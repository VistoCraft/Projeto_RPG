import type { Metadata } from "next";
import PaginaMesa from "../../components/mesa/PaginaMesa";

export const metadata: Metadata = {
  title: "Mesa",
};

export default function PaginaDaMesa() {
  return <PaginaMesa />;
}
