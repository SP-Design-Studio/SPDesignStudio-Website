import { createAdminClient } from "@/lib/supabase/admin";
import { PAGE_TABLES, type PageKey } from "./pages";

export interface PendingDelete {
	table: string;
	id: string;
	label: string;
	image?: string;
}

const LABEL_KEYS = [
	"title",
	"name",
	"label",
	"top_label",
	"category",
	"role",
	"quote",
	"caption",
	"year",
];
const IMAGE_KEYS = ["img", "image", "url", "logo"];

const isImage = (v: unknown): v is string =>
	typeof v === "string" && /\.(jpe?g|png|webp|avif|gif|svg)(\?|$)/i.test(v);

function describe(table: string, row: Record<string, unknown>): PendingDelete {
	let label = "";
	for (const k of LABEL_KEYS) {
		const v = row[k];
		if (typeof v === "string" && v.trim()) {
			label = v.length > 70 ? `${v.slice(0, 67)}…` : v;
			break;
		}
	}
	let image: string | undefined;
	for (const k of IMAGE_KEYS) {
		if (isImage(row[k])) {
			image = row[k] as string;
			break;
		}
	}
	if (!label && image)
		label = image.split("?")[0]!.slice(image.lastIndexOf("/") + 1);
	return { table, id: String(row.id), label: label || "Untitled", image };
}

export const RESTORABLE: Record<string, PageKey> = Object.fromEntries(
	(Object.entries(PAGE_TABLES) as [PageKey, string[]][]).flatMap(
		([page, tables]) =>
			tables
				.filter(
					(t) =>
						![
							"project_facts",
							"project_gallery",
							"site_settings",
							"careers_settings",
						].includes(t),
				)
				.map((t) => [t, page] as const),
	),
);

export async function getPendingDeletes(
	page: PageKey,
	tables: string[],
): Promise<PendingDelete[]> {
	const db = createAdminClient();
	const { data: snap } = await db
		.from("page_snapshots")
		.select("raw")
		.eq("page", page)
		.maybeSingle();
	const raw = snap?.raw as Record<string, Record<string, unknown>[]> | null;
	if (!raw) return [];

	const out: PendingDelete[] = [];
	for (const table of tables) {
		const published = raw[table] ?? [];
		if (published.length === 0) continue;
		const { data: live } = await db.from(table).select("id");
		const liveIds = new Set(
			((live ?? []) as { id: unknown }[]).map((r) => String(r.id)),
		);
		for (const row of published)
			if (!liveIds.has(String(row.id))) out.push(describe(table, row));
	}
	return out;
}
