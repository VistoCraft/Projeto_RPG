import type { Metadata } from "next";
import PaginaModeloMesa from "../../../components/modeloMesa/PaginaModeloMesa";

export const metadata: Metadata = {
  title: "Modelo da ficha",
};

export default function PaginaDoModeloDaMesa() {
  return <PaginaModeloMesa />;
}
