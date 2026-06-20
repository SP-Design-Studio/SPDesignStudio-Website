"use client";

import Link from "next/link";
import { CONTACT } from "@/lib/studio";

interface Props {
	wrapRef: React.RefObject<HTMLDivElement | null>;
}

const ctaCls =
	"group/cta inline-flex w-fit items-center gap-2 font-sans font-normal uppercase tracking-[0.24em] text-gold text-[0.694rem] md:text-sm transition-colors hover:text-cream";

export function ContactInquiryAct({ wrapRef }: Props) {
	const { inquiries } = CONTACT;

	return (
		<div
			ref={wrapRef}
			className="absolute inset-0 z-10 invisible overflow-y-auto">
			<div className="min-h-full flex flex-col justify-center px-6 sm:px-10 md:px-16 py-10 sm:py-12 md:py-14">
				<div className="mx-auto w-full max-w-6xl">
					<div className="c-reveal font-sans font-normal uppercase tracking-[0.42em] text-gold text-[0.672rem] md:text-sm mb-2.5">
						{inquiries.eyebrow}
					</div>
					<h2 className="c-reveal font-bdscript text-cream leading-none text-3xl sm:text-4xl md:text-6xl mb-6 sm:mb-8 md:mb-12">
						{inquiries.title}
					</h2>

					<div className="grid grid-cols-1 divide-y divide-cream/10 border-t border-cream/10 md:grid-cols-3 md:divide-y-0 md:divide-x">
						{inquiries.items.map((it) => (
							<div
								key={it.title}
								className="c-reveal group flex flex-col py-5 md:px-8 md:py-2 first:md:pl-0 last:md:pr-0">
								<div className="font-sans font-normal uppercase tracking-[0.32em] text-gold text-[0.627rem] md:text-[0.65rem] mb-2 md:mb-3">
									{it.title}
								</div>
								<h3 className="font-serif font-light text-cream text-xl sm:text-2xl md:text-3xl leading-tight mb-2.5 md:mb-5">
									{it.who}
								</h3>
								<p className="font-sans font-normal text-cream/85 text-base md:text-lg leading-snug md:leading-[1.7] mb-4 md:mb-8 flex-1 line-clamp-3 md:line-clamp-none">
									{it.desc}
								</p>
								{it.kind === "career" ? (
									<Link href={it.href} className={ctaCls}>
										<span className="ulink">{it.cta}</span>
										<span className="transition-transform duration-500 group-hover/cta:translate-x-1">
											&rarr;
										</span>
									</Link>
								) : (
									<button
										type="button"
										onClick={() =>
											window.dispatchEvent(
												new CustomEvent("open-inquiry", {
													detail: { kind: it.kind },
												}),
											)
										}
										className={`${ctaCls} cursor-pointer`}>
										<span className="ulink">{it.cta}</span>
										<span className="transition-transform duration-500 group-hover/cta:translate-x-1">
											&rarr;
										</span>
									</button>
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
