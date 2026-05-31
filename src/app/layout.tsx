import type { Metadata, Viewport } from "next";
import { Cormorant, DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import PageTransition from "@/components/shared/PageTransition";

const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

// Self-hosted via next/font — Next bundles it with a hashed URL, preload
// and correct headers, so it loads reliably on Vercel (no CSS @font-face FOUT/fallback).
const bdScript = localFont({
  // WOFF2 — iOS Safari (esp. Private Browsing) renders it far more reliably
  // than the FontForge-generated WOFF1, which was falling through to the
  // system `cursive` fallback on the hero headlines. iOS has supported WOFF2
  // since iOS 10, so WOFF1 is no longer needed.
  src: "../../public/fonts/BDScript-Regular.woff2",
  variable: "--font-bdscript",
  // "swap" so the headline never stays invisible if the font is slow — it's
  // preloaded, so the swap window is effectively zero on a warm load.
  display: "swap",
  // Drop next/font's auto Arial fallback face: it uses `local(Arial)`, which
  // iOS Safari Private Browsing blocks (anti-fingerprinting), causing the
  // chain to skip to the ugly `cursive` system script. Without it the chain
  // is just bdScript -> our explicit fallback.
  adjustFontFallback: false,
  preload: true,
});

export const metadata: Metadata = {
  title: "SP Design Studio",
  description: "Interior design studio crafting spaces that merge technical rigor with intentional living.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${bdScript.variable}`}>
      <body>
        <PageTransition />
        {children}
      </body>
    </html>
  );
}
