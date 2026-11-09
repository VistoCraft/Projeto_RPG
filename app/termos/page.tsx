import type { Metadata } from "next";
import TermosDeUso from "../components/legal/TermosDeUso";

export const metadata: Metadata = {
  title: "Termos de uso",
};

export default function PaginaTermos() {
  return <TermosDeUso />;
}
