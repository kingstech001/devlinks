import type { Metadata } from "next";
import { Instrument_Sans, Geist_Mono } from "next/font/google";

import "../index.css";
import Providers from "@/components/providers";
import HeaderWrapper from "@/components/HeaderWrapper"; // new client component

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "devlinks",
  description: "devlinks",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${instrumentSans.variable} ${geistMono.variable}`}
    >
      <body className="antialiased">
        <Providers>
          <HeaderWrapper />
          <div className="min-h-screen flex items-center justify-center">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}