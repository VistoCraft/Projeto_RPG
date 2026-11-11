"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { podeGerenciarMesa } from "@/src/dominio/mesa";
import type { TipoFicha } from "@/src/dominio/ficha";
import type { ModeloFicha } from "@/src/dominio/modeloFicha";
import { conversaoPadrao, type ConversaoModelos, type ModelosFicha, type PreviaConversao } from "@/src/dominio/modeloMesa";
import { alterarModeloMesa, previaConversao } from "@/src/repositories/modeloMesaRepositorio";
import { obterTemplate } from "@/src/repositories/templatesRepositorio";
import useTema from "../useTema";
import useSessao from "../useSessao";
import useMesa from "../mesa/useMesa";
import useTemplates from "../mesa/useTemplates";
import useModeloMesa from "./useModeloMesa";
import CabecalhoSite from "../CabecalhoSite";
import FaixaPagina from "../FaixaPagina";
import AvisoLogin from "../AvisoLogin";
import ListaErros from "../formulario/ListaErros";
import EditorModelosFicha from "../templates/EditorModelosFicha";
import TopoModeloMesa from "./TopoModeloMesa";
import ConversaoModelo from "./ConversaoModelo";
import { conteudoPagina } from "../estilos";

type Revisao = { previa: PreviaConversao; conversao: ConversaoModelos };

const plural = (quantidade: number) => (quantidade === 1 ? "1 ficha convertida" : `${quantidade} fichas convertidas`);

export default function PaginaModeloMesa() {
  const { id } = useParams<{ id: string }>();
  const [tema, alternarTema] = useTema();
  const sessao = useSessao();
  const logado = sessao.sessao.estado === "logado";
  const { mesa } = useMesa(id, logado);
  const templates = useTemplates();
  const atual = useModeloMesa(id, logado);
  const [rascunho, setRascunho] = useState<ModelosFicha | null>(null);
  const [geracao, setGeracao] = useState(0);
  const [revisao, setRevisao] = useState<Revisao | null>(null);
  const [ocupado, setOcupado] = useState(false);
  const [erros, setErros] = useState<string[]>([]);
  const [aviso, setAviso] = useState<string | null>(null);

  const podeAlterar = mesa !== null && podeGerenciarMesa(mesa.meuPapel) && mesa.status === "ativa";
  const modelos = rascunho ?? atual.modeloMesa?.modelos ?? null;

  const substituir = (novos: ModelosFicha | null) => {
    setRascunho(novos);
    setGeracao((valor) => valor + 1);
    setErros([]);
  };

  const alterar = (tipo: TipoFicha, modelo: ModeloFicha) => {
    if (!modelos) return;
    setRascunho({ ...modelos, [tipo]: modelo });
    setAviso(null);
  };

  const usarTemplate = async (templateId: string) => {
    const resultado = await obterTemplate(templateId);
    if (!resultado.sucesso) return setErros(resultado.erros);
    substituir({ completa: resultado.valor.modeloFicha, simplificada: resultado.valor.modeloFichaSimplificada });
    setAviso(`Modelo de "${resultado.valor.nome}" carregado no editor. Ele só vale depois de aplicar.`);
  };

  const revisar = async () => {
    if (!modelos) return;
    setOcupado(true);
    const resultado = await previaConversao(id, modelos);
    setOcupado(false);
    if (!resultado.sucesso) return setErros(resultado.erros);
    setErros([]);
    const previa = resultado.valor;
    setRevisao({ previa, conversao: { completa: conversaoPadrao(previa.completa), simplificada: conversaoPadrao(previa.simplificada) } });
  };

  const escolherOrigem = (tipo: TipoFicha, destino: string, origem: string | null) =>
    setRevisao((atualRevisao) => atualRevisao && {
      ...atualRevisao,
      conversao: { ...atualRevisao.conversao, [tipo]: { ...atualRevisao.conversao[tipo], [destino]: origem } },
    });

  const aplicar = async () => {
    if (!modelos || !revisao) return;
    setOcupado(true);
    const resultado = await alterarModeloMesa(id, modelos, revisao.conversao);
    setOcupado(false);
    if (!resultado.sucesso) return setErros(resultado.erros);
    atual.definir(resultado.valor.modelo);
    substituir(null);
    setRevisao(null);
    setAviso(`Modelo aplicado (versão ${resultado.valor.modelo.versaoModelo}), ${plural(resultado.valor.fichasConvertidas)}. As versões antigas ficam nos backups de cada ficha.`);
  };

  const rotulo = (
    <Link className="flex items-center gap-1 opacity-85 hover:underline hover:opacity-100" href={`/mesas/${id}`}>
      <i className="bi bi-arrow-left" aria-hidden="true"></i> {mesa?.nome ?? "Mesa"}
    </Link>
  );

  return (
    <>
      <CabecalhoSite tema={tema} alternarTema={alternarTema} sessao={sessao} />
      <main className="flex flex-1 flex-col">
        <FaixaPagina rotulo={rotulo} titulo="Modelo da ficha" descricao="Os campos que as fichas desta mesa têm, e como elas aparecem." />
        <div className={`${conteudoPagina} flex flex-1 flex-col gap-6 py-8`}>
          {sessao.sessao.estado === "visitante" && (
            <div className="mx-auto w-full max-w-md py-10">
              <AvisoLogin mensagem="Entre na sua conta para ver o modelo desta mesa." />
            </div>
          )}
          {logado && atual.carregando && <p className="py-16 text-center opacity-80">Carregando modelo...</p>}
          <ListaErros erros={atual.erros} />
          {mesa && !podeAlterar && atual.modeloMesa && (
            <p role="note" className="rounded-md border border-borda bg-superficie p-3 text-center text-sm">
              <i className="bi bi-lock" aria-hidden="true"></i> Só o mestre e o co-mestre alteram o modelo, e só com a mesa aberta.
            </p>
          )}
          {revisao && (
            <ConversaoModelo
              previa={revisao.previa}
              conversao={revisao.conversao}
              aoAlterar={escolherOrigem}
              aoVoltar={() => setRevisao(null)}
              aoAplicar={() => void aplicar()}
              aplicando={ocupado}
              erros={erros}
            />
          )}
          {!revisao && modelos && atual.modeloMesa && (
            <EditorModelosFicha
              key={geracao}
              modelos={modelos}
              editavel={podeAlterar}
              aoAlterar={alterar}
              rotulo="Modelo da mesa"
              topo={podeAlterar ? (
                <TopoModeloMesa
                  versao={atual.modeloMesa.versaoModelo}
                  templates={templates}
                  alterado={rascunho !== null}
                  revisando={ocupado}
                  aviso={aviso}
                  erros={erros}
                  aoUsarTemplate={(templateId) => void usarTemplate(templateId)}
                  aoDesfazer={() => { substituir(null); setAviso(null); }}
                  aoRevisar={() => void revisar()}
                />
              ) : null}
            />
          )}
        </div>
      </main>
    </>
  );
}
