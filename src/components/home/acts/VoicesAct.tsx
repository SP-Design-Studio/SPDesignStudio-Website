"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { Words } from "@/components/shared/Words";
import { CloseButton } from "@/components/shared/CloseButton";
import { SECTIONS } from "@/lib/studio";
import type { Testimonial } from "@/lib/cms/types";

interface VoicesActProps {
	wrapRef: React.RefObject<HTMLDivElement | null>;
	ruleRef: React.RefObject<HTMLDivElement | null>;
	titleWordsRef: React.RefObject<(HTMLSpanElement | null)[]>;
	itemsRef: React.RefObject<(HTMLDivElement | null)[]>;
	testimonials: Testimonial[];
}

const INTERVAL = 5200;
const WINDOW = 3;

export function VoicesAct({
	wrapRef,
	ruleRef,
	titleWordsRef,
	itemsRef,
	testimonials,
}: VoicesActProps) {
	const { title } = SECTIONS.voices;
	const quotes = testimonials;
	const n = quotes.length;
	const [active, setActive] = useState(0);
	const [open, setOpen] = useState(false);
	const slideRef = useRef<HTMLDivElement>(null);
	const panelRef = useRef<HTMLDivElement>(null);
	const activeRef = useRef(0);

	const close = () => {
		if (!panelRef.current) {
			setOpen(false);
			return;
		}
		document.body.style.overflow = "";
		gsap.to(panelRef.current, {
			clipPath: "inset(100% 0% 0% 0%)",
			duration: 0.55,
			ease: "expo.inOut",
			onComplete: () => setOpen(false),
		});
	};
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
		if (open || n <= 1) return;
		timer.current = setInterval(() => goTo(activeRef.current + 1), INTERVAL);
	};
	const stop = () => {
		if (timer.current) clearInterval(timer.current);
	};

	useEffect(() => {
		start();
		return stop;
	}, [n]);

	useEffect(() => {
		if (open) stop();
		else start();
	}, [open]);

	useEffect(() => {
		if (!open || !panelRef.current) return;
		document.body.style.overflow = "hidden";
		gsap.set(panelRef.current, { clipPath: "inset(0% 0% 100% 0%)" });
		gsap.to(panelRef.current, {
			clipPath: "inset(0% 0% 0% 0%)",
			duration: 0.7,
			ease: "expo.inOut",
		});
		gsap.fromTo(
			".tv-row",
			{ y: 28, autoAlpha: 0 },
			{
				y: 0,
				autoAlpha: 1,
				duration: 0.6,
				stagger: 0.05,
				ease: "power3.out",
				delay: 0.25,
			},
		);
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") close();
		};
		window.addEventListener("keydown", onKey);
		return () => {
			window.removeEventListener("keydown", onKey);
			document.body.style.overflow = "";
		};
	}, [open]);

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

	if (n === 0) {
		return (
			<div
				ref={wrapRef}
				className="absolute inset-0 z-10 invisible overflow-y-auto">
				<div className="min-h-full flex flex-col items-center justify-center px-6 py-10 text-center">
					<div
						className="font-bdscript text-gold tracking-[-0.005em] text-4xl sm:text-5xl md:text-6xl"
						style={{ perspective: "1200px" }}>
						<Words
							words={title.split(" ")}
							refStore={titleWordsRef}
							spacing="0.45em"
						/>
					</div>
					<div ref={ruleRef} className="w-14 h-px bg-gold/70 mt-4" />
				</div>
			</div>
		);
	}

	const visible = Array.from(
		{ length: Math.min(WINDOW, n) },
		(_, o) => quotes[(active + o) % n],
	);

	return (
		<div
			ref={wrapRef}
			className="absolute inset-0 z-10 invisible overflow-y-auto">
			<div className="min-h-full flex flex-col items-center justify-center px-6 sm:px-8 md:px-10 py-10 md:py-14">
				<div
					className="font-bdscript text-gold tracking-[-0.005em] text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-center"
					style={{ perspective: "1200px" }}>
					<Words
						words={title.split(" ")}
						refStore={titleWordsRef}
						spacing="0.45em"
					/>
				</div>
				<div ref={ruleRef} className="w-14 h-px bg-gold/70 mt-4 mb-7 md:mb-12" />

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
								className={`h-full flex-col ${idx === 0 ? "flex" : "hidden lg:flex"}`}>
								<div className="relative aspect-4/3 overflow-hidden border border-cream/10 bg-plum-dark mb-5">
									{q.img && (
										<Image
											src={q.img}
											alt=""
											fill
											className="object-cover"
											sizes="(max-width: 1024px) 90vw, 360px"
										/>
									)}
									<div className="absolute inset-0 bg-linear-to-t from-plum-dark/50 to-transparent" />
								</div>
								<span
									aria-hidden
									className="font-serif text-gold/35 leading-[0.5] select-none text-5xl">
									&ldquo;
								</span>
								<blockquote className="font-sans font-normal text-cream/90 leading-normal text-lg md:text-xl lg:text-xl -mt-2">
									{q.quote}
								</blockquote>
								<figcaption className="mt-auto pt-5">
									<div className="font-serif italic font-light text-gold leading-tight text-xl md:text-2xl">
										{q.name}
									</div>
									<div className="font-sans font-normal uppercase tracking-[0.22em] text-cream/72 text-[0.65rem] md:text-[0.717rem] mt-2">
										{q.detail}
									</div>
								</figcaption>
							</figure>
						))}
					</div>

					<div className="mt-7 md:mt-12 flex items-center justify-center gap-6">
						<button
							type="button"
							onClick={() => {
								goTo(active - 1);
								start();
							}}
							aria-label="Previous testimonial"
							className="cursor-pointer font-sans text-lg text-gold/55 transition-colors duration-300 hover:text-gold">
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
							className="cursor-pointer font-sans text-lg text-gold/55 transition-colors duration-300 hover:text-gold">
							&rarr;
						</button>
					</div>

					<div className="mt-6 md:mt-8 flex justify-center">
						<button
							type="button"
							onClick={() => setOpen(true)}
							className="group cursor-pointer inline-flex items-center gap-2.5 font-sans font-normal uppercase tracking-[0.28em] text-[0.694rem] md:text-[0.762rem] text-cream/80 transition-colors duration-300 hover:text-gold">
							<span className="ulink">Read all {n} reflections</span>
							<span className="transition-transform duration-500 group-hover:translate-x-1">
								&rarr;
							</span>
						</button>
					</div>
				</div>
			</div>

			{open &&
				createPortal(
					<div
						ref={panelRef}
						data-lenis-prevent
						className="fixed inset-0 z-200 overflow-y-auto overscroll-contain bg-plum-dark"
						style={{ clipPath: "inset(0% 0% 100% 0%)" }}>
						<div className="relative mx-auto min-h-full max-w-5xl px-6 sm:px-10 pb-16 md:pb-24">
							<div
								className="flex items-end justify-between border-b border-cream/10 pb-5"
								style={{
									paddingTop:
										"calc(env(safe-area-inset-top, 0px) + 1.75rem)",
								}}>
								<div>
									<div className="font-sans font-normal uppercase tracking-[0.4em] text-gold text-[0.672rem] md:text-sm">
										Client Reflections
									</div>
									<div className="font-serif font-light text-cream/78 italic text-base md:text-lg mt-1.5">
										{`${n} stories from the people we’ve built for`}
									</div>
								</div>
								<CloseButton onClick={close} className="shrink-0 ml-4" />
							</div>

							<div className="py-10 md:py-14">
								<ul className="flex flex-col gap-12 md:gap-20">
									{quotes.map((q, i) => (
										<li
											key={q.id}
											className="tv-row grid grid-cols-1 md:grid-cols-12 md:items-center gap-6 md:gap-10">
											<div
												className={`md:col-span-5 ${i % 2 === 1 ? "md:order-2" : ""}`}>
												<div className="relative aspect-3/2 sm:aspect-4/3 md:aspect-4/5 overflow-hidden border border-cream/10 bg-plum-dark">
													{q.img && (
														<Image
															src={q.img}
															alt={q.name}
															fill
															className="object-cover"
															sizes="(max-width: 768px) 90vw, 420px"
														/>
													)}
													<div className="absolute inset-0 bg-linear-to-t from-plum-dark/40 to-transparent" />
												</div>
											</div>

											<div className="md:col-span-7">
												<span
													aria-hidden
													className="block font-serif text-gold/30 leading-[0.4] select-none text-6xl md:text-7xl">
													&ldquo;
												</span>
												<blockquote className="font-sans font-normal text-cream/90 leading-relaxed text-xl md:text-2xl -mt-3">
													{q.quote}
												</blockquote>
												<div className="mt-6 flex items-center gap-4">
													<span className="h-px w-8 bg-gold/60" />
													<div>
														<div className="font-serif italic font-light text-gold leading-tight text-2xl md:text-3xl">
															{q.name}
														</div>
														<div className="font-sans font-normal uppercase tracking-[0.22em] text-cream/72 text-[0.65rem] md:text-[0.717rem] mt-2">
															{q.detail}
														</div>
													</div>
												</div>
											</div>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>,
					document.body,
				)}
		</div>
	);
}
