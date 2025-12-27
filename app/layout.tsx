import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_APP_URL 
    ? new URL(process.env.NEXT_PUBLIC_APP_URL)
    : new URL("https://isla-lobos.conanp.gob.mx"),
  
  title: {
    default: "APFF Sistema Arrecifal Lobos-Tuxpan - Sistema de Gestión",
    template: "%s | APFF Sistema Arrecifal Lobos-Tuxpan",
  },
  
  description:
    "Sistema de gestión turística para la Reserva Natural Isla Lobos. Gestión de embarcaciones, salidas, brazaletes y control de capacidad. Desarrollado para CONANP y prestadores de servicios autorizados.",
  
  keywords: [
    "Isla Lobos",
    "CONANP",
    "Área Protegida",
    "Gestión Turística",
    "Reserva Natural",
    "Embarcaciones",
    "Brazaletes",
    "Turismo Sostenible",
    "Sistema de Gestión",
    "Tuxpan",
    "Veracruz",
  ],
  
  authors: [
    {
      name: "CONANP",
      url: "https://www.gob.mx/conanp",
    },
    {
      name: "TresA Design",
    },
  ],
  
  creator: "TresA Design",
  
  publisher: "CONANP - Comisión Nacional de Áreas Naturales Protegidas",
  
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  // Next.js detecta automáticamente app/icon.svg
  // Configuramos explícitamente para asegurar que se use el SVG
  icons: {
    icon: "/icon.svg",
  },
  
  manifest: "/site.webmanifest",
  
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "/",
    siteName: "APFF Sistema Arrecifal Lobos-Tuxpan",
    title: "APFF Sistema Arrecifal Lobos-Tuxpan - Sistema de Gestión",
    description:
      "Sistema de gestión turística para la Reserva Natural Isla Lobos. Gestión de embarcaciones, salidas, brazaletes y control de capacidad.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "APFF Sistema Arrecifal Lobos-Tuxpan",
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "APFF Sistema Arrecifal Lobos-Tuxpan - Sistema de Gestión",
    description:
      "Sistema de gestión turística para la Reserva Natural Isla Lobos.",
    images: ["/og-image.png"],
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  verification: {
    // Agregar códigos de verificación cuando estén disponibles
    // google: "verification-code",
    // yandex: "verification-code",
    // bing: "verification-code",
  },
  
  category: "Turismo Sostenible",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
