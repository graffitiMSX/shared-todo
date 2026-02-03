import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/providers/query-provider";
import { AuthProvider } from "@/lib/providers/auth-provider";
import { LanguageProvider } from "@/lib/providers/language-provider";
import { CapacitorProvider } from "@/lib/providers/capacitor-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shared Todo - Plan Together",
  description: "A shared todo app for couples to manage tasks together",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Shared Todo",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#059669",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CapacitorProvider>
          <LanguageProvider>
            <QueryProvider>
              <AuthProvider>{children}</AuthProvider>
            </QueryProvider>
          </LanguageProvider>
        </CapacitorProvider>
      </body>
    </html>
  );
}
