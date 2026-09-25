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
import {
	ACCEPTED_IMAGE_ATTR,
	formatBytes,
	MAX_IMAGE_BYTES,
	validateImageFile,
	type UploadProblem,
} from "@/lib/admin/imageFile";
import { beginTask } from "@/lib/admin/saving";

export interface ImageMeta {
	aspect: number;
}

interface Props {
	value: string | null;
	onChange: (url: string | null, meta?: ImageMeta) => void;
	folder: string;
	aspect?: string | number;
	className?: string;
	multiple?: boolean;
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
	let img: HTMLImageElement;
	try {
		img = await loadImage(src);
	} catch {
		throw new Error("load");
	}
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
	"w-[78%] cursor-pointer border border-cream/60 bg-plum-dark/50 px-3 py-1.5 text-center font-sans font-light uppercase tracking-[0.2em] text-cream text-micro transition-colors hover:border-gold hover:text-gold";

function BusyVeil({ label }: { label: string }) {
	return (
		<div
			role="status"
			aria-live="polite"
			className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2.5 bg-plum-dark/85 backdrop-blur-[1px] [animation:auth-fade-in_0.2s_ease]">
			<span className="h-5 w-5 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
			<span className="font-sans font-light uppercase tracking-[0.24em] text-gold text-micro">
				{label}…
			</span>
		</div>
	);
}

export function ImageUploader({
	value,
	onChange,
	folder,
	aspect = "aspect-[4/3]",
	className = "",
	multiple = false,
}: Props) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [busy, setBusy] = useState<string | null>(null);
	const [drag, setDrag] = useState(false);
	const [error, setError] = useState<UploadProblem | null>(null);

	const [cropSrc, setCropSrc] = useState<string | null>(null);
	const cropMime = useRef("image/jpeg");
	const cropIsBlob = useRef(false);
	const [crop, setCrop] = useState({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [areaPixels, setAreaPixels] = useState<Area | null>(null);
	const [naturalRatio, setNaturalRatio] = useState(0);
	const queue = useRef<File[]>([]);
	const [queued, setQueued] = useState(0);

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
		setBusy("Uploading");
		setError(null);
		const endTask = beginTask("Uploading image");
		const fd = new FormData();
		fd.set("file", file);
		fd.set("folder", folder);
		try {
			const res = await uploadImage(fd);
			if (res.error) setError({ message: res.error, detail: res.detail });
			else if (res.url) onChange(res.url, meta);
		} catch {
			setError({
				message:
					"The upload didn't reach the server. Check your connection and try again.",
			});
		} finally {
			endTask();
			setBusy(null);
		}
	};

	const startNext = () => {
		const file = queue.current.shift();
		setQueued(queue.current.length);
		if (!file) return;
		openCrop(URL.createObjectURL(file), file.type, true);
	};

	const pickFiles = (files?: FileList | null) => {
		const picked = Array.from(files ?? []);
		if (picked.length === 0) return;
		const bad = picked.map(validateImageFile).find(Boolean);
		if (bad) {
			setError({ message: bad });
			return;
		}
		setError(null);
		queue.current = multiple ? picked : picked.slice(0, 1);
		startNext();
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

	const closeCrop = () => {
		if (cropSrc && cropIsBlob.current) URL.revokeObjectURL(cropSrc);
		setCropSrc(null);
	};

	const cancelCrop = () => {
		queue.current = [];
		setQueued(0);
		closeCrop();
	};

	const skipCrop = () => {
		closeCrop();
		startNext();
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
			closeCrop();
			await upload(file, { aspect: cropped });
			startNext();
		} catch (e) {
			queue.current = [];
			setQueued(0);
			setError({
				message:
					e instanceof Error && e.message === "load"
						? "Couldn't open this image for cropping — it may have been moved or deleted from storage."
						: "This image couldn't be processed in your browser. Try uploading the original file again instead of cropping.",
			});
			cancelCrop();
		}
	};

	const remove = async () => {
		const old = value;
		if (!old) {
			onChange(null);
			return;
		}
		setBusy("Removing");
		const endTask = beginTask("Removing image");
		try {
			onChange(null);
			await deleteImage(old);
		} finally {
			endTask();
			setBusy(null);
		}
	};

	return (
		<div className={className}>
			{value ? (
				<div
					className={`group relative w-full ${boxCls} overflow-hidden rounded-sm border border-cream/10`}
					style={boxStyle}>
					<Image
						src={value}
						alt=""
						fill
						sizes="(max-width: 640px) 100vw, 320px"
						className="object-cover"
					/>
					{busy && <BusyVeil label={busy} />}
					<div
						className={`absolute inset-0 flex flex-col items-center justify-center gap-2 bg-plum-dark/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-coarse:bg-plum-dark/50 pointer-coarse:opacity-100 ${
							busy ? "pointer-events-none" : ""
						}`}>
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
						pickFiles(e.dataTransfer.files);
					}}
					style={boxStyle}
					disabled={!!busy}
					className={`relative flex w-full ${boxCls} cursor-pointer flex-col items-center justify-center gap-2 rounded-sm border border-dashed text-center transition-colors ${
						drag
							? "border-gold bg-gold/5"
							: "border-cream/20 hover:border-cream/40"
					}`}>
					{busy && <BusyVeil label={busy} />}
					<span className="font-sans font-light text-cream/82 text-sm">
						Drag &amp; drop or click to upload
					</span>
					<span className="font-sans font-light text-cream/30 text-micro">
						JPG · PNG · WebP · AVIF — max {formatBytes(MAX_IMAGE_BYTES)}
					</span>
				</button>
			)}

			<input
				ref={inputRef}
				type="file"
				accept={ACCEPTED_IMAGE_ATTR}
				multiple={multiple}
				className="hidden"
				onChange={(e) => {
					pickFiles(e.target.files);
					e.target.value = "";
				}}
			/>
			{error && (
				<div
					role="alert"
					className="mt-2 rounded-sm border border-gold/40 bg-gold/5 px-3 py-2">
					<div className="flex items-start justify-between gap-3">
						<p className="font-sans font-light text-gold text-tiny leading-relaxed">
							{error.message}
						</p>
						<button
							type="button"
							onClick={() => setError(null)}
							aria-label="Dismiss"
							className="cursor-pointer font-sans text-cream/50 text-sm leading-none transition-colors hover:text-gold">
							×
						</button>
					</div>
					{error.detail && (
						<p className="mt-1.5 font-sans font-light text-cream/55 text-micro leading-relaxed">
							{error.detail}
						</p>
					)}
				</div>
			)}

			{cropSrc &&
				createPortal(
					<div className="fixed inset-0 z-130 flex flex-col bg-plum-dark/95 p-4 md:p-8">
						<div className="mx-auto mb-4 font-sans font-light uppercase tracking-[0.3em] text-gold text-tiny">
							Adjust image
						</div>

						<div className="mx-auto mb-4 flex w-full max-w-3xl flex-wrap items-center gap-2">
							<span className="mr-1 font-sans font-light uppercase tracking-[0.2em] text-cream/70 text-micro">
								Ratio
							</span>
							{options.map((r) => (
								<button
									key={r.label}
									type="button"
									onClick={() => setChoice(r.value)}
									className={`cursor-pointer border px-3 py-1.5 font-sans font-light uppercase tracking-[0.16em] text-micro transition-colors ${
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

						<p className="mx-auto mt-3 w-full max-w-3xl font-sans font-light text-cream/60 text-tiny">
							{layout.label} matches how this image is displayed on the site.
						</p>

						<div className="mx-auto mt-3 flex w-full max-w-3xl flex-wrap items-center gap-4">
							<span className="font-sans font-light uppercase tracking-[0.2em] text-cream/70 text-micro">
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
							{queued > 0 && (
								<button
									type="button"
									onClick={skipCrop}
									className="cursor-pointer border border-cream/40 px-5 py-2 font-sans font-light uppercase tracking-[0.2em] text-cream/80 text-micro transition-colors hover:border-gold hover:text-gold">
									Skip
								</button>
							)}
							<button
								type="button"
								onClick={cancelCrop}
								className="cursor-pointer border border-cream/40 px-5 py-2 font-sans font-light uppercase tracking-[0.2em] text-cream/80 text-micro transition-colors hover:border-gold hover:text-gold">
								{queued > 0 ? "Cancel all" : "Cancel"}
							</button>
							<button
								type="button"
								onClick={applyCrop}
								className="cta-gold cursor-pointer bg-gold px-6 py-2 font-sans font-light uppercase tracking-[0.2em] text-plum-dark text-micro">
								Use crop
							</button>
						</div>
					</div>,
					document.body,
				)}
		</div>
	);
}
