import { createAdminClient } from "@/lib/supabase/admin";

export interface GrainSettings {
	enabled: boolean;
	intensity: number;
}

export const DEFAULT_GRAIN_INTENSITY = 0.13;

export async function getGrainSettings(): Promise<GrainSettings> {
	try {
		const db = createAdminClient();
		const { data } = await db
			.from("app_config")
			.select("key, value")
			.in("key", ["grain_enabled", "grain_intensity"]);
		const map = new Map(
			(data ?? []).map((r) => [
				(r as { key: string }).key,
				(r as { value?: string }).value ?? "",
			]),
		);
		const raw = parseFloat(map.get("grain_intensity") || "");
		const intensity = Number.isFinite(raw)
			? Math.min(Math.max(raw, 0), 0.4)
			: DEFAULT_GRAIN_INTENSITY;
		return { enabled: map.get("grain_enabled") === "true", intensity };
	} catch {
		return { enabled: false, intensity: DEFAULT_GRAIN_INTENSITY };
	}
}
