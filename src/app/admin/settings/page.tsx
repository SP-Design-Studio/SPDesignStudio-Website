import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getGrainSettings } from "@/lib/config";
import { GrainToggle } from "./GrainToggle";
import { ui } from "@/lib/admin/ui";
import { PageHeader } from "@/components/admin/PageHeader";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
	await requireRole("admin");
	const grain = await getGrainSettings();

	return (
		<div className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-16">
			<PageHeader eyebrow="Studio" title="Settings">
				Site-wide options for the studio.
			</PageHeader>

			<section>
				<div className={ui.sectionTitle}>Appearance</div>
				<p className="mb-6 font-sans font-light text-cream/82 text-base">
					Toggle the subtle film-grain texture overlay shown across the public
					site. Unlike content, this applies to the live site immediately and is
					not part of publishing.
				</p>
				<GrainToggle enabled={grain.enabled} intensity={grain.intensity} />
			</section>

			<section className="mt-14 border-t border-cream/10 pt-10">
				<div className={ui.sectionTitle}>Instagram</div>
				<p className="mb-6 font-sans font-light text-cream/82 text-base">
					The &ldquo;Studio on Instagram&rdquo; section is a curated feed you
					manage directly. Like all content, changes are saved as drafts and go
					live when the Home page is published.
				</p>
				<Link
					href="/admin/instagram"
					className="w-fit cursor-pointer border border-gold/40 px-6 py-3 font-sans font-light uppercase tracking-[0.24em] text-gold text-tiny transition-colors hover:bg-gold/10">
					Manage Instagram feed &rarr;
				</Link>
			</section>
		</div>
	);
}
