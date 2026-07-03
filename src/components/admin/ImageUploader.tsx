"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import Cropper, { type Area } from "react-easy-crop";
import { uploadImage, deleteImage } from "@/app/admin/media-actions";

interface Props {
  value: string | null;
  onChange: (url: string | null) => void;
  folder: string;
  aspect?: string;
  className?: string;
}

function parseAspect(cls: string): number {
  if (cls.includes("square")) return 1;
  if (cls.includes("video")) return 16 / 9;
  const m = cls.match(/(\d+)\s*\/\s*(\d+)/);
  if (m) return Number(m[1]) / Number(m[2]);
  return 4 / 3;
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
  const cropMeta = useRef({ type: "image/jpeg" });
  const cropIsBlob = useRef(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [areaPixels, setAreaPixels] = useState<Area | null>(null);
  const ratio = parseAspect(aspect);

  const upload = async (file: File) => {
    setBusy(true);
    setError("");
    const fd = new FormData();
    fd.set("file", file);
    fd.set("folder", folder);
    const res = await uploadImage(fd);
    setBusy(false);
    if (res.error) setError(res.error);
    else if (res.url) onChange(res.url);
  };

  const startCrop = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setAreaPixels(null);
  };

  const openCrop = (file: File) => {
    cropMeta.current = { type: file.type };
    cropIsBlob.current = true;
    startCrop();
    setCropSrc(URL.createObjectURL(file));
  };

  const openCropFromUrl = (url: string) => {
    const ext = url.split("?")[0]!.split(".").pop()?.toLowerCase() ?? "";
    cropMeta.current = {
      type:
        ext === "png"
          ? "image/png"
          : ext === "webp"
            ? "image/webp"
            : "image/jpeg",
    };
    cropIsBlob.current = false;
    startCrop();
    setCropSrc(url);
  };

  const cancelCrop = () => {
    if (cropSrc && cropIsBlob.current) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
  };

  const applyCrop = async () => {
    if (!cropSrc || !areaPixels) return;
    const t = cropMeta.current.type;
    const mime =
      t === "image/png" || t === "image/webp" ? t : "image/jpeg";
    const ext = mime === "image/png" ? "png" : mime === "image/webp" ? "webp" : "jpg";
    try {
      const blob = await getCroppedBlob(cropSrc, areaPixels, mime);
      const file = new File([blob], `image.${ext}`, { type: mime });
      cancelCrop();
      await upload(file);
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
          className={`group relative w-full ${aspect} overflow-hidden rounded-sm border border-cream/10`}
        >
          <Image src={value} alt="" fill className="object-cover" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-plum-dark/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="w-[78%] cursor-pointer border border-cream/60 bg-plum-dark/50 px-3 py-1.5 text-center font-sans font-light uppercase tracking-[0.2em] text-cream text-[0.6rem] transition-colors hover:border-gold hover:text-gold"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => value && openCropFromUrl(value)}
              className="w-[78%] cursor-pointer border border-cream/60 bg-plum-dark/50 px-3 py-1.5 text-center font-sans font-light uppercase tracking-[0.2em] text-cream text-[0.6rem] transition-colors hover:border-gold hover:text-gold"
            >
              Crop
            </button>
            <button
              type="button"
              onClick={remove}
              className="w-[78%] cursor-pointer border border-cream/60 bg-plum-dark/50 px-3 py-1.5 text-center font-sans font-light uppercase tracking-[0.2em] text-cream text-[0.6rem] transition-colors hover:border-gold hover:text-gold"
            >
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
            if (f) openCrop(f);
          }}
          className={`flex w-full ${aspect} cursor-pointer flex-col items-center justify-center gap-2 rounded-sm border border-dashed text-center transition-colors ${
            drag
              ? "border-gold bg-gold/5"
              : "border-cream/20 hover:border-cream/40"
          }`}
        >
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
          if (f) openCrop(f);
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
            <div className="relative mx-auto w-full max-w-3xl flex-1 overflow-hidden rounded-sm bg-plum">
              <Cropper
                image={cropSrc}
                crop={crop}
                zoom={zoom}
                aspect={ratio}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, a) => setAreaPixels(a)}
              />
            </div>
            <div className="mx-auto mt-5 flex w-full max-w-3xl flex-wrap items-center gap-4">
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
                className="cursor-pointer border border-cream/40 px-5 py-2 font-sans font-light uppercase tracking-[0.2em] text-cream/80 text-[0.6rem] transition-colors hover:border-gold hover:text-gold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyCrop}
                className="cta-gold cursor-pointer bg-gold px-6 py-2 font-sans font-light uppercase tracking-[0.2em] text-plum-dark text-[0.6rem]"
              >
                Use crop
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
