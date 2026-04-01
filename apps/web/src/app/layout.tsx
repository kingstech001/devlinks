import type { Metadata } from "next";
import "@fontsource-variable/inter";

import "../index.css";
import Providers from "@/components/providers";
import HeaderWrapper from "@/components/HeaderWrapper"; // new client component

export const metadata: Metadata = {
  title: "devlinks",
  description: "devlinks",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
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
