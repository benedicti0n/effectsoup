import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "EffectSoup — Beautiful image effects, made in the browser.",
  description:
    "Transform any image with pixel grids, halftones, ASCII art, glowing symbols, cinematic bloom, and graphic print effects — directly in your browser."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-canvas font-body text-ink-primary antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
