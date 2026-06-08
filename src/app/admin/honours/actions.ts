"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { logActivity } from "@/lib/cms/activity";

export type ActionResult = { ok?: boolean; error?: string };

async function reval() {
	revalidatePath("/admin/honours");
	await logActivity("edit", "Honours & Milestones");
}

const Schema = z.object({
	title: z.string().min(1, "Title is required."),
	year: z.string().nullable().optional(),
	by_line: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	img: z.string().nullable().optional(),
});

export async function createHonour(): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	const { data: top } = await supabase
		.from("honours")
		.select("sort")
		.order("sort", { ascending: false })
		.limit(1)
		.maybeSingle();
	const { error } = await supabase
		.from("honours")
		.insert({ title: "New Milestone", sort: (top?.sort ?? -1) + 1 });
	if (error) return { error: error.message };
	await reval();
	return { ok: true };
}

export async function updateHonour(
	id: string,
	input: unknown,
): Promise<ActionResult> {
	await requireRole("editor");
	const parsed = Schema.safeParse(input);
	if (!parsed.success)
		return { error: parsed.error.issues[0]?.message ?? "Invalid." };
	const supabase = await createClient();
	const { error } = await supabase.from("honours").update(parsed.data).eq("id", id);
	if (error) return { error: error.message };
	await reval();
	return { ok: true };
}

export async function deleteHonour(id: string): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	const { error } = await supabase.from("honours").delete().eq("id", id);
	if (error) return { error: error.message };
	await reval();
	return { ok: true };
}

export async function reorderHonours(ids: string[]): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	await Promise.all(
		ids.map((id, i) =>
			supabase.from("honours").update({ sort: i }).eq("id", id),
		),
	);
	await reval();
	return { ok: true };
}
