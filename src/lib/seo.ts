import type { Metadata } from "next";
import { STUDIO } from "@/lib/studio";

export const SITE_URL = (
	process.env.NEXT_PUBLIC_SITE_URL || "https://spdesignstudio.in"
).replace(/\/+$/, "");

export const SITE_NAME = STUDIO.name;
export const SITE_DESC =
	"SP Design Studio is an interior design studio in Banjara Hills, Hyderabad — crafting residential, commercial, and hospitality interiors that merge technical rigor with intentional, soulful living.";
export const OG_IMAGE = "/images/about-hero.jpg";

export const ALT_NAMES = ["SP Designs", "SPDesigns", "SP Design Studio Hyderabad"];

export const SERVICES = [
	"Residential Interior Design",
	"Commercial Interior Design",
	"Hospitality Interiors",
	"Turnkey Interior Solutions",
	"Interior Styling",
	"Interior Architecture",
	"Design Consultation",
];

export const KEYWORDS = [
	"SP Design Studio",
	"SP Design Studio Hyderabad",
	"Spandana Puppala",
	"interior design studio Hyderabad",
	"interior designer Banjara Hills",
	"residential interior design Hyderabad",
	"commercial interior design Hyderabad",
	"turnkey interiors Hyderabad",
	"interior architecture",
	"luxury interior design Hyderabad",
];

const GEO = { latitude: 17.4156, longitude: 78.4347 };
const POSTAL_CODE = "500034";

export type PageKey =
	| "home"
	| "about"
	| "projects"
	| "process"
	| "contact"
	| "careers"
	| "atelier";

export const PAGE_SEO: Record<
	PageKey,
	{ path: string; title: string; desc: string }
> = {
	home: { path: "/", title: SITE_NAME, desc: SITE_DESC },
	about: {
		path: "/about",
		title: "About",
		desc: `Meet ${STUDIO.founder} and the SP Design Studio team — an interior design studio in Hyderabad bridging intentional architecture and the quiet art of well-being.`,
	},
	projects: {
		path: "/projects",
		title: "Projects",
		desc: "Selected residential, commercial, and hospitality interior design projects by SP Design Studio, Hyderabad.",
	},
	process: {
		path: "/process",
		title: "Process",
		desc: "From first conversation to final styling — how SP Design Studio, an interior design studio in Hyderabad, delivers turnkey interiors.",
	},
	contact: {
		path: "/contact",
		title: "Contact",
		desc: `Start an interior design project with SP Design Studio — ${STUDIO.address}. Studio visits by appointment.`,
	},
	careers: {
		path: "/careers",
		title: "Careers",
		desc: "Join the SP Design Studio collective of interior designers, architects, and makers in Hyderabad.",
	},
	atelier: {
		path: "/atelier",
		title: "Atelier",
		desc: "Behind the studio — moments, materials, and process from SP Design Studio.",
	},
};

export function pageMeta(key: PageKey): Metadata {
	const p = PAGE_SEO[key];
	const fullTitle = key === "home" ? SITE_NAME : `${p.title} · ${SITE_NAME}`;
	return {
		title: key === "home" ? { absolute: SITE_NAME } : p.title,
		description: p.desc,
		keywords: KEYWORDS,
		alternates: { canonical: p.path },
		openGraph: {
			type: "website",
			locale: "en_IN",
			url: p.path,
			siteName: SITE_NAME,
			title: fullTitle,
			description: p.desc,
			images: [{ url: OG_IMAGE, width: 2000, height: 1055, alt: SITE_NAME }],
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
		"@id": `${SITE_URL}/#organization`,
		name: SITE_NAME,
		alternateName: ALT_NAMES,
		url: SITE_URL,
		image: `${SITE_URL}${OG_IMAGE}`,
		logo: `${SITE_URL}/images/logo.svg`,
		description: SITE_DESC,
		slogan: "Crafting spaces with soul.",
		email: STUDIO.email,
		telephone: STUDIO.phone,
		priceRange: "₹₹₹",
		foundingDate: STUDIO.founded,
		founder: {
			"@type": "Person",
			name: STUDIO.founder,
			jobTitle: "Founder & Principal Designer",
		},
		address: {
			"@type": "PostalAddress",
			streetAddress: STUDIO.address,
			addressLocality: "Hyderabad",
			addressRegion: "Telangana",
			postalCode: POSTAL_CODE,
			addressCountry: "IN",
		},
		geo: { "@type": "GeoCoordinates", ...GEO },
		hasMap: STUDIO.mapsUrl,
		areaServed: ["Hyderabad", "Secunderabad", "Telangana", "India"],
		knowsAbout: SERVICES,
		openingHoursSpecification: [
			{
				"@type": "OpeningHoursSpecification",
				dayOfWeek: [
					"Monday",
					"Tuesday",
					"Wednesday",
					"Thursday",
					"Friday",
				],
				opens: "10:00",
				closes: "18:00",
			},
		],
		hasOfferCatalog: {
			"@type": "OfferCatalog",
			name: "Interior Design Services",
			itemListElement: SERVICES.map((s) => ({
				"@type": "Offer",
				itemOffered: { "@type": "Service", name: s },
			})),
		},
		sameAs: [STUDIO.socials.instagram, STUDIO.socials.linkedin].filter(Boolean),
	};
}

export function websiteLd() {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		"@id": `${SITE_URL}/#website`,
		url: SITE_URL,
		name: SITE_NAME,
		alternateName: ALT_NAMES,
		description: SITE_DESC,
		inLanguage: "en-IN",
		publisher: { "@id": `${SITE_URL}/#organization` },
	};
}

export function breadcrumbLd(key: PageKey) {
	const p = PAGE_SEO[key];
	const trail = [{ name: "Home", path: "/" }];
	if (key !== "home") trail.push({ name: p.title, path: p.path });
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: trail.map((it, i) => ({
			"@type": "ListItem",
			position: i + 1,
			name: it.name,
			item: `${SITE_URL}${it.path === "/" ? "" : it.path}`,
		})),
	};
}

export function webPageLd(key: PageKey, type = "WebPage") {
	const p = PAGE_SEO[key];
	const url = `${SITE_URL}${p.path === "/" ? "" : p.path}`;
	return {
		"@context": "https://schema.org",
		"@type": type,
		"@id": `${url}#webpage`,
		url,
		name: key === "home" ? SITE_NAME : `${p.title} · ${SITE_NAME}`,
		description: p.desc,
		isPartOf: { "@id": `${SITE_URL}/#website` },
		about: { "@id": `${SITE_URL}/#organization` },
		inLanguage: "en-IN",
	};
}

export function founderLd() {
	return {
		"@context": "https://schema.org",
		"@type": "Person",
		name: STUDIO.founder,
		jobTitle: "Founder & Principal Designer",
		worksFor: { "@id": `${SITE_URL}/#organization` },
		image: `${SITE_URL}/images/team/spandana.jpg`,
	};
}
