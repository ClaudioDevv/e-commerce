import type { Metadata } from "next";
import "./globals.css";
import { inter } from '@/app/ui/fonts'
import Footer from '@/app/ui/Footer';

export const metadata: Metadata = {
  title: "E-commerce de Pizzeria ",
  description: "Proyecto personal de un sistema de pizzeria local",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased`}>
        {children}
        <Footer />
      </body>
    </html>
  );
}
