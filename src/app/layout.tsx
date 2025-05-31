import { type Metadata } from "next";
import { Inter } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import { AuthProvider } from "~/components/providers/auth-provider";
import { Toaster } from "~/components/ui/toaster";

import "~/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Ojir - Your Digital Wallet",
  description: "Track expenses, manage events, and stay organized with smart insights and seamless collaboration.",
  icons: [
    { rel: "icon", url: "/favicon.svg", type: "image/svg+xml" },
    { rel: "apple-touch-icon", url: "/favicon.svg" }
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} bg-[#0f0f0f] text-white antialiased`}>
        <AuthProvider>
          <TRPCReactProvider>
            {children}
          </TRPCReactProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
