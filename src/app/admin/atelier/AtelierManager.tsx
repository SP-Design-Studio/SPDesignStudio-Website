"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSaving } from "@/lib/admin/saving";
import { uploadImage } from "@/app/admin/media-actions";
import {
	addAtelierImages,
	deleteAtelierImage,
	reorderAtelierImages,
} from "./actions";
import type { AtelierImage } from "@/lib/atelier";

export function AtelierManager({ images }: { images: AtelierImage[] }) {
	const router = useRouter();
	const [pending, start] = useSaving();
	const [order, setOrder] = useState(images);
	const [progress, setProgress] = useState("");
	const fileRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		setOrder(images);
	}, [images]);

	const run = (fn: () => Promise<unknown>) =>
		start(async () => {
			await fn();
			router.refresh();
		});

	const onFiles = (files: FileList | null) => {
		if (!files || files.length === 0) return;
		const list = Array.from(files);
		run(async () => {
			const urls: string[] = [];
			for (let i = 0; i < list.length; i++) {
				setProgress(`Uploading ${i + 1} / ${list.length}…`);
				const fd = new FormData();
				fd.set("file", list[i]!);
				fd.set("folder", "atelier");
				const res = await uploadImage(fd);
				if (res.url) urls.push(res.url);
			}
			setProgress("");
			if (urls.length) await addAtelierImages(urls);
			if (fileRef.current) fileRef.current.value = "";
		});
	};

	const move = (i: number, dir: -1 | 1) => {
		const j = i + dir;
		if (j < 0 || j >= order.length) return;
		const next = [...order];
		[next[i], next[j]] = [next[j]!, next[i]!];
		setOrder(next);
		run(() => reorderAtelierImages(next.map((m) => m.id)));
	};

	return (
		<div className="flex flex-col gap-8">
			<div>
				<input
					ref={fileRef}
					type="file"
					accept="image/jpeg,image/png,image/webp,image/avif"
					multiple
					className="hidden"
					onChange={(e) => onFiles(e.target.files)}
				/>
				<button
					type="button"
					disabled={pending}
					onClick={() => fileRef.current?.click()}
					className="cta-gold cursor-pointer bg-gold px-7 py-2.5 font-sans font-light uppercase tracking-[0.24em] text-plum-dark text-[0.732rem] disabled:opacity-60"
				>
					{pending ? progress || "Uploading…" : "Upload images"}
				</button>
				<p className="mt-2 font-sans font-light text-cream/80 text-[0.7rem]">
					Select multiple images at once. JPG, PNG, WebP, or AVIF.
				</p>
			</div>

			{order.length > 0 && (
				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
					{order.map((img, i) => (
						<div
							key={img.id}
							className="group relative aspect-square overflow-hidden rounded-sm border border-cream/10 bg-plum"
						>
							<Image
								src={img.url}
								alt=""
								fill
								sizes="200px"
								className="object-cover"
							/>
							<div className="absolute inset-0 flex items-center justify-center gap-2 bg-plum-dark/70 opacity-0 transition-opacity group-hover:opacity-100">
								<button
									type="button"
									disabled={pending || i === 0}
									onClick={() => move(i, -1)}
									className="cursor-pointer rounded-full border border-cream/50 bg-plum-dark/50 px-2 py-1 text-cream text-xs hover:border-gold hover:text-gold disabled:opacity-30"
								>
									←
								</button>
								<button
									type="button"
									disabled={pending}
									onClick={() => run(() => deleteAtelierImage(img.id, img.url))}
									className="cursor-pointer rounded-full border border-cream/50 bg-plum-dark/50 px-3 py-1 font-sans uppercase tracking-[0.2em] text-cream text-[0.55rem] hover:border-gold hover:text-gold"
								>
									Delete
								</button>
								<button
									type="button"
									disabled={pending || i === order.length - 1}
									onClick={() => move(i, 1)}
									className="cursor-pointer rounded-full border border-cream/50 bg-plum-dark/50 px-2 py-1 text-cream text-xs hover:border-gold hover:text-gold disabled:opacity-30"
								>
									→
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
