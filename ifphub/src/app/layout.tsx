import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./frontend/styles/globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
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
      <body className={`${manrope.variable} ${fraunces.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
