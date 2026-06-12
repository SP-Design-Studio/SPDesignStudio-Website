import type { MetadataRoute } from "next";
import { SITE_URL, PAGE_SEO } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
	const now = new Date();
	return Object.values(PAGE_SEO).map((p) => ({
		url: `${SITE_URL}${p.path === "/" ? "" : p.path}`,
		lastModified: now,
		changeFrequency: "monthly",
		priority: p.path === "/" ? 1 : 0.8,
	}));
}
