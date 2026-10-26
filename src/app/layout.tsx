/*
|-----------------------------------------
| setting up layout.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 14 August 2026
|-----------------------------------------
*/

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { getCanonicalAppUrl } from "@/app/api/lib/canonical-app-url";
import { ConfirmDeleteProvider } from "@/components/confirm-delete-provider";
import Footer from "@/components/footer/Footer";
import { Menu } from "@/components/menu/Menu";
import MobileNavigation from "@/components/MobileNavigation";
import { PublicMobileNavigationSpacing } from "@/components/PublicMobileNavigationSpacing";
import { ScrollTransition } from "@/components/ScrollTransition";
import TopBanner from "@/components/topbanner/TopBanner";
import { GlobalToast } from "@/components/ui/global-toast";
import WhatsAppButton from "@/components/whatsapp/WhatsAppButton";
import { getSeoSettings } from "@/lib/services/seo-settings";
import { ReduxProvider } from "@/redux/app/provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const setting = await getSeoSettings({ type: "layout" });
  const title = setting?.title || "TestPrep Center";
  const description =
    setting?.description ||
    "TestPrep Center (TPC) is Bangladesh's online learning platform for IELTS preparation, study-abroad guidance, and kids' spoken English courses.";
  const images = setting?.socialImage ? [setting.socialImage] : undefined;
  return {
    metadataBase: getCanonicalAppUrl(),
    title,
    description,
    applicationName: "TestPrep Center",
    icons: { icon: "/Logo.png" },
    appleWebApp: { capable: true, statusBarStyle: "default", title: "TestPrep Center" },
    formatDetection: { telephone: false },
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "TestPrep Center",
      ...(setting?.canonicalUrl ? { url: setting.canonicalUrl } : {}),
      ...(images ? { images } : {}),
    },
    twitter: { card: "summary_large_image", title, description, ...(images ? { images } : {}) },
    ...(setting?.canonicalUrl ? { alternates: { canonical: setting.canonicalUrl } } : {}),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col">
        <div className="print:hidden">
          <ScrollTransition />
          <GlobalToast />
        </div>
        <ReduxProvider>
          <ConfirmDeleteProvider>
            <div className="print:hidden">
              <TopBanner />
              <Menu />
            </div>
            <PublicMobileNavigationSpacing>
              <>
                {children}
                <div className="print:hidden">
                  <Footer />
                </div>
              </>
            </PublicMobileNavigationSpacing>
            <div className="print:hidden">
              <WhatsAppButton />
              <MobileNavigation />
            </div>
          </ConfirmDeleteProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
