import Link from "next/link";
import { Words } from "@/components/shared/Words";
import { PROCESS, STUDIO } from "@/lib/studio";

interface Props {
	wrapRef: React.RefObject<HTMLDivElement | null>;
	innerRef: React.RefObject<HTMLDivElement | null>;
	lineRef: React.RefObject<HTMLSpanElement | null>;
	titleWordsRef: React.RefObject<(HTMLSpanElement | null)[]>;
}

export function ProcessContactAct({
	wrapRef,
	innerRef,
	lineRef,
	titleWordsRef,
}: Props) {
	return (
		<div ref={wrapRef} className="absolute inset-0 z-20 invisible">
			<div
				ref={innerRef}
				className="absolute inset-0 flex flex-col items-center justify-center bg-plum-dark text-center px-6">
				<h2
					className="font-bdscript text-gold leading-none text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-6"
					style={{ perspective: "1000px" }}>
					<Words
						words={["Let's", "begin", "yours."]}
						refStore={titleWordsRef}
						spacing="0.2em"
					/>
				</h2>
				<p className="font-serif italic font-light text-cream/80 text-xl md:text-2xl max-w-xl mb-9">
					Tell us about your space. We&rsquo;ll do the listening.
				</p>
				<Link
					href={`mailto:${STUDIO.email}`}
					className="cta-gold group inline-flex items-center gap-3 bg-gold px-8 py-4 font-sans font-normal uppercase tracking-[0.28em] text-plum-dark text-sm">
					{PROCESS.ctaText}
					<span className="transition-transform duration-500 group-hover:translate-x-1">
						&rarr;
					</span>
				</Link>
			</div>
			<span
				ref={lineRef}
				aria-hidden
				className="absolute inset-x-0 top-0 h-px bg-gold/25"
				style={{ opacity: 0 }}
			/>
		</div>
	);
}
