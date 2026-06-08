import Link from "next/link";
import { requireRole } from "@/lib/auth";
import {
	getActivityLog,
	ACTION_LABELS,
	ACTIVITY_FILTERS,
} from "@/lib/cms/activity";

export const metadata = { title: "Activity" };

const FILTERS = [
	{ key: "", label: "All" },
	{ key: "edits", label: "Edits" },
	{ key: "publishes", label: "Publishes" },
	{ key: "team", label: "Team" },
];

export default async function ActivityPage({
	searchParams,
}: {
	searchParams: Promise<{ type?: string }>;
}) {
	await requireRole("admin");
	const { type } = await searchParams;
	const filter = type && ACTIVITY_FILTERS[type] ? type : "";
	const entries = await getActivityLog(filter);

	return (
		<div className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-16">
			<div className="mb-10">
				<Link
					href="/admin"
					className="font-sans font-light uppercase tracking-[0.24em] text-cream/45 text-[0.649rem] transition-colors hover:text-gold">
					← Dashboard
				</Link>
				<div className="mt-4 font-sans font-light uppercase tracking-[0.4em] text-gold text-[0.708rem]">
					Activity
				</div>
				<h1 className="mt-2 font-serif font-light text-cream text-4xl md:text-5xl">
					Edits & publishing log
				</h1>
				<p className="mt-3 font-sans font-light text-cream/45 text-base">
					Every content edit, publish, revert, and team change, newest first.
				</p>
			</div>

			<div className="mb-8 flex flex-wrap gap-2">
				{FILTERS.map((f) => {
					const active = filter === f.key;
					return (
						<Link
							key={f.key || "all"}
							href={f.key ? `/admin/activity?type=${f.key}` : "/admin/activity"}
							className={`rounded-full border px-4 py-1.5 font-sans font-light uppercase tracking-[0.2em] text-[0.649rem] transition-colors ${
								active
									? "border-gold/50 bg-gold/10 text-gold"
									: "border-cream/15 text-cream/45 hover:border-cream/30 hover:text-cream/70"
							}`}>
							{f.label}
						</Link>
					);
				})}
			</div>

			{entries.length === 0 ? (
				<p className="font-sans font-light text-cream/35 text-base">
					No activity in this view yet.
				</p>
			) : (
				<ul className="flex flex-col">
					{entries.map((a) => (
						<li
							key={a.id}
							className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-cream/10 py-3.5 last:border-b-0">
							<span className="font-sans font-light text-cream/70 text-base">
								<span className="text-gold/80">
									{ACTION_LABELS[a.action] ?? a.action}
								</span>
								{a.target && <span className="text-cream/80"> · {a.target}</span>}
								{a.detail && <span className="text-cream/40"> — {a.detail}</span>}
							</span>
							<span className="font-sans font-light text-cream/35 text-[0.826rem]">
								{a.actor_name?.trim() || a.actor_email || "—"} ·{" "}
								{new Date(a.created_at).toLocaleString()}
							</span>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
