import { createPublicClient } from "@/lib/supabase/public";
import { diffDetailed, type Change } from "./diff";
import { getAtelierImages, type AtelierImage } from "@/lib/atelier";
import type { Project, ProjectCategoryOption } from "@/lib/data/projects";
import {
	getDisciplines,
	getPartners,
	getPartnerCategories,
	getTestimonials,
	getRecognition,
	getTeam,
	getTimeline,
	getHonours,
	getProjectsWithDetails,
	getProjectCategories,
	getSiteSettings,
	getCareerOpenings,
	getCareersSettings,
	getProcessSteps,
	getInstagramPosts,
} from "./queries";
import type {
	Discipline,
	Partner,
	PartnerCategory,
	Testimonial,
	TeamMember,
	TimelineEntry,
	Honour,
	SiteSettings,
	CareerOpening,
	CareersSettings,
	ProcessStep,
	InstagramPost,
} from "./types";

export const PAGE_KEYS = [
	"home",
	"about",
	"projects",
	"contact",
	"careers",
	"process",
	"atelier",
] as const;
export type PageKey = (typeof PAGE_KEYS)[number];

export const PAGE_LABELS: Record<PageKey, string> = {
	home: "Home",
	about: "About",
	projects: "Projects",
	contact: "Contact",
	careers: "Careers",
	process: "Process",
	atelier: "Atelier",
};

export const PAGE_PATHS: Record<PageKey, string> = {
	home: "/",
	about: "/about",
	projects: "/projects",
	contact: "/contact",
	careers: "/careers",
	process: "/process",
	atelier: "/atelier",
};

export const PAGE_TABLES: Record<PageKey, string[]> = {
	home: [
		"home_disciplines",
		"partners",
		"partner_categories",
		"testimonials",
		"home_recognition",
		"instagram_posts",
	],
	about: ["team_members", "timeline_entries", "honours"],
	projects: ["project_categories", "projects", "project_facts", "project_gallery"],
	contact: ["site_settings"],
	careers: ["career_openings", "careers_settings"],
	process: ["process_steps"],
	atelier: ["atelier_images"],
};

export interface HomeData {
	disciplines: Discipline[];
	partners: Partner[];
	partnerCategories: PartnerCategory[];
	testimonials: Testimonial[];
	recognition: string[];
	instagram: InstagramPost[];
}
export interface AboutData {
	team: TeamMember[];
	timeline: TimelineEntry[];
	honours: Honour[];
}
export interface ProjectsData {
	projects: Project[];
	categories: ProjectCategoryOption[];
}
export interface ContactData {
	settings: SiteSettings | null;
}
export interface CareersData {
	openings: CareerOpening[];
	settings: CareersSettings | null;
}
export interface ProcessData {
	steps: ProcessStep[];
}
export interface AtelierData {
	images: AtelierImage[];
}

export async function buildHome(): Promise<HomeData> {
	const [
		disciplines,
		partners,
		partnerCategories,
		testimonials,
		recognition,
		instagram,
	] = await Promise.all([
		getDisciplines(),
		getPartners(),
		getPartnerCategories(),
		getTestimonials(),
		getRecognition(),
		getInstagramPosts(),
	]);
	return {
		disciplines,
		partners,
		partnerCategories,
		testimonials,
		recognition: recognition.map((r) => r.label),
		instagram,
	};
}

export async function buildAbout(): Promise<AboutData> {
	const [team, timeline, honours] = await Promise.all([
		getTeam(),
		getTimeline(),
		getHonours(),
	]);
	return { team, timeline, honours };
}

export async function buildProjects(): Promise<ProjectsData> {
	const [db, cats] = await Promise.all([
		getProjectsWithDetails(),
		getProjectCategories(),
	]);
	const projects: Project[] = db.map((p) => ({
		id: p.slug,
		title: p.title,
		location: p.location ?? "",
		type: p.type ?? "",
		category: p.category,
		delivery: p.delivery,
		img: p.img ?? "",
		year: p.year ?? "",
		blurb: p.blurb ?? "",
		facts: (p.facts ?? []).map((f) => ({ label: f.label, value: f.value })),
		gallery: (p.gallery ?? []).map((g) => ({
			url: g.url,
			aspect: g.aspect ?? null,
		})),
	}));
	const categories: ProjectCategoryOption[] = cats.map((c) => ({
		slug: c.slug,
		label: c.label,
	}));
	return { projects, categories };
}

export async function buildContact(): Promise<ContactData> {
	return { settings: await getSiteSettings() };
}

export async function buildCareers(): Promise<CareersData> {
	const [openings, settings] = await Promise.all([
		getCareerOpenings(),
		getCareersSettings(),
	]);
	return { openings, settings };
}

export async function buildProcess(): Promise<ProcessData> {
	return { steps: await getProcessSteps() };
}

export async function buildAtelier(): Promise<AtelierData> {
	return { images: await getAtelierImages() };
}

async function published<T>(page: PageKey): Promise<T | null> {
	const db = createPublicClient();
	const { data } = await db
		.from("page_snapshots")
		.select("data")
		.eq("page", page)
		.maybeSingle();
	return (data?.data as T) ?? null;
}

const EMPTY_HOME: HomeData = {
	disciplines: [],
	partners: [],
	partnerCategories: [],
	testimonials: [],
	recognition: [],
	instagram: [],
};
const EMPTY_ABOUT: AboutData = { team: [], timeline: [], honours: [] };
const EMPTY_PROJECTS: ProjectsData = { projects: [], categories: [] };
const EMPTY_CONTACT: ContactData = { settings: null };
const EMPTY_CAREERS: CareersData = { openings: [], settings: null };
const EMPTY_PROCESS: ProcessData = { steps: [] };

export const getHomeData = async (): Promise<HomeData> => {
	const data = await published<HomeData>("home");
	if (!data) return EMPTY_HOME;
	return data.instagram
		? data
		: { ...data, instagram: await getInstagramPosts() };
};
export const getAboutData = async (): Promise<AboutData> =>
	(await published<AboutData>("about")) ?? EMPTY_ABOUT;
export const getProjectsData = async (): Promise<ProjectsData> =>
	(await published<ProjectsData>("projects")) ?? EMPTY_PROJECTS;
export const getContactData = async (): Promise<ContactData> =>
	(await published<ContactData>("contact")) ?? EMPTY_CONTACT;
export const getCareersData = async (): Promise<CareersData> =>
	(await published<CareersData>("careers")) ?? EMPTY_CAREERS;
export const getProcessData = async (): Promise<ProcessData> =>
	(await published<ProcessData>("process")) ?? EMPTY_PROCESS;
export const getAtelierData = async (): Promise<AtelierData> =>
	(await published<AtelierData>("atelier")) ?? (await buildAtelier());

export async function buildPage(page: PageKey): Promise<unknown> {
	switch (page) {
		case "home":
			return buildHome();
		case "about":
			return buildAbout();
		case "projects":
			return buildProjects();
		case "contact":
			return buildContact();
		case "careers":
			return buildCareers();
		case "process":
			return buildProcess();
		case "atelier":
			return buildAtelier();
	}
}

export type PageStatus = "unpublished" | "clean" | "dirty";

export interface PageDraft {
	key: PageKey;
	label: string;
	path: string;
	publishedAt: string | null;
	status: PageStatus;
	changes: Change[];
	dirtyKeys: string[];
}

type SnapRow = { data: unknown; published_at: string };

async function draftFor(
	key: PageKey,
	snap: SnapRow | undefined,
): Promise<PageDraft> {
	const base = { key, label: PAGE_LABELS[key], path: PAGE_PATHS[key] };
	if (!snap)
		return {
			...base,
			publishedAt: null,
			status: "unpublished",
			changes: [],
			dirtyKeys: [],
		};
	const changes = diffDetailed(snap.data, await buildPage(key));
	const dirtyKeys = [
		...new Set(changes.map((c) => c.path.split("·")[0]!.trim())),
	];
	return {
		...base,
		publishedAt: snap.published_at,
		status: changes.length ? "dirty" : "clean",
		changes,
		dirtyKeys,
	};
}

export async function getPageDrafts(): Promise<PageDraft[]> {
	const db = createPublicClient();
	const { data } = await db
		.from("page_snapshots")
		.select("page, data, published_at");
	const snaps = new Map(
		(data ?? []).map((r) => [(r as { page: string }).page, r as SnapRow]),
	);
	return Promise.all(PAGE_KEYS.map((key) => draftFor(key, snaps.get(key))));
}

export async function getPageDraft(key: PageKey): Promise<PageDraft> {
	const db = createPublicClient();
	const { data } = await db
		.from("page_snapshots")
		.select("data, published_at")
		.eq("page", key)
		.maybeSingle();
	return draftFor(key, (data as SnapRow | null) ?? undefined);
}

export async function getSnapshotMeta(): Promise<
	Record<string, string | null>
> {
	const db = createPublicClient();
	const { data } = await db.from("page_snapshots").select("page, published_at");
	const map: Record<string, string | null> = {};
	for (const k of PAGE_KEYS) map[k] = null;
	for (const row of data ?? [])
		map[(row as { page: string }).page] = (
			row as { published_at: string }
		).published_at;
	return map;
}
