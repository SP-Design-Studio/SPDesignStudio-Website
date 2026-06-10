import { Words } from "@/components/shared/Words";
import { SECTIONS } from "@/lib/studio";

interface PhilosophyActProps {
  wrapRef: React.RefObject<HTMLDivElement | null>;
  eyebrowRef: React.RefObject<HTMLDivElement | null>;
  ruleRef: React.RefObject<HTMLDivElement | null>;
  wordsRef: React.RefObject<(HTMLSpanElement | null)[]>;
  bodyRef: React.RefObject<HTMLParagraphElement | null>;
}

export function PhilosophyAct({
  wrapRef,
  eyebrowRef,
  ruleRef,
  wordsRef,
  bodyRef,
}: PhilosophyActProps) {
  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 z-10 invisible overflow-y-auto"
    >
      <div className="min-h-full flex flex-col items-center justify-center text-center px-6 sm:px-10 md:px-16 lg:px-20 py-16 md:py-14">
      <div
        ref={eyebrowRef}
        className="font-bdscript text-gold tracking-[0.01em] leading-tight mb-5 sm:mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
      >
        {SECTIONS.philosophy.eyebrow}
      </div>

      <div
        ref={ruleRef}
        className="w-15 h-px bg-gold/70 mb-[clamp(28px,4vw,52px)]"
      />

      <div
        className="mb-8 sm:mb-10 md:mb-14 max-w-255 font-serif font-light text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.15] tracking-[-0.005em]"
        style={{ perspective: "1200px" }}
      >
        <Words
          words={SECTIONS.philosophy.words}
          refStore={wordsRef}
          spacing="0.34em"
          wordStyleByIndex={(i) => {
            const italic = i >= SECTIONS.philosophy.italicFromIndex;
            return {
              color: italic ? "var(--color-plum)" : "var(--color-plum-dark)",
              fontStyle: italic ? "italic" : "normal",
              opacity: italic ? 0.62 : 1,
            };
          }}
        />
      </div>

      <p
        ref={bodyRef}
        className="font-sans font-normal leading-relaxed text-plum/80 max-w-145 text-base sm:text-lg md:text-xl"
        style={{ lineHeight: 1.75 }}
      >
        {SECTIONS.philosophy.body}
      </p>
      </div>
    </div>
  );
}
