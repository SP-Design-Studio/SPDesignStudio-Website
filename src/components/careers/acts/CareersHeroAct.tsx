import { Words } from "@/components/shared/Words";
import { CAREERS } from "@/lib/studio";

interface Props {
	wrapRef: React.RefObject<HTMLDivElement | null>;
	eyebrowRef: React.RefObject<HTMLDivElement | null>;
	title1Ref: React.RefObject<(HTMLSpanElement | null)[]>;
	title2Ref: React.RefObject<(HTMLSpanElement | null)[]>;
	subRef: React.RefObject<HTMLParagraphElement | null>;
	hintRef: React.RefObject<HTMLDivElement | null>;
}

export function CareersHeroAct({
	wrapRef,
	eyebrowRef,
	title1Ref,
	title2Ref,
	subRef,
	hintRef,
}: Props) {
	const { eyebrow, line1, line2, subtitle } = CAREERS;

	return (
		<div
			ref={wrapRef}
			className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 sm:px-10 md:px-16">
			<div
				ref={eyebrowRef}
				className="font-sans font-light uppercase tracking-[0.42em] text-gold text-sm md:text-base mb-7">
				{eyebrow}
			</div>
			<h1
				className="font-bdscript leading-[0.95] text-4xl sm:text-6xl md:text-7xl lg:text-8xl"
				style={{ perspective: "1000px" }}>
				<span className="block text-cream">
					<Words words={line1.split(" ")} refStore={title1Ref} spacing="0.18em" />
				</span>
				<span className="block text-gold">
					<Words words={line2.split(" ")} refStore={title2Ref} spacing="0.18em" />
				</span>
			</h1>
			<p
				ref={subRef}
				className="font-serif italic font-light text-cream/70 text-base sm:text-lg md:text-xl max-w-xl leading-[1.6] mt-7">
				{subtitle}
			</p>

			<div
				ref={hintRef}
				className="absolute bottom-10 right-10 z-10 hidden items-center gap-4 rotate-90 origin-right">
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
