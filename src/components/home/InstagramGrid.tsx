import type { InstaItem } from "@/lib/instagram";
import { STUDIO } from "@/lib/studio";

export function InstagramGrid({ media }: { media: InstaItem[] }) {
	if (!media.length) return null;
	return (
		<section className="bg-plum-dark px-6 py-20 sm:px-10 md:px-16 md:py-28">
			<div className="mx-auto max-w-7xl">
				<div className="mb-10 flex flex-col items-center text-center md:mb-14">
					<div className="font-bdscript text-gold leading-none text-4xl sm:text-5xl md:text-6xl">
						From the Studio
					</div>
					<a
						href={STUDIO.socials.instagram}
						target="_blank"
						rel="noopener noreferrer"
						className="mt-4 font-sans font-normal uppercase tracking-[0.28em] text-cream/70 text-[0.72rem] transition-colors hover:text-gold">
						@spdesigns_official ↗
					</a>
				</div>

				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
					{media.map((m) => (
						<a
							key={m.id}
							href={m.permalink}
							target="_blank"
							rel="noopener noreferrer"
							className="group relative block aspect-square overflow-hidden border border-cream/10 bg-plum">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={m.image}
								alt={m.caption.slice(0, 80) || "Instagram post"}
								loading="lazy"
								className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
							/>
							<div className="absolute inset-0 bg-linear-to-t from-plum-dark/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
							{(m.isReel || m.isVideo) && (
								<span className="absolute right-2.5 top-2.5 text-cream drop-shadow-[0_1px_4px_rgba(46,31,36,0.8)]">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
										<path d="M8 5v14l11-7z" />
									</svg>
								</span>
							)}
							{m.caption && (
								<p className="absolute inset-x-0 bottom-0 line-clamp-2 p-3 font-sans font-normal text-cream/90 text-[0.7rem] leading-snug opacity-0 transition-opacity duration-500 group-hover:opacity-100">
									{m.caption}
								</p>
							)}
						</a>
					))}
				</div>
			</div>
		</section>
	);
}
