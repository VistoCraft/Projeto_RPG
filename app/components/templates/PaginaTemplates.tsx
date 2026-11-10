"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { excluirTemplate, listarTemplates } from "@/src/repositories/templatesRepositorio";
import type { Template } from "@/src/dominio/template";
import type { Resultado } from "@/src/dominio/resultado";
import useTema from "../useTema";
import useSessao from "../useSessao";
import useColecaoRemota from "../useColecaoRemota";
import CabecalhoSite from "../CabecalhoSite";
import FaixaPagina from "../FaixaPagina";
import ListaErros from "../formulario/ListaErros";
import CartaoTemplate from "./CartaoTemplate";
import { chamadaPrincipal, conteudoPagina, rotuloSecao } from "../estilos";

const listar = async (): Promise<Resultado<Template[]>> => ({ sucesso: true, valor: await listarTemplates() });

export default function PaginaTemplates() {
  const [tema, alternarTema] = useTema();
  const sessao = useSessao();
  const { estado } = sessao.sessao;
  const logado = estado === "logado";
  const buscar = useCallback(listar, []);
  const { itens, carregando, executando, erros, executar } = useColecaoRemota(buscar, estado !== "carregando");
  const [excluindo, setExcluindo] = useState<string | null>(null);
  const padrao = itens.filter((template) => template.padrao);
  const meus = itens.filter((template) => !template.padrao);

  const excluir = async (id: string) => {
    setExcluindo(id);
    await executar(() => excluirTemplate(id));
    setExcluindo(null);
  };

  return (
    <>
      <CabecalhoSite tema={tema} alternarTema={alternarTema} sessao={sessao} />
      <main className="flex flex-1 flex-col">
        <FaixaPagina
          rotulo={<span className="tracking-[0.2em] uppercase opacity-80">Templates de ficha</span>}
          titulo="Modelos para as fichas das mesas"
          descricao="Use o template padrão ou monte o seu: campos, atributos, perícias, barras e fórmulas de rolagem."
        >
          {logado && (
            <Link className={chamadaPrincipal} href="/templates/novo">
              <i className="bi bi-plus-lg" aria-hidden="true"></i> Novo template
            </Link>
          )}
        </FaixaPagina>
        <div className={`${conteudoPagina} flex flex-1 flex-col gap-10 py-8`}>
          <ListaErros erros={erros} />
          {carregando && <p className="py-10 text-center opacity-80">Carregando templates...</p>}
          {!carregando && (
            <section aria-labelledby="titulo-padrao" className="flex flex-col gap-4">
              <h2 id="titulo-padrao" className={rotuloSecao}>Padrão do site</h2>
              <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-5">
                {padrao.map((template) => <CartaoTemplate key={template.id} template={template} logado={logado} />)}
              </ul>
            </section>
          )}
          {!carregando && logado && (
            <section aria-labelledby="titulo-meus" className="flex flex-col gap-4">
              <h2 id="titulo-meus" className={rotuloSecao}>Seus templates</h2>
              {meus.length === 0 ? (
                <p className="rounded-lg border border-dashed border-borda p-8 text-center text-sm opacity-80">
                  Você ainda não tem templates. Crie um do zero ou a partir do padrão com “Criar cópia”.
                </p>
              ) : (
                <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-5">
                  {meus.map((template) => (
                    <CartaoTemplate
                      key={template.id}
                      template={template}
                      logado={logado}
                      executando={executando && excluindo === template.id}
                      aoExcluir={() => void excluir(template.id)}
                    />
                  ))}
                </ul>
              )}
            </section>
          )}
          {estado === "visitante" && (
            <p className="text-sm opacity-80">
              <Link className="font-bold text-acento hover:underline" href="/login">Entre</Link> para criar os seus próprios templates.
            </p>
          )}
        </div>
      </main>
    </>
  );
}
