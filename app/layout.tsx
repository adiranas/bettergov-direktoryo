import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { LOGO_ICON_PRIMARY } from "@/lib/site";
import "./globals.css";

const kapwaSans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-kapwa-sans",
  display: "swap",
});

const kapwaMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-kapwa-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Philippine Civic Tech & CSO Directory | BetterGov.ph",
  description:
    "Open civic tech tools, public datasets and civil society organizations across the Philippines.",
  icons: { icon: LOGO_ICON_PRIMARY },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${kapwaSans.variable} ${kapwaMono.variable} antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-[var(--color-kapwa-bg-surface-raised)] font-sans">
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
