import { useEffect, useState } from "react";
import Link from "next/link";
import type { ResumoBiblioteca } from "@/src/dominio/biblioteca";
import { ROTULO_TIPO_FICHA } from "@/src/dominio/ficha";
import { botaoContorno, botaoPerigo, cartaoBase } from "../estilos";

type CartaoBibliotecaProps = {
  ficha: ResumoBiblioteca;
  executando: boolean;
  aoExcluir: () => void;
};

const FORMATO_DATA: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" };

export default function CartaoBiblioteca({ ficha, executando, aoExcluir }: CartaoBibliotecaProps) {
  const [confirmando, setConfirmando] = useState(false);
  const [data, setData] = useState("");

  useEffect(() => {
    setData(new Date(ficha.atualizadaEm).toLocaleDateString("pt-BR", FORMATO_DATA));
  }, [ficha.atualizadaEm]);

  return (
    <li className={`${cartaoBase} flex flex-col gap-4 overflow-hidden`}>
      <div className="h-1.5 bg-linear-to-r from-essencia via-mare to-arcano opacity-80"></div>
      <div className="flex flex-1 flex-col gap-3 px-5 pb-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-arcano/15 text-destaque">
            <i className={`bi ${ficha.tipo === "completa" ? "bi-person-vcard" : "bi-feather"}`} aria-hidden="true"></i>
          </span>
          <div className="flex min-w-0 flex-col">
            <h2 className="truncate font-titulo text-[22px] leading-tight font-bold">{ficha.nome}</h2>
            <span className="text-xs opacity-70">{ROTULO_TIPO_FICHA[ficha.tipo]}</span>
          </div>
        </div>
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
          <dt className="opacity-70"><i className="bi bi-journal-text" aria-hidden="true"></i> Modelo</dt>
          <dd className="truncate">{ficha.template}</dd>
          <dt className="opacity-70"><i className="bi bi-clock" aria-hidden="true"></i> Guardada</dt>
          <dd>{data}</dd>
        </dl>
        <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-borda pt-3">
          {confirmando ? (
            <span className="flex items-center gap-2 text-sm" role="group" aria-label={`Confirmar exclusão de ${ficha.nome}`}>
              Excluir de vez?
              <button type="button" className={botaoPerigo} disabled={executando} onClick={aoExcluir}>Excluir</button>
              <button type="button" className={botaoContorno} onClick={() => setConfirmando(false)}>Manter</button>
            </span>
          ) : (
            <>
              <Link className={`${botaoContorno} text-sm`} href={`/biblioteca/fichas/${ficha.id}`}>
                <i className="bi bi-eye" aria-hidden="true"></i> Ver ficha
              </Link>
              <button type="button" className={`${botaoPerigo} ml-auto`} aria-label={`Excluir ${ficha.nome} da biblioteca`} onClick={() => setConfirmando(true)}>
                <i className="bi bi-trash" aria-hidden="true"></i>
              </button>
            </>
          )}
        </div>
        <p className="text-xs opacity-60">Para levar a uma mesa, abra a mesa e use “Escolher da biblioteca” na área de fichas.</p>
      </div>
    </li>
  );
}
