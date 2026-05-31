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
  display: "swap",
  // CRITICAL: BDScript is a 40°-slanted script (post.italicAngle = -40) that
  // mislabels itself "Regular" in its OS/2 table. iOS Safari/WebKit does strict
  // style matching and REFUSES to use a slanted face for a `font-style:normal`
  // request — it silently falls back, which is why the hero headlines rendered
  // wrong on iPhone but fine on desktop Chrome (which is lenient). Declaring the
  // face as italic (and requesting italic via `.font-bdscript`, see globals.css)
  // makes iOS accept it. This matches the working v1 site's config exactly.
  style: "italic",
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
