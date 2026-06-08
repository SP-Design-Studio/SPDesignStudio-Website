import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getCareerOpenings, getCareersSettings } from "@/lib/cms/queries";
import { CareersManager } from "./CareersManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "Careers" };

export default async function AdminCareersPage() {
	await requireRole("editor");
	const [openings, settings] = await Promise.all([
		getCareerOpenings(),
		getCareersSettings(),
	]);

	return (
		<div className="mx-auto max-w-4xl px-6 py-12 md:px-10 md:py-16">
			<Link
				href="/admin"
				className="font-sans font-light uppercase tracking-[0.24em] text-cream/45 text-[0.6rem] transition-colors hover:text-gold">
				&larr; Dashboard
			</Link>
			<div className="mb-10 mt-4">
				<div className="font-sans font-light uppercase tracking-[0.4em] text-gold text-[0.6rem] mb-3">
					Careers
				</div>
				<h1 className="font-serif font-light text-cream text-3xl md:text-4xl">
					Roles & page copy
				</h1>
				<p className="mt-3 font-sans font-light text-cream/45 text-sm">
					Manage open roles and the careers page subtitle. Remove all roles to
					show the &ldquo;no openings&rdquo; note.
				</p>
			</div>

			<CareersManager openings={openings} settings={settings} />
		</div>
	);
}
