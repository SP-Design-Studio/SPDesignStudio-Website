import { createAdminClient } from "@/lib/supabase/admin";

export async function getGrainEnabled(): Promise<boolean> {
	try {
		const db = createAdminClient();
		const { data } = await db
			.from("app_config")
			.select("value")
			.eq("key", "grain_enabled")
			.maybeSingle();
		return (data as { value?: string } | null)?.value === "true";
	} catch {
		return false;
	}
}
