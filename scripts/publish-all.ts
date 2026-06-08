import { createClient } from "@supabase/supabase-js";
import { PAGE_KEYS, buildPage } from "../src/lib/cms/pages";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
	console.error("Missing Supabase env in .env.local");
	process.exit(1);
}

const db = createClient(url, key, {
	auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
	for (const page of PAGE_KEYS) {
		const data = await buildPage(page);
		const { error } = await db
			.from("page_snapshots")
			.upsert(
				{ page, data, published_at: new Date().toISOString() },
				{ onConflict: "page" },
			);
		console.log(page, error ? `ERROR: ${error.message}` : "published");
		if (error) process.exit(1);
	}
}

main();
