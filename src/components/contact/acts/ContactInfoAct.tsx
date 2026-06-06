import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { CONTACT } from "@/lib/studio";

const ICONS = { mail: FiMail, phone: FiPhone, whatsapp: FaWhatsapp };

interface Props {
	wrapRef: React.RefObject<HTMLDivElement | null>;
}

export function ContactInfoAct({ wrapRef }: Props) {
	const { channels, visit } = CONTACT;

	return (
		<div
			ref={wrapRef}
			className="absolute inset-0 z-10 invisible overflow-y-auto">
			<div className="min-h-full flex flex-col justify-center px-6 sm:px-10 md:px-16 py-10 sm:py-12 md:py-14">
				<div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-9 sm:gap-12 lg:grid-cols-2 lg:gap-20">
					<section>
						<header className="c-reveal mb-7 md:mb-9 flex items-baseline gap-4">
							<div>
								<div className="font-sans font-light uppercase tracking-[0.4em] text-gold text-[0.58rem] md:text-[0.62rem] mb-1.5">
									{channels.eyebrow}
								</div>
								<h2 className="font-serif font-light leading-[1.05] tracking-[-0.01em] text-cream text-2xl md:text-3xl lg:text-4xl">
									{channels.title}
								</h2>
							</div>
						</header>

						<div className="flex flex-col">
							{channels.items.map((ch) => {
								const Icon = ICONS[ch.icon];
								const external = ch.icon === "whatsapp";
								return (
									<a
										key={ch.label}
										href={ch.href}
										target={external ? "_blank" : undefined}
										rel={external ? "noopener noreferrer" : undefined}
										className="c-reveal group flex items-center gap-5 border-t border-cream/10 py-4 md:py-5 last:border-b transition-colors duration-500 hover:border-gold/40">
										<Icon className="shrink-0 text-gold" size={18} />
										<div className="flex-1">
											<div className="font-sans font-light uppercase tracking-[0.28em] text-cream/45 text-[0.55rem] mb-1">
												{ch.label}
											</div>
											<div className="font-serif font-light text-cream text-lg md:text-xl transition-colors duration-500 group-hover:text-gold">
												<span className="ulink">{ch.value}</span>
											</div>
										</div>
										<span className="text-cream/30 transition-all duration-500 group-hover:translate-x-1 group-hover:text-gold">
											&rarr;
										</span>
									</a>
								);
							})}
						</div>
					</section>

					<section className="border-t border-cream/10 pt-9 lg:border-t-0 lg:pt-0 lg:border-l lg:pl-20">
						<header className="c-reveal mb-7 md:mb-9 flex items-baseline gap-4">
							<div>
								<div className="font-sans font-light uppercase tracking-[0.4em] text-gold text-[0.58rem] md:text-[0.62rem] mb-1.5">
									{visit.eyebrow}
								</div>
								<h2 className="font-serif font-light leading-[1.05] tracking-[-0.01em] text-cream text-2xl md:text-3xl lg:text-4xl">
									Come See Us
								</h2>
							</div>
						</header>

						<a
							href={visit.mapsUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="c-reveal group flex items-start gap-4 mb-8 md:mb-10">
							<FiMapPin className="mt-1.5 shrink-0 text-gold" size={18} />
							<span>
								<span className="block font-serif italic font-light text-cream/90 text-lg md:text-2xl leading-snug transition-colors duration-500 group-hover:text-gold">
									{visit.address}
								</span>
								<span className="font-sans font-light text-cream/50 text-sm">
									{visit.city}
								</span>
							</span>
						</a>

						<div className="c-reveal font-sans font-light uppercase tracking-[0.4em] text-gold/80 text-[0.55rem] mb-4">
							Studio Hours
						</div>
						<div className="flex max-w-sm flex-col gap-2.5">
							{visit.hours.map((h) => (
								<div
									key={h.days}
									className="c-reveal flex items-center justify-between border-b border-cream/5 pb-2.5">
									<span className="font-sans font-light text-cream/70 text-sm md:text-base">
										{h.days}
									</span>
									<span className="font-sans font-light text-cream/45 text-sm md:text-base">
										{h.time}
									</span>
								</div>
							))}
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}
