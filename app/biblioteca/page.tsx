import type { Metadata } from "next";
import PaginaBiblioteca from "../components/biblioteca/PaginaBiblioteca";

export const metadata: Metadata = {
  title: "Biblioteca",
};

export default function PaginaDaBiblioteca() {
  return <PaginaBiblioteca />;
}
