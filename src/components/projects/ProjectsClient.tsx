"use client";

import { useEffect, useState } from "react";
import SmoothScrollProvider from "@/components/shared/SmoothScrollProvider";
import Nav from "@/components/shared/Nav";
import ProjectsPinnedScroll from "@/components/projects/ProjectsPinnedScroll";
import Footer from "@/components/shared/Footer";
import type { Project, ProjectCategoryOption } from "@/lib/data/projects";

export default function ProjectsClient({
	projects,
	categories,
}: {
	projects: Project[];
	categories: ProjectCategoryOption[];
}) {
	const [started, setStarted] = useState(false);
	const [navVisible, setNavVisible] = useState(false);

	useEffect(() => {
		const t = setTimeout(() => {
			setStarted(true);
			setNavVisible(true);
		}, 250);
		return () => clearTimeout(t);
	}, []);

	return (
		<SmoothScrollProvider>
			<Nav visible={navVisible} />
			<main>
				<ProjectsPinnedScroll
					started={started}
					projects={projects}
					categories={categories}
				/>
				<Footer />
			</main>
		</SmoothScrollProvider>
	);
}
