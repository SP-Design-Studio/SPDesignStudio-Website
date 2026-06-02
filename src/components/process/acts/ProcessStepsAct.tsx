import Image from "next/image";
import { PROCESS } from "@/lib/studio";

const SHADES = [
	"#2e1f24",
	"#37252a",
	"#3f2a31",
	"#473037",
	"#4f353e",
	"#583b44",
];

interface Props {
	wrapRef: React.RefObject<HTMLDivElement | null>;
	imgInnerRefs: React.RefObject<(HTMLDivElement | null)[]>;
	imgLineRefs: React.RefObject<(HTMLSpanElement | null)[]>;
	textInnerRefs: React.RefObject<(HTMLDivElement | null)[]>;
	textLineRefs: React.RefObject<(HTMLSpanElement | null)[]>;
}

export function ProcessStepsAct({
	wrapRef,
	imgInnerRefs,
	imgLineRefs,
	textInnerRefs,
	textLineRefs,
}: Props) {
	const steps = PROCESS.steps;

	return (
		<div
			ref={wrapRef}
			className="absolute inset-0 z-10 invisible grid grid-rows-[42vh_1fr] md:grid-rows-1 md:grid-cols-2">
			<div className="relative h-full overflow-hidden">
				{steps.map((s, i) => (
					<div key={s.no} className="absolute inset-0">
						<div
							ref={(el) => {
								imgInnerRefs.current[i] = el;
							}}
							className="absolute inset-0">
							<Image
								src={s.img}
								alt=""
								fill
								className="object-cover"
								sizes="(max-width: 768px) 100vw, 50vw"
								priority={i === 0}
							/>
							<div className="absolute inset-0 bg-plum-dark/25" />
						</div>
						<span
							ref={(el) => {
								imgLineRefs.current[i] = el;
							}}
							aria-hidden
							className="absolute inset-x-0 top-0 h-px bg-gold/25"
							style={{ opacity: 0 }}
						/>
					</div>
				))}
			</div>

			<div className="relative h-full overflow-hidden">
				{steps.map((s, i) => (
					<div key={s.no} className="absolute inset-0">
						<div
							ref={(el) => {
								textInnerRefs.current[i] = el;
							}}
							style={{ backgroundColor: SHADES[i % SHADES.length] }}
							className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 md:px-12 lg:px-20">
							<span
								aria-hidden
								className="pointer-events-none absolute right-4 top-6 md:right-8 md:top-12 font-serif font-light leading-none text-gold/10 text-[8rem] md:text-[14rem]">
								{s.no}
							</span>
							<div className="relative max-w-xl">
								<div className="p-eyebrow font-sans font-light uppercase tracking-[0.4em] text-gold text-[0.6rem] md:text-xs mb-5">
									Stage {s.no}
								</div>
								<h2
									className="font-serif font-light leading-[1.05] tracking-[-0.01em] text-cream text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-5 md:mb-7"
									style={{ perspective: "800px" }}>
									{s.title.split(" ").map((w, k) => (
										<span
											key={k}
											className="p-tword inline-block"
											style={{ marginRight: "0.22em" }}>
											{w}
										</span>
									))}
								</h2>
								<p className="p-desc font-sans font-light text-cream/65 text-sm md:text-base lg:text-lg leading-[1.7]">
									{s.desc}
								</p>
							</div>
						</div>
						<span
							ref={(el) => {
								textLineRefs.current[i] = el;
							}}
							aria-hidden
							className="absolute inset-x-0 top-0 h-px bg-gold/25"
							style={{ opacity: 0 }}
						/>
					</div>
				))}
			</div>
		</div>
	);
}
