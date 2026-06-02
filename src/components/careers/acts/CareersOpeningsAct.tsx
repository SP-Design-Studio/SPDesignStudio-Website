"use client";

import { CAREERS } from "@/lib/studio";

interface Props {
	wrapRef: React.RefObject<HTMLDivElement | null>;
}

const openApplication = (role?: string) =>
	window.dispatchEvent(
		new CustomEvent("open-application", { detail: role ? { role } : {} }),
	);

export function CareersOpeningsAct({ wrapRef }: Props) {
	const { openings, openingsTitle, emptyNote } = CAREERS;
	const hasRoles = openings.length > 0;

	return (
		<div ref={wrapRef} className="absolute inset-0 z-10 invisible overflow-y-auto">
			<div className="min-h-full flex flex-col justify-center px-6 sm:px-10 md:px-16 py-12 md:py-14">
				<div className="mx-auto w-full max-w-5xl">
					<div className="cr-reveal font-sans font-light uppercase tracking-[0.42em] text-gold text-[0.6rem] md:text-xs mb-6 md:mb-10">
						{openingsTitle}
					</div>

					{hasRoles ? (
						<div className="border-t border-cream/10">
							{openings.map((o) => (
								<div
									key={o.role}
									className="cr-reveal grid gap-x-8 gap-y-3 border-b border-cream/10 py-6 md:grid-cols-12 md:py-8">
									<div className="md:col-span-4">
										<h2 className="font-serif font-light text-cream text-xl sm:text-2xl md:text-3xl leading-tight">
											{o.role}
										</h2>
										<div className="mt-2 font-sans font-light uppercase tracking-[0.24em] text-cream/40 text-[0.56rem] md:text-[0.58rem]">
											{o.type} · {o.location}
										</div>
									</div>
									<p className="md:col-span-6 font-sans font-light text-cream/60 text-sm md:text-base leading-snug md:leading-[1.7]">
										{o.desc}
									</p>
									<div className="md:col-span-2 md:text-right">
										<button
											type="button"
											onClick={() => openApplication(o.role)}
											className="group inline-flex cursor-pointer items-center gap-2 font-sans font-light uppercase tracking-[0.24em] text-gold text-[0.62rem] md:text-xs hover:text-cream transition-colors">
											Apply
											<span className="transition-transform duration-500 group-hover:translate-x-1">
												&rarr;
											</span>
										</button>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="border-t border-cream/10 pt-10 md:pt-14">
							<p className="cr-reveal font-serif italic font-light text-cream/80 text-2xl sm:text-3xl md:text-4xl leading-[1.4] max-w-3xl">
								{emptyNote}
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
