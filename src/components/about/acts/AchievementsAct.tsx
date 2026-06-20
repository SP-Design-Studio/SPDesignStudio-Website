"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { CloseButton } from "@/components/shared/CloseButton";
import { ABOUT } from "@/lib/studio";
import type { Honour } from "@/lib/cms/types";

interface Props {
	wrapRef: React.RefObject<HTMLDivElement | null>;
	items: Honour[];
}

const ROTATE = 4200;

export function AchievementsAct({ wrapRef, items }: Props) {
	const { achievements } = ABOUT;
	const n = items.length;
	const [active, setActive] = useState(0);
	const [paused, setPaused] = useState(false);
	const [detail, setDetail] = useState<number | null>(null);

	const open = detail !== null;
	const d = items[detail ?? 0];

	const panelRef = useRef<HTMLDivElement>(null);
	const imgRef = useRef<HTMLDivElement>(null);
	const bodyRef = useRef<HTMLDivElement>(null);

	const close = () => {
		document.body.style.overflow = "";
		if (!panelRef.current) {
			setDetail(null);
			return;
		}
		gsap.to(panelRef.current, {
			clipPath: "inset(100% 0% 0% 0%)",
			duration: 0.55,
			ease: "expo.inOut",
			onComplete: () => setDetail(null),
		});
	};

	useEffect(() => {
		if (paused || detail !== null) return;
		const id = setInterval(() => setActive((a) => (a + 1) % n), ROTATE);
		return () => clearInterval(id);
	}, [paused, detail, n]);

	useEffect(() => {
		if (!open || !panelRef.current) return;
		document.body.style.overflow = "hidden";
		gsap.set(panelRef.current, { clipPath: "inset(0% 0% 100% 0%)" });
		gsap.to(panelRef.current, {
			clipPath: "inset(0% 0% 0% 0%)",
			duration: 0.7,
			ease: "expo.inOut",
		});
		const ctx = gsap.context(() => {
			gsap.fromTo(
				".am-static",
				{ y: 24, autoAlpha: 0 },
				{
					y: 0,
					autoAlpha: 1,
					duration: 0.6,
					stagger: 0.08,
					ease: "power3.out",
					delay: 0.28,
				},
			);
		});
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") close();
			else if (e.key === "ArrowRight")
				setDetail((dd) => (dd === null ? dd : (dd + 1) % n));
			else if (e.key === "ArrowLeft")
				setDetail((dd) => (dd === null ? dd : (dd - 1 + n) % n));
		};
		window.addEventListener("keydown", onKey);
		return () => {
			window.removeEventListener("keydown", onKey);
			ctx.revert();
			document.body.style.overflow = "";
		};
	}, [open]);

	useEffect(() => {
		if (detail === null) return;
		const ctx = gsap.context(() => {
			gsap.fromTo(
				imgRef.current,
				{ autoAlpha: 0, scale: 1.06, y: 14 },
				{
					autoAlpha: 1,
					scale: 1,
					y: 0,
					duration: 0.8,
					ease: "expo.out",
					delay: 0.18,
				},
			);
			const parts = bodyRef.current ? Array.from(bodyRef.current.children) : [];
			gsap.fromTo(
				parts,
				{ autoAlpha: 0, y: 20, filter: "blur(4px)" },
				{
					autoAlpha: 1,
					y: 0,
					filter: "blur(0px)",
					duration: 0.65,
					ease: "power3.out",
					stagger: 0.07,
					delay: 0.24,
				},
			);
		});
		return () => ctx.revert();
	}, [detail]);

	if (n === 0) {
		return (
			<div ref={wrapRef} className="absolute inset-0 z-10 invisible overflow-y-auto">
				<div className="min-h-full flex flex-col justify-center px-6 sm:px-10 md:px-16 py-12 md:py-14">
					<div className="mx-auto w-full max-w-6xl">
						<div className="ach-reveal font-sans font-normal uppercase tracking-[0.4em] text-gold text-sm md:text-base mb-3">
							{achievements.eyebrow}
						</div>
						<h2 className="ach-reveal font-bdscript text-cream leading-[0.95] text-4xl sm:text-5xl md:text-6xl">
							{achievements.title}
						</h2>
						<p className="ach-reveal mt-6 font-serif italic font-light text-cream/90 text-xl">
							Milestones coming soon.
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div ref={wrapRef} className="absolute inset-0 z-10 invisible overflow-y-auto">
			<div className="min-h-full flex flex-col justify-center px-6 sm:px-10 md:px-16 py-12 md:py-14">
				<div
					className="mx-auto w-full max-w-6xl"
					onMouseEnter={() => setPaused(true)}
					onMouseLeave={() => setPaused(false)}>
					<div className="mb-7 md:mb-10">
						<div className="ach-reveal font-sans font-normal uppercase tracking-[0.4em] text-gold text-sm md:text-base mb-3">
							{achievements.eyebrow}
						</div>
						<h2 className="ach-reveal font-bdscript text-cream leading-[0.95] text-4xl sm:text-5xl md:text-6xl">
							{achievements.title}
						</h2>
					</div>

					<div className="md:grid md:grid-cols-12 md:gap-10 lg:gap-14 md:items-stretch">
						<button
							type="button"
							onClick={() => setDetail(active)}
							aria-label={`Open ${items[active].title}`}
							className="ach-reveal group relative hidden md:block md:col-span-5 overflow-hidden bg-plum-dark cursor-pointer text-left">
							{items.map((it, i) =>
								it.img ? (
									<Image
										key={it.id}
										src={it.img}
										alt={it.title}
										fill
										sizes="40vw"
										className={`object-cover transition-all duration-700 ease-out group-hover:scale-105 ${i === active ? "opacity-100" : "opacity-0"}`}
									/>
								) : null,
							)}
							<div
								className="absolute inset-0"
								style={{
									background:
										"linear-gradient(to top, rgba(46,31,36,0.9) 0%, rgba(46,31,36,0.25) 45%, transparent 78%)",
								}}
							/>
							<div className="absolute inset-x-0 bottom-0 p-6">
								<div className="flex items-center gap-2.5 mb-2">
									<span className="bg-gold px-2.5 py-1 font-sans font-normal text-plum-dark text-[0.65rem] tracking-[0.16em] tabular-nums">
										{items[active].year}
									</span>
									<span className="font-sans font-normal uppercase tracking-[0.24em] text-cream/88 text-[0.616rem]">
										{items[active].by_line}
									</span>
								</div>
								<div className="font-serif font-light text-cream text-2xl leading-tight">
									{items[active].title}
								</div>
								<span className="mt-3 inline-flex items-center gap-2 font-sans font-normal uppercase tracking-[0.24em] text-cream/85 text-[0.672rem] transition-colors duration-300 group-hover:text-gold">
									<span className="ulink">View milestone</span>
									<span className="transition-transform duration-300 group-hover:translate-x-1">
										→
									</span>
								</span>
							</div>
						</button>

						<ul className="md:col-span-7 flex flex-col">
							{items.map((it, i) => (
								<li key={it.id} className="ach-row">
									<button
										type="button"
										onMouseEnter={() => setActive(i)}
										onFocus={() => setActive(i)}
										onClick={() => setDetail(i)}
										className={`group flex w-full items-center gap-4 md:gap-6 border-b border-cream/10 py-4 md:py-5 text-left transition-colors duration-300 ${
											i === active ? "md:border-gold/30" : ""
										}`}>
										<div className="relative h-14 w-20 shrink-0 overflow-hidden bg-plum-dark md:hidden">
											{it.img && (
												<Image
													src={it.img}
													alt={it.title}
													fill
													sizes="80px"
													className="object-cover"
												/>
											)}
										</div>

										<span
											className={`font-serif font-normal tracking-[0.04em] leading-none text-2xl md:text-3xl shrink-0 w-12 md:w-16 whitespace-nowrap transition-colors duration-300 ${
												i === active ? "text-gold" : "text-gold/55 md:text-cream/85"
											}`}>
											{it.year}
										</span>

										<div className="min-w-0 flex-1">
											<div
												className={`font-serif font-light leading-snug text-xl md:text-xl transition-colors duration-300 ${
													i === active ? "text-cream" : "text-cream/90 md:text-cream/90"
												}`}>
												{it.title}
											</div>
											<div className="font-sans font-normal uppercase tracking-[0.22em] text-cream/90 text-[0.616rem] md:text-[0.672rem] mt-1.5">
												{it.by_line}
											</div>
										</div>

										<span
											aria-hidden
											className={`shrink-0 text-gold transition-all duration-300 ${
												i === active
													? "md:opacity-100 md:translate-x-0"
													: "md:opacity-0 md:-translate-x-2"
											} opacity-40`}>
											→
										</span>
									</button>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>

			{open &&
				createPortal(
					<div
						ref={panelRef}
						className="fixed inset-0 z-200 overflow-y-auto bg-plum-dark"
						style={{ clipPath: "inset(0% 0% 100% 0%)" }}>
						<div className="mx-auto flex min-h-full max-w-7xl flex-col px-6 sm:px-10 md:px-16 py-12 sm:py-16 md:py-20">
							<div className="am-static mb-9 flex items-start justify-between gap-5 sm:mb-12 md:mb-14">
								<div>
									<div className="font-sans font-normal uppercase tracking-[0.32em] sm:tracking-[0.42em] text-gold text-[0.65rem] md:text-sm mb-3 md:mb-4">
										{achievements.eyebrow}
									</div>
									<h2 className="font-bdscript text-cream leading-none text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
										{achievements.title}
									</h2>
								</div>
								<CloseButton onClick={close} />
							</div>

							<div className="flex flex-1 flex-col items-center justify-center text-center">
								<div className="w-full max-w-2xl">
									<div
										ref={imgRef}
										className="relative aspect-3/2 w-full overflow-hidden border border-cream/10 bg-plum-dark">
										{d.img && (
											<Image
												key={d.img}
												src={d.img}
												alt={d.title}
												fill
												sizes="(max-width: 768px) 90vw, 672px"
												className="object-cover"
											/>
										)}
									</div>

									<div
										ref={bodyRef}
										className="mt-8 md:mt-10 flex flex-col items-center">
										<div className="flex items-center gap-3">
											<span className="bg-gold px-2.5 py-1 font-sans font-normal text-plum-dark text-[0.672rem] tracking-[0.16em] tabular-nums">
												{d.year}
											</span>
											<span className="font-sans font-normal uppercase tracking-[0.24em] text-cream/90 text-[0.672rem]">
												{d.by_line}
											</span>
										</div>
										<h3 className="mt-5 font-serif font-light text-cream text-3xl md:text-4xl leading-[1.12] max-w-2xl">
											{d.title}
										</h3>
										<span className="mt-5 block h-px w-10 bg-gold/60" />
										<p className="mt-5 font-sans font-normal text-cream/88 text-lg md:text-xl leading-relaxed max-w-xl">
											{d.description}
										</p>
									</div>
								</div>
							</div>

							<div className="am-static mt-10 md:mt-14 flex items-center justify-between border-t border-cream/10 pt-6">
								<button
									type="button"
									onClick={() =>
										setDetail((x) => (x === null ? x : (x - 1 + n) % n))
									}
									className="group cursor-pointer inline-flex items-center gap-2 font-sans font-normal uppercase tracking-[0.24em] text-cream/90 transition-colors duration-300 hover:text-gold text-[0.672rem] md:text-sm">
									<span className="transition-transform duration-300 group-hover:-translate-x-1">
										←
									</span>
									<span className="ulink">Prev</span>
								</button>
								<div className="font-sans font-normal tracking-[0.2em] text-cream/85 text-[0.672rem] md:text-sm tabular-nums">
									{String((detail ?? 0) + 1).padStart(2, "0")} /{" "}
									{String(n).padStart(2, "0")}
								</div>
								<button
									type="button"
									onClick={() => setDetail((x) => (x === null ? x : (x + 1) % n))}
									className="group cursor-pointer inline-flex items-center gap-2 font-sans font-normal uppercase tracking-[0.24em] text-cream/90 transition-colors duration-300 hover:text-gold text-[0.672rem] md:text-sm">
									<span className="ulink">Next</span>
									<span className="transition-transform duration-300 group-hover:translate-x-1">
										→
									</span>
								</button>
							</div>
						</div>
					</div>,
					document.body,
				)}
		</div>
	);
}
