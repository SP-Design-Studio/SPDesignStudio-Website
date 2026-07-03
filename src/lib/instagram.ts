import { createAdminClient } from "@/lib/supabase/admin";
import { getInstagramPosts } from "@/lib/cms/queries";
import { STUDIO } from "@/lib/data/studio";

export interface InstaItem {
	id: string;
	permalink: string;
	caption: string;
	isReel: boolean;
	isVideo: boolean;
	image: string;
}

// Curated feed: the "Studio on Instagram" home section reads this admin-managed
// list instead of the Instagram API. No token, no expiry, no outages.
export async function getCuratedInstagram(): Promise<InstaItem[]> {
	const posts = await getInstagramPosts();
	return posts
		.filter((p) => p.image)
		.map((p) => ({
			id: p.id,
			permalink: p.permalink?.trim() || STUDIO.socials.instagram,
			caption: p.caption ?? "",
			isReel: p.is_reel,
			isVideo: p.is_reel,
			image: p.image as string,
		}));
}

const TOKEN_KEY = "instagram_token";
const MEDIA_CACHE_KEY = "instagram_media_cache";
const IG_UA =
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

// Instagram CDN URLs are signed/expiring. Download each image once and store it
// in Supabase Storage so the feed survives URL expiry and API outages.
async function mirrorToStorage(items: InstaItem[]): Promise<InstaItem[]> {
	const db = createAdminClient();
	return Promise.all(
		items.map(async (m) => {
			try {
				const res = await fetch(m.image, { headers: { "User-Agent": IG_UA } });
				if (!res.ok) return m;
				const buf = Buffer.from(await res.arrayBuffer());
				const ct = res.headers.get("content-type") || "image/jpeg";
				const ext = ct.includes("png")
					? "png"
					: ct.includes("webp")
						? "webp"
						: "jpg";
				const path = `instagram/${m.id}.${ext}`;
				const { error } = await db.storage
					.from("media")
					.upload(path, buf, {
						contentType: ct,
						upsert: true,
						cacheControl: "31536000",
					});
				if (error) return m;
				const { data } = db.storage.from("media").getPublicUrl(path);
				return { ...m, image: data.publicUrl };
			} catch {
				return m;
			}
		}),
	);
}

async function readMediaCache(): Promise<InstaItem[]> {
	try {
		const db = createAdminClient();
		const { data } = await db
			.from("app_config")
			.select("value")
			.eq("key", MEDIA_CACHE_KEY)
			.maybeSingle();
		const raw = (data as { value?: string } | null)?.value;
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? (parsed as InstaItem[]) : [];
	} catch {
		return [];
	}
}

async function writeMediaCache(items: InstaItem[]): Promise<void> {
	try {
		const db = createAdminClient();
		await db
			.from("app_config")
			.upsert(
				{ key: MEDIA_CACHE_KEY, value: JSON.stringify(items) },
				{ onConflict: "key" },
			);
	} catch {}
}

async function readToken(): Promise<string | null> {
	try {
		const db = createAdminClient();
		const { data } = await db
			.from("app_config")
			.select("value")
			.eq("key", TOKEN_KEY)
			.maybeSingle();
		const fromDb = (data as { value?: string } | null)?.value?.trim();
		return fromDb || process.env.INSTAGRAM_TOKEN || null;
	} catch {
		return process.env.INSTAGRAM_TOKEN || null;
	}
}

async function writeToken(token: string): Promise<void> {
	const db = createAdminClient();
	await db
		.from("app_config")
		.upsert({ key: TOKEN_KEY, value: token }, { onConflict: "key" });
}

export interface IgSettings {
	enabled: boolean;
	reelsCount: number;
	postsCount: number;
	hasToken: boolean;
}

const clamp = (n: number, def: number) =>
	Math.min(Math.max(Number.isFinite(n) ? n : def, 0), 18);

export async function getInstagramSettings(): Promise<IgSettings> {
	try {
		const db = createAdminClient();
		const { data } = await db
			.from("app_config")
			.select("key, value")
			.in("key", [
				TOKEN_KEY,
				"instagram_enabled",
				"instagram_reels_count",
				"instagram_posts_count",
			]);
		const map = new Map(
			(data ?? []).map((r) => [
				(r as { key: string }).key,
				(r as { value?: string }).value ?? "",
			]),
		);
		return {
			enabled: map.get("instagram_enabled") !== "false",
			reelsCount: clamp(parseInt(map.get("instagram_reels_count") || "6", 10), 6),
			postsCount: clamp(parseInt(map.get("instagram_posts_count") || "6", 10), 6),
			hasToken: Boolean((map.get(TOKEN_KEY) || process.env.INSTAGRAM_TOKEN)?.trim()),
		};
	} catch {
		return {
			enabled: true,
			reelsCount: 6,
			postsCount: 6,
			hasToken: Boolean(process.env.INSTAGRAM_TOKEN),
		};
	}
}

export async function getInstagramMedia(): Promise<InstaItem[]> {
	const settings = await getInstagramSettings();
	if (!settings.enabled) return [];
	const token = await readToken();
	if (!token) return readMediaCache();
	const want = settings.reelsCount + settings.postsCount;
	const limit = Math.min(want * 2 + 6, 50);
	const fields =
		"id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink";
	const url = `https://graph.instagram.com/me/media?fields=${fields}&limit=${limit}&access_token=${token}`;
	try {
		const res = await fetch(url, { next: { revalidate: 3600 } });
		if (!res.ok) return readMediaCache();
		const json = (await res.json()) as { data?: RawMedia[] };
		const all = (json.data ?? [])
			.map(normalize)
			.filter((m): m is InstaItem => m !== null);
		const reels = all.filter((m) => m.isReel).slice(0, settings.reelsCount);
		const posts = all.filter((m) => !m.isReel).slice(0, settings.postsCount);
		const result = [...reels, ...posts];
		if (result.length === 0) return readMediaCache();
		const mirrored = await mirrorToStorage(result);
		await writeMediaCache(mirrored);
		return mirrored;
	} catch {
		return readMediaCache();
	}
}

interface RawMedia {
	id: string;
	caption?: string;
	media_type?: string;
	media_product_type?: string;
	media_url?: string;
	thumbnail_url?: string;
	permalink?: string;
}

function normalize(m: RawMedia): InstaItem | null {
	if (!m.permalink) return null;
	const isVideo = m.media_type === "VIDEO";
	const image = isVideo ? m.thumbnail_url || m.media_url : m.media_url;
	if (!image) return null;
	return {
		id: m.id,
		permalink: m.permalink,
		caption: m.caption ?? "",
		isReel: m.media_product_type === "REELS",
		isVideo,
		image,
	};
}

export async function refreshInstagramToken(): Promise<{
	ok: boolean;
	error?: string;
}> {
	const token = await readToken();
	if (!token) return { ok: false, error: "No token set." };
	try {
		const res = await fetch(
			`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`,
			{ cache: "no-store" },
		);
		const json = (await res.json()) as {
			access_token?: string;
			error?: { message?: string };
		};
		if (!res.ok || !json.access_token)
			return { ok: false, error: json.error?.message || "Refresh failed." };
		await writeToken(json.access_token);
		return { ok: true };
	} catch (e) {
		return { ok: false, error: String(e) };
	}
}
