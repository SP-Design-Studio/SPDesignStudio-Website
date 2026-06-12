import type { Metadata } from "next";
import { STUDIO } from "@/lib/studio";

export const SITE_URL = (
	process.env.NEXT_PUBLIC_SITE_URL || "https://spdesignstudiov2.vercel.app"
).replace(/\/+$/, "");

export const SITE_NAME = STUDIO.name;
export const SITE_DESC =
	"Interior design studio in Hyderabad crafting spaces that merge technical rigor with intentional, soulful living.";
export const OG_IMAGE = "/images/about-hero.jpg";

export type PageKey =
	| "home"
	| "about"
	| "projects"
	| "process"
	| "contact"
	| "careers";

export const PAGE_SEO: Record<
	PageKey,
	{ path: string; title: string; desc: string }
> = {
	home: { path: "/", title: SITE_NAME, desc: SITE_DESC },
	about: {
		path: "/about",
		title: "About",
		desc: `Led by ${STUDIO.founder} — SP Design Studio bridges intentional architecture and the quiet art of well-being.`,
	},
	projects: {
		path: "/projects",
		title: "Projects",
		desc: "Selected residential, commercial, and hospitality interiors by SP Design Studio.",
	},
	process: {
		path: "/process",
		title: "Process",
		desc: "How SP Design Studio takes a space from first conversation to final styling.",
	},
	contact: {
		path: "/contact",
		title: "Contact",
		desc: `Start a project with SP Design Studio — ${STUDIO.address}.`,
	},
	careers: {
		path: "/careers",
		title: "Careers",
		desc: "Join the SP Design Studio collective of designers, architects, and makers.",
	},
};

export function pageMeta(key: PageKey): Metadata {
	const p = PAGE_SEO[key];
	const fullTitle = key === "home" ? SITE_NAME : `${p.title} · ${SITE_NAME}`;
	return {
		title: key === "home" ? { absolute: SITE_NAME } : p.title,
		description: p.desc,
		alternates: { canonical: p.path },
		openGraph: {
			type: "website",
			url: p.path,
			siteName: SITE_NAME,
			title: fullTitle,
			description: p.desc,
			images: [{ url: OG_IMAGE, width: 1200, height: 800, alt: SITE_NAME }],
		},
		twitter: {
			card: "summary_large_image",
			title: fullTitle,
			description: p.desc,
			images: [OG_IMAGE],
		},
	};
}

export function organizationLd() {
	return {
		"@context": "https://schema.org",
		"@type": "InteriorDesignBusiness",
		name: SITE_NAME,
		url: SITE_URL,
		image: `${SITE_URL}${OG_IMAGE}`,
		logo: `${SITE_URL}/images/logo.svg`,
		email: STUDIO.email,
		telephone: STUDIO.phone,
		foundingDate: STUDIO.founded,
		founder: { "@type": "Person", name: STUDIO.founder },
		address: {
			"@type": "PostalAddress",
			streetAddress: STUDIO.address,
			addressLocality: "Hyderabad",
			addressRegion: "Telangana",
			addressCountry: "IN",
		},
		areaServed: "IN",
		sameAs: [
			STUDIO.socials.instagram,
			STUDIO.socials.linkedin,
		].filter(Boolean),
	};
}
