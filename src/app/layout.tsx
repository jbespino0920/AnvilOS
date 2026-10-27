/*
App Name: CWL Hardware
App Client: CWL Hardware
Author: James Bryant D. Espino
URL: https://github.com/Jamespino20
Last Update Date: July 16, 2026
*/

import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";

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
      className={cn("font-sans")}
      style={{ overflowX: "clip" }}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){window.addEventListener("error",function(e){try{var m=String((e&&e.message)||"");var s=String((e&&e.error&&e.error.stack)||"");if(m.indexOf("startTime")!==-1&&s.indexOf("reportAllChanges")!==-1){e.preventDefault();if(e.stopImmediatePropagation)e.stopImmediatePropagation();return false}}catch(_){}},true)})();`,
          }}
        />
      </head>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){function txt(e){try{if(e&&e.reason!==undefined){var r=e.reason;return String((r&&(r.message||r))||"");}return String((e&&(e.message||""))||"");}catch(_){return "";}}function fresh(){try{var k="anvilos-reloaded-at";var l=Number(sessionStorage.getItem(k)||0);if(Date.now()-l<60000)return false;sessionStorage.setItem(k,String(Date.now()));return true;}catch(_){return false;}}window.addEventListener("unhandledrejection",function(e){var m=txt(e);if(m.indexOf("was not found on the server")!==-1||m.indexOf("Failed to find Server Action")!==-1||m.indexOf("failed-to-find-server-action")!==-1){try{e.preventDefault();}catch(_){}if(fresh())window.location.reload();}});window.addEventListener("error",function(e){try{var m=String((e&&e.message)||"");var s=String((e&&e.error&&e.error.stack)||"");if(m.indexOf("startTime")!==-1&&s.indexOf("reportAllChanges")!==-1){e.preventDefault();if(e.stopImmediatePropagation)e.stopImmediatePropagation();return false;}}catch(_){}},true)})();`,
        }}
      />
      <body
        className="font-mono antialiased"
        style={{ overflowX: "clip" }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
