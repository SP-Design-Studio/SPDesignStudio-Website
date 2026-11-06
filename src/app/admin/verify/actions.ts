"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth";
import { logLoginAttempt } from "@/lib/security/loginLog";
import {
	BAD_CODE_FORMAT,
	WRONG_CODE,
	cleanCode,
	codeGuard,
	isSixDigits,
	lockedMessage,
} from "@/lib/security/mfa";

export interface VerifyState {
	error?: string;
}

export async function verifyCode(
	_prev: VerifyState,
	formData: FormData,
): Promise<VerifyState> {
	const user = await getSessionUser();
	if (!user) redirect("/admin/login");

	const code = cleanCode(formData.get("code"));
	if (!isSixDigits(code)) return { error: BAD_CODE_FORMAT };

	const email = user.email ?? user.id;
	const guard = await codeGuard("verify", email);

	const lock = await guard.check();
	if (lock.locked) {
		await logLoginAttempt({
			email,
			ip: guard.ip,
			reason: "mfa_blocked_locked",
			success: false,
		});
		return { error: lockedMessage(lock.retryAfterMin) };
	}

	const supabase = await createClient();
	const { data } = await supabase.auth.mfa.listFactors();
	const factor = data?.totp?.[0];
	if (!factor) redirect("/admin");

	const { error } = await supabase.auth.mfa.challengeAndVerify({
		factorId: factor.id,
		code,
	});

	if (error) {
		const after = await guard.fail();
		await logLoginAttempt({
			email,
			ip: guard.ip,
			reason: after.locked ? "mfa_locked_out" : "mfa_invalid_code",
			success: false,
		});
		return {
			error: after.locked ? lockedMessage(after.retryAfterMin) : WRONG_CODE,
		};
	}

	await guard.pass();
	await logLoginAttempt({
		email,
		ip: guard.ip,
		reason: "mfa_success",
		success: true,
	});
	redirect("/admin");
}
