import { requireRole } from "@/lib/auth";
import { getProcessSteps } from "@/lib/cms/queries";
import { ProcessManager } from "./ProcessManager";
import { PageHeader } from "@/components/admin/PageHeader";
import { PendingDeletes } from "@/components/admin/PendingDeletes";

export const dynamic = "force-dynamic";
export const metadata = { title: "Process" };

export default async function AdminProcessPage() {
	await requireRole("editor");
	const steps = await getProcessSteps();

	return (
		<div className="mx-auto max-w-4xl px-6 py-12 md:px-10 md:py-16">
			<PageHeader eyebrow="Process" title="Studio steps" draft={{ page: "process" }} reorder />

			<ProcessManager initial={steps} />
			<PendingDeletes page="process" tables={["process_steps"]} />
		</div>
	);
}
