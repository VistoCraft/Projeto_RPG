import type { ReactNode } from "react";
import TelaAutenticacao from "../components/autenticacao/TelaAutenticacao";

export default function LayoutAutenticacao({ children }: { children: ReactNode }) {
  return <TelaAutenticacao>{children}</TelaAutenticacao>;
}
