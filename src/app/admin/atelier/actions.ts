"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteImage } from "@/app/admin/media-actions";
import { logActivity } from "@/lib/cms/activity";

type Result = { ok?: boolean; error?: string };

export async function addAtelierImage(url: string): Promise<Result> {
	await requireRole("editor");
	const db = createAdminClient();
	const { data } = await db
		.from("atelier_images")
		.select("sort")
		.order("sort", { ascending: false })
		.limit(1)
		.maybeSingle();
	const nextSort = ((data as { sort?: number } | null)?.sort ?? -1) + 1;
	const { error } = await db
		.from("atelier_images")
		.insert({ url, sort: nextSort });
	if (error) return { error: error.message };
	await logActivity("edit", "Atelier", "Added image");
	revalidatePath("/atelier");
	revalidatePath("/admin/atelier");
	return { ok: true };
}

export async function addAtelierImages(urls: string[]): Promise<Result> {
	await requireRole("editor");
	const clean = urls.filter(Boolean);
	if (clean.length === 0) return { ok: true };
	const db = createAdminClient();
	const { data } = await db
		.from("atelier_images")
		.select("sort")
		.order("sort", { ascending: false })
		.limit(1)
		.maybeSingle();
	let sort = ((data as { sort?: number } | null)?.sort ?? -1) + 1;
	const rows = clean.map((url) => ({ url, sort: sort++ }));
	const { error } = await db.from("atelier_images").insert(rows);
	if (error) return { error: error.message };
	await logActivity("edit", "Atelier", `Added ${clean.length} image(s)`);
	revalidatePath("/atelier");
	revalidatePath("/admin/atelier");
	return { ok: true };
}

export async function deleteAtelierImage(
	id: string,
	url: string,
): Promise<Result> {
	await requireRole("editor");
	const db = createAdminClient();
	const { error } = await db.from("atelier_images").delete().eq("id", id);
	if (error) return { error: error.message };
	if (url) await deleteImage(url);
	await logActivity("edit", "Atelier", "Removed image");
	revalidatePath("/atelier");
	revalidatePath("/admin/atelier");
	return { ok: true };
}

export async function reorderAtelierImages(ids: string[]): Promise<Result> {
	await requireRole("editor");
	const db = createAdminClient();
	await Promise.all(
		ids.map((id, i) =>
			db.from("atelier_images").update({ sort: i }).eq("id", id),
		),
	);
	revalidatePath("/atelier");
	revalidatePath("/admin/atelier");
	return { ok: true };
}
