"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import Lenis from "lenis";
import Image from "next/image";
import { CloseButton } from "@/components/shared/CloseButton";
import { useImageLightbox } from "@/components/shared/ImageLightbox";
import { getLenis } from "@/lib/smoothScroll";
import type { Project } from "@/lib/data/projects";

interface Props {
  project: Project;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const CLIP_HIDDEN = "inset(0% 0% 100% 0% round 0.125rem)";
const CLIP_SHOWN = "inset(0% 0% 0% 0% round 0.125rem)";
const PANEL_HIDDEN = "inset(0% 0% 100% 0%)";
const PANEL_SHOWN = "inset(0% 0% 0% 0%)";

export function ProjectDetail({
  project,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const first = useRef(true);

  const lightboxUrls = [
    ...(project.img ? [project.img] : []),
    ...project.gallery.map((g) => g.url),
  ];
  const galleryBase = project.img ? 1 : 0;
  const lightbox = useImageLightbox(lightboxUrls);

  useEffect(() => {
    if (!wrapRef.current || !contentRef.current) return;
    const lenis = new Lenis({
      wrapper: wrapRef.current,
      content: contentRef.current,
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: true,
    });
    lenisRef.current = lenis;
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const hero = heroRef.current;
    const title = titleRef.current;
    if (!panel || !hero) return;

    getLenis()?.stop();
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline();
    tl.set(panel, { autoAlpha: 1, clipPath: PANEL_HIDDEN }).to(
      panel,
      { clipPath: PANEL_SHOWN, duration: 0.85, ease: "expo.inOut" },
      0,
    );

    tl.fromTo(
      hero,
      { clipPath: CLIP_HIDDEN, scale: 1.12 },
      { clipPath: CLIP_SHOWN, scale: 1, duration: 1.1, ease: "expo.out" },
      0.28,
    );

    if (title) {
      tl.fromTo(
        title,
        { y: 44, autoAlpha: 0, filter: "blur(6px)" },
        {
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 1.0,
          ease: "expo.out",
        },
        0.34,
      );
    }

    tl.fromTo(
      ".pd-reveal",
      { y: 26, autoAlpha: 0, filter: "blur(5px)" },
      {
        y: 0,
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.06,
      },
      0.42,
    );

    tl.fromTo(
      ".pd-img",
      { clipPath: CLIP_HIDDEN, scale: 1.12 },
      {
        clipPath: CLIP_SHOWN,
        scale: 1,
        duration: 1.0,
        ease: "expo.out",
        stagger: 0.09,
      },
      0.55,
    );

    first.current = false;
  }, []);

  useEffect(() => {
    if (first.current) return;
    lenisRef.current?.scrollTo(0, { immediate: true });
    const hero = heroRef.current;
    if (hero) {
      gsap.fromTo(
        hero,
        { clipPath: CLIP_HIDDEN, scale: 1.08 },
        { clipPath: CLIP_SHOWN, scale: 1, duration: 0.9, ease: "expo.out" },
      );
    }
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.85, ease: "expo.out", delay: 0.05 },
      );
    }
    gsap.fromTo(
      ".pd-reveal",
      { y: 18, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.04,
        delay: 0.08,
      },
    );
    gsap.fromTo(
      ".pd-img",
      { clipPath: CLIP_HIDDEN },
      {
        clipPath: CLIP_SHOWN,
        duration: 0.85,
        ease: "expo.out",
        stagger: 0.07,
        delay: 0.12,
      },
    );
  }, [project.id]);

  const close = () => {
    const panel = panelRef.current;
    document.body.style.overflow = "";
    getLenis()?.start();
    if (!panel) {
      onClose();
      return;
    }
    gsap.to(".pd-reveal", {
      autoAlpha: 0,
      y: 14,
      duration: 0.3,
      ease: "power2.in",
    });
    gsap.to(panel, {
      clipPath: PANEL_HIDDEN,
      duration: 0.6,
      delay: 0.1,
      ease: "expo.inOut",
      onComplete: onClose,
    });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onNext, onPrev]);

  return createPortal(
    <div
      ref={panelRef}
      data-lenis-prevent
      className="fixed inset-0 z-200 bg-plum-dark text-cream"
      style={{ opacity: 0, clipPath: PANEL_HIDDEN }}
    >
      <CloseButton
        onClick={close}
        className="fixed right-6 top-6 z-20 md:right-10 md:top-9"
      />

      <div ref={wrapRef} className="h-full overflow-hidden">
        <div ref={contentRef}>
          <div className="mx-auto max-w-6xl px-6 pb-24 pt-24 sm:px-10 md:px-16 md:pt-28">
            <div className="pd-reveal mb-5 flex items-center gap-4 font-sans font-normal uppercase tracking-[0.32em] text-gold text-[0.672rem] md:text-sm">
              <span>{project.type}</span>
              <span className="h-px w-8 bg-gold/40" />
              <span>{project.year}</span>
            </div>

            <h2 className="font-bdscript leading-[0.95] text-cream text-5xl sm:text-6xl md:text-7xl">
              <span ref={titleRef} className="block will-change-transform">
                {project.title}
              </span>
            </h2>
            <div className="pd-reveal mt-4 flex items-center gap-3 font-sans font-normal uppercase tracking-[0.24em] text-cream/85 text-[0.694rem] md:text-[0.784rem]">
              {project.location}
              <span className="w-fit rounded-[3px] bg-plum/55 backdrop-blur-xl px-2.5 py-1 font-sans font-normal uppercase tracking-[0.3em] text-gold text-[0.7rem]">
                {project.delivery === "renovation" && "Renovation"}
                {project.delivery === "design-consultation" &&
                  "Design Consultation"}
                {(project.delivery === "turnkey" || !project.delivery) &&
                  "Turnkey"}
              </span>
            </div>

            <div
              ref={heroRef}
              onClick={() => project.img && lightbox.open(0)}
              className={`relative mt-10 md:mt-14 w-full aspect-16/10 overflow-hidden rounded-sm bg-plum-dark will-change-[clip-path] ${
                project.img ? "cursor-pointer" : ""
              }`}
            >
              {project.img && (
                <Image
                  src={project.img}
                  alt={project.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 1100px"
                  className="object-cover transition-transform duration-1200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03]"
                />
              )}
            </div>

            <div className="mt-12 md:mt-16 grid grid-cols-1 gap-10 md:gap-16 lg:grid-cols-12">
              <p className="pd-reveal font-serif italic font-light text-cream/88 text-xl md:text-2xl leading-[1.6] lg:col-span-7">
                {project.blurb}
              </p>
              <div className="pd-reveal grid grid-cols-2 gap-x-8 gap-y-7 self-start lg:col-span-5 lg:border-l lg:border-cream/10 lg:pl-12">
                {project.facts.map((f) => (
                  <div key={f.label}>
                    <div className="font-sans font-normal uppercase tracking-[0.28em] text-gold text-[0.582rem] md:text-[0.65rem] mb-2">
                      {f.label}
                    </div>
                    <div className="font-serif font-light text-cream text-xl md:text-xl">
                      {f.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {project.gallery.length > 0 && (
              <div className="mt-16 md:mt-24">
                <div className="pd-reveal mb-6 flex items-center gap-4 font-sans font-normal uppercase tracking-[0.32em] text-gold text-[0.672rem] md:mb-8 md:text-sm">
                  <span>Gallery</span>
                  <span className="h-px flex-1 bg-gold/25" />
                </div>
                <div className="columns-1 gap-4 md:columns-2 md:gap-5">
                  {project.gallery.map((g, i) => (
                    <div
                      key={g.url + i}
                      onClick={() => lightbox.open(galleryBase + i)}
                      style={{ aspectRatio: String(g.aspect ?? 4 / 3) }}
                      className="pd-img relative mb-4 block w-full cursor-pointer overflow-hidden rounded-sm break-inside-avoid will-change-[clip-path] md:mb-5"
                    >
                      <Image
                        src={g.url}
                        alt={`${project.title} ${i + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-1200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pd-reveal mt-16 flex items-center justify-between border-t border-cream/10 pt-8">
              <button
                type="button"
                onClick={onPrev}
                className="group inline-flex cursor-pointer items-center gap-3 font-sans font-normal uppercase tracking-[0.28em] text-cream/90 text-[0.672rem] md:text-sm transition-colors duration-300 hover:text-gold"
              >
                <span className="transition-transform duration-500 group-hover:-translate-x-1">
                  &larr;
                </span>
                Prev
              </button>
              <span className="font-sans font-normal tracking-[0.3em] text-cream/85 text-[0.672rem]">
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(total).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={onNext}
                className="group inline-flex cursor-pointer items-center gap-3 font-sans font-normal uppercase tracking-[0.28em] text-cream/90 text-[0.672rem] md:text-sm transition-colors duration-300 hover:text-gold"
              >
                Next
                <span className="transition-transform duration-500 group-hover:translate-x-1">
                  &rarr;
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {lightbox.modal}
    </div>,
    document.body,
  );
}
