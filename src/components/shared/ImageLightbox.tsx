"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CloseButton } from "@/components/shared/CloseButton";

function LightboxImage({ src }: { src: string }) {
	const [loaded, setLoaded] = useState(false);
	return (
		<>
			<Image
				src={src}
				alt=""
				fill
				sizes="88vw"
				onLoad={() => setLoaded(true)}
				className={`object-contain transition-opacity duration-500 ${
					loaded ? "opacity-100" : "opacity-0"
				}`}
			/>
			{!loaded && (
				<div className="absolute inset-0 flex items-center justify-center">
					<span className="h-8 w-8 animate-spin rounded-full border-2 border-cream/20 border-t-gold" />
				</div>
			)}
		</>
	);
}

export function useImageLightbox(
	urls: string[],
	opts: { nav?: boolean } = {},
) {
	const nav = opts.nav ?? true;
	const [index, setIndex] = useState<number | null>(null);

	const close = () => setIndex(null);
	const prev = () =>
		setIndex((i) => (i === null ? null : (i - 1 + urls.length) % urls.length));
	const next = () =>
		setIndex((i) => (i === null ? null : (i + 1) % urls.length));

	useEffect(() => {
		if (index === null) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") close();
			else if (nav && e.key === "ArrowLeft") prev();
			else if (nav && e.key === "ArrowRight") next();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [index, urls.length, nav]);

	const active = index === null ? null : (urls[index] ?? null);

	const modal = active && (
		<div
			className="fixed inset-0 z-120 flex items-center justify-center bg-plum-dark/95 p-6 animate-[auth-fade-in_0.25s_ease]"
			onClick={close}
			role="dialog"
			aria-modal="true"
		>
			<div
				className="relative h-[88vh] w-[88vw]"
				onClick={(e) => e.stopPropagation()}
			>
				<LightboxImage key={active} src={active} />
			</div>

			{nav && urls.length > 1 && (
				<>
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							prev();
						}}
						aria-label="Previous"
						className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-cream/30 bg-plum-dark/40 text-cream/80 text-2xl leading-none backdrop-blur-sm transition-colors hover:border-gold hover:text-gold md:left-8"
					>
						&#8249;
					</button>
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							next();
						}}
						aria-label="Next"
						className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-cream/30 bg-plum-dark/40 text-cream/80 text-2xl leading-none backdrop-blur-sm transition-colors hover:border-gold hover:text-gold md:right-8"
					>
						&#8250;
					</button>
					<div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-sans uppercase tracking-[0.3em] text-cream/70 text-[0.7rem] tabular-nums">
						{index! + 1} / {urls.length}
					</div>
				</>
			)}

			<CloseButton
				onClick={close}
				className="absolute top-6 right-6 z-10"
			/>
		</div>
	);

	return { open: (i: number) => setIndex(i), modal };
}
