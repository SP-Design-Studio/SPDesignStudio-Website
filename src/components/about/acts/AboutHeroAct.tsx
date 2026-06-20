import Image from "next/image";
import { Words } from "@/components/shared/Words";
import { ABOUT } from "@/lib/studio";

interface AboutHeroActProps {
	wrapRef: React.RefObject<HTMLDivElement | null>;
	bgImgRef: React.RefObject<HTMLDivElement | null>;
	eyebrowRef: React.RefObject<HTMLDivElement | null>;
	line1CharsRef: React.RefObject<(HTMLSpanElement | null)[]>;
	line2CharsRef: React.RefObject<(HTMLSpanElement | null)[]>;
	quoteRef: React.RefObject<HTMLParagraphElement | null>;
	hintRef: React.RefObject<HTMLDivElement | null>;
}

export function AboutHeroAct({
	wrapRef,
	bgImgRef,
	eyebrowRef,
	line1CharsRef,
	line2CharsRef,
	quoteRef,
	hintRef,
}: AboutHeroActProps) {
	return (
		<div
			ref={wrapRef}
			className="absolute inset-0 z-10 flex flex-col justify-end pt-24 pb-12 md:py-14 px-6 sm:px-10 md:px-16 overflow-hidden">
			<div ref={bgImgRef} className="absolute inset-0 z-0">
				<Image
					src="/images/about-hero.jpg"
					alt=""
					fill
					priority
					className="object-cover"
					style={{ opacity: 0.95 }}
				/>
				<div
					className="absolute inset-0"
					style={{
						background:
							"linear-gradient(to top, var(--color-plum-dark) 0%, rgba(61,36,46,0.65) 50%, rgba(61,36,46,0.35) 100%)",
					}}
				/>
			</div>

			<div className="relative z-10">
				<div
					ref={eyebrowRef}
					className="font-sans font-normal uppercase tracking-[0.42em] text-gold text-base md:text-lg mb-5 sm:mb-6">
					{ABOUT.hero.eyebrow}
				</div>

				<div
					className="font-bdscript text-cream leading-none tracking-[-0.015em] text-6xl sm:text-7xl md:text-8xl lg:text-9xl"
					style={{ perspective: "1200px" }}>
					<Words
						words={ABOUT.hero.line1.split(" ")}
						refStore={line1CharsRef}
						spacing="0.18em"
						initialHidden
					/>
				</div>

				<div
					className="font-bdscript leading-none tracking-[-0.015em] mb-6 md:mb-[clamp(22px,2.5vw,32px)] text-6xl sm:text-7xl md:text-8xl lg:text-9xl"
					style={{ perspective: "1200px" }}>
					<Words
						words={ABOUT.hero.line2.split(" ")}
						refStore={line2CharsRef}
						spacing="0.18em"
						initialHidden
						wordStyleByIndex={(i) => ({
							color:
								i === 0
									? "var(--color-cream)"
									: "var(--color-gold)",
						})}
					/>
				</div>

				<p
					ref={quoteRef}
					className="font-serif italic font-light text-cream/90 leading-[1.55] max-w-130 whitespace-pre-line text-lg sm:text-xl md:text-2xl">
					{ABOUT.hero.quote}
				</p>
			</div>

			<div
				ref={hintRef}
				className="absolute bottom-10 right-10 z-10 hidden items-center gap-4 rotate-90 origin-right">
				<span className="text-sm uppercase tracking-[0.4em] text-cream/85">
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
