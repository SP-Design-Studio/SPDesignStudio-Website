import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { getProjectById } from "@/lib/cms/queries";
import { ProjectEditor } from "./ProjectEditor";

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
	const project = await getProjectById(id);
	if (!project) notFound();

	return (
		<div className="mx-auto max-w-4xl px-6 py-12 md:px-10 md:py-16">
			<Link
				href="/admin/projects"
				className="font-sans font-light uppercase tracking-[0.24em] text-cream/80 text-[0.708rem] transition-colors hover:text-gold">
				&larr; All projects
			</Link>
			<div className="mb-10 mt-4">
				<div className="font-sans font-light uppercase tracking-[0.4em] text-gold text-[0.708rem] mb-3">
					Project
				</div>
				<h1 className="font-serif font-light text-cream text-4xl md:text-5xl">
					{project.title}
				</h1>
			</div>

			<ProjectEditor project={project} />
		</div>
	);
}
