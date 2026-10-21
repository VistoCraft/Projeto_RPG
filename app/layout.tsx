import type { Metadata } from "next";
import type { ReactNode } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ficha do jogador",
  description: "Uma ficha interativa para mestrar RPG",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="bg-fundo text-white">{children}</body>
    </html>
  );
}
