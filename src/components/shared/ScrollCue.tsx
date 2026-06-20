"use client";

import { useEffect, useRef, useState } from "react";
import { getSectionAnchors } from "@/lib/sectionNav";
import { getLenis } from "@/lib/smoothScroll";

export default function ScrollCue() {
	const barRef = useRef<HTMLDivElement>(null);
	const ref = useRef<HTMLButtonElement>(null);
	const targetRef = useRef(0);
	const [label, setLabel] = useState("Scroll to Begin");
	const [up, setUp] = useState(false);
	const [dark, setDark] = useState(true);
	const [show, setShow] = useState(false);

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
			setShow((s) => {
				const v = stops.length > 0 && max > 80;
				return s === v ? s : v;
			});

			const nextIdx = stops.findIndex((sp) => sp > cur + 40);
			const atEnd = nextIdx === -1;
			targetRef.current = atEnd ? 0 : stops[nextIdx];
			setUp((u) => (u === atEnd ? u : atEnd));
			const nl =
				cur < window.innerHeight * 0.85
					? "Scroll to Begin"
					: atEnd
						? "Back to Top"
						: "Continue";
			setLabel((l) => (l === nl ? l : nl));

			const btn = ref.current;
			if (btn) {
				btn.style.visibility = "hidden";
				const stack = document.elementsFromPoint(
					window.innerWidth - 44,
					window.innerHeight - 44,
				);
				btn.style.visibility = "";
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
		const t = targetRef.current;
		const lenis = getLenis();
		if (!lenis) {
			window.scrollTo({ top: t, behavior: "smooth" });
			return;
		}
		const dist = Math.abs(t - lenis.scroll);
		const dur = Math.min(2.6, Math.max(1.1, dist / window.innerHeight) * 0.7);
		lenis.scrollTo(t, { duration: dur, lock: true, force: true });
	};

	const text = dark ? "text-cream/85" : "text-plum-dark/80";
	const arrow = dark ? "text-cream/85" : "text-plum-dark/80";

	return (
		<>
			<div className="fixed top-0 left-0 right-0 h-0.5 z-70 bg-cream/10 pointer-events-none">
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
				className={`group fixed bottom-10 right-10 z-55 hidden md:flex items-center gap-4 rotate-90 origin-right cursor-pointer transition-opacity duration-500 ${show ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
				<span
					key={label}
					className={`font-sans font-normal uppercase tracking-[0.4em] text-[0.784rem] whitespace-nowrap transition-colors duration-300 group-hover:text-gold motion-safe:animate-[cue-text-in_0.55s_cubic-bezier(0.65,0,0.35,1)_both] ${text}`}>
					{label}
				</span>
				<span
					aria-hidden
					className={`flex items-center transition-transform duration-500 ${up ? "rotate-180" : ""}`}>
					<svg
						aria-hidden
						viewBox="0 0 56 14"
						fill="none"
						className={`w-14 h-3.5 will-change-transform transition-colors duration-300 group-hover:text-gold motion-safe:animate-[cue-arrow_2.4s_cubic-bezier(0.45,0,0.55,1)_infinite] ${arrow}`}>
						<path
							d="M0 7 H48"
							stroke="currentColor"
							strokeWidth="1.2"
							strokeLinecap="round"
							strokeOpacity="0.5"
						/>
						<path
							d="M42 2.5 L48 7 L42 11.5"
							stroke="currentColor"
							strokeWidth="1.2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</span>
			</button>
		</>
	);
}
