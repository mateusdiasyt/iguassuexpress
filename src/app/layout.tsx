import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { getSiteSettings } from "@/data/queries";
import "./globals.css";

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const headingFont = Manrope({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

function resolveFaviconUrl(value?: string | null) {
  if (!value || !value.trim()) {
    return "/favicon.ico";
  }

  return value;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const hotelName = settings.hotelName?.trim() || "Iguassu Express Hotel";
  const faviconUrl = resolveFaviconUrl(settings.favicon);

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    ),
    title: {
      default: hotelName,
      template: `%s | ${hotelName}`,
    },
    description:
      "Hotel em Foz do Iguacu com reservas diretas, restaurante, apartamentos confortaveis e localizacao estrategica.",
    icons: {
      icon: [{ url: faviconUrl }],
      shortcut: [{ url: faviconUrl }],
      apple: [{ url: faviconUrl }],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${bodyFont.variable} ${headingFont.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
