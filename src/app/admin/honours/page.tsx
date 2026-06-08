import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getHonours } from "@/lib/cms/queries";
import { HonoursManager } from "./HonoursManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Honours & Milestones" };

export default async function AdminHonoursPage() {
	await requireRole("editor");
	const honours = await getHonours();

	return (
		<div className="mx-auto max-w-4xl px-6 py-12 md:px-10 md:py-16">
			<Link
				href="/admin"
				className="font-sans font-light uppercase tracking-[0.24em] text-cream/45 text-[0.708rem] transition-colors hover:text-gold">
				&larr; Dashboard
			</Link>
			<div className="mb-10 mt-4">
				<div className="font-sans font-light uppercase tracking-[0.4em] text-gold text-[0.708rem] mb-3">
					Honours &amp; Milestones
				</div>
				<h1 className="font-serif font-light text-cream text-4xl md:text-5xl">
					Awards &amp; recognition
				</h1>
				<p className="mt-3 font-sans font-light text-cream/45 text-base">
					The recognition section on the About page. Each milestone has a title,
					year, by-line, description, and image.
				</p>
			</div>

			<HonoursManager initial={honours} />
		</div>
	);
}
