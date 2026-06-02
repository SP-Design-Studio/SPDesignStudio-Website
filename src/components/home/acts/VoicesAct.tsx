"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Words } from "@/components/shared/Words";
import { SECTIONS } from "@/lib/studio";

interface VoicesActProps {
	wrapRef: React.RefObject<HTMLDivElement | null>;
	ruleRef: React.RefObject<HTMLDivElement | null>;
	titleWordsRef: React.RefObject<(HTMLSpanElement | null)[]>;
	itemsRef: React.RefObject<(HTMLDivElement | null)[]>;
}

const INTERVAL = 5200;
const WINDOW = 3;

export function VoicesAct({
	wrapRef,
	ruleRef,
	titleWordsRef,
	itemsRef,
}: VoicesActProps) {
	const { title, quotes } = SECTIONS.voices;
	const n = quotes.length;
	const [active, setActive] = useState(0);
	const slideRef = useRef<HTMLDivElement>(null);
	const activeRef = useRef(0);
	const timer = useRef<ReturnType<typeof setInterval> | null>(null);

	const goTo = (i: number) => {
		const next = ((i % n) + n) % n;
		if (next === activeRef.current) return;
		gsap.to(slideRef.current, {
			autoAlpha: 0,
			y: -12,
			filter: "blur(6px)",
			duration: 0.4,
			ease: "power2.in",
			onComplete: () => setActive(next),
		});
	};

	const start = () => {
		stop();
		timer.current = setInterval(
			() => goTo(activeRef.current + 1),
			INTERVAL,
		);
	};
	const stop = () => {
		if (timer.current) clearInterval(timer.current);
	};

	useEffect(() => {
		start();
		return stop;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [n]);

	useEffect(() => {
		activeRef.current = active;
		gsap.fromTo(
			slideRef.current,
			{ autoAlpha: 0, y: 14, filter: "blur(6px)" },
			{
				autoAlpha: 1,
				y: 0,
				filter: "blur(0px)",
				duration: 0.55,
				ease: "power3.out",
			},
		);
	}, [active]);

	const visible = Array.from(
		{ length: Math.min(WINDOW, n) },
		(_, o) => quotes[(active + o) % n],
	);

	return (
		<div
			ref={wrapRef}
			className="absolute inset-0 z-10 invisible overflow-y-auto">
			<div className="min-h-full flex flex-col items-center justify-center px-6 sm:px-8 md:px-10 py-12 md:py-14">
				<div
					className="font-bdscript text-gold tracking-[-0.005em] text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-center"
					style={{ perspective: "1200px" }}>
					<Words
						words={title.split(" ")}
						refStore={titleWordsRef}
						spacing="0.45em"
					/>
				</div>
				<div ref={ruleRef} className="w-14 h-px bg-gold/70 mt-5 mb-10 md:mb-12" />

				{/* Carousel — the master scroll timeline reveals/hides this block. */}
				<div
					ref={(el) => {
						itemsRef.current[0] = el;
					}}
					className="w-full max-w-6xl mx-auto"
					onMouseEnter={stop}
					onMouseLeave={start}>
					<div
						ref={slideRef}
						className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
						{visible.map((q, idx) => (
							<figure
								key={`${active}-${idx}`}
								className={`flex-col ${idx === 0 ? "flex" : "hidden lg:flex"}`}>
								<div className="relative aspect-4/3 overflow-hidden border border-cream/10 bg-plum-dark mb-5">
									<Image
										src={q.img}
										alt=""
										fill
										className="object-cover"
										sizes="(max-width: 1024px) 90vw, 360px"
									/>
									<div className="absolute inset-0 bg-linear-to-t from-plum-dark/50 to-transparent" />
								</div>
								<span
									aria-hidden
									className="font-serif text-gold/35 leading-[0.5] select-none text-5xl">
									&ldquo;
								</span>
								<blockquote className="font-serif italic font-light text-cream/90 leading-[1.5] text-sm md:text-base -mt-2">
									{q.quote}
								</blockquote>
								<figcaption className="mt-4">
									<div className="font-bdscript text-gold leading-none text-xl md:text-2xl">
										{q.name}
									</div>
									<div className="font-sans font-light uppercase tracking-[0.22em] text-cream/45 text-[0.56rem] md:text-[0.6rem] mt-2">
										{q.detail}
									</div>
								</figcaption>
							</figure>
						))}
					</div>

					{/* Custom nav — a gold segment that slides along a hairline. */}
					<div className="mt-10 md:mt-12 flex items-center justify-center gap-6">
						<button
							type="button"
							onClick={() => {
								goTo(active - 1);
								start();
							}}
							aria-label="Previous testimonial"
							className="cursor-pointer font-sans text-base text-gold/55 transition-colors duration-300 hover:text-gold">
							&larr;
						</button>
						<div className="relative h-px w-28 md:w-44 bg-cream/15">
							<span
								className="absolute top-0 h-px bg-gold transition-all duration-500 ease-out"
								style={{
									width: `${100 / n}%`,
									left: `${active * (100 / n)}%`,
								}}
							/>
						</div>
						<button
							type="button"
							onClick={() => {
								goTo(active + 1);
								start();
							}}
							aria-label="Next testimonial"
							className="cursor-pointer font-sans text-base text-gold/55 transition-colors duration-300 hover:text-gold">
							&rarr;
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
