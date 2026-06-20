import { pageMeta, breadcrumbLd, webPageLd } from "@/lib/seo";
import JsonLd from "@/components/shared/JsonLd";
import ProjectsClient from "@/components/projects/ProjectsClient";
import { getProjectsData } from "@/lib/cms/pages";

export const revalidate = 60;
export const metadata = pageMeta("projects");

export default async function ProjectsPage() {
	const { projects } = await getProjectsData();
	return (
		<>
			<JsonLd
				data={[
					breadcrumbLd("projects"),
					webPageLd("projects", "CollectionPage"),
				]}
			/>
			<ProjectsClient projects={projects} />
		</>
	);
}
