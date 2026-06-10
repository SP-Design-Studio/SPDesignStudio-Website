"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface PreloaderProps {
  onCompleteAction: () => void;
}

const PHRASES = [
  "Curating Textures",
  "Selecting Palettes",
  "Composing Light",
  "Sourcing Materials",
  "Crafting Atmospheres",
  "Defining Spaces",
];

export default function Preloader({ onCompleteAction }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const phraseRef = useRef<HTMLSpanElement>(null);
  const goldLineRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);

  const swapPhrase = (newIndex: number) => {
    gsap.to(phraseRef.current, {
      yPercent: -120,
      opacity: 0,
      duration: 0.24,
      ease: "power2.in",
      onComplete: () => {
        setPhraseIndex(newIndex);
        requestAnimationFrame(() => {
          gsap.fromTo(
            phraseRef.current,
            { yPercent: 120, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.32, ease: "power3.out" }
          );
        });
      },
    });
  };

  const exitAnimation = () => {
    gsap.to(containerRef.current, {
      yPercent: -100,
      duration: 1.1,
      ease: "expo.inOut",
      onComplete: onCompleteAction,
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(textRef.current, { clipPath: "inset(-40px 100% -40px 0px)" });

      const total = 0.85 * PHRASES.length;
      const per = total / PHRASES.length;
      const proxy = { progress: 0 };

      const tl = gsap.timeline({
        onComplete: () => gsap.delayedCall(0.4, exitAnimation),
      });

      tl.to(proxy, {
        progress: 1,
        duration: total,
        ease: "power1.inOut",
        onUpdate: () => {
          const remaining = 100 - proxy.progress * 100;
          if (textRef.current) {
            textRef.current.style.clipPath = `inset(-40px ${remaining}% -40px 0px)`;
          }
        },
      })
        .fromTo(
          goldLineRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.5, ease: "expo.out", transformOrigin: "left center" },
          "-=0.3"
        );

      const counter = { val: 0 };
      gsap.to(counter, {
        val: 100,
        duration: total,
        ease: "power1.inOut",
        onUpdate: () => {
          const v = Math.floor(counter.val);
          setCount(v);
          if (progressBarRef.current) {
            progressBarRef.current.style.transform = `scaleX(${v / 100})`;
          }
        },
      });

      gsap.fromTo(counterRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, delay: 0.2 });

      gsap.fromTo(
        phraseRef.current,
        { yPercent: 60, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.45, delay: 0.2, ease: "power3.out" }
      );
      for (let i = 1; i < PHRASES.length; i++) {
        gsap.delayedCall(per * i, () => swapPhrase(i));
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const displayCount = String(count).padStart(3, "0");

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-9999 flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--color-cream)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none z-1"
        style={{
          backgroundImage: "url('/noisy.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "180px",
          opacity: 0.025,
          mixBlendMode: "multiply",
        }}
      />

      <div className="relative z-10 flex flex-col items-center" style={{ gap: "clamp(16px, 2.5vw, 28px)" }}>

        <div style={{ padding: "40px 8px 40px", lineHeight: 1 }}>
          <span
            ref={textRef}
            className="font-bdscript block"
            style={{
              fontSize: "clamp(3rem, 8vw, 8rem)",
              color: "var(--color-plum-dark)",
              letterSpacing: "-0.01em",
              lineHeight: 1,
              willChange: "clip-path",
              display: "block",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-alta)",
                fontWeight: 500,
                fontSize: "0.62em",
                letterSpacing: "0.04em",
              }}
            >
              SP
            </span>{" "}
            Design Studio
          </span>
        </div>

        <div
          ref={goldLineRef}
          style={{
            width: "clamp(48px, 5vw, 80px)",
            height: "1px",
            backgroundColor: "var(--color-gold)",
            opacity: 0.65,
            transform: "scaleX(0)",
            transformOrigin: "left center",
            marginTop: "-20px",
          }}
        />

        <div
          className="overflow-hidden relative flex items-center justify-center"
          style={{ height: "clamp(1.1rem, 1.8vw, 1.4rem)" }}
        >
          <span
            ref={phraseRef}
            className="flex w-full items-center justify-center text-center font-serif font-light"
            style={{
              fontSize: "clamp(0.68rem, 1.3vw, 0.95rem)",
              color: "var(--color-plum)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            {PHRASES[phraseIndex]}
          </span>
        </div>
      </div>

      <div className="absolute bottom-10 left-0 right-0 z-10 flex items-end justify-between px-8 md:px-14">
        <span
          className="hidden md:block text-sm tracking-[0.22em] uppercase font-light"
          style={{ color: "var(--color-plum)", opacity: 0.3 }}
        >
          SP Design Studio
        </span>

        <div ref={counterRef} className="flex items-baseline ml-auto" style={{ gap: "0px" }}>
          {displayCount.split("").map((digit, i) => (
            <RollingDigit key={i} digit={digit} />
          ))}
          <span
            className="font-serif"
            style={{
              fontSize: "clamp(2.8rem, 6vw, 5rem)",
              color: "var(--color-plum-dark)",
              opacity: 0.45,
              fontWeight: 300,
              marginLeft: "3px",
              lineHeight: 1,
            }}
          >
            %
          </span>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 z-10"
        style={{ height: "1px", backgroundColor: "rgba(91,54,68,0.1)" }}
      >
        <div
          ref={progressBarRef}
          className="absolute inset-0 origin-left"
          style={{ backgroundColor: "var(--color-gold)", transform: "scaleX(0)", willChange: "transform" }}
        />
      </div>
    </div>
  );
}

const RollingDigit = React.forwardRef<HTMLSpanElement, { digit: string }>(
  ({ digit }, _ref) => {
    const prevDigit = useRef(digit);
    const innerRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
      if (prevDigit.current === digit) return;
      prevDigit.current = digit;
      if (!innerRef.current) return;

      gsap.fromTo(
        innerRef.current,
        { y: 0, opacity: 1 },
        {
          y: "-110%",
          opacity: 0,
          duration: 0.13,
          ease: "power2.in",
          onComplete: () => {
            if (!innerRef.current) return;
            gsap.fromTo(
              innerRef.current,
              { y: "110%", opacity: 0 },
              { y: "0%", opacity: 1, duration: 0.15, ease: "power2.out" }
            );
          },
        }
      );
    }, [digit]);

    return (
      <span
        className="relative overflow-hidden inline-block"
        style={{
          fontSize: "clamp(2.8rem, 6vw, 5rem)",
          lineHeight: 1,
          fontFamily: "var(--font-serif)",
          fontWeight: 300,
          color: "var(--color-plum-dark)",
          width: "0.58em",
          textAlign: "center",
          letterSpacing: "-0.02em",
        }}
      >
        <span ref={innerRef} className="inline-block will-change-transform">
          {digit}
        </span>
      </span>
    );
  }
);
RollingDigit.displayName = "RollingDigit";
