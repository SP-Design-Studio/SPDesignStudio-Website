"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { logActivity } from "@/lib/cms/activity";

export type ActionResult = { ok?: boolean; error?: string };

async function reval() {
	revalidatePath("/admin/timeline");
	await logActivity("edit", "Studio Evolution");
}

const Schema = z.object({
	year: z.string().min(1, "Year is required."),
	label: z.string().min(1, "Label is required."),
	description: z.string().nullable().optional(),
	img: z.string().nullable().optional(),
});

export async function createEntry(): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	const { data: top } = await supabase
		.from("timeline_entries")
		.select("sort")
		.order("sort", { ascending: false })
		.limit(1)
		.maybeSingle();
	const { error } = await supabase
		.from("timeline_entries")
		.insert({ year: "2025", label: "New Entry", sort: (top?.sort ?? -1) + 1 });
	if (error) return { error: error.message };
	await reval();
	return { ok: true };
}

export async function updateEntry(
	id: string,
	input: unknown,
): Promise<ActionResult> {
	await requireRole("editor");
	const parsed = Schema.safeParse(input);
	if (!parsed.success)
		return { error: parsed.error.issues[0]?.message ?? "Invalid." };
	const supabase = await createClient();
	const { error } = await supabase
		.from("timeline_entries")
		.update(parsed.data)
		.eq("id", id);
	if (error) return { error: error.message };
	await reval();
	return { ok: true };
}

export async function deleteEntry(id: string): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	const { error } = await supabase
		.from("timeline_entries")
		.delete()
		.eq("id", id);
	if (error) return { error: error.message };
	await reval();
	return { ok: true };
}

export async function reorderEntries(ids: string[]): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	await Promise.all(
		ids.map((id, i) =>
			supabase.from("timeline_entries").update({ sort: i }).eq("id", id),
		),
	);
	await reval();
	return { ok: true };
}
