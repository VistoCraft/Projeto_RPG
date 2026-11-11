import { useState } from "react";
import type { Template } from "@/src/dominio/template";
import ListaErros from "../formulario/ListaErros";
import { botaoCompacto, botaoContorno, campoFicha, rotuloFicha } from "../estilos";

type TopoModeloMesaProps = {
  versao: number;
  templates: Template[];
  alterado: boolean;
  revisando: boolean;
  aviso: string | null;
  erros: string[];
  aoUsarTemplate: (templateId: string) => void;
  aoDesfazer: () => void;
  aoRevisar: () => void;
};

export default function TopoModeloMesa(props: TopoModeloMesaProps) {
  const { versao, templates, alterado, revisando, aviso, erros, aoUsarTemplate, aoDesfazer, aoRevisar } = props;
  const [templateId, setTemplateId] = useState("");

  return (
    <>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <p className="max-w-[70ch] text-sm opacity-85">
          Versão {versao} do modelo desta mesa. As mudanças valem só para esta mesa; o template de origem continua igual.
          Ao aplicar, você revisa como os campos antigos viram os novos.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {alterado && (
            <button type="button" className={botaoContorno} onClick={aoDesfazer}>
              <i className="bi bi-arrow-counterclockwise" aria-hidden="true"></i> Desfazer mudanças
            </button>
          )}
          <button type="button" className={botaoCompacto} disabled={revisando || !alterado} onClick={aoRevisar}>
            <i className="bi bi-arrow-left-right" aria-hidden="true"></i> {revisando ? "Conferindo..." : "Revisar conversão"}
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-end gap-2">
        <label className="flex min-w-[16rem] flex-1 flex-col gap-1 sm:flex-none">
          <span className={rotuloFicha}>Começar de um template</span>
          <select className={`${campoFicha} cursor-pointer`} value={templateId} onChange={(evento) => setTemplateId(evento.target.value)}>
            <option value="">Escolha um template</option>
            {templates.map((template) => <option key={template.id} value={template.id}>{template.nome}</option>)}
          </select>
        </label>
        <button type="button" className={botaoContorno} disabled={!templateId} onClick={() => aoUsarTemplate(templateId)}>
          <i className="bi bi-download" aria-hidden="true"></i> Usar este template
        </button>
      </div>
      {aviso && <p role="status" className="text-sm font-semibold text-acento"><i className="bi bi-check2-circle" aria-hidden="true"></i> {aviso}</p>}
      <ListaErros erros={erros} />
    </>
  );
}
