"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AtelierHeroAct } from "./acts/AtelierHeroAct";
import { AtelierGalleryAct } from "./acts/AtelierGalleryAct";
import type { AtelierImage } from "@/lib/atelier";

gsap.registerPlugin(ScrollTrigger);

const HIDDEN_CHAR_3D = {
	rotateX: -88,
	y: 70,
	opacity: 0,
	filter: "blur(6px)",
	transformPerspective: 1200,
};

export default function AtelierScroll({ images }: { images: AtelierImage[] }) {
	const scopeRef = useRef<HTMLDivElement>(null);
	const titleCharsRef = useRef<(HTMLSpanElement | null)[]>([]);
	const taglineRef = useRef<HTMLParagraphElement>(null);
	const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);

	useEffect(() => {
		const ctx = gsap.context(() => {
			const chars = titleCharsRef.current.filter(Boolean) as HTMLSpanElement[];
			gsap.set(chars, HIDDEN_CHAR_3D);
			gsap.set(taglineRef.current, { y: 18, autoAlpha: 0, filter: "blur(5px)" });

			const playIn = () => {
				chars.forEach((el) => {
					el.style.visibility = "visible";
				});
				const tl = gsap.timeline({ delay: 0.2 });
				tl.to(chars, {
					rotateX: 0,
					y: 0,
					opacity: 1,
					filter: "blur(0px)",
					duration: 1.1,
					ease: "power4.out",
					stagger: 0.06,
					onComplete: () =>
						chars.forEach((el) => {
							el.style.willChange = "auto";
						}),
				}).to(
					taglineRef.current,
					{
						y: 0,
						autoAlpha: 1,
						filter: "blur(0px)",
						duration: 0.7,
						ease: "power3.out",
					},
					"-=0.55",
				);
			};

			if (typeof document !== "undefined" && document.fonts?.load) {
				Promise.all([
					document.fonts.load('italic 1em "bdScript"'),
					document.fonts.ready,
				])
					.then(playIn)
					.catch(playIn);
			} else {
				playIn();
			}

			const tiles = itemsRef.current.filter(Boolean) as HTMLButtonElement[];
			if (tiles.length) {
				gsap.set(tiles, { y: 44, autoAlpha: 0, filter: "blur(4px)" });
				ScrollTrigger.batch(tiles, {
					start: "top 90%",
					onEnter: (els) =>
						gsap.to(els, {
							y: 0,
							autoAlpha: 1,
							filter: "blur(0px)",
							duration: 0.85,
							ease: "expo.out",
							stagger: 0.09,
							overwrite: true,
						}),
					onLeaveBack: (els) =>
						gsap.to(els, {
							y: 44,
							autoAlpha: 0,
							filter: "blur(4px)",
							duration: 0.4,
							ease: "power2.in",
							overwrite: true,
						}),
				});
			}
			ScrollTrigger.refresh();
		}, scopeRef);

		return () => ctx.revert();
	}, [images]);

	return (
		<div ref={scopeRef} className="bg-plum-dark">
			<AtelierHeroAct titleCharsRef={titleCharsRef} taglineRef={taglineRef} />
			<AtelierGalleryAct images={images} itemsRef={itemsRef} />
		</div>
	);
}
