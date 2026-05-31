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
  src: "../../public/fonts/BDScript-Regular.woff",
  variable: "--font-bdscript",
  // "block" — keep glyphs invisible until BDScript loads instead of painting
  // the iOS `cursive` fallback. The fallback was getting frozen inside the
  // hero's composited transform layer (will-change-transform) and never
  // repainting once the real font arrived.
  display: "block",
  // Preload so the woff is fetched before the hero paints.
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
