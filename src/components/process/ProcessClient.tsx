"use client";

import { useEffect, useState } from "react";
import SmoothScrollProvider from "@/components/shared/SmoothScrollProvider";
import Nav from "@/components/shared/Nav";
import ProcessPinnedScroll from "@/components/process/ProcessPinnedScroll";
import Footer from "@/components/shared/Footer";
import type { ProcessStep } from "@/lib/cms/types";

export default function ProcessClient({ steps }: { steps: ProcessStep[] }) {
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
				<ProcessPinnedScroll started={started} steps={steps} />
				<Footer />
			</main>
		</SmoothScrollProvider>
	);
}
