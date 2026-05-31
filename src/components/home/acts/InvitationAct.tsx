import { FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { Chars } from "@/components/shared/Chars";
import { STUDIO, SECTIONS } from "@/lib/studio";

const DFS = "clamp(3rem, 11vw, 13rem)";

interface InvitationActProps {
	wrapRef: React.RefObject<HTMLDivElement | null>;
	line1CharsRef: React.RefObject<(HTMLSpanElement | null)[]>;
	line2CharsRef: React.RefObject<(HTMLSpanElement | null)[]>;
	detailsRef: React.RefObject<HTMLDivElement | null>;
	socialRef: React.RefObject<HTMLDivElement | null>;
	ctaWrapRef: React.RefObject<HTMLDivElement | null>;
	ctaRef: React.RefObject<HTMLAnchorElement | null>;
}
export function InvitationAct({
	wrapRef,
	line1CharsRef,
	line2CharsRef,
	detailsRef,
	socialRef,
	ctaWrapRef,
	ctaRef,
}: InvitationActProps) {
	return (
		<div
			ref={wrapRef}
			className="absolute inset-0 z-10 invisible overflow-y-auto">
			<div className="min-h-full flex flex-col items-center justify-center text-center px-6 sm:px-10 md:px-16 py-16 md:py-12">
			<div
				className="font-bdscript text-cream tracking-[-0.015em]"
				style={{ fontSize: DFS, lineHeight: 1, perspective: "1200px" }}>
				<Chars text={SECTIONS.invitation.line1} refStore={line1CharsRef} />
			</div>

			<div
				className="font-bdscript tracking-[-0.015em] mb-[clamp(32px,5vw,64px)]"
				style={{ fontSize: DFS, lineHeight: 1, perspective: "1200px" }}>
				<Chars
					text={SECTIONS.invitation.line2}
					refStore={line2CharsRef}
					charStyleByIndex={(i) => ({
						color:
							i < SECTIONS.invitation.line2GoldFromIndex
								? "var(--color-cream)"
								: "var(--color-gold)",
					})}
				/>
			</div>

			<div
				ref={detailsRef}
				className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-5 sm:gap-6 md:gap-12 mb-8 md:mb-9">
				{[
					{ icon: FiMail, value: STUDIO.email, href: `mailto:${STUDIO.email}` },
					{
						icon: FiPhone,
						value: STUDIO.phone,
						href: `tel:${STUDIO.phone.replace(/\s/g, "")}`,
					},
					{ icon: FiMapPin, value: STUDIO.address, href: undefined },
				].map(({ icon: Icon, value, href }) => (
					<div key={value} className="group flex items-center gap-3">
						<Icon size={14} className="text-gold/60 shrink-0" />
						{href ? (
							<a
								href={href}
								className="font-serif font-light inline-block transition-opacity duration-500 hover:opacity-100 text-cream/80 text-sm md:text-base">
								{value}
							</a>
						) : (
							<span className="font-serif font-light text-cream/55 text-sm md:text-base">
								{value}
							</span>
						)}
					</div>
				))}
			</div>

			<div ref={socialRef} className="flex gap-9 mb-9">
				{[
					{ href: STUDIO.socials.instagram, Icon: FaInstagram },
					{ href: STUDIO.socials.linkedin, Icon: FaLinkedin },
					{ href: STUDIO.socials.whatsapp, Icon: FaWhatsapp },
				].map(({ href, Icon }) => (
					<a
						key={href}
						href={href}
						target="_blank"
						rel="noopener noreferrer"
						className="transition-all duration-500 hover:opacity-100 hover:-translate-y-0.5 text-cream/35">
						<Icon size={20} />
					</a>
				))}
			</div>

			<div ref={ctaWrapRef} className="inline-block">
				<a
					ref={ctaRef}
					href={`mailto:${STUDIO.email}`}
					className="group inline-flex items-center gap-3 px-8 py-4 font-sans font-light text-sm uppercase tracking-[0.28em] transition-[gap] duration-500 hover:gap-5 bg-gold text-plum-dark will-change-transform">
					{SECTIONS.invitation.ctaText}
					<span className="transition-transform duration-500 group-hover:translate-x-1">
						→
					</span>
				</a>
			</div>
			</div>
		</div>
	);
}
