export const TURNSTILE_SITE_KEY =
	process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

export const turnstileEnabled = Boolean(
	process.env.TURNSTILE_SECRET_KEY && TURNSTILE_SITE_KEY,
);

export async function verifyTurnstile(
	token: string | null,
	ip: string,
): Promise<boolean> {
	const secret = process.env.TURNSTILE_SECRET_KEY;
	if (!secret) return true;
	if (!token) return false;

	try {
		const body = new URLSearchParams({ secret, response: token });
		if (ip && ip !== "unknown") body.set("remoteip", ip);

		const res = await fetch(
			"https://challenges.cloudflare.com/turnstile/v0/siteverify",
			{
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body,
				cache: "no-store",
			},
		);
		const data = (await res.json()) as { success?: boolean };
		return data.success === true;
	} catch {
		return false;
	}
}
