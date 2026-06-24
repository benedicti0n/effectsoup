import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "effectLab — Image Effects Studio",
  description: "Browser-based, non-AI image transformation studio."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-charcoal text-neon-cream">
        {children}
      </body>
    </html>
  );
}
