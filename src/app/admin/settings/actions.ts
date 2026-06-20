"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { logActivity } from "@/lib/cms/activity";

export async function saveGrain(
	enabled: boolean,
	intensity: number,
): Promise<{ ok?: boolean; error?: string }> {
	await requireRole("admin");
	const clamped = Math.min(Math.max(Number(intensity) || 0, 0), 0.4);
	const db = createAdminClient();
	const { error } = await db.from("app_config").upsert(
		[
			{ key: "grain_enabled", value: String(enabled) },
			{ key: "grain_intensity", value: String(clamped) },
		],
		{ onConflict: "key" },
	);
	if (error) return { error: error.message };
	await logActivity("edit", "Grain overlay", enabled ? "Enabled" : "Disabled");
	revalidatePath("/", "layout");
	return { ok: true };
}
