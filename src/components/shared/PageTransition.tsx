"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";

export default function PageTransition() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const labelRef   = useRef<HTMLDivElement>(null);
  const logoRef    = useRef<HTMLImageElement>(null);
  const pathname   = usePathname();
  const router     = useRouter();
  const firstRender = useRef(true);

  useEffect(() => {
    const onCover = (e: Event) => {
      const detail = (e as CustomEvent).detail as { href: string };
      const el = overlayRef.current;
      const label = labelRef.current;
      const logo = logoRef.current;
      if (!el || !label || !logo) return;

      el.style.background = "var(--color-cream)";
      logo.style.filter = "invert(1) brightness(0.32)";

      gsap.set(el, { display: "block", clipPath: "inset(100% 0 0 0)", pointerEvents: "auto" });
      gsap.set(label, { autoAlpha: 0, scale: 0.85, filter: "blur(8px)" });

      const tl = gsap.timeline();
      tl
        .to(el, { clipPath: "inset(0% 0 0 0)", duration: 0.7, ease: "expo.inOut" })
        .to(label, { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 0.5, ease: "expo.out" }, "-=0.3")
        .call(() => router.push(detail.href));
    };
    document.addEventListener("page-transition-cover", onCover);
    return () => document.removeEventListener("page-transition-cover", onCover);
  }, [router]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const el = overlayRef.current;
    const label = labelRef.current;
    if (!el || !label) return;

    const tl = gsap.timeline({ delay: 0.18 });
    tl
      .to(label, { autoAlpha: 0, scale: 0.92, filter: "blur(6px)", duration: 0.35, ease: "power3.in" })
      .to(el, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.85,
        ease: "expo.inOut",
        onComplete: () => {
          if (el) {
            el.style.display = "none";
            el.style.pointerEvents = "none";
          }
        },
      }, "-=0.15");
  }, [pathname]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-100 pointer-events-none"
      style={{ display: "none", clipPath: "inset(100% 0 0 0)", background: "var(--color-cream)" }}
      aria-hidden
    >
      <div ref={labelRef} className="absolute inset-0 flex items-center justify-center">
        {}
        <img ref={logoRef} src="/images/logo.svg" alt="" className="h-28 md:h-36 w-auto opacity-90" />
      </div>
    </div>
  );
}
