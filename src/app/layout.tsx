import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SaveStack - Find Every Energy Rebate & Tax Credit",
  description:
    "Discover all federal tax credits, state rebates, utility incentives, and manufacturer promotions for your home energy upgrades. Calculate your total savings in minutes.",
  keywords: [
    "energy rebates",
    "tax credits",
    "heat pump rebates",
    "IRA rebates",
    "home energy savings",
    "utility rebates",
  ],
  openGraph: {
    title: "SaveStack - Find Every Energy Rebate & Tax Credit",
    description:
      "Discover all federal tax credits, state rebates, utility incentives, and manufacturer promotions for your home energy upgrades.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
