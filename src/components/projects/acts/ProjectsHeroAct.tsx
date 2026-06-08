import { Words } from "@/components/shared/Words";
import { PROJECTS_PAGE } from "@/lib/data/projects";

interface Props {
	eyebrowRef: React.RefObject<HTMLDivElement | null>;
	titleRef: React.RefObject<HTMLHeadingElement | null>;
	title1Ref: React.RefObject<(HTMLSpanElement | null)[]>;
	title2Ref: React.RefObject<(HTMLSpanElement | null)[]>;
	title3Ref: React.RefObject<(HTMLSpanElement | null)[]>;
}

export function ProjectsHeroAct({
	eyebrowRef,
	titleRef,
	title1Ref,
	title2Ref,
	title3Ref,
}: Props) {
	return (
		<div className="min-h-dvh flex flex-col items-center justify-center text-center px-6">
			<div
				ref={eyebrowRef}
				className="flex items-center gap-4 md:gap-5 mb-7 md:mb-9 will-change-transform">
				<span className="font-sans font-light uppercase tracking-[0.42em] text-gold text-sm md:text-base">
					{PROJECTS_PAGE.eyebrow}
				</span>
			</div>

			<h1
				ref={titleRef}
				className="font-serif font-light leading-[1.05] tracking-[-0.01em] text-cream text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
				style={{ perspective: "1200px" }}>
				<span className="block">
					<Words
						words={PROJECTS_PAGE.title[0].split(" ")}
						refStore={title1Ref}
						spacing="0.18em"
						initialHidden
					/>
				</span>
				<span className="block">
					<Words
						words={PROJECTS_PAGE.title[1].split(" ")}
						refStore={title2Ref}
						spacing="0.18em"
						initialHidden
					/>
				</span>
				<span className="mt-2 block font-bdscript leading-[0.95] text-gold text-6xl sm:text-7xl md:text-8xl lg:text-9xl">
					<Words
						words={PROJECTS_PAGE.title[2].split(" ")}
						refStore={title3Ref}
						spacing="0.06em"
						initialHidden
					/>
				</span>
			</h1>
		</div>
	);
}
