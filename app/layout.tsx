import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import type { ReactNode } from "react";
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
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${kapwaSans.variable} ${kapwaMono.variable} antialiased`}
    >
      <body className="bg-[var(--color-kapwa-bg-surface-raised)] font-sans">
        {children}
      </body>
    </html>
  );
}
