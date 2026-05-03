import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Maksym Mishchenko — Software Engineer",
  description:
    "Software Engineer II at Microsoft Security (Identity & Application Governance). Security-focused full-stack developer from Ukraine. Building tools that solve real problems.",
  metadataBase: new URL("https://mmishchenko.dev"),
  openGraph: {
    title: "Maksym Mishchenko — Software Engineer",
    description:
      "Software Engineer at Microsoft. Security-focused full-stack developer from Ukraine.",
    url: "https://mmishchenko.dev",
    siteName: "mmishchenko.dev",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maksym Mishchenko — Software Engineer",
    description:
      "Software Engineer at Microsoft. Building tools that solve real problems.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://mmishchenko.dev" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} dark`}
    >
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Maksym Mishchenko — Blog"
          href="/blog/feed.xml"
        />
      </head>
      {/* <!-- Hey there, curious dev! Welcome to the source. Built with Next.js, Tailwind & Framer Motion. --> */}
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <a href="#main" className="skip-to-content">
          Skip to content
        </a>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
