"use client";

import { useEffect, useRef, useState } from "react";
import { getSectionAnchors } from "@/lib/sectionNav";
import { getLenis } from "@/lib/smoothScroll";

export default function ScrollCue() {
	const ref = useRef<HTMLButtonElement>(null);
	const barRef = useRef<HTMLDivElement>(null);
	const targetRef = useRef(0);
	const [show, setShow] = useState(false);
	const [label, setLabel] = useState("Scroll to Begin");
	const [up, setUp] = useState(false);
	const [dark, setDark] = useState(true);

	useEffect(() => {
		let raf = 0;
		const compute = () => {
			const lenis = getLenis();
			const cur = lenis
				? lenis.scroll
				: (document.scrollingElement?.scrollTop ?? window.scrollY);
			const max = document.documentElement.scrollHeight - window.innerHeight;
			if (barRef.current) {
				const p = max > 0 ? Math.min(1, Math.max(0, cur / max)) : 0;
				barRef.current.style.transform = `scaleX(${p})`;
			}

			const sections = getSectionAnchors();
			const last = sections[sections.length - 1] ?? 0;
			const hasFooter =
				sections.length > 0 &&
				!!document.querySelector("footer") &&
				max > last + 80;
			const stops = hasFooter ? [...sections, max] : sections;
			const next = stops.find((a) => a > cur + 12) ?? null;
			const atBottom = next == null;
			targetRef.current = next ?? 0;
			const vis = sections.length > 0;
			setShow((p) => (p === vis ? p : vis));
			setUp((p) => (p === atBottom ? p : atBottom));
			const lab = atBottom
				? "Back to Top"
				: cur < window.innerHeight * 0.85
					? "Scroll to Begin"
					: "Continue";
			setLabel((p) => (p === lab ? p : lab));

			const el = ref.current;
			if (el) {
				el.style.visibility = "hidden";
				const stack = document.elementsFromPoint(
					window.innerWidth - 48,
					window.innerHeight - 48,
				);
				el.style.visibility = "";
				let lum = 0.15;
				for (const node of stack) {
					const m = getComputedStyle(node).backgroundColor.match(/[\d.]+/g);
					if (m && (m[3] === undefined || +m[3] > 0.3)) {
						lum = (0.299 * +m[0] + 0.587 * +m[1] + 0.114 * +m[2]) / 255;
						break;
					}
				}
				const isDark = lum < 0.55;
				setDark((p) => (p === isDark ? p : isDark));
			}
		};
		const onScroll = () => {
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(compute);
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onScroll);
		compute();
		const poll = window.setInterval(compute, 500);
		const stop = window.setTimeout(() => clearInterval(poll), 8000);
		return () => {
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onScroll);
			cancelAnimationFrame(raf);
			clearInterval(poll);
			clearTimeout(stop);
		};
	}, []);

	const onClick = () => {
		const lenis = getLenis();
		const target = targetRef.current;
		if (!lenis) {
			window.scrollTo({ top: target, behavior: "smooth" });
			return;
		}
		const dist = Math.abs(target - lenis.scroll);
		const dur = Math.min(2.6, Math.max(1.1, dist / window.innerHeight) * 0.7);
		lenis.scrollTo(target, { duration: dur, lock: true });
	};

	const text = dark ? "text-cream/45" : "text-plum-dark/55";
	const line = dark ? "bg-cream/35" : "bg-plum-dark/35";
	const arrow = dark ? "border-cream/55" : "border-plum-dark/55";

	return (
		<>
			<div className="fixed top-0 left-0 right-0 h-[2px] z-[70] bg-cream/10 pointer-events-none">
				<div
					ref={barRef}
					className="h-full origin-left bg-gold"
					style={{ transform: "scaleX(0)" }}
				/>
			</div>

			<button
				ref={ref}
				type="button"
				onClick={onClick}
				aria-label="Scroll"
				className={`group fixed bottom-10 right-10 z-[55] hidden md:flex items-center gap-4 rotate-90 origin-right cursor-pointer transition-opacity duration-500 ${show ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
				<span
					key={label}
					className={`font-sans font-light uppercase tracking-[0.4em] text-[0.7rem] whitespace-nowrap transition-colors duration-300 group-hover:text-gold motion-safe:animate-[cue-text-in_0.55s_cubic-bezier(0.65,0,0.35,1)_both] ${text}`}>
					{label}
				</span>
				<span
					aria-hidden
					className={`relative block w-12 h-px transition-[background-color,transform] duration-500 group-hover:bg-gold ${line} ${up ? "rotate-180" : ""}`}>
					<span
						className={`absolute right-0 top-1/2 w-[7px] h-[7px] border-t border-r transition-colors duration-300 group-hover:border-gold motion-safe:animate-[cue-arrow_1.8s_cubic-bezier(0.65,0,0.35,1)_infinite] ${arrow}`}
					/>
				</span>
			</button>
		</>
	);
}
