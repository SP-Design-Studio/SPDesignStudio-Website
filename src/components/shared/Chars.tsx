import React from "react";

type Props = {
  text: string;
  refStore: React.MutableRefObject<(HTMLSpanElement | null)[]>;
  charStyleByIndex?: (i: number) => React.CSSProperties | undefined;
  /**
   * Render the chars invisible on first paint (opacity:0 baked into the
   * markup). Use for text that is visible at mount before its reveal
   * animation runs — prevents iOS Safari from rasterizing the system
   * `cursive` fallback into the will-change composited layer and freezing it
   * there before the real web font (BDScript) finishes loading.
   */
  initialHidden?: boolean;
};

export function Chars({
  text,
  refStore,
  charStyleByIndex,
  initialHidden,
}: Props) {
  return (
    <>
      {text.split("").map((c, i) => (
        <span
          key={i}
          ref={(el) => { refStore.current[i] = el; }}
          // NOTE: no `will-change-transform` here. On iOS Safari it forces a
          // permanent composited layer that rasterizes the system `cursive`
          // fallback before the BDScript web font loads and then FREEZES it —
          // the headline stays in the wrong font forever. Let GSAP create the
          // (transient) layer during the reveal instead, by which point the
          // font is loaded.
          className="inline-block overflow-visible"
          style={{
            whiteSpace: "pre",
            transformOrigin: "50% 100%",
            backfaceVisibility: "hidden",
            ...(initialHidden ? { opacity: 0 } : {}),
            ...(charStyleByIndex?.(i) ?? {}),
          }}
        >
          {c === " " ? " " : c}
        </span>
      ))}
    </>
  );
}
