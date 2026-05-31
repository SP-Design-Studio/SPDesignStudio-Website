"use client";

import { useEffect, useState } from "react";

// TEMPORARY diagnostic — shows what the device actually computes for the
// BDScript hero text. Remove after debugging.
export default function FontDebug() {
  const [info, setInfo] = useState("collecting…");

  useEffect(() => {
    const run = () => {
      const span = document.querySelector(
        ".font-bdscript span",
      ) as HTMLElement | null;
      const cs = span ? getComputedStyle(span) : null;
      const fd = document.fonts;
      const lines = [
        `face loaded italic: ${fd?.check?.('italic 64px "bdScript"')}`,
        `face loaded normal: ${fd?.check?.('64px "bdScript"')}`,
        `hero font-family: ${cs?.fontFamily ?? "n/a"}`,
        `hero font-style:  ${cs?.fontStyle ?? "n/a"}`,
        `hero visibility:  ${cs?.visibility ?? "n/a"}`,
        `UA: ${navigator.userAgent.slice(0, 60)}`,
      ];
      setInfo(lines.join("\n"));
    };
    run();
    document.fonts?.ready?.then(run);
    const t = setTimeout(run, 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999999,
        background: "rgba(0,0,0,0.92)",
        color: "#39ff14",
        font: "11px/1.4 monospace",
        padding: "10px 12px",
        whiteSpace: "pre-line",
      }}
    >
      {info}
      {/* Reference renderings — compare these to the hero text by eye. */}
      <div
        style={{
          color: "#fff",
          fontFamily: '"bdScript"',
          fontStyle: "italic",
          fontSize: 30,
        }}
      >
        A) bdScript ITALIC: Your Space
      </div>
      <div
        style={{
          color: "#fff",
          fontFamily: '"bdScript"',
          fontStyle: "normal",
          fontSize: 30,
        }}
      >
        B) bdScript NORMAL: Your Space
      </div>
      <div style={{ color: "#fff", fontFamily: "cursive", fontSize: 30 }}>
        C) system cursive: Your Space
      </div>
    </div>
  );
}
