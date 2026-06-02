import { Chars } from "@/components/shared/Chars";
import { DISCIPLINES, SECTIONS } from "@/lib/studio";

interface DisciplinesActProps {
	wrapRef: React.RefObject<HTMLDivElement | null>;
	ruleRef: React.RefObject<HTMLDivElement | null>;
	titleCharsRef: React.RefObject<(HTMLSpanElement | null)[]>;
	itemsRef: React.RefObject<(HTMLDivElement | null)[]>;
}

export function DisciplinesAct({
	wrapRef,
	ruleRef,
	titleCharsRef,
	itemsRef,
}: DisciplinesActProps) {
	return (
		<div
			ref={wrapRef}
			className="absolute inset-0 z-10 invisible overflow-y-auto">
			<div className="min-h-full flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-10 sm:py-12 md:py-14">
			<div
				className="font-bdscript text-gold tracking-[-0.005em] mb-4 sm:mb-5 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.05]"
				style={{ perspective: "1200px" }}>
				<Chars text={SECTIONS.disciplines.eyebrow} refStore={titleCharsRef} />
			</div>
			<div ref={ruleRef} className="w-14 h-px bg-gold/70 mb-5 sm:mb-7 md:mb-8" />

			<div className="grid grid-cols-2 lg:grid-cols-3 grid-flow-row-dense auto-rows-[clamp(5.5rem,13vh,11rem)] gap-2.5 md:gap-4 max-w-7xl mx-auto w-full">
				{DISCIPLINES.map((d, i) => {
					const spanClass =
						d.span === "wide"
							? "col-span-2 lg:col-span-2"
							: d.span === "tall"
								? "lg:row-span-2"
								: d.variant === "italic"
									? "col-span-2 lg:col-span-1"
									: "";
					return (
						<div
							key={d.id}
							ref={(el) => {
								(itemsRef.current as (HTMLDivElement | null)[])[i] = el;
							}}
							className={`group relative cursor-default overflow-hidden ${spanClass}`}>
							{d.img ? (
								<>
									<div
										className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
										style={{ backgroundImage: `url(${d.img})` }}
									/>
									<div
										className="absolute inset-0"
										style={{
											background:
												"linear-gradient(180deg, rgba(61,36,46,0.25) 0%, rgba(61,36,46,0.55) 55%, rgba(61,36,46,0.82) 100%)",
										}}
									/>
								</>
							) : (
								<div className="absolute inset-0 bg-plum-dark/65" />
							)}

							{d.variant === "centered" ? (
								<div className="relative h-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 text-center">
									<span className="font-sans font-light text-gold tracking-[0.4em] mb-3 sm:mb-7 md:mb-10 text-[0.62rem] sm:text-[0.68rem]">
										{d.topLabel}
									</span>
									<div className="font-serif italic font-light text-cream leading-none mb-2.5 sm:mb-4 text-4xl sm:text-5xl md:text-7xl">
										{d.bigStat}
									</div>
									<div className="font-sans font-light text-cream/65 tracking-[0.3em] uppercase text-[0.6rem] sm:text-[0.66rem] mb-3 sm:mb-6">
										{d.desc}
									</div>
									<span className="w-12 h-px bg-gold/55" />
								</div>
							) : d.variant === "italic" ? (
								<div className="relative h-full flex flex-col justify-between p-6 md:p-7">
									<span className="font-sans font-light text-gold tracking-[0.36em] text-[0.68rem]">
										{d.topLabel}
									</span>
									<div>
										<div className="font-serif italic font-light text-cream leading-none mb-3 text-3xl sm:text-4xl md:text-5xl">
											{d.bigStat}
										</div>
										<div className="font-sans font-light text-cream/55 tracking-[0.28em] uppercase text-[0.62rem]">
											{d.desc}
										</div>
									</div>
								</div>
							) : (
								<div className="relative h-full flex flex-col justify-between p-6 md:p-7">
									<span className="font-sans font-light text-gold tracking-[0.36em] text-[0.68rem]">
										{d.topLabel}
									</span>
									<div className="flex flex-col gap-1.5 md:flex-row-reverse md:items-end md:justify-between md:gap-3">
										<span className="font-serif font-light text-cream leading-none shrink-0 text-3xl sm:text-4xl md:text-7xl">
											{d.bigStat}
										</span>
										{d.span === "wide" ? (
											<p className="font-sans font-light italic text-cream/85 leading-[1.55] md:leading-[1.6] max-w-100 text-xs md:text-sm md:flex-1">
												{d.desc}
											</p>
										) : (
											<p className="font-sans font-light text-cream/75 tracking-[0.18em] uppercase text-[0.62rem] sm:text-[0.7rem] md:flex-1">
												{d.desc}
											</p>
										)}
									</div>
								</div>
							)}

							<span className="absolute top-0 left-0 w-0 group-hover:w-full h-px bg-gold/80 transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]" />
						</div>
					);
				})}
			</div>
			</div>
		</div>
	);
}
