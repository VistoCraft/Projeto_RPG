import type { Metadata } from "next";
import PaginaTemplates from "../components/templates/PaginaTemplates";

export const metadata: Metadata = {
  title: "Templates de ficha",
};

export default function PaginaDosTemplates() {
  return <PaginaTemplates />;
}
