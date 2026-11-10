import type { Metadata } from "next";
import PaginaEditorTemplate from "../../components/templates/PaginaEditorTemplate";

export const metadata: Metadata = {
  title: "Template",
};

type PaginaDoTemplateProps = {
  params: Promise<{ id: string }>;
};

export default async function PaginaDoTemplate({ params }: PaginaDoTemplateProps) {
  const { id } = await params;
  return <PaginaEditorTemplate modo="existente" templateId={id} />;
}
