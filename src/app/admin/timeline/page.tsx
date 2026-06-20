import { NavLink } from "../NavLink";
import { requireRole } from "@/lib/auth";
import { getTimeline } from "@/lib/cms/queries";
import { TimelineManager } from "./TimelineManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Studio Evolution" };

export default async function AdminTimelinePage() {
	await requireRole("editor");
	const entries = await getTimeline();

	return (
		<div className="mx-auto max-w-4xl px-6 py-12 md:px-10 md:py-16">
			<NavLink
				href="/admin"
				className="font-sans font-light uppercase tracking-[0.24em] text-cream/80 text-[0.708rem] transition-colors hover:text-gold">
				&larr; Dashboard
			</NavLink>
			<div className="mb-10 mt-4">
				<div className="font-sans font-light uppercase tracking-[0.4em] text-gold text-[0.708rem] mb-3">
					Studio Evolution
				</div>
				<h1 className="font-serif font-light text-cream text-4xl md:text-5xl">
					Timeline entries
				</h1>
				<p className="mt-3 font-sans font-light text-cream/80 text-base">
					The milestone timeline on the About page. Each entry has a year,
					label, description, and image.
				</p>
			</div>

			<TimelineManager initial={entries} />
		</div>
	);
}
