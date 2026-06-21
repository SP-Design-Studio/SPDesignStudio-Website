import Link from "next/link";
import Image from "next/image";
import { ABOUT, STUDIO } from "@/lib/studio";
import { pageMeta, breadcrumbLd, webPageLd, founderLd } from "@/lib/seo";
import JsonLd from "@/components/shared/JsonLd";

export const metadata = pageMeta("whoWeAre");

const eyebrow =
	"font-sans font-light uppercase tracking-[0.4em] text-gold text-[0.7rem]";
const heading =
	"font-serif font-light text-cream tracking-[-0.01em] text-2xl md:text-3xl leading-tight";
const body =
	"font-sans font-light text-cream/85 leading-relaxed text-base md:text-lg";

export default function WhoWeArePage() {
	return (
		<main className="min-h-dvh bg-plum-dark text-cream">
			<JsonLd
				data={[
					breadcrumbLd("whoWeAre"),
					webPageLd("whoWeAre", "AboutPage"),
					founderLd(),
				]}
			/>

			<div className="border-b border-gold/20 bg-plum/40 px-6 py-3 text-center">
				<p className="font-sans font-light text-cream/80 text-[0.72rem] tracking-[0.04em]">
					You&rsquo;re viewing a simplified text version of this page.{" "}
					<Link
						href="/about"
						className="text-gold underline-offset-4 transition-colors hover:text-cream hover:underline"
					>
						Visit the full studio experience &rarr;
					</Link>
				</p>
			</div>

			<div className="mx-auto max-w-3xl px-6 py-24 md:py-32">
				<header className="text-center">
					<div className={eyebrow}>Who We Are</div>
					<h1 className="mt-6 font-serif font-light text-gold leading-[1.05] tracking-[-0.01em] text-4xl sm:text-5xl md:text-6xl">
						Crafting spaces with soul.
					</h1>
					<div className="mx-auto my-9 h-px w-16 bg-gold/60" />
					<p className="mx-auto max-w-xl font-serif font-light italic text-cream/85 leading-relaxed text-lg md:text-xl">
						SP Design Studio is an interior design studio in Banjara Hills,
						Hyderabad, crafting residential, commercial, and hospitality
						interiors where intentional architecture meets the quiet art of
						well-being.
					</p>
				</header>

				<div className="relative mt-14 aspect-video w-full overflow-hidden rounded-sm border border-cream/10">
					<Image
						src="/images/about-hero.jpg"
						alt="SP Design Studio interior"
						fill
						sizes="(max-width: 768px) 100vw, 768px"
						className="object-cover"
					/>
				</div>

				<section className="mt-16 md:mt-20">
					<div className={eyebrow}>{ABOUT.mission.eyebrow}</div>
					<h2 className={`${heading} mt-4`}>{ABOUT.mission.title}</h2>
					<p className={`${body} mt-5`}>{ABOUT.mission.body}</p>
				</section>

				<section className="mt-16 md:mt-20">
					<div className={eyebrow}>{ABOUT.visionary.eyebrow}</div>
					<h2 className={`${heading} mt-4`}>{ABOUT.visionary.title}</h2>
					<div className="mt-7 grid gap-8 sm:grid-cols-[200px_1fr] sm:items-start">
						<div className="relative aspect-3/4 w-full overflow-hidden rounded-sm border border-cream/10">
							<Image
								src={ABOUT.visionary.image}
								alt={ABOUT.visionary.attribution}
								fill
								sizes="200px"
								className="object-cover"
							/>
						</div>
						<div className="flex flex-col gap-5">
							<p className={body}>{ABOUT.visionary.body1}</p>
							<p className={body}>{ABOUT.visionary.body2}</p>
							<blockquote className="border-l border-gold/40 pl-5 font-serif font-light italic text-cream/90 text-lg leading-relaxed">
								&ldquo;{ABOUT.visionary.quoteBefore}
								<span className="text-gold">
									{ABOUT.visionary.quoteEmphasis}
								</span>
								{ABOUT.visionary.quoteAfter}&rdquo;
								<cite className="mt-3 block font-sans font-normal uppercase not-italic tracking-[0.24em] text-cream/70 text-[0.66rem]">
									{ABOUT.visionary.attribution}
								</cite>
							</blockquote>
						</div>
					</div>
				</section>

				<section className="mt-16 md:mt-20">
					<div className={eyebrow}>{ABOUT.team.eyebrow}</div>
					<h2 className={`${heading} mt-4`}>{ABOUT.team.title}</h2>
					<p className={`${body} mt-5`}>{ABOUT.team.body}</p>
				</section>

				<section className="mt-16 md:mt-20">
					<div className={eyebrow}>Visit the Studio</div>
					<p className={`${body} mt-4`}>
						{STUDIO.address}. {STUDIO.location}.
					</p>
				</section>

				<nav className="mt-20 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-cream/10 pt-8 font-sans font-light uppercase tracking-[0.24em] text-[0.72rem]">
					<Link href="/about" className="text-gold transition-colors hover:text-cream">
						The full story
					</Link>
					<Link href="/projects" className="text-cream/80 transition-colors hover:text-gold">
						Our work
					</Link>
					<Link href="/contact" className="text-cream/80 transition-colors hover:text-gold">
						Contact
					</Link>
					<Link href="/" className="text-cream/80 transition-colors hover:text-gold">
						Home
					</Link>
				</nav>
			</div>
		</main>
	);
}
