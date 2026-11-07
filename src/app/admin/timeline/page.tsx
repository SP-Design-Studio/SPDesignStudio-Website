import { requireRole } from "@/lib/auth";
import { getTimeline } from "@/lib/cms/queries";
import { TimelineManager } from "./TimelineManager";
import { PageHeader } from "@/components/admin/PageHeader";
import { PendingDeletes } from "@/components/admin/PendingDeletes";

export const dynamic = "force-dynamic";
export const metadata = { title: "Studio Evolution" };

export default async function AdminTimelinePage() {
	await requireRole("editor");
	const entries = await getTimeline();

	return (
		<div className="mx-auto max-w-4xl px-6 py-12 md:px-10 md:py-16">
			<PageHeader eyebrow="Studio Evolution" title="Timeline entries" draft={{ page: "about", keys: ["timeline"] }} reorder />

			<TimelineManager initial={entries} />
			<PendingDeletes page="about" tables={["timeline_entries"]} />
		</div>
	);
}
