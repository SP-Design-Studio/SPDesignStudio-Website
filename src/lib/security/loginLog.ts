import { createAdminClient } from "@/lib/supabase/admin";

export async function logLoginAttempt(info: {
	email: string;
	ip: string;
	reason: string;
	success: boolean;
}): Promise<void> {
	try {
		const db = createAdminClient();
		await db.from("login_attempts").insert({
			email: info.email,
			ip: info.ip,
			reason: info.reason,
			success: info.success,
		});
	} catch (e) {
		console.error("[login-log] failed to record attempt:", e);
	}
}
