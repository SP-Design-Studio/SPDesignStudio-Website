import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getPageDrafts, type PageDraft, type PageKey } from "@/lib/cms/pages";
import { getContentCounts } from "@/lib/cms/queries";
import { getRecentActivity, ACTION_LABELS } from "@/lib/cms/activity";
import { CONTENT_GROUPS } from "@/lib/admin/sections";
import { PageHeader } from "@/components/admin/PageHeader";

export const metadata = { title: "Dashboard" };

const PAGE_ORDER: PageKey[] = [
	"home",
	"about",
	"projects",
	"process",
	"atelier",
	"contact",
	"careers",
];

const KIND_WORD: Record<string, string> = {
	added: "added",
	removed: "removed",
	edited: "edited",
	reordered: "reordered",
	recropped: "recropped",
};

function summarise(d: PageDraft): string {
	const counts = new Map<string, number>();
	for (const c of d.changes) counts.set(c.kind, (counts.get(c.kind) ?? 0) + 1);
	return [...counts.entries()]
		.map(([k, n]) => `${n} ${KIND_WORD[k] ?? k}`)
		.join(" · ");
}

function ago(iso: string): string {
	const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
	if (s < 60) return "just now";
	if (s < 3600) return `${Math.floor(s / 60)} min ago`;
	if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
	if (s < 86400 * 7) return `${Math.floor(s / 86400)} d ago`;
	return new Date(iso).toLocaleDateString();
}

const plural = (n: number, one: string, many = `${one}s`) =>
	`${n} ${n === 1 ? one : many}`;

export default async function AdminHome() {
	const profile = await requireRole("editor");
	const canManage = profile.role === "founder" || profile.role === "admin";

	const [drafts, counts, activity] = await Promise.all([
		getPageDrafts(),
		getContentCounts(),
		canManage ? getRecentActivity(8) : Promise.resolve([]),
	]);

	const byKey = new Map<string, PageDraft>(drafts.map((d) => [d.key, d]));
	const pending = drafts.filter((d) => d.status !== "clean");
	const lastPublished = drafts
		.map((d) => d.publishedAt)
		.filter((d): d is string => Boolean(d))
		.sort()
		.at(-1);
	const greetName =
		profile.full_name?.trim() || profile.email.split("@")[0]!.split(" ")[0]!;

	const items = CONTENT_GROUPS.flatMap((g) => g.items);
	const inPage = (key: PageKey) => items.filter((i) => i.page === key);

	const c = (k: string) => counts[k] ?? 0;

	const rest = [
		[c("team_members"), `${c("team_members")} on the team`],
		[c("partners"), plural(c("partners"), "partner")],
		[c("testimonials"), plural(c("testimonials"), "client reflection")],
		[c("instagram_posts"), `${plural(c("instagram_posts"), "post")} on Instagram`],
		[c("atelier_images"), `${plural(c("atelier_images"), "image")} in the Atelier`],
	]
		.filter(([n]) => (n as number) > 0)
		.map(([, text]) => text as string)
		.join(", ");

	return (
		<div className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-16">
			<PageHeader eyebrow="Studio CMS" title={`Welcome back, ${greetName}.`} />

			<p
				className="admin-stagger max-w-4xl font-serif font-light text-cream text-[clamp(1.6rem,2.8vw,2.5rem)] leading-[1.25] tracking-[-0.01em]"
				style={{ animationDelay: "40ms" }}>
				{plural(c("projects"), "project")} across{" "}
				{plural(c("project_categories"), "type")}
				<span className="text-cream/60">. {rest}</span>
			</p>

			<div
				className="admin-stagger mt-10"
				style={{ animationDelay: "100ms" }}>
				{pending.length > 0 ? (
					<div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 rounded-sm border border-warn/35 bg-warn/[0.07] px-5 py-4">
						<p className="max-w-2xl font-sans font-light text-cream text-base leading-relaxed">
							<span className="text-warn">
								{pending.length === 1
									? "1 page has"
									: `${pending.length} pages have`}{" "}
								changes that aren&rsquo;t live yet:
							</span>{" "}
							{pending.map((d) => d.label).join(", ")}.
						</p>
						{canManage ? (
							<Link
								href="/admin/publish"
								className="cta-ok cursor-pointer rounded-sm bg-ok px-6 py-2.5 font-sans font-light uppercase tracking-[0.22em] text-plum-dark text-tiny pointer-coarse:min-h-11">
								Review and publish
							</Link>
						) : (
							<span className="font-sans font-light text-cream/70 text-tiny">
								An admin publishes these
							</span>
						)}
					</div>
				) : (
					<p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-sans font-light text-cream/90 text-base">
						<span className="h-2 w-2 rounded-full bg-ok" />
						Everything is live.
						{lastPublished && (
							<span className="text-cream/60 text-tiny">
								Last published {ago(lastPublished)}
							</span>
						)}
					</p>
				)}
			</div>

			<div className="mt-16 grid grid-cols-1 gap-x-16 gap-y-16 lg:grid-cols-12">
				<section
					className={`admin-stagger ${canManage ? "lg:col-span-7" : "lg:col-span-12"}`}
					style={{ animationDelay: "160ms" }}>
					<h2 className="mb-2 font-sans font-light uppercase tracking-[0.34em] text-cream/70 text-tiny">
						Website pages
					</h2>
					<ul>
						{PAGE_ORDER.map((key) => {
							const d = byKey.get(key);
							if (!d) return null;
							const contains = inPage(key);
							const isPending = d.status !== "clean";
							return (
								<li
									key={key}
									className="grid grid-cols-1 items-start gap-x-6 gap-y-3 border-b border-cream/[0.07] py-6 sm:grid-cols-[1fr_auto]">
									<div className="min-w-0">
										<div className="flex flex-wrap items-baseline gap-x-3">
											<span className="font-serif font-light text-cream text-3xl leading-none">
												{d.label}
											</span>
											<span className="font-sans font-light text-cream/50 text-tiny">
												{d.path}
											</span>
										</div>
										{contains.length > 0 && (
											<p className="mt-2 font-sans font-light text-cream/70 text-tiny leading-relaxed">
												{contains
													.map((i) =>
														i.countKey && counts[i.countKey] !== undefined
															? `${i.label} ${counts[i.countKey]}`
															: i.label,
													)
													.join(" · ")}
											</p>
										)}
										<p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans font-light text-tiny">
											<span
												className={`inline-flex items-center gap-2 ${
													isPending ? "text-warn" : "text-ok"
												}`}>
												<span
													className={`h-1.5 w-1.5 rounded-full ${
														isPending ? "bg-warn" : "bg-ok"
													}`}
												/>
												{d.status === "unpublished"
													? "Not published yet"
													: isPending
														? `${plural(d.changes.length, "unpublished change")}`
														: "Live"}
											</span>
											<span className="text-cream/60">
												{d.status === "unpublished"
													? "nothing is on the live site"
													: isPending
														? summarise(d)
														: d.publishedAt
															? `published ${ago(d.publishedAt)}`
															: ""}
											</span>
										</p>
									</div>
									<div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-sans font-light uppercase tracking-[0.2em] text-tiny sm:justify-end sm:pt-1">
										{isPending && (
											<a
												href={`/preview/${key}`}
												target="_blank"
												rel="noopener noreferrer"
												className="text-cream/70 transition-colors hover:text-gold">
												Preview ↗
											</a>
										)}
										{isPending && canManage && (
											<Link
												href={`/admin/publish?page=${key}`}
												className="text-ok transition-colors hover:brightness-110">
												Review →
											</Link>
										)}
										<a
											href={d.path}
											target="_blank"
											rel="noopener noreferrer"
											aria-label={`View ${d.label} on the site`}
											className="text-cream/70 transition-colors hover:text-gold">
											View ↗
										</a>
									</div>
								</li>
							);
						})}
					</ul>
				</section>

				{canManage && (
					<section
						className="admin-stagger lg:col-span-5"
						style={{ animationDelay: "220ms" }}>
						<div className="mb-5 flex items-baseline justify-between gap-4">
							<h2 className="font-sans font-light uppercase tracking-[0.34em] text-cream/70 text-tiny">
								Recent activity
							</h2>
							<Link
								href="/admin/activity"
								className="font-sans font-light uppercase tracking-[0.2em] text-cream/70 text-tiny transition-colors hover:text-gold">
								All activity →
							</Link>
						</div>
						{activity.length === 0 ? (
							<p className="font-sans font-light text-cream/70 text-base">
								Edits, publishes and team changes will show up here.
							</p>
						) : (
							<ul className="flex flex-col gap-5">
								{activity.map((a) => (
									<li key={a.id} className="border-l border-gold/30 pl-4">
										<p className="font-sans font-light text-cream text-base leading-snug">
											{a.detail ||
												`${ACTION_LABELS[a.action] ?? a.action}${
													a.target ? ` ${a.target}` : ""
												}`}
										</p>
										<p className="mt-1 font-sans font-light text-cream/60 text-tiny">
											{a.target && a.detail ? `${a.target} · ` : ""}
											{a.actor_name ||
												a.actor_email?.split("@")[0] ||
												"Someone"}
											, {ago(a.created_at)}
										</p>
									</li>
								))}
							</ul>
						)}
					</section>
				)}
			</div>
		</div>
	);
}
