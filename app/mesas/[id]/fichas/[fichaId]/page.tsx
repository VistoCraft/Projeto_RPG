import type { Metadata } from "next";
import PaginaFicha from "../../../../components/ficha/PaginaFicha";

export const metadata: Metadata = {
  title: "Ficha",
};

export default function PaginaDaFicha() {
  return <PaginaFicha />;
}
