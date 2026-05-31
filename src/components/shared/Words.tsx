import React from "react";

type Props = {
  words: readonly string[];
  refStore: React.MutableRefObject<(HTMLSpanElement | null)[]>;
  spacing?: string;
  baseStyle?: React.CSSProperties;
  wordStyleByIndex?: (i: number) => React.CSSProperties | undefined;
};

export function Words({
  words,
  refStore,
  spacing = "0.32em",
  baseStyle,
  wordStyleByIndex,
}: Props) {
  return (
    <>
      {words.map((w, i) => (
        <span
          key={i}
          ref={(el) => { refStore.current[i] = el; }}
          className="inline-block will-change-transform"
          style={{
            marginRight: spacing,
            transformOrigin: "50% 100%",
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
