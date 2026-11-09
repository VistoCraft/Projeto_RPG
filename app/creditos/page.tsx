import type { Metadata } from "next";
import Creditos from "../components/legal/Creditos";

export const metadata: Metadata = {
  title: "Créditos",
};

export default function PaginaCreditos() {
  return <Creditos />;
}
