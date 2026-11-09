import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Almendra, Literata } from "next/font/google";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import Rodape from "./components/Rodape";

const almendra = Almendra({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-almendra" });

const literata = Literata({ subsets: ["latin"], variable: "--font-literata" });

export const metadata: Metadata = {
  title: "RPG de mesa online",
  description: "Mesas, fichas, chat e tabuleiro para jogar RPG de mesa online",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-br" className={`dark ${almendra.variable} ${literata.variable}`}>
      <body className="flex min-h-screen flex-col bg-fundo font-texto text-texto">
        {children}
        <Rodape />
      </body>
    </html>
  );
}
