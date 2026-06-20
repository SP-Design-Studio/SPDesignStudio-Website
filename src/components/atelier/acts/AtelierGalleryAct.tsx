"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { AtelierImage } from "@/lib/atelier";

function Tile({
	img,
	assignRef,
	onOpen,
}: {
	img: AtelierImage;
	assignRef: (el: HTMLButtonElement | null) => void;
	onOpen: (img: AtelierImage) => void;
}) {
	const [status, setStatus] = useState<"loading" | "loaded" | "error">(
		"loading",
	);

	if (status === "error") return null;

	return (
		<button
			ref={assignRef}
			type="button"
			data-atelier-tile
			onClick={() => onOpen(img)}
			className="group relative block aspect-4/5 w-full cursor-pointer overflow-hidden rounded-sm border border-cream/10 bg-plum"
		>
			<Image
				src={img.url}
				alt=""
				fill
				sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
				onLoad={() => setStatus("loaded")}
				onError={() => setStatus("error")}
				className={`object-cover transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 ${
					status === "loaded" ? "opacity-100" : "opacity-0"
				}`}
			/>
			{status !== "loaded" && (
				<div className="absolute inset-0 overflow-hidden bg-plum">
					<div className="absolute inset-y-0 left-0 w-1/2 bg-linear-to-r from-transparent via-gold/10 to-transparent animate-[auth-sweep_1.9s_ease-in-out_infinite]" />
				</div>
			)}
		</button>
	);
}

interface Props {
	images: AtelierImage[];
	itemsRef: React.RefObject<(HTMLButtonElement | null)[]>;
}

export function AtelierGalleryAct({ images, itemsRef }: Props) {
	const [active, setActive] = useState<AtelierImage | null>(null);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);

	return (
		<section className="bg-plum-dark px-6 pt-8 pb-28 md:px-12">
			{images.length === 0 ? (
				<p className="text-center font-sans text-cream/80 text-sm">
					New images coming soon.
				</p>
			) : (
				<div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
					{images.map((img, i) => (
						<Tile
							key={img.id}
							img={img}
							assignRef={(el) => {
								itemsRef.current[i] = el;
							}}
							onOpen={setActive}
						/>
					))}
				</div>
			)}

			{active && (
				<div
					className="fixed inset-0 z-120 flex items-center justify-center bg-plum-dark/95 p-6 animate-[auth-fade-in_0.25s_ease]"
					onClick={() => setActive(null)}
					role="dialog"
					aria-modal="true"
				>
					<div
						className="relative h-[90vh] w-[92vw]"
						onClick={(e) => e.stopPropagation()}
					>
						<Image
							src={active.url}
							alt=""
							fill
							sizes="92vw"
							className="object-contain"
						/>
					</div>
					<button
						type="button"
						onClick={() => setActive(null)}
						aria-label="Close"
						className="absolute top-6 right-6 cursor-pointer text-cream/80 text-3xl leading-none transition-colors hover:text-gold"
					>
						&times;
					</button>
				</div>
			)}
		</section>
	);
}
