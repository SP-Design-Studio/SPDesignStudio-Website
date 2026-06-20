"use client";

import { CAREERS } from "@/lib/studio";

interface Props {
	wrapRef: React.RefObject<HTMLDivElement | null>;
}

export function CareersInviteAct({ wrapRef }: Props) {
	const { invite, ctaText } = CAREERS;

	return (
		<div ref={wrapRef} className="absolute inset-0 z-10 invisible overflow-y-auto">
			<div className="min-h-full flex flex-col justify-center px-6 sm:px-10 md:px-16 py-12 md:py-14">
				<div className="mx-auto w-full max-w-3xl text-center">
					<div className="cr-reveal font-sans font-normal uppercase tracking-[0.42em] text-gold text-[0.672rem] md:text-sm mb-5">
						{invite.eyebrow}
					</div>
					<h2 className="cr-reveal font-bdscript text-cream leading-[0.95] text-4xl sm:text-5xl md:text-7xl mb-6 md:mb-8">
						{invite.headline}
					</h2>
					<p className="cr-reveal mx-auto font-serif italic font-light text-cream/90 text-lg sm:text-xl md:text-xl max-w-xl leading-[1.6] mb-9 md:mb-11">
						{invite.body}
					</p>
					<button
						type="button"
						onClick={() =>
							window.dispatchEvent(new CustomEvent("open-application", { detail: {} }))
						}
						className="cr-reveal cta-gold group inline-flex w-fit cursor-pointer items-center gap-3 bg-gold px-9 py-4 font-sans font-normal uppercase tracking-[0.28em] text-plum-dark text-sm">
						{ctaText}
						<span className="transition-transform duration-500 group-hover:translate-x-1">
							&rarr;
						</span>
					</button>
				</div>
			</div>
		</div>
	);
}
