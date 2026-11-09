"use client";

import type { ReactNode } from "react";
import useTema from "../useTema";
import useSessao from "../useSessao";
import CabecalhoSite from "../CabecalhoSite";
import FaixaPagina from "../FaixaPagina";
import { DATA_ATUALIZACAO_TERMOS } from "@/src/dominio/termos";
import { conteudoPagina } from "../estilos";

export type SecaoLegal = {
  titulo: string;
  conteudo: ReactNode;
};

type PaginaLegalProps = {
  titulo: string;
  resumo: ReactNode;
  secoes: SecaoLegal[];
};

const ancora = (indice: number) => `secao-${indice + 1}`;

const numero = (indice: number) => String(indice + 1).padStart(2, "0");

export default function PaginaLegal({ titulo, resumo, secoes }: PaginaLegalProps) {
  const [tema, alternarTema] = useTema();
  const sessao = useSessao();

  const rotulo = (
    <>
      <span className="rounded-full border border-pergaminho/30 bg-pergaminho/10 px-3 py-1">
        <i className="bi bi-calendar3" aria-hidden="true"></i> Última atualização: {DATA_ATUALIZACAO_TERMOS}
      </span>
      <span className="rounded-full border border-pergaminho/30 bg-pergaminho/10 px-3 py-1">
        <i className="bi bi-list-ol" aria-hidden="true"></i> {secoes.length} seções
      </span>
    </>
  );

  const quadroResumo = (
    <div className="flex gap-4 rounded-xl border border-pergaminho/25 bg-noite/30 p-5 text-lg leading-relaxed backdrop-blur lg:p-6">
      <i className="bi bi-info-circle text-2xl text-essencia" aria-hidden="true"></i>
      <div>{resumo}</div>
    </div>
  );

  return (
    <>
      <CabecalhoSite tema={tema} alternarTema={alternarTema} sessao={sessao} />
      <main className="flex flex-1 flex-col">
        <FaixaPagina rotulo={rotulo} titulo={titulo} ladoALado>
          {quadroResumo}
        </FaixaPagina>
        <div className={`${conteudoPagina} grid items-start gap-8 py-10 lg:grid-cols-[240px_minmax(0,1fr)]`}>
          <nav aria-label="Seções" className="flex gap-2 overflow-x-auto pb-2 lg:sticky lg:top-24 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
            <p className="mb-2 hidden text-xs font-bold tracking-[0.2em] text-acento uppercase lg:block">Nesta página</p>
            {secoes.map(({ titulo: tituloSecao }, indice) => (
              <a
                key={tituloSecao}
                href={`#${ancora(indice)}`}
                className="flex shrink-0 items-baseline gap-2 rounded-md border border-borda px-3 py-1.5 text-sm whitespace-nowrap transition-colors hover:border-arcano hover:text-destaque lg:border-0 lg:border-l-2 lg:whitespace-normal lg:hover:bg-texto/5"
              >
                <span className="font-mono text-xs text-destaque">{numero(indice)}</span>
                {tituloSecao}
              </a>
            ))}
          </nav>
          <article className="gap-16 text-[17px] leading-relaxed [column-rule:1px_solid_var(--color-borda)] [columns:44rem_2]">
            {secoes.map(({ titulo: tituloSecao, conteudo }, indice) => (
              <section
                key={tituloSecao}
                id={ancora(indice)}
                aria-labelledby={`${ancora(indice)}-titulo`}
                className="mb-10 flex scroll-mt-24 break-inside-avoid flex-col gap-3"
              >
                <h2 id={`${ancora(indice)}-titulo`} className="flex items-baseline gap-3 font-titulo text-[24px] leading-tight font-bold">
                  <span className="font-mono text-base text-destaque">{numero(indice)}</span>
                  {tituloSecao}
                </h2>
                {conteudo}
              </section>
            ))}
          </article>
        </div>
      </main>
    </>
  );
}
