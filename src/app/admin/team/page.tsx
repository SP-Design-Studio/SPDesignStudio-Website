import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getTeam } from "@/lib/cms/queries";
import { TeamManager } from "./TeamManager";

export const dynamic = "force-dynamic";
export const metadata = { title: "The Collection" };

export default async function AdminTeamPage() {
	await requireRole("editor");
	const team = await getTeam();

	return (
		<div className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-16">
			<Link
				href="/admin"
				className="font-sans font-light uppercase tracking-[0.24em] text-cream/45 text-[0.708rem] transition-colors hover:text-gold">
				&larr; Dashboard
			</Link>
			<div className="mb-10 mt-4">
				<div className="font-sans font-light uppercase tracking-[0.4em] text-gold text-[0.708rem] mb-3">
					The Collection
				</div>
				<h1 className="font-serif font-light text-cream text-4xl md:text-5xl">
					Team members
				</h1>
				<p className="mt-3 font-sans font-light text-cream/45 text-base">
					The team grid on the About page. Add members, set name/role, upload a
					portrait, and reorder. Members without a photo show their initials.
				</p>
			</div>

			<TeamManager initial={team} />
		</div>
	);
}
