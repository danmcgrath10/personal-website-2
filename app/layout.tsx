import type { Metadata } from "next";
import { Michroma, Silkscreen } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from '@vercel/speed-insights/next';

const michroma = Michroma({
  variable: "--font-michroma",
  subsets: ["latin"],
  weight: "400",
});

const silkscreen = Silkscreen({
  variable: "--font-silkscreen",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.dannymportfolio.com"),
  title: "Daniel McGrath | Software Engineer in Boston, MA",
  description: "Daniel McGrath is a software engineer based in Boston, MA. See projects and work experience at Klaviyo, DeVil-Tech, Criteo, WHOOP, and MEDITECH.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Daniel McGrath | Software Engineer in Boston, MA",
    description: "Projects and work experience from Daniel McGrath, a software engineer based in Boston, MA.",
    url: "/",
    siteName: "Daniel McGrath",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${michroma.variable} ${silkscreen.variable}`}>
      <head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="font-sans antialiased">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
