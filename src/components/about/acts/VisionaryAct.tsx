import Image from "next/image";
import { ABOUT } from "@/lib/studio";

interface VisionaryActProps {
	wrapRef: React.RefObject<HTMLDivElement | null>;
	eyebrowRef: React.RefObject<HTMLDivElement | null>;
	titleRef: React.RefObject<HTMLDivElement | null>;
	subtitleRef: React.RefObject<HTMLDivElement | null>;
	body1Ref: React.RefObject<HTMLParagraphElement | null>;
	body2Ref: React.RefObject<HTMLParagraphElement | null>;
	quoteRef: React.RefObject<HTMLDivElement | null>;
	attribRef: React.RefObject<HTMLDivElement | null>;
	imageRef: React.RefObject<HTMLDivElement | null>;
}

export function VisionaryAct({
	wrapRef,
	eyebrowRef,
	titleRef,
	subtitleRef,
	body1Ref,
	body2Ref,
	quoteRef,
	attribRef,
	imageRef,
}: VisionaryActProps) {
	return (
		<div
			ref={wrapRef}
			className="absolute inset-0 z-10 invisible overflow-y-auto">
			<div className="min-h-full flex items-start md:items-center justify-center px-6 sm:px-8 md:px-10 pt-16 sm:pt-24 pb-8 md:py-14">
			<div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-5 lg:gap-8 max-w-295 w-full items-center">
				<div className="md:col-span-7 flex flex-col">
					<div
						ref={eyebrowRef}
						className="font-bdscript text-gold tracking-[0.01em] mb-2 md:mb-6 text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
						{ABOUT.visionary.eyebrow}
					</div>
					<div
						ref={titleRef}
						className="font-serif font-light text-plum-dark leading-[1.05] tracking-[-0.01em] mb-2 md:mb-4 text-[1.7rem] sm:text-4xl md:text-5xl lg:text-6xl">
						{ABOUT.visionary.title}
					</div>
					<div
						ref={subtitleRef}
						className="font-serif italic font-light text-plum/55 mb-3 md:mb-7 text-sm sm:text-lg md:text-2xl">
						{ABOUT.visionary.subtitle}
					</div>
					<p
						ref={body1Ref}
						className="font-sans font-light text-plum-dark/80 mb-2.5 md:mb-4 text-sm md:text-base leading-normal md:leading-[1.75] max-w-140">
						{ABOUT.visionary.body1}
					</p>
					<p
						ref={body2Ref}
						className="font-sans font-light text-plum-dark/80 mb-3 md:mb-9 text-sm md:text-base leading-normal md:leading-[1.75] max-w-140">
						{ABOUT.visionary.body2}
					</p>
					<div
						ref={quoteRef}
						className="font-serif italic font-light text-plum-dark border-l-2 border-gold/55 pl-4 md:pl-6 max-w-140 text-base sm:text-lg md:text-2xl leading-normal mb-3 md:mb-5">
						<span>&ldquo;{ABOUT.visionary.quoteBefore}</span>
						<span className="text-gold">{ABOUT.visionary.quoteEmphasis}</span>
						<span>{ABOUT.visionary.quoteAfter}&rdquo;</span>
					</div>
					<div
						ref={attribRef}
						className="font-bdscript text-gold/85 pl-4 md:pl-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
						— {ABOUT.visionary.attribution}
					</div>
				</div>

				<div className="md:col-span-5 md:col-start-8 flex flex-col items-center md:items-end">
					<div className="w-12 md:w-16 h-px bg-gold/60 mb-3 md:mb-5 self-center md:self-end" />
					<div
						ref={imageRef}
						className="relative w-full max-w-36 sm:max-w-75 md:max-w-115">
						<div className="absolute -top-4 -left-4 w-full h-full border border-gold/40 pointer-events-none" />
						<div className="absolute -bottom-4 -right-4 w-16 h-16 border-b-2 border-r-2 border-gold/70 pointer-events-none" />
						<div className="relative aspect-4/5 overflow-hidden">
							<Image
								src={ABOUT.visionary.image}
								alt={ABOUT.visionary.attribution}
								fill
								className="object-cover"
								sizes="(min-width: 768px) 40vw, 90vw"
							/>
						</div>
						<div className="mt-2.5 md:mt-4 font-sans uppercase tracking-[0.32em] text-plum/55 text-[0.7rem] text-right">
							Principal Designer
						</div>
					</div>
				</div>
			</div>
			</div>
		</div>
	);
}
