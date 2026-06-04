import Image from "next/image";
import { ABOUT } from "@/lib/studio";

interface Props {
	wrapRef: React.RefObject<HTMLDivElement | null>;
}

export function AchievementsAct({ wrapRef }: Props) {
	const { achievements } = ABOUT;

	return (
		<div ref={wrapRef} className="absolute inset-0 z-10 invisible overflow-y-auto">
			<div className="min-h-full flex flex-col justify-center px-6 sm:px-10 md:px-16 py-12 md:py-14">
				<div className="mx-auto w-full max-w-5xl">
					<div className="ach-reveal text-center font-sans font-light uppercase tracking-[0.4em] text-gold text-sm md:text-base mb-2.5">
						{achievements.eyebrow}
					</div>
					<h2 className="ach-reveal text-center font-bdscript text-cream leading-[0.95] text-4xl sm:text-5xl md:text-6xl mb-8 md:mb-12">
						{achievements.title}
					</h2>

					<div className="ach-reveal flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto overflow-y-hidden md:overflow-visible snap-x snap-mandatory md:snap-none -mx-6 px-6 sm:-mx-10 sm:px-10 md:mx-0 md:px-0 pb-3 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
						{achievements.items.map((it) => (
							<div key={it.title} className="group flex flex-col shrink-0 w-[72%] sm:w-[46%] md:w-auto snap-center">
								<div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-[2px]">
									<Image
										src={it.img}
										alt={it.title}
										fill
										sizes="(max-width: 768px) 50vw, 33vw"
										className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
									/>
									<div
										className="absolute inset-0"
										style={{
											background:
												"linear-gradient(to top, rgba(46,31,36,0.78) 0%, rgba(46,31,36,0.1) 55%, transparent 100%)",
										}}
									/>
									<div className="absolute left-3 top-3 flex items-center gap-2">
										<span className="bg-gold px-2 py-0.5 font-sans font-light text-plum-dark text-[0.56rem] tracking-[0.12em] tabular-nums">
											{it.year}
										</span>
										<span className="font-sans font-light uppercase tracking-[0.22em] text-cream/80 text-[0.5rem] md:text-[0.55rem]">
											{it.by}
										</span>
									</div>
								</div>
								<h3 className="font-serif font-light text-cream text-base md:text-xl leading-snug mb-1.5">
									{it.title}
								</h3>
								<p className="font-sans font-light text-cream/55 text-xs md:text-sm leading-snug md:leading-relaxed">
									{it.desc}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
