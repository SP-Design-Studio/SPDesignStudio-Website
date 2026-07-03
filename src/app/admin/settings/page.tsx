import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getGrainSettings } from "@/lib/config";
import { GrainToggle } from "./GrainToggle";

export const metadata = { title: "Settings" };

const sectionLabel =
	"font-sans font-light uppercase tracking-[0.32em] text-gold text-[0.684rem] mb-2";

export default async function SettingsPage() {
	await requireRole("admin");
	const grain = await getGrainSettings();

	return (
		<div className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-16">
			<h1 className="mb-12 font-serif font-light text-cream text-4xl md:text-5xl">
				Settings
			</h1>

			<section>
				<div className={sectionLabel}>Appearance</div>
				<p className="mb-6 font-sans font-light text-cream/82 text-base">
					Toggle the subtle film-grain texture overlay shown across the public
					site.
				</p>
				<GrainToggle enabled={grain.enabled} intensity={grain.intensity} />
			</section>

			<section className="mt-14 border-t border-cream/10 pt-10">
				<div className={sectionLabel}>Instagram</div>
				<p className="mb-6 font-sans font-light text-cream/82 text-base">
					The &ldquo;Studio on Instagram&rdquo; section is now a curated feed you
					manage directly &mdash; no access token or API needed.
				</p>
				<Link
					href="/admin/instagram"
					className="w-fit cursor-pointer border border-gold/40 px-6 py-3 font-sans font-light uppercase tracking-[0.24em] text-gold text-[0.732rem] transition-colors hover:bg-gold/10">
					Manage Instagram feed &rarr;
				</Link>
			</section>
		</div>
	);
}
