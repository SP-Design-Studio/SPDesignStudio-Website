import { requireRole } from "@/lib/auth";
import { getTeam } from "@/lib/cms/queries";
import { TeamManager } from "./TeamManager";
import { PageHeader } from "@/components/admin/PageHeader";
import { PendingDeletes } from "@/components/admin/PendingDeletes";

export const dynamic = "force-dynamic";
export const metadata = { title: "The Collection" };

export default async function AdminTeamPage() {
	await requireRole("editor");
	const team = await getTeam();

	return (
		<div className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-16">
			<PageHeader eyebrow="The Collection" title="Team members" draft={{ page: "about", keys: ["team"] }} reorder />

			<TeamManager initial={team} />
			<PendingDeletes page="about" tables={["team_members"]} />
		</div>
	);
}
