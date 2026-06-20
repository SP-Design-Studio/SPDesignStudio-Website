"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { uploadImage, deleteImage } from "@/app/admin/media-actions";

interface Props {
  value: string | null;
  onChange: (url: string | null) => void;
  folder: string;
  aspect?: string;
  className?: string;
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
            if (f) upload(f);
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
          if (f) upload(f);
          e.target.value = "";
        }}
      />
      {error && <p className="mt-2 font-sans text-sm text-gold">{error}</p>}
    </div>
  );
}
