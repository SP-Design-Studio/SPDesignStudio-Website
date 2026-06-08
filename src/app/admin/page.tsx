import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getContentCounts } from "@/lib/cms/queries";
import { getPageDrafts } from "@/lib/cms/pages";

export const metadata = { title: "Dashboard" };

const SECTIONS = [
	{
		label: "Homepage",
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
		label: "Testimonials",
		note: "Client reflections",
		href: "/admin/testimonials",
		view: "/",
		page: "home",
		keys: ["testimonials"],
		countKey: "testimonials",
		unit: "quotes",
	},
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
		label: "Honours & Milestones",
		note: "Awards & recognition",
		href: "/admin/honours",
		view: "/about",
		page: "about",
		keys: ["honours"],
		countKey: "honours",
		unit: "milestones",
	},
	{
		label: "Projects",
		note: "Case studies & galleries",
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
];

export default async function AdminHome() {
	const profile = await requireRole("editor");
	const counts = await getContentCounts();
	const drafts = await getPageDrafts();
	const draftByKey = new Map(drafts.map((d) => [d.key as string, d]));
	const firstName = (profile.full_name?.trim() || profile.email.split("@")[0])
		.split(" ")[0];
	const greetName = profile.full_name?.trim() || firstName;

	return (
		<div className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-16">
			<div className="mb-12">
				<div className="font-sans font-light uppercase tracking-[0.4em] text-gold text-[0.6rem] mb-3">
					Dashboard
				</div>
				<h1 className="font-serif font-light text-cream text-3xl md:text-4xl">
					Welcome back, {greetName}.
				</h1>
				<p className="mt-3 font-sans font-light text-cream/45 text-sm">
					Manage the studio&rsquo;s public content. Edits are saved as drafts
					until an admin publishes.
				</p>
			</div>

			<div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-cream/10 bg-cream/10 sm:grid-cols-2 lg:grid-cols-3">
				{SECTIONS.map((s) => {
					const count = s.countKey ? counts[s.countKey] : undefined;
					const draft = draftByKey.get(s.page);
					const sectionStatus = !draft
						? "clean"
						: draft.status === "unpublished"
							? "unpublished"
							: s.keys.some((k) => draft.dirtyKeys.includes(k))
								? "dirty"
								: "clean";
					const pending = sectionStatus !== "clean";
					return (
						<div
							key={s.label}
							className="group flex flex-col bg-plum-dark px-5 py-6">
							<div className="flex items-baseline justify-between gap-2">
								<Link
									href={s.href}
									className="font-serif font-light text-cream text-lg transition-colors hover:text-gold">
									{s.label}
								</Link>
								{count !== undefined && (
									<span className="font-sans font-light text-gold/70 text-[0.7rem] tabular-nums">
										{count}
										<span className="text-cream/30">
											{" "}
											{s.unit}
										</span>
									</span>
								)}
							</div>
							<span className="mt-1 font-sans font-light text-cream/40 text-[0.72rem]">
								{s.note}
							</span>
							{pending && (
								<span className="mt-2 w-fit rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 font-sans font-light uppercase tracking-[0.18em] text-gold text-[0.48rem]">
									{sectionStatus === "unpublished"
										? "Not published"
										: "Draft — needs publish"}
								</span>
							)}
							<div className="mt-3 flex items-center gap-4 font-sans font-light uppercase tracking-[0.2em] text-[0.5rem]">
								<Link
									href={s.href}
									className="text-gold/80 transition-colors hover:text-gold">
									Manage →
								</Link>
								<a
									href={s.view}
									target="_blank"
									rel="noopener noreferrer"
									className="text-cream/30 transition-colors hover:text-gold">
									View ↗
								</a>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
