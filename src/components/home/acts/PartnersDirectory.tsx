"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { CloseButton } from "@/components/shared/CloseButton";
import type { PartnerCategory } from "@/lib/cms/types";

export function PartnersDirectory({
	categories,
}: {
	categories: PartnerCategory[];
}) {
	const [open, setOpen] = useState(false);
	const panelRef = useRef<HTMLDivElement>(null);

	const close = () => {
		document.body.style.overflow = "";
		if (!panelRef.current) {
			setOpen(false);
			return;
		}
		gsap.to(panelRef.current, {
			clipPath: "inset(100% 0% 0% 0%)",
			duration: 0.55,
			ease: "expo.inOut",
			onComplete: () => setOpen(false),
		});
	};

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
			".pd-col",
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
		return () => window.removeEventListener("keydown", onKey);
	}, [open]);

	return (
		<>
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="group mt-8 inline-flex w-fit cursor-pointer items-center gap-3 border border-gold/40 px-6 py-3 font-sans font-normal uppercase tracking-[0.28em] text-gold text-[0.694rem] md:text-sm transition-colors duration-500 hover:bg-gold hover:text-plum-dark">
				View All Partners
				<span className="transition-transform duration-500 group-hover:translate-x-1">
					&rarr;
				</span>
			</button>

			{open &&
				createPortal(
					<div
						ref={panelRef}
						className="fixed inset-0 z-200 overflow-y-auto bg-plum-dark"
						style={{ clipPath: "inset(0% 0% 100% 0%)" }}>
						<div className="mx-auto min-h-full max-w-7xl px-6 sm:px-10 md:px-16 py-12 sm:py-16 md:py-20">
							<div className="mb-9 flex items-start justify-between gap-5 sm:mb-12 md:mb-16">
								<div>
									<div className="font-sans font-normal uppercase tracking-[0.32em] sm:tracking-[0.42em] text-gold text-[0.65rem] md:text-sm mb-3 md:mb-4">
										Our Network
									</div>
									<h2 className="font-bdscript text-cream leading-none text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
										Trusted Houses
									</h2>
								</div>
								<CloseButton onClick={close} />
							</div>

							<div className="grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-12 md:grid-cols-4">
								{categories.map((cat) => (
									<div key={cat.id} className="pd-col">
										<h3 className="font-serif italic font-light text-gold text-xl sm:text-xl md:text-2xl mb-3 md:mb-4">
											{cat.category}
										</h3>
										<ul className="flex flex-col gap-2 sm:gap-2.5">
											{cat.brands.map((b) => (
												<li
													key={b}
													className="font-sans font-normal text-cream/90 text-[0.918rem] sm:text-base md:text-lg">
													{b}
												</li>
											))}
										</ul>
									</div>
								))}
							</div>
						</div>
					</div>,
					document.body,
				)}
		</>
	);
}
