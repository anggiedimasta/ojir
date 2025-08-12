import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { AuthProvider } from "~/components/providers/auth-provider";
import { GlobalLoadingBar } from "~/components/ui/global-loading-bar";
import { NavigationLoading } from "~/components/ui/navigation-loading";
import { Toaster } from "~/components/ui/toaster";
import { TRPCReactProvider } from "~/trpc/react";
import { viewport } from "./viewport";

import "~/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Ojir - Your Digital Wallet",
  description:
    "Track expenses, manage events, and stay organized with smart insights and seamless collaboration.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ojir",
  },
  icons: [
    { rel: "icon", url: "/favicon.svg", type: "image/svg+xml" },
    { rel: "apple-touch-icon", url: "/icons/icon-192x192.png" },
    { rel: "mask-icon", url: "/icons/icon-192x192.png" },
  ],
};

export { viewport };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="Ojir" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Ojir" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={`font-sans ${inter.variable} bg-[#0f0f0f] text-white antialiased`}
      >
        <GlobalLoadingBar />
        <NavigationLoading />
        <AuthProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </AuthProvider>
        <Toaster />
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                  },
                  function(err) {
                  }
                );
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
