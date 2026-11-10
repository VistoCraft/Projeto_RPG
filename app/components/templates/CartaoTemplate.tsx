import { useState } from "react";
import Link from "next/link";
import type { Template } from "@/src/dominio/template";
import { botaoContorno, botaoPerigo, cartaoBase } from "../estilos";

type CartaoTemplateProps = {
  template: Template;
  logado: boolean;
  executando?: boolean;
  aoExcluir?: () => void;
};

export default function CartaoTemplate({ template, logado, executando = false, aoExcluir }: CartaoTemplateProps) {
  const [confirmando, setConfirmando] = useState(false);

  return (
    <li className={`${cartaoBase} flex flex-col gap-3 overflow-hidden`}>
      <div className={`h-1.5 bg-linear-to-r ${template.padrao ? "from-essencia via-mare to-arcano" : "from-arcano via-mare to-essencia"} opacity-80`}></div>
      <div className="flex flex-1 flex-col gap-3 px-5 pb-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-titulo text-[22px] leading-tight font-bold">{template.nome}</h3>
          <span className="shrink-0 rounded-full border border-borda px-2.5 py-0.5 text-xs">{template.padrao ? "Padrão" : "Seu"}</span>
        </div>
        <p className="line-clamp-3 text-sm opacity-80">{template.descricao || "Sem descrição."}</p>
        <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-borda pt-3">
          {confirmando ? (
            <span className="flex items-center gap-2 text-sm" role="group" aria-label={`Confirmar exclusão de ${template.nome}`}>
              Excluir de vez?
              <button type="button" className={botaoPerigo} disabled={executando} onClick={aoExcluir}>Excluir</button>
              <button type="button" className={botaoContorno} onClick={() => setConfirmando(false)}>Manter</button>
            </span>
          ) : (
            <>
              <Link className={`${botaoContorno} text-sm`} href={`/templates/${template.id}`}>
                <i className={`bi ${template.padrao ? "bi-eye" : "bi-pencil"}`} aria-hidden="true"></i> {template.padrao ? "Ver" : "Editar"}
              </Link>
              {logado && (
                <Link className={`${botaoContorno} text-sm`} href={`/templates/novo?base=${template.id}`}>
                  <i className="bi bi-copy" aria-hidden="true"></i> Criar cópia
                </Link>
              )}
              {aoExcluir && (
                <button type="button" className={`${botaoPerigo} ml-auto`} aria-label={`Excluir ${template.nome}`} onClick={() => setConfirmando(true)}>
                  <i className="bi bi-trash" aria-hidden="true"></i>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </li>
  );
}
