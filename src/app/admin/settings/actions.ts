"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { logActivity } from "@/lib/cms/activity";

export async function saveGrainEnabled(
	enabled: boolean,
): Promise<{ ok?: boolean; error?: string }> {
	await requireRole("admin");
	const db = createAdminClient();
	const { error } = await db
		.from("app_config")
		.upsert(
			{ key: "grain_enabled", value: String(enabled) },
			{ onConflict: "key" },
		);
	if (error) return { error: error.message };
	await logActivity("edit", "Grain overlay", enabled ? "Enabled" : "Disabled");
	revalidatePath("/", "layout");
	return { ok: true };
}
