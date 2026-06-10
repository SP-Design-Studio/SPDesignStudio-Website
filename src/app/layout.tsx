import type { Metadata, Viewport } from "next";
import { Cormorant, DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import PageTransition from "@/components/shared/PageTransition";
import ScrollCue from "@/components/shared/ScrollCue";
import { GRAIN_ENABLED } from "@/lib/config";

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

const bdScript = localFont({
  src: "../../public/fonts/BDScript-Regular.woff",
  variable: "--font-bdscript",
  display: "swap",
  style: "italic",
});

const alta = localFont({
  src: [
    { path: "../../public/fonts/Alta/Alta_regular.otf", weight: "400", style: "normal" },
  ],
  variable: "--font-alta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SP Design Studio",
    template: "%s · SP Design Studio",
  },
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
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${bdScript.variable} ${alta.variable}`}>
      <body>
        <PageTransition />
        {children}
        <ScrollCue />
        {GRAIN_ENABLED && <div className="grain-overlay" aria-hidden />}
      </body>
    </html>
  );
}
