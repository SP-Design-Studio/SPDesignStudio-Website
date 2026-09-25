export interface AdminSection {
	label: string;
	note: string;
	href: string;
	view?: string;
	page?: string;
	keys?: string[];
	countKey?: string;
	unit?: string;
	manageOnly?: boolean;
}

export interface AdminGroup {
	title: string;
	view?: string;
	items: AdminSection[];
}

export const ADMIN_GROUPS: AdminGroup[] = [
	{
		title: "Home page",
		view: "/",
		items: [
			{
				label: "Hero & disciplines",
				note: "Disciplines grid & hero accolades",
				href: "/admin/home",
				view: "/",
				page: "home",
				keys: ["disciplines", "recognition"],
				countKey: "home_disciplines",
				unit: "tiles",
			},
			{
				label: "Partners",
				note: "Logos & directory",
				href: "/admin/partners",
				view: "/",
				page: "home",
				keys: ["partners", "partnerCategories"],
				countKey: "partners",
				unit: "logos",
			},
			{
				label: "Instagram",
				note: "Curated studio feed",
				href: "/admin/instagram",
				view: "/",
				countKey: "instagram_posts",
				unit: "posts",
			},
			{
				label: "Testimonials",
				note: "Client reflections",
				href: "/admin/testimonials",
				view: "/",
				page: "home",
				keys: ["testimonials"],
				countKey: "testimonials",
				unit: "quotes",
			},
		],
	},
	{
		title: "About",
		view: "/about",
		items: [
			{
				label: "The Collection",
				note: "Team members",
				href: "/admin/team",
				view: "/about",
				page: "about",
				keys: ["team"],
				countKey: "team_members",
				unit: "members",
			},
			{
				label: "Studio Evolution",
				note: "Timeline entries",
				href: "/admin/timeline",
				view: "/about",
				page: "about",
				keys: ["timeline"],
				countKey: "timeline_entries",
				unit: "entries",
			},
			{
				label: "Honours",
				note: "Awards & recognition",
				href: "/admin/honours",
				view: "/about",
				page: "about",
				keys: ["honours"],
				countKey: "honours",
				unit: "milestones",
			},
			{
				label: "Atelier",
				note: "Behind the studio",
				href: "/admin/atelier",
				view: "/atelier",
			},
		],
	},
	{
		title: "Work",
		view: "/projects",
		items: [
			{
				label: "Projects",
				note: "Projects & galleries",
				href: "/admin/projects",
				view: "/projects",
				page: "projects",
				keys: ["projects"],
				countKey: "projects",
				unit: "projects",
			},
			{
				label: "Process",
				note: "Studio steps & images",
				href: "/admin/process",
				view: "/process",
				page: "process",
				keys: ["steps"],
				countKey: "process_steps",
				unit: "steps",
			},
		],
	},
	{
		title: "Enquiries",
		items: [
			{
				label: "Contact",
				note: "Channels & studio info",
				href: "/admin/contact",
				view: "/contact",
				page: "contact",
				keys: ["settings"],
			},
			{
				label: "Careers",
				note: "Openings & details",
				href: "/admin/careers",
				view: "/careers",
				page: "careers",
				keys: ["openings", "settings"],
				countKey: "career_openings",
				unit: "roles",
			},
		],
	},
	{
		title: "Studio",
		items: [
			{
				label: "Publish",
				note: "Push drafts live",
				href: "/admin/publish",
				manageOnly: true,
			},
			{
				label: "Activity",
				note: "Recent edits",
				href: "/admin/activity",
				manageOnly: true,
			},
			{
				label: "Users",
				note: "Team access",
				href: "/admin/users",
				manageOnly: true,
			},
			{
				label: "Settings",
				note: "Appearance & integrations",
				href: "/admin/settings",
				manageOnly: true,
			},
			{ label: "Account", note: "Your profile", href: "/admin/account" },
		],
	},
];

export const CONTENT_GROUPS = ADMIN_GROUPS.filter(
	(g) => g.title !== "Studio",
);

export function visibleGroups(canManage: boolean): AdminGroup[] {
	return ADMIN_GROUPS.map((g) => ({
		...g,
		items: g.items.filter((i) => !i.manageOnly || canManage),
	})).filter((g) => g.items.length > 0);
}
