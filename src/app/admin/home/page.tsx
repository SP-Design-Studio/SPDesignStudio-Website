import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getDisciplines, getRecognition } from "@/lib/cms/queries";
import { DisciplinesManager } from "./DisciplinesManager";
import { RecognitionManager } from "./RecognitionManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Homepage" };

export default async function AdminHomePage() {
	await requireRole("editor");
	const [disciplines, recognition] = await Promise.all([
		getDisciplines(),
		getRecognition(),
	]);

	return (
		<div className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-16">
			<Link
				href="/admin"
				className="font-sans font-light uppercase tracking-[0.24em] text-cream/45 text-[0.6rem] transition-colors hover:text-gold">
				&larr; Dashboard
			</Link>
			<div className="mb-10 mt-4">
				<div className="font-sans font-light uppercase tracking-[0.4em] text-gold text-[0.6rem] mb-3">
					Homepage
				</div>
				<h1 className="font-serif font-light text-cream text-3xl md:text-4xl">
					Hero &amp; disciplines
				</h1>
				<p className="mt-3 font-sans font-light text-cream/45 text-sm">
					Manage the hero accolades and the &ldquo;Tailored Design&rdquo; grid.
					Changes publish to the home page.
				</p>
			</div>

			<div className="mb-16">
				<div className="font-sans font-light uppercase tracking-[0.32em] text-gold text-[0.58rem] mb-2">
					Hero recognition
				</div>
				<p className="mb-6 font-sans font-light text-cream/45 text-sm">
					The accolades line at the bottom of the hero.
				</p>
				<RecognitionManager initial={recognition} />
			</div>

			<div className="border-t border-cream/10 pt-10">
				<div className="font-sans font-light uppercase tracking-[0.32em] text-gold text-[0.58rem] mb-2">
					Disciplines grid
				</div>
				<p className="mb-6 font-sans font-light text-cream/45 text-sm">
					The tiles in the &ldquo;Tailored Design&rdquo; section. Edit text,
					stats, and images; reorder or add tiles.
				</p>
				<DisciplinesManager initial={disciplines} />
			</div>
		</div>
	);
}
