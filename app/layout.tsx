import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Almendra, Literata } from "next/font/google";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";

const almendra = Almendra({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-almendra" });

const literata = Literata({ subsets: ["latin"], variable: "--font-literata" });

export const metadata: Metadata = {
  title: "Ficha do jogador",
  description: "Uma ficha interativa para mestrar RPG",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-br" className={`dark ${almendra.variable} ${literata.variable}`}>
      <body className="bg-fundo font-texto text-texto">{children}</body>
    </html>
  );
}
