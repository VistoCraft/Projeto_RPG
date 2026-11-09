"use client";

import type { ReactNode } from "react";
import useTema from "../useTema";
import useSessao from "../useSessao";
import CabecalhoSite from "../CabecalhoSite";
import DivisorRunico from "../DivisorRunico";
import { DATA_ATUALIZACAO_TERMOS } from "@/src/dominio/termos";
import { cartao } from "../estilos";

export type SecaoLegal = {
  titulo: string;
  conteudo: ReactNode;
};

type PaginaLegalProps = {
  titulo: string;
  resumo: ReactNode;
  secoes: SecaoLegal[];
};

export default function PaginaLegal({ titulo, resumo, secoes }: PaginaLegalProps) {
  const [tema, alternarTema] = useTema();
  const sessao = useSessao();

  return (
    <main className="mx-auto flex w-full max-w-[940px] flex-1 flex-col gap-6 px-4 pt-5">
      <CabecalhoSite tema={tema} alternarTema={alternarTema} sessao={sessao} />
      <article className={`${cartao} flex flex-col gap-6 leading-relaxed`}>
        <header className="flex flex-col gap-2 text-center">
          <h1 className="font-titulo text-[2.25rem] leading-tight font-bold">{titulo}</h1>
          <p className="text-sm opacity-80">Última atualização: {DATA_ATUALIZACAO_TERMOS}</p>
        </header>
        <div className="rounded-md border border-acento bg-acento/10 p-4">{resumo}</div>
        <DivisorRunico />
        {secoes.map(({ titulo: tituloSecao, conteudo }, indice) => (
          <section key={tituloSecao} className="flex flex-col gap-3">
            <h2 className="font-titulo text-[22px] leading-tight font-bold">{indice + 1}. {tituloSecao}</h2>
            {conteudo}
          </section>
        ))}
      </article>
    </main>
  );
}
