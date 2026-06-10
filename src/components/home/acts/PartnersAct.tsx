"use client";

import { useEffect, useRef } from "react";
import { Words } from "@/components/shared/Words";
import { PartnersDirectory } from "./PartnersDirectory";
import { SECTIONS } from "@/lib/studio";
import type { Partner, PartnerCategory } from "@/lib/cms/types";
import { gsap } from "gsap";

interface PartnersActProps {
	wrapRef: React.RefObject<HTMLDivElement | null>;
	eyebrowRef: React.RefObject<HTMLDivElement | null>;
	ruleRef: React.RefObject<HTMLDivElement | null>;
	titleWordsRef: React.RefObject<(HTMLSpanElement | null)[]>;
	taglineRef: React.RefObject<HTMLParagraphElement | null>;
	ctaRef: React.RefObject<HTMLDivElement | null>;
	showcaseRef: React.RefObject<HTMLDivElement | null>;
	partners: Partner[];
	partnerCategories: PartnerCategory[];
}

const STEP_DURATION = 1.0;
const DWELL_MS = 1800;

function LogoMask({ logo, name }: { logo: string; name: string }) {
	return (
		<div
			aria-label={name}
			role="img"
			className="w-3/4 h-3/4"
			style={{
				backgroundColor: "var(--color-gold)",
				WebkitMaskImage: `url(${logo})`,
				WebkitMaskSize: "contain",
				WebkitMaskRepeat: "no-repeat",
				WebkitMaskPosition: "center",
				maskImage: `url(${logo})`,
				maskSize: "contain",
				maskRepeat: "no-repeat",
				maskPosition: "center",
				maskMode: "luminance",
			} as React.CSSProperties}
		/>
	);
}

export function PartnersAct({
	wrapRef,
	eyebrowRef,
	ruleRef,
	titleWordsRef,
	taglineRef,
	ctaRef,
	showcaseRef,
	partners,
	partnerCategories,
}: PartnersActProps) {
	const titleWordsArr = SECTIONS.partners.title.split(" ");
	const trackRef = useRef<HTMLDivElement | null>(null);
	const stepRef = useRef(0);

	const logos = partners.filter((p) => p.logo);
	const reel = [...logos, ...logos];

	useEffect(() => {
		const track = trackRef.current;
		if (!track || logos.length === 0) return;

		const tick = () => {
			const next = stepRef.current + 1;
			gsap.to(track, {
				yPercent: -(next * (100 / reel.length)),
				duration: STEP_DURATION,
				ease: "expo.inOut",
				onComplete: () => {
					if (next >= logos.length) {
						gsap.set(track, { yPercent: 0 });
						stepRef.current = 0;
					} else {
						stepRef.current = next;
					}
				},
			});
		};

		const id = window.setInterval(tick, DWELL_MS + STEP_DURATION * 1000);
		return () => window.clearInterval(id);
	}, [reel.length, logos.length]);

	return (
		<div
			ref={wrapRef}
			className="absolute inset-0 z-10 invisible overflow-y-auto">
			<div className="min-h-full flex items-center justify-center px-6 sm:px-8 md:px-10 py-16 md:py-14">
			<div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 md:gap-14 items-center">
				<div className="md:col-span-7 flex flex-col">
					<div
						ref={eyebrowRef}
						className="font-bdscript text-gold tracking-[0.01em] leading-tight mb-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
						{SECTIONS.partners.eyebrow}
					</div>
					<div ref={ruleRef} className="w-14 h-px bg-gold/70 mb-6" />
					<div
						className="font-serif font-light text-cream tracking-[-0.01em] text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-6 sm:mb-7 md:mb-9"
						style={{ perspective: "1200px" }}>
						<Words
							words={titleWordsArr}
							refStore={titleWordsRef}
							spacing="0.22em"
							flat
						/>
					</div>
					<p
						ref={taglineRef}
						className="font-serif italic font-light text-cream/76 max-w-130 text-lg sm:text-xl md:text-2xl leading-[1.6]">
						{SECTIONS.partners.tagline}
					</p>
					<div ref={ctaRef} className="w-fit">
						<PartnersDirectory categories={partnerCategories} />
					</div>
				</div>

				<div
					ref={showcaseRef}
					className="md:col-span-5 relative h-36 sm:h-44 md:h-72 overflow-hidden">
					<div
						ref={trackRef}
						className="flex flex-col will-change-transform"
						style={{ height: `${reel.length * 100}%` }}>
						{reel.map((b, i) => (
							<div
								key={`${b.name}-${i}`}
								className="shrink-0 flex items-center justify-center"
								style={{ height: `${100 / reel.length}%` }}>
								<LogoMask logo={b.logo!} name={b.name} />
							</div>
						))}
					</div>
				</div>
			</div>
			</div>
		</div>
	);
}
