import { requireRole } from "@/lib/auth";
import {
	getProjectsWithDetails,
	getProjectCategories,
} from "@/lib/cms/queries";
import { ProjectsList } from "./ProjectsList";
import { ProjectTypesManager } from "./ProjectTypesManager";
import { PageHeader } from "@/components/admin/PageHeader";
import { PendingDeletes } from "@/components/admin/PendingDeletes";

export const dynamic = "force-dynamic";
export const metadata = { title: "Projects" };

export default async function AdminProjectsPage() {
	await requireRole("editor");
	const [projects, categories] = await Promise.all([
		getProjectsWithDetails(),
		getProjectCategories(),
	]);

	return (
		<div className="mx-auto max-w-4xl px-6 py-12 md:px-10 md:py-16">
			<PageHeader eyebrow="Projects" title="Projects List" draft={{ page: "projects" }} reorder />

			<ProjectTypesManager items={categories} />
			<ProjectsList initial={projects} />
			<PendingDeletes page="projects" tables={["projects", "project_categories"]} />
		</div>
	);
}
