import { useState } from "react";
import Link from "next/link";
import type { ResumoFicha } from "@/src/dominio/ficha";
import { botaoContorno, botaoPerigo } from "../estilos";

type ItemFichaProps = {
  mesaId: string;
  ficha: ResumoFicha;
  podeCuidar: boolean;
  executando: boolean;
  aoEditar: () => void;
  aoExcluir: () => void;
};

function rotuloDono(ficha: ResumoFicha): string {
  if (!ficha.donoId) return "NPC do mestre";
  return ficha.ehMinha ? "Você" : ficha.dono ?? "Jogador";
}

export default function ItemFicha({ mesaId, ficha, podeCuidar, executando, aoEditar, aoExcluir }: ItemFichaProps) {
  const [confirmando, setConfirmando] = useState(false);

  return (
    <li className={`flex flex-wrap items-center gap-3 rounded-md border px-3 py-2.5 ${ficha.ehMinha ? "border-arcano/50 bg-arcano/10" : "border-borda bg-fundo"}`}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-arcano/15 text-destaque">
        <i className={`bi ${ficha.tipo === "completa" ? "bi-person-vcard" : "bi-feather"}`} aria-hidden="true"></i>
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <Link className="truncate font-semibold hover:text-destaque hover:underline" href={`/mesas/${mesaId}/fichas/${ficha.id}`}>{ficha.nome}</Link>
        <span className="flex flex-wrap items-center gap-x-3 text-xs opacity-75">
          <span><i className="bi bi-person" aria-hidden="true"></i> {rotuloDono(ficha)}</span>
          {podeCuidar && (
            <span>
              <i className={`bi ${ficha.visivelParaJogadores ? "bi-eye" : "bi-eye-slash"}`} aria-hidden="true"></i>{" "}
              {ficha.visivelParaJogadores ? "Visível para os jogadores" : "Oculta dos outros jogadores"}
            </span>
          )}
          {!podeCuidar && !ficha.podeEditar && <span><i className="bi bi-lock" aria-hidden="true"></i> Só leitura</span>}
        </span>
      </div>
      {!confirmando && (
        <Link className={`${botaoContorno} text-sm`} href={`/mesas/${mesaId}/fichas/${ficha.id}`}>
          <i className="bi bi-box-arrow-up-right" aria-hidden="true"></i> Abrir
        </Link>
      )}
      {podeCuidar && !confirmando && (
        <span className="flex gap-2">
          <button type="button" className={botaoContorno} aria-label={`Editar ${ficha.nome}`} onClick={aoEditar}>
            <i className="bi bi-pencil" aria-hidden="true"></i>
          </button>
          <button type="button" className={botaoPerigo} aria-label={`Excluir ${ficha.nome}`} onClick={() => setConfirmando(true)}>
            <i className="bi bi-trash" aria-hidden="true"></i>
          </button>
        </span>
      )}
      {confirmando && (
        <span className="flex items-center gap-2 text-sm" role="group" aria-label={`Confirmar exclusão de ${ficha.nome}`}>
          Excluir de vez?
          <button type="button" className={botaoPerigo} disabled={executando} onClick={aoExcluir}>Excluir</button>
          <button type="button" className={botaoContorno} onClick={() => setConfirmando(false)}>Manter</button>
        </span>
      )}
    </li>
  );
}
