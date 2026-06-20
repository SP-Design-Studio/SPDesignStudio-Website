import type { Metadata, Viewport } from "next";
import { Cormorant, DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import PageTransition from "@/components/shared/PageTransition";
import ScrollCue from "@/components/shared/ScrollCue";
import { getGrainEnabled } from "@/lib/config";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESC,
  OG_IMAGE,
  KEYWORDS,
  organizationLd,
  websiteLd,
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
  keywords: KEYWORDS,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESC,
    images: [{ url: OG_IMAGE, width: 2000, height: 1055, alt: SITE_NAME }],
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const grainEnabled = await getGrainEnabled();
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${bdScript.variable} ${alta.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd()) }}
        />
        <PageTransition />
        {children}
        <ScrollCue />
        {grainEnabled && <div className="grain-overlay" aria-hidden />}
      </body>
    </html>
  );
}
