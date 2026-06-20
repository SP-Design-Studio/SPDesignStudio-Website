import { createAdminClient } from "@/lib/supabase/admin";

export interface AtelierImage {
	id: string;
	url: string;
	caption: string | null;
	sort: number;
}

export async function getAtelierImages(): Promise<AtelierImage[]> {
	try {
		const db = createAdminClient();
		const { data } = await db
			.from("atelier_images")
			.select("id, url, caption, sort")
			.order("sort", { ascending: true })
			.order("created_at", { ascending: true });
		return (data ?? []) as AtelierImage[];
	} catch {
		return [];
	}
}
