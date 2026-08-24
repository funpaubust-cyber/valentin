import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Header } from "@/components/modules/Header";
import { Footer } from "@/components/modules/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { YandexMetrika } from "@/components/seo/YandexMetrika";
import { siteImages } from "@/data/products";
import { siteUrl } from "@/lib/site";
import { Providers } from "./providers";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
});

const url = siteUrl();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F4F1EA",
};

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: "Valentin — кухни и мебель премиум-класса",
    template: "%s",
  },
  description:
    "Кухни по индивидуальным размерам, прихожие и люксовые диваны в Белгороде. Салон Valentin, МЦ «Мебельный город».",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url,
    siteName: "Valentin",
    title: "Valentin — кухни и мебель премиум-класса",
    description:
      "Кухни, прихожие и диваны. Замер, проект и изготовление в салоне Valentin, Белгород.",
    images: [{ url: siteImages.hero }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Valentin — кухни и мебель премиум-класса",
    description:
      "Кухни, прихожие и диваны в салоне Valentin, Белгород.",
    images: [siteImages.hero],
  },
  icons: {
    icon: [{ url: "/favicon-32.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${display.variable} ${sans.variable}`}>
        <JsonLd />
        <YandexMetrika />
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
