import type { Metadata, Viewport } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastProvider } from "@/components/ui/toast";
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  canonical,
  getSiteOrigin
} from "@/lib/seo";

const serifDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif-display"
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" }
  ],
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export const metadata: Metadata = {
  metadataBase: new URL(getSiteOrigin()),
  title: {
    default: "EffectSoup — Beautiful Image Effects",
    template: `%s | ${SITE_NAME}`
  },
  applicationName: SITE_NAME,
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: "benedicti0n", url: "https://github.com/benedicti0n" }],
  creator: "benedicti0n",
  publisher: SITE_NAME,
  category: "Photo & Video",
  classification: "Image Editor",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
    url: false
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  alternates: {
    canonical: "/",
    languages: { "en-US": "/", "en": "/" }
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico", sizes: "any", type: "image/x-icon" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico"
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: canonical("/"),
    siteName: "EffectSoup",
    title: "EffectSoup — Beautiful Image Effects",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/effectsoupbanner.png?v=1",
        width: 1200,
        height: 630,
        alt: "EffectSoup — Beautiful Image Effects"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    site: "@benedicti0n",
    creator: "@benedicti0n",
    title: "EffectSoup — Beautiful Image Effects",
    description: SITE_DESCRIPTION,
    images: ["/effectsoupbanner.png?v=1"]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: SITE_NAME
  },
  other: {
    "application-category": "DesignApplication",
    "operating-system": "Web Browser"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className={`${serifDisplay.variable}`}>
      <head>
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="canonical" href={canonical("/")} />
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body className="min-h-screen bg-canvas font-body text-ink-primary antialiased">
        <ClerkProvider>
          <ToastProvider>{children}</ToastProvider>
          <Analytics />
        </ClerkProvider>
      </body>
    </html>
  );
}
