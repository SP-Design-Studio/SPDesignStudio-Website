import { Words } from "@/components/shared/Words";
import { PROCESS } from "@/lib/studio";

interface Props {
	wrapRef: React.RefObject<HTMLDivElement | null>;
	eyebrowRef: React.RefObject<HTMLDivElement | null>;
	titleWordsRef: React.RefObject<(HTMLSpanElement | null)[]>;
	subRef: React.RefObject<HTMLParagraphElement | null>;
	hintRef: React.RefObject<HTMLDivElement | null>;
}

export function ProcessHeroAct({
	wrapRef,
	eyebrowRef,
	titleWordsRef,
	subRef,
	hintRef,
}: Props) {
	return (
		<div
			ref={wrapRef}
			className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 sm:px-10 md:px-16">
			<div
				ref={eyebrowRef}
				className="font-sans font-light uppercase tracking-[0.42em] text-gold text-[0.62rem] md:text-xs mb-7">
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
