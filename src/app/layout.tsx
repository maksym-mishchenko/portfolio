import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
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
    "Software Engineer at Microsoft. Security-focused full-stack developer from Ukraine. Building tools that solve real problems.",
  metadataBase: new URL("https://maksym.dev"),
  openGraph: {
    title: "Maksym Mishchenko — Software Engineer",
    description:
      "Software Engineer at Microsoft. Security-focused full-stack developer from Ukraine.",
    url: "https://maksym.dev",
    siteName: "maksym.dev",
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
      {/* <!-- Hey there, curious dev! Welcome to the source. Built with Next.js, Tailwind & Framer Motion. --> */}
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
