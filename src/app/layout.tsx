/*
App Name: CWL Hardware
App Client: CWL Hardware
Author: James Bryant D. Espino
URL: https://github.com/Jamespino20
Last Update Date: July 16, 2026
*/

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";

const montserrat = localFont({
  src: [
    { path: "../../public/fonts/Montserrat/Montserrat-Regular.ttf", weight: "400" },
    { path: "../../public/fonts/Montserrat/Montserrat-SemiBold.ttf", weight: "600" },
    { path: "../../public/fonts/Montserrat/Montserrat-Black.ttf", weight: "900" },
  ],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: "../../public/fonts/JetBrainsMono-Regular.ttf",
  weight: "400",
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CWL Hardware — POS & Inventory System",
  description:
    "Complete point-of-sale, inventory, and supplier management system by CWL Hardware.",
  icons: {
    icon: "/favicon.ico",
  },
};

import { Providers } from "@/components/providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", montserrat.variable)}
      style={{ overflowX: "clip" }}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var _ric=window.requestIdleCallback;if(_ric){window.requestIdleCallback=function(cb,opts){return _ric.call(window,function(deadline){try{cb(deadline)}catch(e){console.warn("[web-vitals] suppressed:",e.message)}},opts)}}})();`,
          }}
        />
      </head>
      <body
        className={`${jetbrainsMono.variable} antialiased`}
        style={{ overflowX: "clip" }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
