import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Pumpky — AI Meme Coin Intelligence",
    template: "%s | Pumpky",
  },
  description:
    "Discover, rank, and analyze meme coins for short-term opportunities. AI-powered scoring, risk analysis, and momentum signals for serious on-chain traders.",
  keywords: [
    "meme coin",
    "crypto trading",
    "dex analytics",
    "pump radar",
    "defi",
    "solana memes",
    "AI crypto",
  ],
  openGraph: {
    title: "Pumpky — AI Meme Coin Intelligence",
    description: "Terminal-grade meme coin analysis for the information class.",
    type: "website",
    siteName: "Pumpky",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pumpky — AI Meme Coin Intelligence",
    description: "Terminal-grade meme coin analysis for the information class.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#030303" />
      </head>
      <body className="antialiased bg-[#030303] text-[#f0f0f0] overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
