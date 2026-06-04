import React from "react";

type Props = {
  text: string;
  refStore: React.MutableRefObject<(HTMLSpanElement | null)[]>;
  charStyleByIndex?: (i: number) => React.CSSProperties | undefined;
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
          className="inline-block overflow-visible"
          style={{
            whiteSpace: "pre",
            transformOrigin: "50% 100%",
            backfaceVisibility: "visible",
            ...(initialHidden ? { visibility: "hidden" as const } : {}),
            ...(charStyleByIndex?.(i) ?? {}),
          }}
        >
          {c === " " ? " " : c}
        </span>
      ))}
    </>
  );
}
