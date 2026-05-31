"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";

const BIG = "404";

export default function NotFound() {
	const rootRef = useRef<HTMLDivElement>(null);
	const bigChars = useRef<(HTMLSpanElement | null)[]>([]);
	const eyebrowRef = useRef<HTMLDivElement>(null);
	const ruleRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLDivElement>(null);
	const bodyRef = useRef<HTMLParagraphElement>(null);
	const ctaWrapRef = useRef<HTMLDivElement>(null);
	const ctaRef = useRef<HTMLAnchorElement>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			gsap.set(bigChars.current, {
				rotateX: -82,
				y: 70,
				scale: 0.92,
				autoAlpha: 0,
				filter: "blur(10px)",
				transformPerspective: 1200,
				transformOrigin: "50% 100%",
			});
			gsap.set(eyebrowRef.current, { y: -18, autoAlpha: 0, filter: "blur(4px)" });
			gsap.set(ruleRef.current, { scaleX: 0, transformOrigin: "center" });
			gsap.set(titleRef.current, { y: 24, autoAlpha: 0, filter: "blur(5px)" });
			gsap.set(bodyRef.current, { y: 20, autoAlpha: 0, filter: "blur(4px)" });
			gsap.set(ctaWrapRef.current, { y: 18, autoAlpha: 0 });

			// Cascade is timed to begin as the page-transition overlay lifts
			// (~0.55s after mount) so it reveals WITH the page, not after it.
			// Kept moderately tight so it doesn't trail long once the page is shown.
			const tl = gsap.timeline({ delay: 0.55, defaults: { ease: "power3.out" } });
			tl.to(eyebrowRef.current, {
				y: 0,
				autoAlpha: 1,
				filter: "blur(0px)",
				duration: 0.7,
				ease: "expo.out",
			})
				.to(
					bigChars.current,
					{
						rotateX: 0,
						y: 0,
						scale: 1,
						autoAlpha: 1,
						filter: "blur(0px)",
						duration: 1.0,
						ease: "power3.out",
						stagger: 0.13,
					},
					"-=0.4",
				)
				.to(
					ruleRef.current,
					{ scaleX: 1, duration: 0.7, ease: "expo.inOut" },
					"-=0.5",
				)
				.to(
					titleRef.current,
					{ y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.7 },
					"-=0.45",
				)
				.to(
					bodyRef.current,
					{ y: 0, autoAlpha: 1, filter: "blur(0px)", duration: 0.6 },
					"-=0.45",
				)
				.to(
					ctaWrapRef.current,
					{ y: 0, autoAlpha: 1, duration: 0.55 },
					"-=0.35",
				);

			const el = ctaRef.current;
			if (el) {
				let hovering = false;
				const onEnter = () => { hovering = true; };
				const onMove = (e: MouseEvent) => {
					if (!hovering) return;
					const r = el.getBoundingClientRect();
					const dx = e.clientX - r.left - r.width / 2;
					const dy = e.clientY - r.top - r.height / 2;
					gsap.to(el, { x: dx * 0.3, y: dy * 0.45, duration: 0.45, ease: "power3.out" });
				};
				const onLeave = () => {
					hovering = false;
					gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1.1, 0.45)" });
				};
				el.addEventListener("mouseenter", onEnter);
				el.addEventListener("mousemove", onMove);
				el.addEventListener("mouseleave", onLeave);
			}
		}, rootRef);

		return () => ctx.revert();
	}, []);

	return (
		<main
			ref={rootRef}
			className="relative min-h-dvh w-full overflow-hidden bg-plum-dark grid place-items-center text-center px-6 py-16">
			<div className="relative z-10 flex flex-col items-center">
				<div
					ref={eyebrowRef}
					className="font-sans font-light uppercase tracking-[0.55em] text-cream/40 text-[0.7rem] sm:text-xs mb-7 sm:mb-9 pl-[0.55em] opacity-0">
					Off the Floorplan
				</div>

				<div
					className="font-serif font-light text-gold leading-none tracking-[-0.01em] text-[7rem] sm:text-[11rem] md:text-[15rem] lg:text-[17rem] flex items-end justify-center"
					style={{ perspective: "1200px" }}>
					{BIG.split("").map((c, i) => (
						<span
							key={i}
							ref={(el) => { bigChars.current[i] = el; }}
							className="inline-block will-change-transform opacity-0"
							style={{ transformOrigin: "50% 100%", backfaceVisibility: "hidden" }}>
							{c}
						</span>
					))}
				</div>

				<div
					ref={ruleRef}
					className="w-16 sm:w-20 h-px bg-gold/60 my-7 sm:my-9"
					style={{ transform: "scaleX(0)" }}
				/>

				<div
					ref={titleRef}
					className="font-serif font-light text-cream tracking-[-0.01em] text-2xl sm:text-3xl md:text-4xl leading-tight mb-4 sm:mb-5 opacity-0">
					This space hasn&apos;t been designed.
				</div>

				<p
					ref={bodyRef}
					className="font-sans font-light text-cream/55 max-w-md text-sm sm:text-base leading-relaxed mb-9 sm:mb-11 opacity-0">
					The page you&apos;re looking for was never drawn. Let&apos;s walk you
					back to rooms that exist.
				</p>

				<div ref={ctaWrapRef} className="inline-block opacity-0">
					<Link
						ref={ctaRef}
						href="/"
						className="group inline-flex items-center gap-3 px-8 py-4 font-sans font-light text-xs sm:text-sm uppercase tracking-[0.28em] bg-gold text-plum-dark transition-[gap] duration-500 hover:gap-5 will-change-transform">
						Return Home
						<span className="transition-transform duration-500 group-hover:translate-x-1">
							→
						</span>
					</Link>
				</div>
			</div>
		</main>
	);
}
