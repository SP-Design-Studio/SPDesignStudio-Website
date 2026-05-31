import React from "react";

type Props = {
  words: readonly string[];
  refStore: React.MutableRefObject<(HTMLSpanElement | null)[]>;
  spacing?: string;
  baseStyle?: React.CSSProperties;
  wordStyleByIndex?: (i: number) => React.CSSProperties | undefined;
  /** Start invisible until the reveal flips visibility (see PinnedScroll). */
  initialHidden?: boolean;
};

export function Words({
  words,
  refStore,
  spacing = "0.32em",
  baseStyle,
  wordStyleByIndex,
  initialHidden,
}: Props) {
  return (
    <>
      {words.map((w, i) => (
        <span
          key={i}
          ref={(el) => { refStore.current[i] = el; }}
          // No `will-change-transform`: see Chars.tsx — it freezes the iOS
          // Safari fallback-font raster into a permanent composited layer.
          className="inline-block overflow-visible"
          style={{
            marginRight: spacing,
            transformOrigin: "50% 100%",
            ...(initialHidden ? { visibility: "hidden" as const } : {}),
            ...baseStyle,
            ...(wordStyleByIndex?.(i) ?? {}),
          }}
        >
          {w}
        </span>
      ))}
    </>
  );
}
