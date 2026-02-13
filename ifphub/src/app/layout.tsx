import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./frontend/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "IFPHub Noticias",
    template: "%s | IFPHub Noticias",
  },
  description: "Portal de noticias, eventos y recursos del campus IFP.",
  icons: {
    icon: "/imagenes/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
