"use client";

import { useEffect, useState } from "react";
import SmoothScrollProvider from "@/components/shared/SmoothScrollProvider";
import Nav from "@/components/shared/Nav";
import ProjectsPinnedScroll from "@/components/projects/ProjectsPinnedScroll";
import Footer from "@/components/shared/Footer";
import type { Project } from "@/lib/data/projects";

export default function ProjectsClient({ projects }: { projects: Project[] }) {
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
				<ProjectsPinnedScroll started={started} projects={projects} />
				<Footer />
			</main>
		</SmoothScrollProvider>
	);
}
