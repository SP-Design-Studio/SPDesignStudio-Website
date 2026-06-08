"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { logActivity } from "@/lib/cms/activity";

export type ActionResult = { ok?: boolean; error?: string };

async function reval() {
	revalidatePath("/admin/careers");
	await logActivity("edit", "Careers");
}

const SettingsSchema = z.object({
	subtitle: z.string().nullable().optional(),
	empty_note: z.string().nullable().optional(),
	apply_email: z.string().email().or(z.literal("")).nullable().optional(),
	role_options: z.array(z.string().min(1)),
	type_options: z.array(z.string().min(1)),
});

export async function saveCareersSettings(
	input: unknown,
): Promise<ActionResult> {
	await requireRole("editor");
	const parsed = SettingsSchema.safeParse(input);
	if (!parsed.success)
		return { error: parsed.error.issues[0]?.message ?? "Invalid." };
	const supabase = await createClient();
	const { error } = await supabase
		.from("careers_settings")
		.upsert({ id: "main", ...parsed.data }, { onConflict: "id" });
	if (error) return { error: error.message };
	await reval();
	return { ok: true };
}

const OpeningSchema = z.object({
	role: z.string().min(1, "Role is required."),
	type: z.string().nullable().optional(),
	location: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
});

export async function createOpening(): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	const { data: top } = await supabase
		.from("career_openings")
		.select("sort")
		.order("sort", { ascending: false })
		.limit(1)
		.maybeSingle();
	const { error } = await supabase.from("career_openings").insert({
		role: "New Role",
		type: "Full-time",
		location: "Hyderabad",
		sort: (top?.sort ?? -1) + 1,
	});
	if (error) return { error: error.message };
	await reval();
	return { ok: true };
}

export async function updateOpening(
	id: string,
	input: unknown,
): Promise<ActionResult> {
	await requireRole("editor");
	const parsed = OpeningSchema.safeParse(input);
	if (!parsed.success)
		return { error: parsed.error.issues[0]?.message ?? "Invalid." };
	const supabase = await createClient();
	const { error } = await supabase
		.from("career_openings")
		.update(parsed.data)
		.eq("id", id);
	if (error) return { error: error.message };
	await reval();
	return { ok: true };
}

export async function deleteOpening(id: string): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	const { error } = await supabase
		.from("career_openings")
		.delete()
		.eq("id", id);
	if (error) return { error: error.message };
	await reval();
	return { ok: true };
}

export async function reorderOpenings(ids: string[]): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	await Promise.all(
		ids.map((id, i) =>
			supabase.from("career_openings").update({ sort: i }).eq("id", id),
		),
	);
	await reval();
	return { ok: true };
}
