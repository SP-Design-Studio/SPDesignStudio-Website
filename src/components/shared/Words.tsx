import React from "react";

type Props = {
  words: readonly string[];
  refStore: React.MutableRefObject<(HTMLSpanElement | null)[]>;
  spacing?: string;
  baseStyle?: React.CSSProperties;
  wordStyleByIndex?: (i: number) => React.CSSProperties | undefined;
  initialHidden?: boolean;
  flat?: boolean;
};

const PAD_X = "0.5em";

export function Words({
  words,
  refStore,
  spacing = "0.32em",
  baseStyle,
  wordStyleByIndex,
  initialHidden,
  flat,
}: Props) {
  const pad = flat ? "0em" : PAD_X;
  return (
    <>
      {words.map((w, i) => (
        <span
          key={i}
          ref={(el) => { refStore.current[i] = el; }}
          className="inline-block overflow-visible"
          style={{
            paddingInline: pad,
            marginRight: `calc(${spacing} - ${pad} - ${pad})`,
            marginLeft: i === 0 ? `calc(-1 * ${pad})` : "0",
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
