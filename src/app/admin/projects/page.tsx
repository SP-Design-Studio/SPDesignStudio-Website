import { NavLink } from "../_components/NavLink";
import { requireRole } from "@/lib/auth";
import {
	getProjectsWithDetails,
	getProjectCategories,
} from "@/lib/cms/queries";
import { ProjectsList } from "./ProjectsList";
import { ProjectTypesManager } from "./ProjectTypesManager";

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
			<NavLink
				href="/admin"
				className="font-sans font-light uppercase tracking-[0.24em] text-cream/80 text-[0.708rem] transition-colors hover:text-gold">
				&larr; Dashboard
			</NavLink>
			<div className="mb-10 mt-4">
				<div className="font-sans font-light uppercase tracking-[0.4em] text-gold text-[0.708rem] mb-3">
					Projects
				</div>
				<h1 className="font-serif font-light text-cream text-4xl md:text-5xl">
					Projects List
				</h1>
				<p className="mt-3 font-sans font-light text-cream/80 text-base">
					Add or reorder projects. Open one to edit its details, key facts, and
					gallery.
				</p>
			</div>

			<ProjectTypesManager items={categories} />
			<ProjectsList initial={projects} />
		</div>
	);
}
