import type { Metadata } from "next";
import NovaMesa from "../../components/mesa/NovaMesa";

export const metadata: Metadata = {
  title: "Criar mesa",
};

export default function PaginaNovaMesa() {
  return <NovaMesa />;
}
