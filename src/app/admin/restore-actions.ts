"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { logActivity } from "@/lib/cms/activity";
import { RESTORABLE } from "@/lib/cms/pending";
import { PAGE_LABELS } from "@/lib/cms/pages";

export type RestoreResult = { ok?: boolean; error?: string };

const CHILDREN: Record<string, { table: string; fk: string }[]> = {
	projects: [
		{ table: "project_facts", fk: "project_id" },
		{ table: "project_gallery", fk: "project_id" },
	],
};

export async function restoreDeleted(
	table: string,
	id: string,
): Promise<RestoreResult> {
	await requireRole("editor");
	const page = RESTORABLE[table];
	if (!page) return { error: "That can't be restored." };

	const db = createAdminClient();
	const { data: snap } = await db
		.from("page_snapshots")
		.select("raw")
		.eq("page", page)
		.maybeSingle();
	const raw = snap?.raw as Record<string, Record<string, unknown>[]> | null;
	const row = raw?.[table]?.find((r) => String(r.id) === id);
	if (!row) return { error: "No published copy to restore from." };

	const { data: exists } = await db
		.from(table)
		.select("id")
		.eq("id", id)
		.maybeSingle();
	if (exists) return { ok: true };

	const { error } = await db.from(table).insert(row);
	if (error) return { error: error.message };

	for (const child of CHILDREN[table] ?? []) {
		const rows = (raw?.[child.table] ?? []).filter(
			(r) => String(r[child.fk]) === id,
		);
		if (rows.length === 0) continue;
		const { error: childError } = await db.from(child.table).insert(rows);
		if (childError) return { error: childError.message };
	}

	await logActivity("edit", PAGE_LABELS[page], "Restored a deleted item");
	revalidatePath("/admin", "layout");
	return { ok: true };
}
