import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import {
	getProjectById,
	getProjectCategories,
	getProjects,
} from "@/lib/cms/queries";
import { ProjectEditor } from "./ProjectEditor";
import { PageHeader } from "@/components/admin/PageHeader";

export const dynamic = "force-dynamic";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const project = await getProjectById(id);
	return { title: project ? project.title : "Project" };
}

export default async function AdminProjectEditPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	await requireRole("editor");
	const { id } = await params;
	const [project, categories, all] = await Promise.all([
		getProjectById(id),
		getProjectCategories(),
		getProjects(),
	]);
	if (!project) notFound();

	return (
		<div className="mx-auto max-w-4xl px-6 py-12 md:px-10 md:py-16">
			<Link
				href="/admin/projects"
				className="font-sans font-light uppercase tracking-[0.24em] text-cream/80 text-tiny transition-colors hover:text-gold">
				&larr; All projects
			</Link>
			<PageHeader eyebrow="Project" title={project.title} draft={{ page: "projects" }} />

			<ProjectEditor
				project={project}
				categories={categories}
				suggestions={{
					types: all.map((p) => p.type ?? "").filter(Boolean),
					locations: all.map((p) => p.location ?? "").filter(Boolean),
				}}
			/>
		</div>
	);
}
