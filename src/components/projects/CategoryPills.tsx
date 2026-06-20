"use client";

import { useRef, useLayoutEffect, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import {
	PROJECT_CATEGORIES,
	type ProjectCategory,
} from "@/lib/data/projects";

interface Props {
	active: ProjectCategory | null;
	onSelect: (cat: ProjectCategory) => void;
	className?: string;
}

export function CategoryPills({ active, onSelect, className = "" }: Props) {
	const indicatorRef = useRef<HTMLSpanElement>(null);
	const pillsRef = useRef<(HTMLButtonElement | null)[]>([]);
	const mounted = useRef(false);

	const move = useCallback((animate: boolean) => {
		const indicator = indicatorRef.current;
		if (!indicator) return;
		const idx = PROJECT_CATEGORIES.findIndex((c) => c.id === active);
		const pill = idx >= 0 ? pillsRef.current[idx] : null;
		if (!pill || !pill.parentElement) {
			gsap.to(indicator, { autoAlpha: 0, duration: 0.3, overwrite: true });
			return;
		}
		const r = pill.getBoundingClientRect();
		const pr = pill.parentElement.getBoundingClientRect();
		const x = r.left - pr.left;
		const w = r.width;
		if (!animate) {
			gsap.set(indicator, { x, width: w, autoAlpha: 1 });
			return;
		}
		gsap.to(indicator, {
			x,
			width: w,
			autoAlpha: 1,
			duration: 0.7,
			ease: "expo.out",
			overwrite: true,
		});
	}, [active]);

	useLayoutEffect(() => {
		move(mounted.current);
		mounted.current = true;
	}, [move]);

	useEffect(() => {
		const onResize = () => move(false);
		window.addEventListener("resize", onResize);
		if (document.fonts?.ready) {
			document.fonts.ready.then(() => move(false)).catch(() => {});
		}
		return () => window.removeEventListener("resize", onResize);
	}, [move]);

	return (
		<div className={`relative flex items-center gap-0 ${className}`}>
			<span
				ref={indicatorRef}
				aria-hidden
				className="absolute bottom-0 left-0 h-px bg-gold origin-left pointer-events-none"
				style={{ width: 0 }}
			/>
			{PROJECT_CATEGORIES.map((cat, i) => (
				<button
					key={cat.id}
					ref={(el) => {
						pillsRef.current[i] = el;
					}}
					onClick={() => onSelect(cat.id)}
					className="group relative cursor-pointer whitespace-nowrap overflow-hidden px-3 sm:px-5 md:px-7 pb-2.5 pt-0.5 font-sans font-normal uppercase tracking-[0.16em] sm:tracking-[0.24em] md:tracking-[0.3em] text-[0.739rem] sm:text-[0.829rem] md:text-[0.918rem]">
					<span
						className={`block transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-y-[-140%] ${
							active === cat.id ? "text-cream" : "text-cream/90"
						}`}>
						{cat.label}
					</span>
					<span
						aria-hidden
						className="absolute inset-0 flex items-start justify-center px-3 sm:px-5 md:px-7 pt-0.5 translate-y-[140%] text-gold transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-y-0">
						{cat.label}
					</span>
				</button>
			))}
		</div>
	);
}
