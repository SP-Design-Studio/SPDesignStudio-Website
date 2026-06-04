import Link from "next/link";
import { Words } from "@/components/shared/Words";
import { SECTIONS } from "@/lib/studio";

interface HeroActProps {
	wrapRef: React.RefObject<HTMLDivElement | null>;
	bgVideoRef: React.RefObject<HTMLDivElement | null>;
	line1CharsRef: React.RefObject<(HTMLSpanElement | null)[]>;
	line2CharsRef: React.RefObject<(HTMLSpanElement | null)[]>;
	quoteRef: React.RefObject<HTMLParagraphElement | null>;
	subRef: React.RefObject<HTMLDivElement | null>;
	ctaRef: React.RefObject<HTMLDivElement | null>;
	hintRef: React.RefObject<HTMLDivElement | null>;
}

export function HeroAct({
	wrapRef,
	bgVideoRef,
	line1CharsRef,
	line2CharsRef,
	quoteRef,
	subRef,
	ctaRef,
	hintRef,
}: HeroActProps) {
	return (
		<div
			ref={wrapRef}
			className="absolute inset-0 z-10 flex flex-col justify-end pt-24 pb-10 md:py-14 px-6 sm:px-10 md:px-16 overflow-hidden">
			{}
			<div ref={bgVideoRef} className="absolute inset-0 z-0">
				<video
					autoPlay
					loop
					muted
					playsInline
					preload="auto"
					className="absolute inset-0 w-full h-full object-cover"
					style={{ opacity: 0.5 }}>
					<source src="/videos/hero.mp4" type="video/mp4" />
				</video>
				<div
					className="absolute inset-0"
					style={{
						background:
							"linear-gradient(to top, var(--color-plum-dark) 4%, rgba(61,36,46,0.55) 45%, rgba(61,36,46,0.35) 100%)",
					}}
				/>
			</div>

			<div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-7 md:gap-8">
				<div className="flex flex-col">
					<div
						className="font-bdscript text-cream leading-none tracking-[-0.015em] text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[12rem]"
						style={{ perspective: "1200px" }}>
						<Words
							words={SECTIONS.hero.line1.split(" ")}
							refStore={line1CharsRef}
							spacing="0.18em"
							initialHidden
						/>
					</div>

					<div
						className="font-bdscript text-gold leading-none tracking-[-0.015em] mb-5 md:mb-[clamp(22px,2.5vw,32px)] text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[12rem]"
						style={{ perspective: "1200px" }}>
						<Words
							words={SECTIONS.hero.line2.split(" ")}
							refStore={line2CharsRef}
							spacing="0.18em"
							initialHidden
						/>
					</div>

					<p
						ref={quoteRef}
						className="font-serif italic font-light text-cream/70 leading-[1.55] md:leading-[1.6] max-w-110 whitespace-pre-line text-sm sm:text-base md:text-xl">
						{SECTIONS.hero.quote}
					</p>
				</div>

				<div className="flex flex-row items-end justify-between gap-6 md:flex-col md:items-end md:gap-6 shrink-0 md:pb-1">
					<div ref={subRef} className="order-2 md:order-0">
						<p className="uppercase text-cream/40 tracking-[0.32em] md:tracking-[0.55em] leading-[1.8] md:leading-[1.9] text-[10px] md:text-xs text-right">
							<span className="md:hidden">
								{SECTIONS.hero.pillars.join(" · ")}
							</span>
							<span className="hidden md:inline">
								{SECTIONS.hero.pillars.map((p, i) => (
									<span key={i}>
										{p}
										{i < SECTIONS.hero.pillars.length - 1 && <br />}
									</span>
								))}
							</span>
						</p>
					</div>
					<div ref={ctaRef} className="order-1 md:order-0">
						<Link
							href={SECTIONS.hero.ctaHref}
							className="group flex items-center gap-2 font-sans font-light uppercase text-gold tracking-[0.24em] md:tracking-[0.28em] text-[11px] md:text-xs">
							<span className="relative">
								{SECTIONS.hero.ctaText}
								<span className="absolute -bottom-px left-0 h-px w-0 group-hover:w-full transition-all duration-700 bg-gold" />
							</span>
							<span className="transition-transform duration-300 group-hover:translate-x-1">
								→
							</span>
						</Link>
					</div>
				</div>
			</div>

			<div
				ref={hintRef}
				className="absolute bottom-10 right-10 z-10 hidden md:flex items-center gap-4 rotate-90 origin-right">
				<span className="text-xs uppercase tracking-[0.4em] text-cream/35">
					Scroll to Begin
				</span>
				<div className="flex items-center relative">
					<div className="w-12 h-px bg-cream/35" />
					<span className="absolute right-0 w-2 h-2 border-t border-r rotate-45 border-cream/35" />
				</div>
			</div>
		</div>
	);
}
