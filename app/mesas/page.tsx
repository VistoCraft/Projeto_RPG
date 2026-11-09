import type { Metadata } from "next";
import Hub from "../components/hub/Hub";

export const metadata: Metadata = {
  title: "Mesas",
};

export default function PaginaMesas() {
  return <Hub />;
}
