"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import Cropper, { type Area, type MediaSize } from "react-easy-crop";
import { uploadImage, deleteImage } from "@/app/admin/media-actions";
import {
	ORIGINAL,
	RATIO_PRESETS,
	resolveAspect,
	type RatioOption,
} from "@/lib/aspect";

export interface ImageMeta {
	aspect: number;
}

interface Props {
	value: string | null;
	onChange: (url: string | null, meta?: ImageMeta) => void;
	folder: string;
	aspect?: string | number;
	className?: string;
}

const RATIOS: RatioOption[] = [
	{ label: "Original", value: ORIGINAL },
	...RATIO_PRESETS,
];

function mimeFromName(name: string): string {
	const ext = name.split("?")[0]!.split(".").pop()?.toLowerCase() ?? "";
	if (ext === "png") return "image/png";
	if (ext === "webp") return "image/webp";
	return "image/jpeg";
}

function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new window.Image();
		img.crossOrigin = "anonymous";
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = src;
	});
}

async function getCroppedBlob(
	src: string,
	area: Area,
	mime: string,
): Promise<Blob> {
	const img = await loadImage(src);
	const canvas = document.createElement("canvas");
	canvas.width = Math.round(area.width);
	canvas.height = Math.round(area.height);
	const ctx = canvas.getContext("2d")!;
	ctx.drawImage(
		img,
		area.x,
		area.y,
		area.width,
		area.height,
		0,
		0,
		area.width,
		area.height,
	);
	return new Promise((resolve, reject) =>
		canvas.toBlob(
			(b) => (b ? resolve(b) : reject(new Error("crop failed"))),
			mime,
			0.92,
		),
	);
}

const overlayBtnCls =
	"w-[78%] cursor-pointer border border-cream/60 bg-plum-dark/50 px-3 py-1.5 text-center font-sans font-light uppercase tracking-[0.2em] text-cream text-[0.6rem] transition-colors hover:border-gold hover:text-gold";

export function ImageUploader({
	value,
	onChange,
	folder,
	aspect = "aspect-[4/3]",
	className = "",
}: Props) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [busy, setBusy] = useState(false);
	const [drag, setDrag] = useState(false);
	const [error, setError] = useState("");

	const [cropSrc, setCropSrc] = useState<string | null>(null);
	const cropMime = useRef("image/jpeg");
	const cropIsBlob = useRef(false);
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [areaPixels, setAreaPixels] = useState<Area | null>(null);
	const [naturalRatio, setNaturalRatio] = useState(0);

	const layout = useMemo(() => resolveAspect(aspect), [aspect]);
	const [choice, setChoice] = useState(layout.value);

	const options = useMemo(() => {
		const known = RATIOS.some(
			(r) => r.value !== ORIGINAL && Math.abs(r.value - layout.value) < 0.02,
		);
		return known ? RATIOS : [RATIOS[0]!, layout, ...RATIOS.slice(1)];
	}, [layout]);

	const ratio = choice === ORIGINAL ? naturalRatio || layout.value : choice;
	const boxCls = typeof aspect === "string" ? aspect : "";
	const boxStyle =
		typeof aspect === "number" ? { aspectRatio: String(aspect) } : undefined;

	const upload = async (file: File, meta: ImageMeta) => {
		setBusy(true);
		setError("");
		const fd = new FormData();
		fd.set("file", file);
		fd.set("folder", folder);
		const res = await uploadImage(fd);
		setBusy(false);
		if (res.error) setError(res.error);
		else if (res.url) onChange(res.url, meta);
	};

	const openCrop = (src: string, mime: string, isBlob: boolean) => {
		cropMime.current = mime;
		cropIsBlob.current = isBlob;
		setCrop({ x: 0, y: 0 });
		setZoom(1);
		setAreaPixels(null);
		setNaturalRatio(0);
		setChoice(layout.value);
		setCropSrc(src);
	};

	const cancelCrop = () => {
		if (cropSrc && cropIsBlob.current) URL.revokeObjectURL(cropSrc);
		setCropSrc(null);
	};

	const applyCrop = async () => {
		if (!cropSrc || !areaPixels) return;
		const mime = cropMime.current;
		const ext =
			mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg";
		try {
			const blob = await getCroppedBlob(cropSrc, areaPixels, mime);
			const file = new File([blob], `image.${ext}`, { type: mime });
			const cropped = areaPixels.width / areaPixels.height;
			cancelCrop();
			await upload(file, { aspect: cropped });
		} catch {
			setError("Could not process the image.");
			cancelCrop();
		}
	};

	const remove = async () => {
		const old = value;
		onChange(null);
		if (old) await deleteImage(old);
	};

	return (
		<div className={className}>
			{value ? (
				<div
					className={`group relative w-full ${boxCls} overflow-hidden rounded-sm border border-cream/10`}
					style={boxStyle}>
					<Image src={value} alt="" fill className="object-cover" />
					<div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-plum-dark/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
						<button
							type="button"
							onClick={() => inputRef.current?.click()}
							className={overlayBtnCls}>
							Replace
						</button>
						<button
							type="button"
							onClick={() =>
								openCrop(value, mimeFromName(value), false)
							}
							className={overlayBtnCls}>
							Crop
						</button>
						<button type="button" onClick={remove} className={overlayBtnCls}>
							Remove
						</button>
					</div>
				</div>
			) : (
				<button
					type="button"
					onClick={() => inputRef.current?.click()}
					onDragOver={(e) => {
						e.preventDefault();
						setDrag(true);
					}}
					onDragLeave={() => setDrag(false)}
					onDrop={(e) => {
						e.preventDefault();
						setDrag(false);
						const f = e.dataTransfer.files?.[0];
						if (f) openCrop(URL.createObjectURL(f), f.type, true);
					}}
					style={boxStyle}
					className={`flex w-full ${boxCls} cursor-pointer flex-col items-center justify-center gap-2 rounded-sm border border-dashed text-center transition-colors ${
						drag
							? "border-gold bg-gold/5"
							: "border-cream/20 hover:border-cream/40"
					}`}>
					<span className="font-sans font-light text-cream/82 text-sm">
						{busy ? "Uploading…" : "Drag & drop or click to upload"}
					</span>
					<span className="font-sans font-light text-cream/30 text-[0.62rem]">
						JPG · PNG · WebP · AVIF - max 8MB
					</span>
				</button>
			)}

			<input
				ref={inputRef}
				type="file"
				accept="image/jpeg,image/png,image/webp,image/avif"
				className="hidden"
				onChange={(e) => {
					const f = e.target.files?.[0];
					if (f) openCrop(URL.createObjectURL(f), f.type, true);
					e.target.value = "";
				}}
			/>
			{error && <p className="mt-2 font-sans text-sm text-gold">{error}</p>}

			{cropSrc &&
				createPortal(
					<div className="fixed inset-0 z-130 flex flex-col bg-plum-dark/95 p-4 md:p-8">
						<div className="mx-auto mb-4 font-sans font-light uppercase tracking-[0.3em] text-gold text-[0.66rem]">
							Adjust image
						</div>

						<div className="mx-auto mb-4 flex w-full max-w-3xl flex-wrap items-center gap-2">
							<span className="mr-1 font-sans font-light uppercase tracking-[0.2em] text-cream/70 text-[0.6rem]">
								Ratio
							</span>
							{options.map((r) => (
								<button
									key={r.label}
									type="button"
									onClick={() => setChoice(r.value)}
									className={`cursor-pointer border px-3 py-1.5 font-sans font-light uppercase tracking-[0.16em] text-[0.6rem] transition-colors ${
										choice === r.value
											? "border-gold bg-gold/10 text-gold"
											: "border-cream/20 text-cream/70 hover:border-gold hover:text-gold"
									}`}>
									{r.label}
								</button>
							))}
						</div>

						<div className="relative mx-auto w-full max-w-3xl flex-1 overflow-hidden rounded-sm bg-plum">
							<Cropper
								image={cropSrc}
								crop={crop}
								zoom={zoom}
								aspect={ratio}
								onCropChange={setCrop}
								onZoomChange={setZoom}
								onCropComplete={(_, a) => setAreaPixels(a)}
								onMediaLoaded={(m: MediaSize) =>
									setNaturalRatio(m.naturalWidth / m.naturalHeight)
								}
							/>
						</div>

						<p className="mx-auto mt-3 w-full max-w-3xl font-sans font-light text-cream/60 text-[0.68rem]">
							{layout.label} matches how this image is displayed on the site.
						</p>

						<div className="mx-auto mt-3 flex w-full max-w-3xl flex-wrap items-center gap-4">
							<span className="font-sans font-light uppercase tracking-[0.2em] text-cream/70 text-[0.6rem]">
								Zoom
							</span>
							<input
								type="range"
								min={1}
								max={4}
								step={0.01}
								value={zoom}
								onChange={(e) => setZoom(Number(e.target.value))}
								className="min-w-40 flex-1 cursor-pointer accent-gold"
							/>
							<button
								type="button"
								onClick={cancelCrop}
								className="cursor-pointer border border-cream/40 px-5 py-2 font-sans font-light uppercase tracking-[0.2em] text-cream/80 text-[0.6rem] transition-colors hover:border-gold hover:text-gold">
								Cancel
							</button>
							<button
								type="button"
								onClick={applyCrop}
								className="cta-gold cursor-pointer bg-gold px-6 py-2 font-sans font-light uppercase tracking-[0.2em] text-plum-dark text-[0.6rem]">
								Use crop
							</button>
						</div>
					</div>,
					document.body,
				)}
		</div>
	);
}
