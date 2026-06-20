"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
	checkLock,
	recordFailure,
	clearFailures,
	getClientIp,
} from "@/lib/security/throttle";
import { verifyTurnstile } from "@/lib/security/turnstile";

export interface LoginState {
	error?: string;
}

const LoginSchema = z.object({
	email: z.email(),
	password: z.string().min(1).max(200),
});

function safeNext(value: FormDataEntryValue | null): string {
	const next = typeof value === "string" ? value : "";
	if (next.startsWith("/admin") && !next.startsWith("//")) return next;
	return "/admin";
}

export async function login(
	_prev: LoginState,
	formData: FormData,
): Promise<LoginState> {
	const parsed = LoginSchema.safeParse({
		email: formData.get("email"),
		password: formData.get("password"),
	});
	if (!parsed.success) {
		return { error: "Invalid email or password." };
	}
	const { email, password } = parsed.data;
	const ip = await getClientIp();

	const lock = await checkLock(ip, email);
	if (lock.locked) {
		return {
			error: `Too many attempts. Try again in ${lock.retryAfterMin} minute${
				lock.retryAfterMin === 1 ? "" : "s"
			}.`,
		};
	}

	const token = formData.get("cf-turnstile-response");
	const human = await verifyTurnstile(
		typeof token === "string" ? token : null,
		ip,
	);
	if (!human.ok) {
		return { error: "Verification failed. Please try again." };
	}

	const supabase = await createClient();
	const { error } = await supabase.auth.signInWithPassword({ email, password });

	if (error) {
		await recordFailure(ip, email);
		const after = await checkLock(ip, email);
		if (after.locked) {
			return {
				error: `Too many attempts. Try again in ${after.retryAfterMin} minute${
					after.retryAfterMin === 1 ? "" : "s"
				}.`,
			};
		}
		return { error: "Invalid email or password." };
	}

	await clearFailures(ip, email);
	redirect(safeNext(formData.get("next")));
}
