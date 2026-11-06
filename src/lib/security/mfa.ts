import {
	checkLock,
	recordFailure,
	clearFailures,
	getClientIp,
} from "./throttle";

export const cleanCode = (value: unknown): string =>
	String(value ?? "").replace(/\s+/g, "");

export const isSixDigits = (code: string): boolean => /^\d{6}$/.test(code);

export const BAD_CODE_FORMAT =
	"Enter the 6 digits shown in your authenticator app.";

export const WRONG_CODE =
	"That code didn't match. Codes change every 30 seconds, so try the current one.";

export const lockedMessage = (min: number): string =>
	`Too many incorrect codes. Try again in ${min} minute${min === 1 ? "" : "s"}.`;

export async function codeGuard(scope: "verify" | "setup", email: string) {
	const ip = await getClientIp();
	const ipKey = `${scope}:${ip}`;
	const idKey = `${scope}:${email}`;
	return {
		ip,
		check: () => checkLock(ipKey, idKey),
		fail: async () => {
			await recordFailure(ipKey, idKey);
			return checkLock(ipKey, idKey);
		},
		pass: () => clearFailures(ipKey, idKey),
	};
}
