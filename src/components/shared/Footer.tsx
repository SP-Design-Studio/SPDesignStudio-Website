"use client";

export default function Footer() {
  return (
    <footer
      className="w-full flex items-center justify-between px-8 md:px-16 py-8"
      style={{
        backgroundColor: "var(--color-plum-dark)",
        borderTop: "1px solid rgba(252,251,247,0.06)",
      }}
    >
      <span
        className="font-bdscript text-xl"
        style={{ color: "var(--color-gold)", opacity: 0.7 }}
      >
        SP Design Studio
      </span>
      <span
        className="text-xs tracking-[0.2em] uppercase font-light"
        style={{ color: "var(--color-cream)", opacity: 0.25 }}
      >
        © {new Date().getFullYear()}
      </span>
    </footer>
  );
}
