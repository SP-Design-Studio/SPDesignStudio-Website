import type { Metadata, Viewport } from "next";
import { Cormorant, DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import PageTransition from "@/components/shared/PageTransition";
import ScrollCue from "@/components/shared/ScrollCue";
import { GRAIN_ENABLED } from "@/lib/config";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESC,
  OG_IMAGE,
  organizationLd,
} from "@/lib/seo";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESC,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESC,
    images: [{ url: OG_IMAGE, width: 1200, height: 800, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESC,
    images: [OG_IMAGE],
  },
  icons: { icon: "/images/logo.svg" },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }}
        />
        <PageTransition />
        {children}
        <ScrollCue />
        {GRAIN_ENABLED && <div className="grain-overlay" aria-hidden />}
      </body>
    </html>
  );
}
