"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { logActivity } from "@/lib/cms/activity";

export type ActionResult = { ok?: boolean; error?: string };

async function reval() {
	revalidatePath("/admin/partners");
	await logActivity("edit", "Partners");
}

async function nextSort(table: string) {
	const supabase = await createClient();
	const { data } = await supabase
		.from(table)
		.select("sort")
		.order("sort", { ascending: false })
		.limit(1)
		.maybeSingle();
	return (data?.sort ?? -1) + 1;
}

const PartnerSchema = z.object({
	name: z.string().min(1, "Name is required."),
	logo: z.string().nullable().optional(),
});

export async function createPartner(): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	const { error } = await supabase
		.from("partners")
		.insert({ name: "New Partner", sort: await nextSort("partners") });
	if (error) return { error: error.message };
	await reval();
	return { ok: true };
}

export async function updatePartner(
	id: string,
	input: unknown,
): Promise<ActionResult> {
	await requireRole("editor");
	const parsed = PartnerSchema.safeParse(input);
	if (!parsed.success)
		return { error: parsed.error.issues[0]?.message ?? "Invalid." };
	const supabase = await createClient();
	const { error } = await supabase
		.from("partners")
		.update(parsed.data)
		.eq("id", id);
	if (error) return { error: error.message };
	await reval();
	return { ok: true };
}

export async function deletePartner(id: string): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	const { error } = await supabase.from("partners").delete().eq("id", id);
	if (error) return { error: error.message };
	await reval();
	return { ok: true };
}

export async function reorderPartners(ids: string[]): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	await Promise.all(
		ids.map((id, i) =>
			supabase.from("partners").update({ sort: i }).eq("id", id),
		),
	);
	await reval();
	return { ok: true };
}

const CategorySchema = z.object({
	category: z.string().min(1, "Category is required."),
	brands: z.array(z.string().min(1)),
});

export async function createCategory(): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	const { error } = await supabase.from("partner_categories").insert({
		category: "New Category",
		brands: [],
		sort: await nextSort("partner_categories"),
	});
	if (error) return { error: error.message };
	await reval();
	return { ok: true };
}

export async function updateCategory(
	id: string,
	input: unknown,
): Promise<ActionResult> {
	await requireRole("editor");
	const parsed = CategorySchema.safeParse(input);
	if (!parsed.success)
		return { error: parsed.error.issues[0]?.message ?? "Invalid." };
	const supabase = await createClient();
	const { error } = await supabase
		.from("partner_categories")
		.update(parsed.data)
		.eq("id", id);
	if (error) return { error: error.message };
	await reval();
	return { ok: true };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	const { error } = await supabase
		.from("partner_categories")
		.delete()
		.eq("id", id);
	if (error) return { error: error.message };
	await reval();
	return { ok: true };
}

export async function reorderCategories(ids: string[]): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	await Promise.all(
		ids.map((id, i) =>
			supabase.from("partner_categories").update({ sort: i }).eq("id", id),
		),
	);
	await reval();
	return { ok: true };
}
