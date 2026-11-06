"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { logActivity } from "@/lib/cms/activity";
import { logLoginAttempt } from "@/lib/security/loginLog";
import { getClientIp } from "@/lib/security/throttle";
import {
	BAD_CODE_FORMAT,
	WRONG_CODE,
	cleanCode,
	codeGuard,
	isSixDigits,
	lockedMessage,
} from "@/lib/security/mfa";

export type MfaSetup = {
	error?: string;
	factorId?: string;
	qr?: string;
	secret?: string;
};

export type MfaResult = { error?: string; ok?: boolean };

function cleanQr(raw: string): string {
	const svg = raw.replace(/^data:image\/svg\+xml;utf-8,/i, "").trim();
	return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export async function startMfaSetup(): Promise<MfaSetup> {
	await requireRole("editor", { allowSetup: true });

	const supabase = await createClient();
	const { data: list } = await supabase.auth.mfa.listFactors();
	for (const f of list?.all ?? []) {
		if (f.status === "unverified")
			await supabase.auth.mfa.unenroll({ factorId: f.id });
	}

	const { data, error } = await supabase.auth.mfa.enroll({
		factorType: "totp",
		issuer: "SP Design Studio",
		friendlyName: `Authenticator ${Date.now()}`,
	});
	if (error || !data)
		return {
			error:
				"Couldn't start setup. Check that two-step sign-in (TOTP) is switched on in Supabase under Authentication, Multi-Factor.",
		};
	return {
		factorId: data.id,
		qr: cleanQr(data.totp.qr_code),
		secret: data.totp.secret,
	};
}

export async function confirmMfaSetup(
	factorId: string,
	rawCode: string,
): Promise<MfaResult> {
	const profile = await requireRole("editor", { allowSetup: true });
	const code = cleanCode(rawCode);
	if (!isSixDigits(code)) return { error: BAD_CODE_FORMAT };

	const guard = await codeGuard("setup", profile.email);
	const lock = await guard.check();
	if (lock.locked) return { error: lockedMessage(lock.retryAfterMin) };

	const supabase = await createClient();
	const { error } = await supabase.auth.mfa.challengeAndVerify({
		factorId,
		code,
	});
	if (error) {
		const after = await guard.fail();
		return {
			error: after.locked ? lockedMessage(after.retryAfterMin) : WRONG_CODE,
		};
	}

	await guard.pass();
	await logLoginAttempt({
		email: profile.email,
		ip: guard.ip,
		reason: "mfa_enrolled",
		success: true,
	});
	await logActivity("edit", "Account", "Turned on two-step sign-in");
	revalidatePath("/admin", "layout");
	return { ok: true };
}

export async function removeMfa(factorId: string): Promise<MfaResult> {
	const profile = await requireRole("editor", { allowSetup: true });

	const supabase = await createClient();
	const { error } = await supabase.auth.mfa.unenroll({ factorId });
	if (error)
		return {
			error:
				"Couldn't turn it off. Sign out, sign in again with your code, then try once more.",
		};

	await logLoginAttempt({
		email: profile.email,
		ip: await getClientIp(),
		reason: "mfa_removed",
		success: true,
	});
	await logActivity("edit", "Account", "Turned off two-step sign-in");
	revalidatePath("/admin", "layout");
	return { ok: true };
}
