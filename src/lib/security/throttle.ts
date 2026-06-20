import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";

export const MAX_ATTEMPTS = 5;
export const WINDOW_MS = 15 * 60 * 1000;
export const LOCK_MS = 15 * 60 * 1000;

interface ThrottleRow {
	identifier: string;
	kind: "ip" | "email";
	attempts: number;
	first_attempt: string;
	locked_until: string | null;
}

export async function getClientIp(): Promise<string> {
	const h = await headers();
	const fwd = h.get("x-forwarded-for");
	if (fwd) return fwd.split(",")[0]!.trim();
	return h.get("x-real-ip")?.trim() || "unknown";
}

function identifiers(ip: string, email: string): string[] {
	return [`ip:${ip}`, `email:${email.toLowerCase().trim()}`];
}

export interface LockState {
	locked: boolean;
	retryAfterMin: number;
}

export async function checkLock(ip: string, email: string): Promise<LockState> {
	const db = createAdminClient();
	const { data } = await db
		.from("login_throttle")
		.select("identifier, locked_until")
		.in("identifier", identifiers(ip, email));

	const now = Date.now();
	let until = 0;
	for (const row of (data ?? []) as Pick<
		ThrottleRow,
		"identifier" | "locked_until"
	>[]) {
		if (row.locked_until) {
			const t = new Date(row.locked_until).getTime();
			if (t > now && t > until) until = t;
		}
	}
	if (until > now) {
		return { locked: true, retryAfterMin: Math.ceil((until - now) / 60000) };
	}
	return { locked: false, retryAfterMin: 0 };
}

export async function recordFailure(ip: string, email: string): Promise<void> {
	const db = createAdminClient();
	const ids = identifiers(ip, email);
	const { data } = await db
		.from("login_throttle")
		.select("identifier, kind, attempts, first_attempt, locked_until")
		.in("identifier", ids);

	const existing = new Map(
		((data ?? []) as ThrottleRow[]).map((r) => [r.identifier, r]),
	);
	const now = Date.now();
	const nowIso = new Date().toISOString();

	const rows = ids.map((identifier) => {
		const kind: "ip" | "email" = identifier.startsWith("ip:") ? "ip" : "email";
		const prev = existing.get(identifier);
		const windowExpired =
			!prev || now - new Date(prev.first_attempt).getTime() > WINDOW_MS;

		const attempts = windowExpired ? 1 : prev!.attempts + 1;
		const firstAttempt = windowExpired ? nowIso : prev!.first_attempt;
		const lockedUntil =
			attempts >= MAX_ATTEMPTS
				? new Date(now + LOCK_MS).toISOString()
				: null;

		return {
			identifier,
			kind,
			attempts,
			first_attempt: firstAttempt,
			locked_until: lockedUntil,
			updated_at: nowIso,
		};
	});

	await db.from("login_throttle").upsert(rows, { onConflict: "identifier" });
}

export async function clearFailures(ip: string, email: string): Promise<void> {
	const db = createAdminClient();
	await db
		.from("login_throttle")
		.delete()
		.in("identifier", identifiers(ip, email));
}
