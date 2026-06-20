"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { logActivity } from "@/lib/cms/activity";
import { createAdminClient } from "@/lib/supabase/admin";

const DiscSchema = z.object({
	top_label: z.string().min(1, "Label is required."),
	big_stat: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	variant: z.enum(["image", "centered", "italic"]),
	span: z.enum(["normal", "wide", "tall"]),
	img: z.string().nullable().optional(),
});

export type ActionResult = { ok?: boolean; error?: string };

async function revalidateHome() {
	revalidatePath("/admin/home");
	await logActivity("edit", "Homepage");
}

export async function createDiscipline(): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	const { data: top } = await supabase
		.from("home_disciplines")
		.select("sort")
		.order("sort", { ascending: false })
		.limit(1)
		.maybeSingle();
	const nextSort = (top?.sort ?? -1) + 1;
	const { error } = await supabase.from("home_disciplines").insert({
		top_label: "New Discipline",
		variant: "image",
		span: "normal",
		sort: nextSort,
	});
	if (error) return { error: error.message };
	await revalidateHome();
	return { ok: true };
}

export async function updateDiscipline(
	id: string,
	input: unknown,
): Promise<ActionResult> {
	await requireRole("editor");
	const parsed = DiscSchema.safeParse(input);
	if (!parsed.success) {
		return { error: parsed.error.issues[0]?.message ?? "Invalid fields." };
	}
	const supabase = await createClient();
	const { error } = await supabase
		.from("home_disciplines")
		.update(parsed.data)
		.eq("id", id);
	if (error) return { error: error.message };
	await revalidateHome();
	return { ok: true };
}

export async function deleteDiscipline(id: string): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	const { error } = await supabase
		.from("home_disciplines")
		.delete()
		.eq("id", id);
	if (error) return { error: error.message };
	await revalidateHome();
	return { ok: true };
}

export async function reorderDisciplines(ids: string[]): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	const results = await Promise.all(
		ids.map((id, i) =>
			supabase.from("home_disciplines").update({ sort: i }).eq("id", id),
		),
	);
	const failed = results.find((r) => r.error);
	if (failed?.error) return { error: failed.error.message };
	await revalidateHome();
	return { ok: true };
}

const RecognitionSchema = z.object({ label: z.string().min(1) });

export async function createRecognition(): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	const { data: top } = await supabase
		.from("home_recognition")
		.select("sort")
		.order("sort", { ascending: false })
		.limit(1)
		.maybeSingle();
	const { error } = await supabase
		.from("home_recognition")
		.insert({ label: "New recognition", sort: (top?.sort ?? -1) + 1 });
	if (error) return { error: error.message };
	await revalidateHome();
	return { ok: true };
}

export async function updateRecognition(
	id: string,
	input: unknown,
): Promise<ActionResult> {
	await requireRole("editor");
	const parsed = RecognitionSchema.safeParse(input);
	if (!parsed.success) return { error: "Label is required." };
	const supabase = await createClient();
	const { error } = await supabase
		.from("home_recognition")
		.update(parsed.data)
		.eq("id", id);
	if (error) return { error: error.message };
	await revalidateHome();
	return { ok: true };
}

export async function deleteRecognition(id: string): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	const { error } = await supabase
		.from("home_recognition")
		.delete()
		.eq("id", id);
	if (error) return { error: error.message };
	await revalidateHome();
	return { ok: true };
}

export async function reorderRecognition(ids: string[]): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	await Promise.all(
		ids.map((id, i) =>
			supabase.from("home_recognition").update({ sort: i }).eq("id", id),
		),
	);
	await revalidateHome();
	return { ok: true };
}

export async function saveInstagramSettings(input: {
	enabled: boolean;
	reelsCount: number;
	postsCount: number;
	token?: string;
}): Promise<ActionResult> {
	await requireRole("admin");
	const db = createAdminClient();
	const rows: { key: string; value: string }[] = [
		{ key: "instagram_enabled", value: String(input.enabled) },
		{ key: "instagram_reels_count", value: String(input.reelsCount) },
		{ key: "instagram_posts_count", value: String(input.postsCount) },
	];
	if (input.token && input.token.trim())
		rows.push({ key: "instagram_token", value: input.token.trim() });
	const { error } = await db.from("app_config").upsert(rows, { onConflict: "key" });
	if (error) return { error: error.message };
	await logActivity("edit", "Instagram");
	revalidatePath("/");
	return { ok: true };
}
