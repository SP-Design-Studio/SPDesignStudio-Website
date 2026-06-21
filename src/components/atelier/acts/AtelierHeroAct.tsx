"use client";

import { Words } from "@/components/shared/Words";

interface Props {
  titleWordsRef: React.RefObject<(HTMLSpanElement | null)[]>;
  taglineRef: React.RefObject<HTMLParagraphElement | null>;
}

export function AtelierHeroAct({ titleWordsRef, taglineRef }: Props) {
  return (
    <section
      id="hero"
      className="flex min-h-dvh flex-col items-center justify-center px-6 text-center"
    >
      <h1
        className="font-bdscript text-gold leading-[0.95] text-6xl sm:text-7xl md:text-8xl lg:text-9xl"
        style={{ perspective: "1200px" }}
      >
        <Words
          words={["Atelier"]}
          refStore={titleWordsRef}
          spacing="0.06em"
          initialHidden
        />
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
