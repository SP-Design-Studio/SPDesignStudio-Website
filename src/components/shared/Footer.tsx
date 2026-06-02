"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const rootRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLElement | null)[]>([]);
  const pillRef = useRef<HTMLSpanElement>(null);

  // Hover: the thin underline grows up to cover the name as a translucent
  // gold highlight, then collapses back to a 1px line.
  const onEnter = () => {
    gsap.to(pillRef.current, {
      height: "100%",
      borderRadius: "3px",
      opacity: 0.16,
      duration: 0.5,
      ease: "expo.out",
    });
  };
  const onLeave = () => {
    gsap.to(pillRef.current, {
      height: "1px",
      borderRadius: "0px",
      opacity: 0.7,
      duration: 0.5,
      ease: "expo.inOut",
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = itemsRef.current.filter(Boolean);

      gsap.set(wordmarkRef.current, { autoAlpha: 0, yPercent: 30 });
      gsap.set(items, { y: 24, autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 88%",
        },
      });

      tl.to(
        wordmarkRef.current,
        { autoAlpha: 1, yPercent: 0, duration: 1.6, ease: "power3.out" },
        0,
      ).to(
        items,
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.14,
        },
        0.3,
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const year = new Date().getFullYear();

  return (
    <footer
      ref={rootRef}
      className="relative overflow-hidden bg-plum-dark px-6 md:px-16 pt-24 pb-12"
    >
      {/* Oversized faint script wordmark, bleeding off the edges. */}
      <div
        ref={wordmarkRef}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center"
      >
        <span className="font-bdscript text-gold/[0.07] whitespace-nowrap leading-[0.8] text-[26vw] md:text-[17vw]">
          SP Design Studio
        </span>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <p
          ref={(el) => {
            itemsRef.current[0] = el;
          }}
          className="font-sans font-light uppercase tracking-[0.32em] text-cream/45 text-[10px] md:text-xs leading-loose"
        >
          © {year} SP Design Studio — A Canvas of Artistry and Dedication.
        </p>

        <p
          ref={(el) => {
            itemsRef.current[1] = el;
          }}
          className="font-sans font-light uppercase tracking-[0.32em] text-cream/35 text-[10px] md:text-xs mt-1.5"
        >
          All Rights Tastefully Reserved.
        </p>

        <p
          ref={(el) => {
            itemsRef.current[2] = el;
          }}
          className="font-sans font-light uppercase tracking-[0.28em] text-cream/30 text-[10px] md:text-xs mt-7"
        >
          Website Brought to Life by{" "}
          <span
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            className="relative inline-block cursor-default px-1.5 py-0.5 text-gold/80"
          >
            <span className="relative z-10">Abhiraman Kuntimaddi</span>
            {/* 1px line that expands up over the name as a translucent gold
                highlight on hover (see spandana-portfolio Tagline). */}
            <span
              ref={pillRef}
              aria-hidden
              className="pointer-events-none absolute bottom-0 left-0 w-full bg-gold"
              style={{ height: "1px", opacity: 0.7 }}
            />
          </span>
        </p>
      </div>
    </footer>
  );
}
