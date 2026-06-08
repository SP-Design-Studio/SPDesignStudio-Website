"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { logActivity } from "@/lib/cms/activity";

export type ActionResult = { ok?: boolean; error?: string };

async function reval() {
	revalidatePath("/admin/testimonials");
	await logActivity("edit", "Testimonials");
}

const Schema = z.object({
	quote: z.string().min(1, "Quote is required."),
	name: z.string().min(1, "Name is required."),
	detail: z.string().nullable().optional(),
	img: z.string().nullable().optional(),
});

export async function createTestimonial(): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	const { data: top } = await supabase
		.from("testimonials")
		.select("sort")
		.order("sort", { ascending: false })
		.limit(1)
		.maybeSingle();
	const { error } = await supabase
		.from("testimonials")
		.insert({ quote: "New reflection", name: "Client", sort: (top?.sort ?? -1) + 1 });
	if (error) return { error: error.message };
	await reval();
	return { ok: true };
}

export async function updateTestimonial(
	id: string,
	input: unknown,
): Promise<ActionResult> {
	await requireRole("editor");
	const parsed = Schema.safeParse(input);
	if (!parsed.success)
		return { error: parsed.error.issues[0]?.message ?? "Invalid." };
	const supabase = await createClient();
	const { error } = await supabase
		.from("testimonials")
		.update(parsed.data)
		.eq("id", id);
	if (error) return { error: error.message };
	await reval();
	return { ok: true };
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	const { error } = await supabase.from("testimonials").delete().eq("id", id);
	if (error) return { error: error.message };
	await reval();
	return { ok: true };
}

export async function reorderTestimonials(ids: string[]): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	await Promise.all(
		ids.map((id, i) =>
			supabase.from("testimonials").update({ sort: i }).eq("id", id),
		),
	);
	await reval();
	return { ok: true };
}
