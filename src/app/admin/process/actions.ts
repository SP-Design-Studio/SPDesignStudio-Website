"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { logActivity } from "@/lib/cms/activity";

export type ActionResult = { ok?: boolean; error?: string };

async function reval() {
	revalidatePath("/admin/process");
	await logActivity("edit", "Process");
}

const Schema = z.object({
	no: z.string().min(1, "Number is required."),
	title: z.string().min(1, "Title is required."),
	description: z.string().nullable().optional(),
	img: z.string().nullable().optional(),
});

export async function createStep(): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	const { data: top } = await supabase
		.from("process_steps")
		.select("sort")
		.order("sort", { ascending: false })
		.limit(1)
		.maybeSingle();
	const sort = (top?.sort ?? -1) + 1;
	const { error } = await supabase.from("process_steps").insert({
		no: String(sort + 1).padStart(2, "0"),
		title: "New Step",
		sort,
	});
	if (error) return { error: error.message };
	await reval();
	return { ok: true };
}

export async function updateStep(
	id: string,
	input: unknown,
): Promise<ActionResult> {
	await requireRole("editor");
	const parsed = Schema.safeParse(input);
	if (!parsed.success)
		return { error: parsed.error.issues[0]?.message ?? "Invalid." };
	const supabase = await createClient();
	const { error } = await supabase
		.from("process_steps")
		.update(parsed.data)
		.eq("id", id);
	if (error) return { error: error.message };
	await reval();
	return { ok: true };
}

export async function deleteStep(id: string): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	const { error } = await supabase.from("process_steps").delete().eq("id", id);
	if (error) return { error: error.message };
	await reval();
	return { ok: true };
}

export async function reorderSteps(ids: string[]): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	await Promise.all(
		ids.map((id, i) =>
			supabase.from("process_steps").update({ sort: i }).eq("id", id),
		),
	);
	await reval();
	return { ok: true };
}
