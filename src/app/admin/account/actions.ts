"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";

export async function updateProfileName(
	name: string,
): Promise<{ ok?: boolean; error?: string }> {
	const profile = await requireRole("editor");
	const supabase = await createClient();
	const { error } = await supabase
		.from("profiles")
		.update({ full_name: name.trim() || null })
		.eq("id", profile.id);
	if (error) return { error: error.message };
	revalidatePath("/admin");
	return { ok: true };
}
