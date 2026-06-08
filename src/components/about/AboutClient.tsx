"use client";

import { useEffect, useState } from "react";
import SmoothScrollProvider from "@/components/shared/SmoothScrollProvider";
import Nav from "@/components/shared/Nav";
import AboutPinnedScroll from "@/components/about/AboutPinnedScroll";
import Footer from "@/components/shared/Footer";
import type { TeamMember, TimelineEntry, Honour } from "@/lib/cms/types";

export default function AboutClient({
	team,
	timeline,
	honours,
}: {
	team: TeamMember[];
	timeline: TimelineEntry[];
	honours: Honour[];
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
				<AboutPinnedScroll
					started={started}
					team={team}
					timeline={timeline}
					honours={honours}
				/>
				<Footer />
			</main>
		</SmoothScrollProvider>
	);
}
