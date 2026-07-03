import { createPublicClient } from "@/lib/supabase/public";
import type {
	HomeStat,
	Recognition,
	ProcessStep,
	Discipline,
	Partner,
	PartnerCategory,
	InstagramPost,
	Testimonial,
	TeamMember,
	TimelineEntry,
	Honour,
	CmsProject,
	ProjectCategoryRow,
	SiteSettings,
	CareerOpening,
	CareersSettings,
} from "./types";

async function list<T>(table: string): Promise<T[]> {
	const db = createPublicClient();
	const { data, error } = await db
		.from(table)
		.select("*")
		.order("sort", { ascending: true });
	if (error) {
		console.error(`cms.${table}:`, error.message);
		return [];
	}
	return (data ?? []) as T[];
}

export const getHomeStats = () => list<HomeStat>("home_stats");
export const getRecognition = () => list<Recognition>("home_recognition");
export const getProcessSteps = () => list<ProcessStep>("process_steps");
export const getDisciplines = () => list<Discipline>("home_disciplines");
export const getPartners = () => list<Partner>("partners");
export const getPartnerCategories = () =>
	list<PartnerCategory>("partner_categories");
export const getInstagramPosts = () =>
	list<InstagramPost>("instagram_posts");
export const getTestimonials = () => list<Testimonial>("testimonials");
export const getTeam = () => list<TeamMember>("team_members");
export const getTimeline = () => list<TimelineEntry>("timeline_entries");
export const getHonours = () => list<Honour>("honours");
export const getCareerOpenings = () => list<CareerOpening>("career_openings");

export async function getProjects(): Promise<CmsProject[]> {
	return list<CmsProject>("projects");
}

function sortNested(p: CmsProject): CmsProject {
	p.facts = (p.facts ?? []).sort((a, b) => a.sort - b.sort);
	p.gallery = (p.gallery ?? []).sort((a, b) => a.sort - b.sort);
	return p;
}

export async function getProjectsWithDetails(): Promise<CmsProject[]> {
	const db = createPublicClient();
	const { data, error } = await db
		.from("projects")
		.select("*, facts:project_facts(*), gallery:project_gallery(*)")
		.order("sort", { ascending: true });
	if (error) {
		console.error("cms.projectsWithDetails:", error.message);
		return [];
	}
	return ((data ?? []) as CmsProject[]).map(sortNested);
}

export async function getProjectCategories(): Promise<ProjectCategoryRow[]> {
	const db = createPublicClient();
	const { data } = await db
		.from("project_categories")
		.select("id, label, slug, sort")
		.order("sort", { ascending: true });
	return (data ?? []) as ProjectCategoryRow[];
}

export async function getProjectById(id: string): Promise<CmsProject | null> {
	const db = createPublicClient();
	const { data } = await db
		.from("projects")
		.select("*, facts:project_facts(*), gallery:project_gallery(*)")
		.eq("id", id)
		.single();
	return data ? sortNested(data as CmsProject) : null;
}

export async function getProject(slug: string): Promise<CmsProject | null> {
	const db = createPublicClient();
	const { data, error } = await db
		.from("projects")
		.select(
			"*, facts:project_facts(*), gallery:project_gallery(*)",
		)
		.eq("slug", slug)
		.single();
	if (error || !data) return null;
	const project = data as CmsProject;
	project.facts = (project.facts ?? []).sort((a, b) => a.sort - b.sort);
	project.gallery = (project.gallery ?? []).sort((a, b) => a.sort - b.sort);
	return project;
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
	const db = createPublicClient();
	const { data } = await db
		.from("site_settings")
		.select("*")
		.eq("id", "main")
		.single();
	return (data as SiteSettings) ?? null;
}

export async function getContentCounts(): Promise<Record<string, number>> {
	const db = createPublicClient();
	const tables = [
		"home_disciplines",
		"home_recognition",
		"partners",
		"partner_categories",
		"testimonials",
		"team_members",
		"timeline_entries",
		"honours",
		"projects",
		"process_steps",
		"career_openings",
		"instagram_posts",
	];
	const entries = await Promise.all(
		tables.map(async (t) => {
			const { count } = await db
				.from(t)
				.select("*", { count: "exact", head: true });
			return [t, count ?? 0] as const;
		}),
	);
	return Object.fromEntries(entries);
}

export async function getCareersSettings(): Promise<CareersSettings | null> {
	const db = createPublicClient();
	const { data } = await db
		.from("careers_settings")
		.select("*")
		.eq("id", "main")
		.single();
	return (data as CareersSettings) ?? null;
}
