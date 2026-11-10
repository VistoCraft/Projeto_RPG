import type { Metadata } from "next";
import PaginaFichaBiblioteca from "../../../components/biblioteca/PaginaFichaBiblioteca";

export const metadata: Metadata = {
  title: "Ficha da biblioteca",
};

export default function PaginaDaFichaDaBiblioteca() {
  return <PaginaFichaBiblioteca />;
}
