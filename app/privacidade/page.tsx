import type { Metadata } from "next";
import PoliticaPrivacidade from "../components/legal/PoliticaPrivacidade";

export const metadata: Metadata = {
  title: "Política de privacidade",
};

export default function PaginaPrivacidade() {
  return <PoliticaPrivacidade />;
}
