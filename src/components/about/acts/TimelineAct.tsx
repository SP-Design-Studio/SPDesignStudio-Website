import Image from "next/image";
import { ABOUT } from "@/lib/studio";
import { Chars } from "@/components/shared/Chars";

interface TimelineActProps {
	wrapRef: React.RefObject<HTMLDivElement | null>;
	eyebrowRef: React.RefObject<HTMLDivElement | null>;
	titleCharsRef: React.RefObject<(HTMLSpanElement | null)[]>;
	lineDesktopRef: React.RefObject<SVGPathElement | null>;
	dotsRef: React.RefObject<(HTMLSpanElement | null)[]>;
	yearsRef: React.RefObject<(HTMLSpanElement | null)[]>;
	entriesRef: React.RefObject<(HTMLDivElement | null)[]>;
	entriesMobileRef: React.RefObject<(HTMLDivElement | null)[]>;
	entriesMobileWrapRef: React.RefObject<HTMLDivElement | null>;
}

const VB_W = 1200;
const VB_H = 420;
const D_NODES = [
	{ x: 120, y: 150 },
	{ x: 380, y: 120 },
	{ x: 620, y: 94 },
	{ x: 860, y: 68 },
	{ x: 1100, y: 46 },
];
const D_PATH =
	"M 0 168 " +
	"C 60 160, 92 154, 120 150 " +
	"C 226 143, 300 126, 380 120 " +
	"C 486 112, 540 100, 620 94 " +
	"C 726 86, 786 74, 860 68 " +
	"C 968 58, 1040 52, 1100 46 " +
	"C 1144 42, 1172 38, 1200 34";

export function TimelineAct({
	wrapRef,
	eyebrowRef,
	titleCharsRef,
	lineDesktopRef,
	dotsRef,
	yearsRef,
	entriesRef,
	entriesMobileRef,
	entriesMobileWrapRef,
}: TimelineActProps) {
	const entries = ABOUT.timeline.entries;

	return (
		<div ref={wrapRef} className="absolute inset-0 z-10 invisible overflow-y-auto">
			<div className="min-h-full flex flex-col justify-center px-6 sm:px-8 md:px-10 lg:px-16 pt-20 sm:pt-24 pb-8 md:py-12">
				<div className="max-w-7xl w-full mx-auto">
					<div className="md:grid md:grid-cols-12 md:gap-10 md:items-end mb-6 md:mb-8">
						<div className="md:col-span-7">
							<div
								ref={eyebrowRef}
								className="font-bdscript text-gold tracking-[0.01em] mb-3 md:mb-5 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
								{ABOUT.timeline.eyebrow}
							</div>
							<div
								className="font-serif font-light text-cream tracking-[-0.01em] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.05]"
								style={{ perspective: "1200px" }}>
								<Chars text={ABOUT.timeline.title} refStore={titleCharsRef} />
							</div>
						</div>
						<p className="md:col-span-5 font-sans font-light text-cream/65 text-sm md:text-base leading-[1.7] mt-4 md:mt-0 max-w-140 md:border-l md:border-gold/35 md:pl-6">
							A decade of crafted spaces — milestone moments that shaped how we build.
						</p>
					</div>

					<div
						className="hidden md:block relative w-full mx-auto max-h-[clamp(320px,46vh,440px)]"
						style={{ aspectRatio: `${VB_W} / ${VB_H}` }}>
						<svg
							className="absolute inset-0 w-full h-full pointer-events-none"
							viewBox={`0 0 ${VB_W} ${VB_H}`}
							fill="none"
							aria-hidden>
							<path
								ref={lineDesktopRef}
								d={D_PATH}
								stroke="var(--color-gold)"
								strokeOpacity={0.3}
								strokeWidth="1.5"
								strokeLinecap="round"
							/>
						</svg>

						{entries.map((e, i) => {
							const n = D_NODES[i];
							const leftPct = (n.x / VB_W) * 100;
							const topPct = (n.y / VB_H) * 100;
							return (
								<div
									key={e.year}
									className="absolute"
									style={{ left: `${leftPct}%`, top: `${topPct}%`, transform: "translate(-50%, -50%)" }}>
									<span
										ref={(el) => { dotsRef.current[i] = el; }}
										className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 block w-3 h-3 rounded-full bg-gold ring-4 ring-plum z-3"
									/>
									<span className="pointer-events-none absolute left-1/2 bottom-4 -translate-x-1/2">
										<span
											ref={(el) => { yearsRef.current[i] = el; }}
											className="block font-bdscript text-gold leading-none text-3xl lg:text-4xl whitespace-nowrap">
											{e.year}
										</span>
									</span>
									<div
										ref={(el) => { entriesRef.current[i] = el; }}
										className="absolute left-1/2 -translate-x-1/2 top-6 w-40 lg:w-48"
										style={{ perspective: "1000px" }}>
										<div className="will-change-transform" style={{ transformStyle: "preserve-3d" }}>
											<div className="relative aspect-16/10 overflow-hidden mb-2 bg-plum-dark">
												<Image src={e.img} alt={e.label} fill className="object-cover" sizes="170px" />
												<div className="absolute inset-0 bg-linear-to-t from-plum-dark/70 to-transparent" />
											</div>
											<div className="font-serif font-light text-cream tracking-[-0.01em] text-base lg:text-lg leading-tight mb-1">
												{e.label}
											</div>
											<p className="font-sans font-light text-cream/60 text-xs lg:text-sm leading-relaxed">
												{e.desc}
											</p>
										</div>
									</div>
								</div>
							);
						})}
					</div>

					<div
						ref={entriesMobileWrapRef}
						className="md:hidden flex gap-4 overflow-x-auto overflow-y-hidden snap-x snap-mandatory -mx-6 px-6 sm:-mx-8 sm:px-8 pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden">
						{entries.map((e, i) => (
							<div
								key={e.year}
								ref={(el) => { entriesMobileRef.current[i] = el; }}
								className="snap-center shrink-0 w-[78%] sm:w-[58%] will-change-transform">
								<div className="relative w-full aspect-4/3 overflow-hidden bg-plum-dark border border-cream/10">
									<Image src={e.img} alt={e.label} fill className="object-cover" sizes="80vw" />
									<div className="absolute inset-0 bg-linear-to-t from-plum-dark/80 via-plum-dark/10 to-transparent" />
									<span className="absolute bottom-2.5 left-3.5 font-bdscript text-gold leading-none text-4xl drop-shadow-[0_1px_6px_rgba(46,31,36,0.6)]">
										{e.year}
									</span>
								</div>
								<div className="font-serif font-light text-cream tracking-[-0.01em] text-xl leading-tight mt-3 mb-1.5">
									{e.label}
								</div>
								<p className="font-sans font-light text-cream/65 text-sm leading-snug">
									{e.desc}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
