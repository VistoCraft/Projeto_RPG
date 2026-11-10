import type { Metadata } from "next";
import PaginaEditorTemplate from "../../components/templates/PaginaEditorTemplate";

export const metadata: Metadata = {
  title: "Novo template",
};

type PaginaNovoTemplateProps = {
  searchParams: Promise<{ base?: string }>;
};

export default async function PaginaNovoTemplate({ searchParams }: PaginaNovoTemplateProps) {
  const { base } = await searchParams;
  return <PaginaEditorTemplate modo="novo" baseId={base ?? null} />;
}
