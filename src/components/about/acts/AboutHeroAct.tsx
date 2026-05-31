import Image from "next/image";
import { Words } from "@/components/shared/Words";
import { ABOUT } from "@/lib/studio";

interface AboutHeroActProps {
	wrapRef: React.RefObject<HTMLDivElement | null>;
	bgImgRef: React.RefObject<HTMLDivElement | null>;
	eyebrowCharsRef: React.RefObject<(HTMLSpanElement | null)[]>;
	line1CharsRef: React.RefObject<(HTMLSpanElement | null)[]>;
	line2CharsRef: React.RefObject<(HTMLSpanElement | null)[]>;
	quoteRef: React.RefObject<HTMLParagraphElement | null>;
}

export function AboutHeroAct({
	wrapRef,
	bgImgRef,
	eyebrowCharsRef,
	line1CharsRef,
	line2CharsRef,
	quoteRef,
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
					className="font-bdscript text-gold tracking-[0.01em] mb-4 sm:mb-5 text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
					style={{ perspective: "1200px", paddingLeft: "0.12em", overflow: "visible" }}>
					<Words
						words={ABOUT.hero.eyebrow.split(" ")}
						refStore={eyebrowCharsRef}
						spacing="0.2em"
						initialHidden
					/>
				</div>

				<div
					className="font-bdscript text-cream leading-none tracking-[-0.015em] text-6xl sm:text-7xl md:text-8xl lg:text-9xl"
					style={{ perspective: "1200px", paddingLeft: "0.12em", overflow: "visible" }}>
					<Words
						words={ABOUT.hero.line1.split(" ")}
						refStore={line1CharsRef}
						spacing="0.18em"
						initialHidden
					/>
				</div>

				<div
					className="font-bdscript leading-none tracking-[-0.015em] mb-6 md:mb-[clamp(22px,2.5vw,32px)] text-6xl sm:text-7xl md:text-8xl lg:text-9xl"
					style={{ perspective: "1200px", paddingLeft: "0.12em", overflow: "visible" }}>
					<Words
						words={ABOUT.hero.line2.split(" ")}
						refStore={line2CharsRef}
						spacing="0.18em"
						initialHidden
						wordStyleByIndex={(i) => ({
							// First word cream, remaining word(s) gold — matches the
							// original "with Soul." cream/gold split, but per word so
							// the connecting script stays joined.
							color:
								i === 0
									? "var(--color-cream)"
									: "var(--color-gold)",
						})}
					/>
				</div>

				<p
					ref={quoteRef}
					className="font-serif italic font-light text-cream/80 leading-[1.55] max-w-130 whitespace-pre-line text-sm sm:text-base md:text-lg">
					{ABOUT.hero.quote}
				</p>
			</div>
		</div>
	);
}
