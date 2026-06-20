"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { logActivity } from "@/lib/cms/activity";
import {
	buildPage,
	PAGE_PATHS,
	PAGE_KEYS,
	PAGE_TABLES,
	PAGE_LABELS,
	type PageKey,
} from "@/lib/cms/pages";

export type PublishState = { ok?: boolean; error?: string; at?: string };

async function captureRaw(
	supabase: Awaited<ReturnType<typeof createClient>>,
	page: PageKey,
): Promise<Record<string, unknown[]>> {
	const raw: Record<string, unknown[]> = {};
	for (const table of PAGE_TABLES[page]) {
		const { data } = await supabase.from(table).select("*");
		raw[table] = data ?? [];
	}
	return raw;
}

async function snapshot(page: PageKey): Promise<string | null> {
	const data = await buildPage(page);
	const at = new Date().toISOString();
	const supabase = await createClient();
	const raw = await captureRaw(supabase, page);
	const { error } = await supabase
		.from("page_snapshots")
		.upsert({ page, data, raw, published_at: at }, { onConflict: "page" });
	if (error) return null;
	revalidatePath(PAGE_PATHS[page]);
	return at;
}

export async function publishPage(page: PageKey): Promise<PublishState> {
	await requireRole("admin");
	if (!PAGE_KEYS.includes(page)) return { error: "Unknown page." };
	const at = await snapshot(page);
	if (!at) return { error: "Publish failed." };
	await logActivity("publish", PAGE_LABELS[page], "Published page");
	revalidatePath("/admin");
	return { ok: true, at };
}

export async function publishAll(): Promise<PublishState> {
	await requireRole("admin");
	for (const page of PAGE_KEYS) {
		const at = await snapshot(page);
		if (!at) return { error: `Failed publishing ${page}.` };
	}
	await logActivity("publish", "All pages", "Published all pages");
	revalidatePath("/admin");
	return { ok: true, at: new Date().toISOString() };
}

export async function discardPage(page: PageKey): Promise<PublishState> {
	await requireRole("admin");
	if (!PAGE_KEYS.includes(page)) return { error: "Unknown page." };
	const supabase = await createClient();
	const { data: snap } = await supabase
		.from("page_snapshots")
		.select("raw")
		.eq("page", page)
		.maybeSingle();
	const raw = snap?.raw as Record<string, unknown[]> | null | undefined;
	if (!raw)
		return { error: "No restore point yet — publish this page once first." };

	const tables = PAGE_TABLES[page];
	for (const table of [...tables].reverse()) {
		const { error } = await supabase.from(table).delete().not("id", "is", null);
		if (error) return { error: `Revert failed (${table}): ${error.message}` };
	}
	for (const table of tables) {
		const rows = raw[table] ?? [];
		if (rows.length === 0) continue;
		const { error } = await supabase.from(table).insert(rows);
		if (error) return { error: `Revert failed (${table}): ${error.message}` };
	}
	await logActivity("discard", PAGE_LABELS[page], "Reverted draft to published");
	revalidatePath("/admin");
	return { ok: true };
}
