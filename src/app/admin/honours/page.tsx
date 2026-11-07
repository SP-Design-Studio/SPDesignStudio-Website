import { requireRole } from "@/lib/auth";
import { getHonours } from "@/lib/cms/queries";
import { HonoursManager } from "./HonoursManager";
import { PageHeader } from "@/components/admin/PageHeader";
import { PendingDeletes } from "@/components/admin/PendingDeletes";

export const dynamic = "force-dynamic";
export const metadata = { title: "Honours & Milestones" };

export default async function AdminHonoursPage() {
	await requireRole("editor");
	const honours = await getHonours();

	return (
		<div className="mx-auto max-w-4xl px-6 py-12 md:px-10 md:py-16">
			<PageHeader eyebrow="Honours &amp; Milestones" title="Awards &amp; recognition" draft={{ page: "about", keys: ["honours"] }} reorder />

			<HonoursManager initial={honours} />
			<PendingDeletes page="about" tables={["honours"]} />
		</div>
	);
}
