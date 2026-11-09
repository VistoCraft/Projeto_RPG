import type { Metadata } from "next";
import Ficha from "../components/Ficha";

export const metadata: Metadata = {
  title: "Ficha do jogador",
};

export default function PaginaFicha() {
  return <Ficha />;
}
