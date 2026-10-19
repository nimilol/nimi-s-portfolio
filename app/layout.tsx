import type { Metadata } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Inter for body text, Inter Tight for big headings, JetBrains Mono for small spaced labels.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const interTight = Inter_Tight({ variable: "--font-inter-tight", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-jb-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://nimi-portfolio.vercel.app"),
  title: "nimi — ai, tech & crypto",
  description: "Nimi writes about and builds with AI, tech and crypto.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable} ${mono.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
