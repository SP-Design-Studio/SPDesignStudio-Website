"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { logActivity } from "@/lib/cms/activity";

export type ActionResult = { ok?: boolean; error?: string };

async function reval() {
	revalidatePath("/admin/instagram");
	revalidatePath("/");
	await logActivity("edit", "Instagram");
}

async function nextSort() {
	const supabase = await createClient();
	const { data } = await supabase
		.from("instagram_posts")
		.select("sort")
		.order("sort", { ascending: false })
		.limit(1)
		.maybeSingle();
	return (data?.sort ?? -1) + 1;
}

const PostSchema = z.object({
	image: z.string().nullable().optional(),
	permalink: z.string().optional(),
	caption: z.string().optional(),
	is_reel: z.boolean().optional(),
});

export async function createPost(): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	const { error } = await supabase
		.from("instagram_posts")
		.insert({ sort: await nextSort() });
	if (error) return { error: error.message };
	await reval();
	return { ok: true };
}

export async function updatePost(
	id: string,
	input: unknown,
): Promise<ActionResult> {
	await requireRole("editor");
	const parsed = PostSchema.safeParse(input);
	if (!parsed.success)
		return { error: parsed.error.issues[0]?.message ?? "Invalid." };
	const supabase = await createClient();
	const { error } = await supabase
		.from("instagram_posts")
		.update(parsed.data)
		.eq("id", id);
	if (error) return { error: error.message };
	await reval();
	return { ok: true };
}

export async function deletePost(id: string): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	const { error } = await supabase
		.from("instagram_posts")
		.delete()
		.eq("id", id);
	if (error) return { error: error.message };
	await reval();
	return { ok: true };
}

export async function reorderPosts(ids: string[]): Promise<ActionResult> {
	await requireRole("editor");
	const supabase = await createClient();
	await Promise.all(
		ids.map((id, i) =>
			supabase.from("instagram_posts").update({ sort: i }).eq("id", id),
		),
	);
	await reval();
	return { ok: true };
}
