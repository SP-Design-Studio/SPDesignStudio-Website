import React from "react";

type Props = {
  text: string;
  refStore: React.MutableRefObject<(HTMLSpanElement | null)[]>;
  charStyleByIndex?: (i: number) => React.CSSProperties | undefined;
};

export function Chars({ text, refStore, charStyleByIndex }: Props) {
  return (
    <>
      {text.split("").map((c, i) => (
        <span
          key={i}
          ref={(el) => { refStore.current[i] = el; }}
          className="inline-block will-change-transform"
          style={{
            whiteSpace: "pre",
            transformOrigin: "50% 100%",
            backfaceVisibility: "hidden",
            ...(charStyleByIndex?.(i) ?? {}),
          }}
        >
          {c === " " ? " " : c}
        </span>
      ))}
    </>
  );
}
