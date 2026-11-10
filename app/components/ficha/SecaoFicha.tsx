import { createContext, useContext, type ReactNode } from "react";
import type { AparenciaSecao, BordaFicha, TituloFicha } from "@/src/dominio/estiloFicha";
import { tituloPainel } from "../estilos";

export type IdentidadeSecao = { id: string; titulo: string; icone: string; caminho: string };

/** Borda e título de cada seção, vindos do estilo do template (FichaModelo fornece um por seção). */
export const AparenciaSecaoContexto = createContext<AparenciaSecao>({ cor: null, borda: "fina", titulo: "simples" });

const BORDAS: Record<BordaFicha, string> = {
  fina: "border border-borda shadow-sm",
  grossa: "border-2 border-borda shadow-sm",
  destaque: "border border-l-4 border-destaque/40 border-l-destaque shadow-sm",
  nenhuma: "border border-transparent",
};

const TITULOS: Record<TituloFicha, string> = {
  simples: "",
  linha: "border-b-2 border-destaque/40 pb-2",
  faixa: "-mx-5 -mt-5 rounded-t-[inherit] border-b border-borda bg-destaque/12 px-5 py-3",
};

type SecaoFichaProps = {
  id: string;
  titulo: string;
  icone: string;
  acoes?: ReactNode;
  classes?: string;
  children: ReactNode;
};

export default function SecaoFicha({ id, titulo, icone, acoes, classes = "", children }: SecaoFichaProps) {
  const aparencia = useContext(AparenciaSecaoContexto);

  return (
    <section className={`flex flex-col gap-4 rounded-lg bg-superficie p-5 ${BORDAS[aparencia.borda]} ${classes}`} aria-labelledby={`titulo-${id}`}>
      <header className={`flex flex-wrap items-center gap-3 ${TITULOS[aparencia.titulo]}`}>
        <h2 id={`titulo-${id}`} className={tituloPainel}>
          <i className={`bi ${icone} text-destaque`} aria-hidden="true"></i> {titulo}
        </h2>
        {acoes && <div className="ml-auto flex flex-wrap items-center gap-2">{acoes}</div>}
      </header>
      {children}
    </section>
  );
}
