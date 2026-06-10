import { Words } from "@/components/shared/Words";
import { PROCESS } from "@/lib/studio";

interface Props {
	wrapRef: React.RefObject<HTMLDivElement | null>;
	eyebrowRef: React.RefObject<HTMLDivElement | null>;
	titleWordsRef: React.RefObject<(HTMLSpanElement | null)[]>;
	subRef: React.RefObject<HTMLParagraphElement | null>;
	introRef: React.RefObject<HTMLDivElement | null>;
	hintRef: React.RefObject<HTMLDivElement | null>;
}

export function ProcessHeroAct({
	wrapRef,
	eyebrowRef,
	titleWordsRef,
	subRef,
	introRef,
	hintRef,
}: Props) {
	const steps = PROCESS.steps;
	return (
		<div
			ref={wrapRef}
			className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 sm:px-10 md:px-16">
			<div
				ref={eyebrowRef}
				className="font-sans font-normal uppercase tracking-[0.42em] text-gold text-base md:text-lg mb-7">
				{PROCESS.eyebrow}
			</div>
			<h1
				className="font-bdscript text-cream leading-[0.95] text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-6"
				style={{ perspective: "1000px" }}>
				<Words
					words={PROCESS.title.split(" ")}
					refStore={titleWordsRef}
					spacing="0.2em"
				/>
			</h1>
			<p
				ref={subRef}
				className="font-serif italic font-light text-gold/85 text-2xl sm:text-3xl md:text-4xl max-w-2xl">
				{PROCESS.subtitle}
			</p>

			<div ref={introRef} className="mt-8 md:mt-9 flex flex-col items-center">
				<span className="block h-px w-12 bg-gold/50 mb-6 md:mb-7" />
				<p className="font-sans font-normal text-cream/76 text-base md:text-lg leading-[1.85] max-w-xl">
					{PROCESS.intro}
				</p>
				<div className="mt-7 flex items-center gap-3.5 font-sans font-normal uppercase tracking-[0.32em] text-cream/72 text-[0.672rem] md:text-[0.784rem]">
					<span>{steps[0].title.split(" ")[0]}</span>
					<span className="h-px w-10 bg-gold/40" />
					<span>{steps[steps.length - 1].title.split(" ").slice(-1)[0]}</span>
				</div>
			</div>

			<div
				ref={hintRef}
				className="absolute bottom-10 right-10 z-10 hidden items-center gap-4 rotate-90 origin-right">
				<span className="text-sm uppercase tracking-[0.4em] text-cream/74">
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
