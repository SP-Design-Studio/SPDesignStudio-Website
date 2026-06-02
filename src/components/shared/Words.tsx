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

// iOS WebKit rasterizes a 3D-transformed element (each word gets a GSAP
// rotateX / perspective during the reveal) into a compositing layer sized to
// its BORDER BOX and clips any glyph ink painted outside that box — ignoring
// `overflow: visible`. BDScript is a connecting script whose first/last glyphs
// throw swashes well past the box, so they got clipped on iPhone only.
// Padding the word box outward makes the ink fall INSIDE the layer. The padding
// is cancelled out of layout with equal negative margins so word spacing,
// wrapping and the animation are all unchanged.
const PAD_X = "0.5em";

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
            // Enlarge the box horizontally so iOS doesn't clip the leading/
            // trailing swash ink…
            paddingInline: PAD_X,
            // …pull the inter-word spacing back so gaps are unchanged…
            marginRight: `calc(${spacing} - ${PAD_X} - ${PAD_X})`,
            // …and cancel the leading indent on the first word so the line
            // keeps its original position (the empty padding that slips past
            // the edge carries no ink, so nothing clips).
            marginLeft: i === 0 ? `calc(-1 * ${PAD_X})` : "0",
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
