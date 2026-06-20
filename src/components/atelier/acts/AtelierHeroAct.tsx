"use client";

import { Chars } from "@/components/shared/Chars";

interface Props {
  titleCharsRef: React.RefObject<(HTMLSpanElement | null)[]>;
  taglineRef: React.RefObject<HTMLParagraphElement | null>;
}

export function AtelierHeroAct({ titleCharsRef, taglineRef }: Props) {
  return (
    <section
      id="hero"
      className="flex min-h-dvh flex-col items-center justify-center px-6 text-center"
    >
      <h1
        className="font-bdscript text-gold leading-[0.95] text-6xl sm:text-7xl md:text-8xl lg:text-9xl"
        style={{ perspective: "1200px" }}
      >
        <Chars text="Atelier" refStore={titleCharsRef} initialHidden />
      </h1>
      <p
        ref={taglineRef}
        className="mx-auto mt-8 max-w-md font-sans italic text-cream/85 leading-relaxed text-base md:text-lg"
      >
        Moments, materials, and process from inside the studio.
      </p>
    </section>
  );
}
