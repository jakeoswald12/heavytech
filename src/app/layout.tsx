import type { Metadata, Viewport } from "next";
import { Martian_Mono, Tomorrow } from "next/font/google";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import ScrollReveal from "@/components/ScrollReveal";
import { revealScript, themeScript } from "@/lib/inline-scripts";
import { site } from "@/data/site";
import "./globals.css";
import "./components.css";

const tomorrow = Tomorrow({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-tomorrow", display: "swap" });
const martian = Martian_Mono({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-martian", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.heavytech.ai"),
  title: { default: `${site.name} | Hybrid and electric off-highway machines`, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    images: [{ url: "/images/machines/ctl_main.webp", width: 1800, height: 1211, alt: "HeavyTech HT-1 compact track loader" }],
    type: "website",
  },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0d0d0c" },
    { media: "(prefers-color-scheme: light)", color: "#f3eee8" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${tomorrow.variable} ${martian.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript + revealScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <ScrollReveal />
      </body>
    </html>
  );
}
