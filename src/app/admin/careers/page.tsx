import { requireRole } from "@/lib/auth";
import { getCareerOpenings, getCareersSettings } from "@/lib/cms/queries";
import { CareersManager } from "./CareersManager";
import { PageHeader } from "@/components/admin/PageHeader";
import { PendingDeletes } from "@/components/admin/PendingDeletes";

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
			<PageHeader eyebrow="Careers" title="Roles & page copy" draft={{ page: "careers" }} reorder />

			<CareersManager openings={openings} settings={settings} />
			<PendingDeletes page="careers" tables={["career_openings"]} />
		</div>
	);
}
