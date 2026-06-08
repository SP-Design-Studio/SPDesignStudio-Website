export interface HomeStat {
	id: string;
	value: string;
	label: string;
	sort: number;
}

export interface Recognition {
	id: string;
	label: string;
	sort: number;
}

export interface ProcessStep {
	id: string;
	no: string;
	title: string;
	description: string | null;
	img: string | null;
	sort: number;
}

export interface Discipline {
	id: string;
	top_label: string;
	img: string | null;
	big_stat: string | null;
	description: string | null;
	variant: string;
	span: string;
	sort: number;
}

export interface Partner {
	id: string;
	name: string;
	logo: string | null;
	sort: number;
}

export interface PartnerCategory {
	id: string;
	category: string;
	brands: string[];
	sort: number;
}

export interface Testimonial {
	id: string;
	quote: string;
	name: string;
	detail: string | null;
	img: string | null;
	sort: number;
}

export interface TeamMember {
	id: string;
	name: string;
	role: string | null;
	note: string | null;
	img: string | null;
	sort: number;
}

export interface TimelineEntry {
	id: string;
	year: string;
	label: string;
	description: string | null;
	img: string | null;
	sort: number;
}

export interface Honour {
	id: string;
	img: string | null;
	year: string | null;
	by_line: string | null;
	title: string;
	description: string | null;
	sort: number;
}

export interface ProjectFact {
	id: string;
	label: string;
	value: string;
	sort: number;
}

export interface ProjectGalleryImage {
	id: string;
	url: string;
	sort: number;
}

export interface CmsProject {
	id: string;
	slug: string;
	title: string;
	location: string | null;
	type: string | null;
	category: "residential" | "commercial" | "hospitality";
	img: string | null;
	year: string | null;
	blurb: string | null;
	sort: number;
	facts?: ProjectFact[];
	gallery?: ProjectGalleryImage[];
}

export interface SiteSettings {
	id: string;
	founded: string | null;
	name: string | null;
	founder: string | null;
	location: string | null;
	email: string | null;
	phone: string | null;
	address: string | null;
	maps_url: string | null;
	instagram: string | null;
	linkedin: string | null;
	whatsapp: string | null;
	hours: { days: string; time: string }[];
}

export interface CareerOpening {
	id: string;
	role: string;
	type: string | null;
	location: string | null;
	description: string | null;
	sort: number;
}

export interface CareersSettings {
	id: string;
	subtitle: string | null;
	empty_note: string | null;
	apply_email: string | null;
	role_options: string[] | null;
	type_options: string[] | null;
}
