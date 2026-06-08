import ProjectsClient from "@/components/projects/ProjectsClient";
import { getProjectsData } from "@/lib/cms/pages";

export const revalidate = 60;
export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
	const { projects } = await getProjectsData();
	return <ProjectsClient projects={projects} />;
}
