"use client";

import SmoothScrollProvider from "@/components/shared/SmoothScrollProvider";
import Nav from "@/components/shared/Nav";
import Footer from "@/components/shared/Footer";
import AtelierScroll from "./AtelierScroll";
import type { AtelierImage } from "@/lib/atelier";

export default function AtelierClient({ images }: { images: AtelierImage[] }) {
	return (
		<SmoothScrollProvider>
			<Nav visible />
			<AtelierScroll images={images} />
			<Footer />
		</SmoothScrollProvider>
	);
}
