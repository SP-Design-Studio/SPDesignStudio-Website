import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import {
	buildHome,
	buildAbout,
	buildProjects,
	buildContact,
	buildCareers,
	buildProcess,
	PAGE_KEYS,
	PAGE_LABELS,
	PAGE_PATHS,
	type PageKey,
} from "@/lib/cms/pages";
import { DraftBanner } from "@/components/shared/DraftBanner";
import HomeClient from "@/components/home/HomeClient";
import AboutClient from "@/components/about/AboutClient";
import ProjectsClient from "@/components/projects/ProjectsClient";
import ContactClient from "@/components/contact/ContactClient";
import CareersClient from "@/components/careers/CareersClient";
import ProcessClient from "@/components/process/ProcessClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Draft preview" };

export default async function PreviewPage({
	params,
}: {
	params: Promise<{ page: string }>;
}) {
	await requireRole("admin");
	const { page } = await params;
	if (!PAGE_KEYS.includes(page as PageKey)) notFound();
	const key = page as PageKey;

	let view: React.ReactNode = null;
	switch (key) {
		case "home": {
			const d = await buildHome();
			view = (
				<HomeClient
					disciplines={d.disciplines}
					partners={d.partners}
					partnerCategories={d.partnerCategories}
					testimonials={d.testimonials}
					recognition={d.recognition}
				/>
			);
			break;
		}
		case "about": {
			const d = await buildAbout();
			view = (
				<AboutClient team={d.team} timeline={d.timeline} honours={d.honours} />
			);
			break;
		}
		case "projects": {
			const d = await buildProjects();
			view = <ProjectsClient projects={d.projects} />;
			break;
		}
		case "contact": {
			const d = await buildContact();
			view = <ContactClient settings={d.settings} />;
			break;
		}
		case "careers": {
			const d = await buildCareers();
			view = <CareersClient openings={d.openings} settings={d.settings} />;
			break;
		}
		case "process": {
			const d = await buildProcess();
			view = <ProcessClient steps={d.steps} />;
			break;
		}
	}

	return (
		<>
			<DraftBanner label={PAGE_LABELS[key]} exitHref={PAGE_PATHS[key]} />
			{view}
		</>
	);
}
