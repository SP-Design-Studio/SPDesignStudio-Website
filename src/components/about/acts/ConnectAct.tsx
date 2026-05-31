import Link from "next/link";
import { ABOUT, STUDIO } from "@/lib/studio";
import { Chars } from "@/components/shared/Chars";

interface ConnectActProps {
	wrapRef: React.RefObject<HTMLDivElement | null>;
	line1CharsRef: React.RefObject<(HTMLSpanElement | null)[]>;
	line2CharsRef: React.RefObject<(HTMLSpanElement | null)[]>;
	bodyRef: React.RefObject<HTMLParagraphElement | null>;
	ctaRef: React.RefObject<HTMLAnchorElement | null>;
}

export function ConnectAct({
	wrapRef,
	line1CharsRef,
	line2CharsRef,
	bodyRef,
	ctaRef,
}: ConnectActProps) {
	const DFS = "clamp(2.6rem, 10vw, 12rem)";

	return (
		<div
			ref={wrapRef}
			className="absolute inset-0 z-10 invisible overflow-y-auto">
			<div className="min-h-full flex flex-col items-center justify-center text-center px-6 sm:px-10 md:px-16 py-16 md:py-14">
			<div
				className="font-bdscript text-cream tracking-[-0.015em]"
				style={{ fontSize: DFS, lineHeight: 1, perspective: "1200px" }}>
				<Chars text={ABOUT.connect.line1} refStore={line1CharsRef} />
			</div>
			<div
				className="font-bdscript tracking-[-0.015em] mb-8 md:mb-10 text-gold"
				style={{ fontSize: DFS, lineHeight: 1, perspective: "1200px" }}>
				<Chars text={ABOUT.connect.line2} refStore={line2CharsRef} />
			</div>

			<p
				ref={bodyRef}
				className="font-serif italic font-light text-cream/70 max-w-140 mb-8 md:mb-9 text-sm sm:text-base md:text-xl leading-[1.6]">
				{ABOUT.connect.body}
			</p>

			<Link
				ref={ctaRef}
				href={`mailto:${STUDIO.email}`}
				className="group inline-flex items-center gap-3 px-7 sm:px-8 py-3.5 sm:py-4 font-sans font-light text-xs sm:text-sm uppercase tracking-[0.28em] transition-[gap] duration-500 hover:gap-5 bg-gold text-plum-dark">
				{ABOUT.connect.ctaText}
				<span className="transition-transform duration-500 group-hover:translate-x-1">
					→
				</span>
			</Link>
			</div>
		</div>
	);
}
