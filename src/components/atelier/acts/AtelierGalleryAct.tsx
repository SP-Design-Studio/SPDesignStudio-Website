"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CloseButton } from "@/components/shared/CloseButton";
import type { AtelierImage } from "@/lib/atelier";

function Tile({
  img,
  assignRef,
  onOpen,
}: {
  img: AtelierImage;
  assignRef: (el: HTMLButtonElement | null) => void;
  onOpen: () => void;
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
      onClick={() => onOpen()}
      className="group relative block aspect-4/5 w-full cursor-pointer overflow-hidden rounded-sm border border-cream/10 bg-plum"
    >
      <div
        className="atelier-media absolute inset-0 h-full w-full will-change-[clip-path]"
        style={{ clipPath: "inset(100% 0% 0% 0% round 0.125rem)" }}
      >
        <div className="atelier-media-inner absolute inset-0 will-change-transform">
          <Image
            src={img.url}
            alt=""
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onLoad={() => setStatus("loaded")}
            onError={() => setStatus("error")}
            className={`object-cover transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] ${
              status === "loaded" ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </div>

      {status !== "loaded" && (
        <div className="absolute inset-0 overflow-hidden bg-plum">
          <div className="absolute inset-y-0 left-0 w-1/2 bg-linear-to-r from-transparent via-gold/10 to-transparent animate-[auth-sweep_1.9s_ease-in-out_infinite]" />
        </div>
      )}
    </button>
  );
}

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

interface Props {
  images: AtelierImage[];
  itemsRef: React.RefObject<(HTMLButtonElement | null)[]>;
}

export function AtelierGalleryAct({ images, itemsRef }: Props) {
  const [index, setIndex] = useState<number | null>(null);
  const active = index === null ? null : (images[index] ?? null);

  const close = () => setIndex(null);
  const prev = () =>
    setIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  const next = () =>
    setIndex((i) => (i === null ? null : (i + 1) % images.length));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length]);

  return (
    <section id="gallery" className="bg-plum-dark px-6 pt-8 pb-28 md:px-12">
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
              onOpen={() => setIndex(i)}
            />
          ))}
        </div>
      )}

      {active && (
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
            <LightboxImage key={active.url} src={active.url} />
          </div>

          {images.length > 1 && (
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
                {index! + 1} / {images.length}
              </div>
            </>
          )}

          <CloseButton onClick={close} className="absolute top-6 right-6 z-10" />
        </div>
      )}
    </section>
  );
}
