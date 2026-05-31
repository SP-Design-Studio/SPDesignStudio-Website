"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import TransitionLink from "./TransitionLink";
import { gsap } from "gsap";

interface NavProps {
  visible: boolean;
}

const LINKS = [
  { label: "Home",      href: "/" },
  { label: "About",     href: "/about" },
  { label: "Process",   href: "/process" },
  { label: "Portfolio", href: "/work" },
  { label: "Contact",   href: "/contact" },
  { label: "Careers",   href: "/careers" },
] as const;

export default function Nav({ visible }: NavProps) {
  const navRef        = useRef<HTMLElement>(null);
  const logoRef       = useRef<HTMLAnchorElement>(null);
  const logoImgRef    = useRef<HTMLImageElement>(null);
  const linkRefs      = useRef<(HTMLAnchorElement | null)[]>([]);
  const linkCharsRef  = useRef<(HTMLSpanElement | null)[][]>(LINKS.map(() => []));
  const underlineRef  = useRef<HTMLSpanElement>(null);
  const burgerRef     = useRef<HTMLButtonElement>(null);
  const menuRef       = useRef<HTMLDivElement>(null);
  const menuLinksRef  = useRef<(HTMLDivElement | null)[]>([]);
  const burgerTopRef  = useRef<HTMLSpanElement>(null);
  const burgerBotRef  = useRef<HTMLSpanElement>(null);
  const progressRef   = useRef<HTMLSpanElement>(null);

  const [open, setOpen]       = useState(false);
  const [lightBg, setLightBg] = useState(false);
  const lastScrollY           = useRef(0);

  useEffect(() => {
    if (!visible) return;

    const allChars = linkCharsRef.current.flat().filter(Boolean);
    const alreadyShown = typeof window !== "undefined" && sessionStorage.getItem("navShown") === "1";

    gsap.set(underlineRef.current, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(progressRef.current, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(navRef.current, { autoAlpha: 1 });

    if (alreadyShown) {
      gsap.set(logoRef.current, { scale: 1, rotateY: 0, autoAlpha: 1, filter: "blur(0px)", clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set(burgerRef.current, { y: 0, autoAlpha: 1 });
      gsap.set(allChars, { rotateX: 0, y: 0, opacity: 1, filter: "blur(0px)", clearProps: "transform,filter,opacity" });
      return;
    }

    gsap.set(logoRef.current, {
      scale: 0.7, rotateY: 35, autoAlpha: 0, filter: "blur(10px)",
      clipPath: "inset(0% 50% 0% 50%)", transformPerspective: 900,
    });
    gsap.set(burgerRef.current, { y: -28, scale: 0.85, autoAlpha: 0 });
    gsap.set(allChars, {
      rotateX: 85, y: 36, opacity: 0, filter: "blur(5px)", transformPerspective: 700,
    });
    const tl = gsap.timeline({ delay: 0.05 });
    tl
      .to(logoRef.current, {
        scale: 1, rotateY: 0, autoAlpha: 1, filter: "blur(0px)",
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.35, ease: "expo.out",
      })
      .to(burgerRef.current, {
        y: 0, scale: 1, autoAlpha: 1, duration: 0.9, ease: "back.out(1.4)",
      }, "-=1.05")
      .to(allChars, {
        rotateX: 0, y: 0, opacity: 1, filter: "blur(0px)",
        duration: 1.0, ease: "power4.out",
        stagger: { each: 0.024, from: "center" },
      }, "-=0.95")
      .call(() => {
        gsap.set(allChars, { clearProps: "transform,filter,opacity" });
        sessionStorage.setItem("navShown", "1");
      });
  }, [visible]);

  useEffect(() => {
    if (!visible) return;

    const onScroll = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - vh;
      const pct = max > 0 ? y / max : 0;
      gsap.to(progressRef.current, { scaleX: pct, duration: 0.2, ease: "power2.out", overwrite: true });

      setLightBg(y > vh * 1.5 && y < vh * 3.5);

      const diff = y - lastScrollY.current;
      if (y < 80) {
        gsap.to(navRef.current, { y: 0, duration: 0.6, ease: "expo.out", overwrite: true });
      } else if (diff > 6) {
        gsap.to(navRef.current, { y: -120, duration: 0.55, ease: "expo.out", overwrite: true });
      } else if (diff < -6) {
        gsap.to(navRef.current, { y: 0, duration: 0.55, ease: "expo.out", overwrite: true });
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [visible]);

  useEffect(() => {
    const color = lightBg ? "rgba(61,36,46,0.78)" : "rgba(252,251,247,0.7)";
    const burgerColor = lightBg ? "#3d242e" : "#fcfbf7";
    gsap.to(linkCharsRef.current.flat().filter(Boolean), {
      color, duration: 0.7, ease: "power2.out",
    });
    gsap.to([burgerTopRef.current, burgerBotRef.current], {
      backgroundColor: burgerColor, duration: 0.7, ease: "power2.out",
    });
    gsap.to(logoImgRef.current, {
      filter: lightBg ? "invert(1) brightness(0.35)" : "invert(0) brightness(1)",
      duration: 0.7, ease: "power2.out",
    });
  }, [lightBg]);

  useEffect(() => {
    if (!menuRef.current) return;
    if (open) {
      gsap.set(menuRef.current, { display: "flex" });
      gsap.fromTo(menuRef.current,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 0.75, ease: "expo.inOut" });
      gsap.fromTo(menuLinksRef.current.filter(Boolean),
        { y: 70, rotateX: -60, opacity: 0, filter: "blur(8px)" },
        {
          y: 0, rotateX: 0, opacity: 1, filter: "blur(0px)",
          duration: 1.1, ease: "expo.out", stagger: 0.07, delay: 0.25,
        });
      gsap.to(burgerTopRef.current, { rotate: 45, y: 4, duration: 0.45, ease: "expo.inOut" });
      gsap.to(burgerBotRef.current, { rotate: -45, y: -4, duration: 0.45, ease: "expo.inOut" });
    } else {
      gsap.to(menuRef.current, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.55, ease: "expo.in",
        onComplete: () => { if (menuRef.current) menuRef.current.style.display = "none"; },
      });
      gsap.to(burgerTopRef.current, { rotate: 0, y: 0, duration: 0.4, ease: "expo.inOut" });
      gsap.to(burgerBotRef.current, { rotate: 0, y: 0, duration: 0.4, ease: "expo.inOut" });
    }
  }, [open]);

  const handleLinkEnter = (i: number) => {
    const link = linkRefs.current[i];
    const underline = underlineRef.current;
    if (!link || !underline || !navRef.current) return;

    const linkRect = link.getBoundingClientRect();
    const navRect = navRef.current.getBoundingClientRect();
    gsap.to(underline, {
      x: linkRect.left - navRect.left,
      width: linkRect.width,
      scaleX: 1,
      duration: 0.6,
      ease: "expo.out",
      overwrite: true,
    });
  };

  const handleLinkLeave = () => {
    const underline = underlineRef.current;
    if (underline) {
      gsap.to(underline, {
        scaleX: 0,
        duration: 0.45,
        ease: "expo.in",
        overwrite: true,
      });
    }
  };

  const handleLinkMove = (e: React.MouseEvent<HTMLAnchorElement>, i: number) => {
    const link = linkRefs.current[i];
    if (!link) return;
    const r = link.getBoundingClientRect();
    const dx = e.clientX - r.left - r.width / 2;
    gsap.to(link, { x: dx * 0.15, duration: 0.4, ease: "power3.out", overwrite: "auto" });
  };

  const handleLinkMagnetLeave = (i: number) => {
    const link = linkRefs.current[i];
    if (link) gsap.to(link, { x: 0, duration: 0.7, ease: "elastic.out(1.1, 0.5)" });
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 inset-x-0 z-60 px-6 md:px-12 py-5 flex items-center justify-between will-change-transform"
        style={{ opacity: 0, visibility: "hidden" }}
      >
        <span
          ref={progressRef}
          aria-hidden
          className="absolute top-0 left-0 right-0 h-px bg-gold/50 origin-left"
        />

        <Link
          ref={logoRef}
          href="#hero"
          aria-label="SP Design Studio"
          className="block group"
          onClick={() => setOpen(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={logoImgRef}
            src="/images/logo.svg"
            alt="SP Design Studio"
            className="h-10 md:h-14 w-auto select-none transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        <div className="hidden md:flex items-center gap-7 lg:gap-9 text-[0.7rem] lg:text-[0.74rem] tracking-[0.28em] uppercase font-light relative">
          <span
            ref={underlineRef}
            aria-hidden
            className="absolute -bottom-1 left-0 h-px bg-gold pointer-events-none"
            style={{ width: 0 }}
          />
          {LINKS.map((item, i) => {
            const chars = item.label.split("");
            return (
              <TransitionLink
                key={item.label}
                ref={(el) => { linkRefs.current[i] = el; }}
                href={item.href}
                onMouseEnter={() => handleLinkEnter(i)}
                onMouseLeave={() => { handleLinkLeave(); handleLinkMagnetLeave(i); }}
                onMouseMove={(e) => handleLinkMove(e, i)}
                className="group relative inline-block overflow-hidden leading-[1.4] will-change-transform"
              >
                <span className="block">
                  {chars.map((c, ci) => (
                    <span
                      key={ci}
                      ref={(el) => {
                        if (!linkCharsRef.current[i]) linkCharsRef.current[i] = [];
                        linkCharsRef.current[i][ci] = el;
                      }}
                      className="inline-block transition-transform duration-650 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:-translate-y-full"
                      style={{
                        transitionDelay: `${ci * 22}ms`,
                        transformOrigin: "50% 100%",
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </span>
                <span
                  aria-hidden
                  className="absolute top-full left-0 block whitespace-nowrap text-gold"
                >
                  {chars.map((c, ci) => (
                    <span
                      key={ci}
                      className="inline-block transition-transform duration-650 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:-translate-y-full"
                      style={{
                        transitionDelay: `${ci * 22}ms`,
                        transformOrigin: "50% 0%",
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </span>
              </TransitionLink>
            );
          })}
        </div>

        <button
          ref={burgerRef}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.75 z-61"
        >
          <span
            ref={burgerTopRef}
            className="block w-7 h-px bg-cream origin-center will-change-transform"
          />
          <span
            ref={burgerBotRef}
            className="block w-7 h-px bg-cream origin-center will-change-transform"
          />
        </button>
      </nav>

      <div
        ref={menuRef}
        className="md:hidden fixed inset-0 z-55 hidden flex-col items-center justify-center bg-plum-dark"
        style={{ clipPath: "inset(0 0 100% 0)" }}
      >
        <div className="flex flex-col items-center gap-7" style={{ perspective: "1200px" }}>
          {LINKS.map((item, i) => (
            <div
              key={item.label}
              ref={(el) => { menuLinksRef.current[i] = el; }}
              style={{ transformOrigin: "50% 100%", willChange: "transform, opacity, filter" }}
            >
              <TransitionLink
                href={item.href}
                onClick={() => setOpen(false)}
                className="font-serif font-light text-cream hover:text-gold transition-colors duration-500 tracking-[-0.01em] text-4xl sm:text-5xl leading-tight"
              >
                {item.label}
              </TransitionLink>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
