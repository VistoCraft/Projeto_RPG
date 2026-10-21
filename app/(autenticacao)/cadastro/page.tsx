import type { Metadata } from "next";
import FormularioCadastro from "../../components/autenticacao/FormularioCadastro";

export const metadata: Metadata = {
  title: "Criar conta",
};

export default function PaginaCadastro() {
  return <FormularioCadastro />;
}
