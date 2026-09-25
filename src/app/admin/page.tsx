import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { NavLink } from "./_components/NavLink";
import { getContentCounts } from "@/lib/cms/queries";
import { getPageDrafts } from "@/lib/cms/pages";
import { getRecentActivity, ACTION_LABELS } from "@/lib/cms/activity";
import { CONTENT_GROUPS, type AdminSection } from "@/lib/admin/sections";

export const metadata = { title: "Dashboard" };

type Status = "clean" | "dirty" | "unpublished";

function timeAgo(iso: string): string {
	const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
	if (mins < 1) return "just now";
	if (mins < 60) return `${mins}m ago`;
	const hrs = Math.round(mins / 60);
	if (hrs < 24) return `${hrs}h ago`;
	const days = Math.round(hrs / 24);
	if (days < 30) return `${days}d ago`;
	return new Date(iso).toLocaleDateString();
}

export default async function AdminHome() {
	const profile = await requireRole("editor");
	const canManage = profile.role === "founder" || profile.role === "admin";

	const [counts, drafts, activity] = await Promise.all([
		getContentCounts(),
		getPageDrafts(),
		canManage ? getRecentActivity(6) : Promise.resolve([]),
	]);

	const draftByKey = new Map(drafts.map((d) => [d.key as string, d]));
	const greetName =
		profile.full_name?.trim() || profile.email.split("@")[0]!.split(" ")[0]!;

	const statusOf = (s: AdminSection): Status => {
		const draft = s.page ? draftByKey.get(s.page) : undefined;
		if (!draft) return "clean";
		if (draft.status === "unpublished") return "unpublished";
		return (s.keys ?? []).some((k) => draft.dirtyKeys.includes(k))
			? "dirty"
			: "clean";
	};

	const waiting = CONTENT_GROUPS.flatMap((g) => g.items).filter(
		(s) => statusOf(s) !== "clean",
	).length;

	const lastPublished = drafts
		.map((d) => d.publishedAt)
		.filter((d): d is string => Boolean(d))
		.sort()
		.at(-1);

	let delay = 0;
	const next = () => ({ animationDelay: `${(delay += 60)}ms` });
	let n = 0;

	return (
		<div className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-16">
			<header className="admin-stagger" style={next()}>
				<div className="mb-3 font-sans font-light uppercase tracking-[0.4em] text-gold text-micro">
					Studio CMS
				</div>
				<h1 className="font-serif font-light text-cream text-4xl leading-[1.1] md:text-6xl">
					Welcome back,
					<br />
					{greetName}.
				</h1>
			</header>

			<div
				style={next()}
				className="admin-stagger mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-cream/10 py-4">
				<span
					className={`h-1.5 w-1.5 shrink-0 rounded-full ${
						waiting
							? "bg-gold [animation:admin-pulse_1.6s_ease-in-out_infinite]"
							: "bg-cream/30"
					}`}
				/>
				<span className="font-sans font-light text-cream/85 text-sm">
					{waiting
						? `${waiting} section${waiting === 1 ? "" : "s"} awaiting publish`
						: "Everything published — the live site is up to date."}
				</span>
				{lastPublished && (
					<span className="font-sans font-light text-cream/80 text-micro">
						Last published {timeAgo(lastPublished)}
					</span>
				)}
				{canManage && waiting > 0 && (
					<NavLink
						href="/admin/publish"
						className="ml-auto font-sans font-light uppercase tracking-[0.24em] text-gold text-tiny transition-colors hover:text-cream">
						Review &amp; publish →
					</NavLink>
				)}
			</div>

			<div className="mt-14 flex flex-col gap-12">
				{CONTENT_GROUPS.map((group) => (
					<section key={group.title} style={next()} className="admin-stagger">
						<div className="mb-1 flex items-baseline justify-between gap-4 border-b border-cream/15 pb-2">
							<h2 className="font-sans font-light uppercase tracking-[0.34em] text-cream/82 text-tiny">
								{group.title}
							</h2>
							{group.view && (
								<a
									href={group.view}
									target="_blank"
									rel="noopener noreferrer"
									className="font-sans font-light uppercase tracking-[0.2em] text-cream/80 text-micro transition-colors hover:text-gold">
									View ↗
								</a>
							)}
						</div>

						{group.items.map((s) => {
							const count = s.countKey ? counts[s.countKey] : undefined;
							const status = statusOf(s);
							n += 1;
							return (
								<Link
									key={s.href}
									href={s.href}
									className="card-trace group flex items-baseline gap-4 border-b border-cream/5 px-3 py-4 transition-colors hover:bg-plum/25 active:bg-plum/40">
									<span className="w-6 shrink-0 font-sans font-light tabular-nums text-gold/45 text-micro transition-colors group-hover:text-gold group-active:text-gold">
										{String(n).padStart(2, "0")}
									</span>
									<span className="font-serif font-light text-cream text-xl leading-none transition-colors group-hover:text-gold group-active:text-gold">
										{s.label}
									</span>
									<span className="hidden truncate font-sans font-light text-cream/80 text-tiny lg:block">
										{s.note}
									</span>
									<span className="ml-auto flex shrink-0 items-center gap-4">
										{status !== "clean" && (
											<span className="rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 font-sans font-light uppercase tracking-[0.18em] text-gold text-micro">
												{status === "unpublished" ? "Not published" : "Draft"}
											</span>
										)}
										{count !== undefined && (
											<span className="font-sans font-light tabular-nums text-cream/82 text-tiny">
												<span className="text-gold">{count}</span> {s.unit}
											</span>
										)}
										<span className="text-cream/80 text-sm transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-gold group-active:translate-x-0.5 group-active:text-gold">
											›
										</span>
									</span>
								</Link>
							);
						})}
					</section>
				))}

				{canManage && activity.length > 0 && (
					<section style={next()} className="admin-stagger">
						<div className="mb-1 flex items-baseline justify-between gap-4 border-b border-cream/15 pb-2">
							<h2 className="font-sans font-light uppercase tracking-[0.34em] text-cream/82 text-tiny">
								Recent activity
							</h2>
							<NavLink
								href="/admin/activity"
								className="font-sans font-light uppercase tracking-[0.2em] text-cream/80 text-micro transition-colors hover:text-gold">
								Full log →
							</NavLink>
						</div>
						<ul className="flex flex-col">
							{activity.map((a) => (
								<li
									key={a.id}
									className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-cream/5 px-3 py-3 last:border-b-0">
									<span className="font-sans font-light uppercase tracking-[0.2em] text-gold/80 text-micro">
										{ACTION_LABELS[a.action] ?? a.action}
									</span>
									<span className="font-serif font-light text-cream/90 text-base">
										{a.target ?? "—"}
									</span>
									<span className="ml-auto font-sans font-light text-cream/80 text-micro">
										{a.actor_name || a.actor_email || "system"} ·{" "}
										{timeAgo(a.created_at)}
									</span>
								</li>
							))}
						</ul>
					</section>
				)}
			</div>
		</div>
	);
}
