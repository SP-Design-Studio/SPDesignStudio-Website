"use client";

import { useEffect, useState } from "react";
import SmoothScrollProvider from "@/components/shared/SmoothScrollProvider";
import Preloader from "@/components/shared/Preloader";
import Nav from "@/components/shared/Nav";
import PinnedScroll from "@/components/home/PinnedScroll";
import Footer from "@/components/shared/Footer";
import { InstagramGrid } from "@/components/home/InstagramGrid";
import type { InstaItem } from "@/lib/instagram";
import type {
	Discipline,
	Partner,
	PartnerCategory,
	Testimonial,
} from "@/lib/cms/types";

export default function HomeClient({
	disciplines,
	partners,
	partnerCategories,
	testimonials,
	recognition,
	instagram = [],
}: {
	disciplines: Discipline[];
	partners: Partner[];
	partnerCategories: PartnerCategory[];
	testimonials: Testimonial[];
	recognition: string[];
	instagram?: InstaItem[];
}) {
	const [preloaderDone, setPreloaderDone] = useState(false);
	const [showPreloader, setShowPreloader] = useState(false);
	const [navVisible, setNavVisible] = useState(false);
	const [hydrated, setHydrated] = useState(false);

	useEffect(() => {
		setHydrated(true);
		if (sessionStorage.getItem("preloaderShown") === "1") {
			setPreloaderDone(true);
		} else {
			setShowPreloader(true);
		}
	}, []);

	useEffect(() => {
		if (preloaderDone) sessionStorage.setItem("preloaderShown", "1");
	}, [preloaderDone]);

	return (
		<>
			{hydrated && showPreloader && !preloaderDone && (
				<Preloader onCompleteAction={() => setPreloaderDone(true)} />
			)}
			<SmoothScrollProvider>
				<Nav visible={navVisible} />
				<main
					suppressHydrationWarning
					style={{
						opacity: hydrated && preloaderDone ? 1 : 0,
						transition: "opacity 0.35s ease",
					}}>
					<PinnedScroll
						started={preloaderDone}
						onNavVisibleAction={setNavVisible}
						disciplines={disciplines}
						partners={partners}
						partnerCategories={partnerCategories}
						testimonials={testimonials}
						recognition={recognition}
					/>
					<InstagramGrid media={instagram} />
					<Footer />
				</main>
			</SmoothScrollProvider>
		</>
	);
}
