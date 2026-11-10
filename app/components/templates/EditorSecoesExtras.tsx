import { useState } from "react";
import {
  FORMATOS_SECAO,
  idDisponivel,
  idDoRotulo,
  idsDoModelo,
  MODELOS_PRONTOS,
  NOVOS_ITENS,
  novaSecao,
  renomearId,
  SECOES_EXTRAS_MAXIMAS,
  TAMANHO_MAXIMO_ROTULO,
  type Renomeacao,
} from "@/src/dominio/editorModelo";
import { comSecaoNova, ICONES_FORMATO, layoutParaEditar, moverSecao, renomearSecao } from "@/src/dominio/layoutFicha";
import { moverItem } from "@/src/dominio/listas";
import { renomearSecaoNoEstilo, semSecaoNoEstilo } from "@/src/dominio/estiloFicha";
import type { FormatoSecao, ModeloFicha, SecaoExtra } from "@/src/dominio/modeloFicha";
import SecaoFicha from "../ficha/SecaoFicha";
import ListaEditavel from "./ListaEditavel";
import { EntradaTexto } from "./CamposEditor";
import { contextoDeExemplo, LinhaBarra, LinhaCampo, LinhaColuna, LinhaValor } from "./RenderizadoresModelo";
import useReordenacao from "./useReordenacao";
import { botaoCompacto, botaoContorno, botaoPerigo, rotuloFicha } from "../estilos";

type EditorSecoesExtrasProps = {
  modelo: ModeloFicha;
  editavel: boolean;
  aoAlterar: (modelo: ModeloFicha) => void;
};

function nomeDoFormato(formato: FormatoSecao): string {
  return FORMATOS_SECAO.find((item) => item.formato === formato)?.rotulo ?? formato;
}

export default function EditorSecoesExtras({ modelo, editavel, aoAlterar }: EditorSecoesExtrasProps) {
  const [escolhendo, setEscolhendo] = useState(false);
  const [removendo, setRemovendo] = useState<string | null>(null);
  const secoes = modelo.secoesExtras ?? [];
  const idsUsados = idsDoModelo(modelo);
  const contexto = contextoDeExemplo(modelo);
  const reordenacao = useReordenacao((de, para) => aoAlterar({ ...modelo, secoesExtras: moverItem(secoes, de, para) }), editavel);

  const adicionar = (secao: SecaoExtra) => {
    aoAlterar({ ...modelo, secoesExtras: [...secoes, secao], layout: comSecaoNova(layoutParaEditar(modelo.layout), secao.id) });
    setEscolhendo(false);
  };

  const alterar = (indice: number, parcial: Partial<SecaoExtra>, renomeacao?: Renomeacao) => {
    const anterior = secoes[indice];
    const nova = { ...anterior, ...parcial };
    const layout = nova.id !== anterior.id && modelo.layout ? renomearSecao(modelo.layout, anterior.id, nova.id) : modelo.layout;
    const estilo = renomearSecaoNoEstilo(modelo.estilo, anterior.id, nova.id);
    const atualizado = { ...modelo, layout, estilo, secoesExtras: secoes.map((secao, posicao) => (posicao === indice ? nova : secao)) };
    aoAlterar(renomeacao ? renomearId(atualizado, renomeacao) : atualizado);
  };

  const renomear = (indice: number, rotulo: string) => {
    const secao = secoes[indice];
    const outros = new Set([...idsUsados].filter((id) => id !== secao.id));
    const automatico = secao.id === idDoRotulo(secao.rotulo);
    alterar(indice, { rotulo, id: automatico && rotulo.trim() ? idDisponivel(idDoRotulo(rotulo), outros) : secao.id });
  };

  const remover = (secao: SecaoExtra) => {
    const layout = modelo.layout ? moverSecao(modelo.layout, secao.id, "fora") : modelo.layout;
    aoAlterar({ ...modelo, layout, estilo: semSecaoNoEstilo(modelo.estilo, secao.id), secoesExtras: secoes.filter((item) => item.id !== secao.id) });
    setRemovendo(null);
  };

  const itens = (secao: SecaoExtra, indice: number) => {
    const comum = { id: `extra-${secao.id}`, icone: ICONES_FORMATO[secao.formato], descricao: "", idsUsados, editavel, embutida: true };
    switch (secao.formato) {
      case "campos":
        return (
          <ListaEditavel {...comum} titulo="Campos" itens={secao.campos ?? []} novoItem={NOVOS_ITENS.detalhe}
            aoAlterar={(campos, renomeacao) => alterar(indice, { campos }, renomeacao)}
            renderizar={(campo, mudar) => <LinhaCampo campo={campo} mudar={mudar} editavel={editavel} />} />
        );
      case "valores":
        return (
          <ListaEditavel {...comum} titulo="Valores" itens={secao.valores ?? []} novoItem={NOVOS_ITENS.atributo}
            aoAlterar={(valores, renomeacao) => alterar(indice, { valores }, renomeacao)}
            renderizar={(valor, mudar) => <LinhaValor valor={valor} mudar={mudar} editavel={editavel} contexto={contexto} />} />
        );
      case "barras":
        return (
          <ListaEditavel {...comum} titulo="Barras" itens={secao.barras ?? []} novoItem={NOVOS_ITENS.barra}
            aoAlterar={(barras, renomeacao) => alterar(indice, { barras }, renomeacao)}
            renderizar={(barra, mudar) => <LinhaBarra barra={barra} mudar={mudar} editavel={editavel} />} />
        );
      case "marcadores":
        return (
          <ListaEditavel {...comum} titulo="Marcadores" itens={secao.marcadores ?? []} novoItem={NOVOS_ITENS.condicao}
            aoAlterar={(marcadores, renomeacao) => alterar(indice, { marcadores }, renomeacao)} renderizar={() => null} />
        );
      case "tabela":
        return (
          <ListaEditavel {...comum} titulo="Colunas" itens={secao.colunas ?? []} novoItem={NOVOS_ITENS.coluna}
            aoAlterar={(colunas, renomeacao) => alterar(indice, { colunas }, renomeacao)}
            renderizar={(coluna, mudar) => <LinhaColuna coluna={coluna} mudar={mudar} editavel={editavel} />} />
        );
      case "anotacoes":
        return <p className="text-sm opacity-70">Na ficha, esta seção é uma caixa de texto livre (até 5.000 caracteres).</p>;
    }
  };

  const acoes = editavel && secoes.length < SECOES_EXTRAS_MAXIMAS && !escolhendo && (
    <button type="button" className={botaoCompacto} onClick={() => setEscolhendo(true)}>
      <i className="bi bi-plus-lg" aria-hidden="true"></i> Nova seção
    </button>
  );

  return (
    <SecaoFicha id="editor-secoes-extras" titulo={`Seções novas (${secoes.length})`} icone="bi-plus-square" acoes={acoes}>
      <p className="-mt-2 text-sm opacity-70">Crie áreas próprias para a ficha. Cada seção nova entra no grid da organização e pode ser arrastada para qualquer lugar.</p>
      {escolhendo && (
        <div className="flex flex-col gap-4 rounded-md border border-arcano/40 bg-arcano/5 p-3">
          <div className="flex flex-col gap-2">
            <span className={rotuloFicha}>Escolha um formato</span>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {FORMATOS_SECAO.map((item) => (
                <button key={item.formato} type="button" onClick={() => adicionar(novaSecao(item.formato, new Set(idsUsados)))}
                  className="flex cursor-pointer items-start gap-3 rounded-md border border-borda bg-fundo p-3 text-left transition-colors hover:border-arcano">
                  <i className={`bi ${ICONES_FORMATO[item.formato]} text-xl text-destaque`} aria-hidden="true"></i>
                  <span className="flex flex-col">
                    <span className="font-semibold">{item.rotulo}</span>
                    <span className="text-xs opacity-75">{item.descricao}</span>
                    <span className="text-xs opacity-55">Ex.: {item.exemplo}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className={rotuloFicha}>Ou comece por um modelo pronto</span>
            <div className="flex flex-wrap gap-2">
              {MODELOS_PRONTOS.map((pronto) => (
                <button key={pronto.nome} type="button" className={botaoContorno} onClick={() => adicionar(pronto.criar(new Set(idsUsados)))}>
                  <i className={`bi ${pronto.icone}`} aria-hidden="true"></i> {pronto.nome}
                </button>
              ))}
            </div>
          </div>
          <button type="button" className="self-start text-sm font-semibold text-acento hover:underline" onClick={() => setEscolhendo(false)}>Cancelar</button>
        </div>
      )}
      {secoes.length === 0 && !escolhendo && (
        <p className="rounded-md border border-dashed border-borda p-4 text-center text-sm opacity-70">Nenhuma seção nova ainda.</p>
      )}
      <ol className="flex flex-col gap-3">
        {secoes.map((secao, indice) => (
          <li key={indice} {...reordenacao.propsItem(indice)}
            className={`flex flex-col gap-3 rounded-md border bg-fundo p-3 ${
              reordenacao.alvo === indice && reordenacao.arrastando !== indice ? "border-arcano ring-2 ring-arcano/30" : "border-borda"
            } ${reordenacao.arrastando === indice ? "opacity-50" : ""}`}>
            <div className={`grid gap-3 sm:items-end ${editavel ? "sm:grid-cols-[auto_minmax(0,1.4fr)_minmax(0,1fr)_auto]" : "sm:grid-cols-2"}`}>
              {editavel && (
                <span {...reordenacao.propsAlca(indice)} title="Arraste para mudar a ordem" aria-hidden="true"
                  className="hidden cursor-grab self-center rounded px-1 py-2 text-lg opacity-60 hover:opacity-100 active:cursor-grabbing sm:block">
                  <i className="bi bi-grip-vertical"></i>
                </span>
              )}
              <EntradaTexto rotulo="Nome da seção" valor={secao.rotulo} tamanhoMaximo={TAMANHO_MAXIMO_ROTULO} editavel={editavel} aoAlterar={(rotulo) => renomear(indice, rotulo)} />
              <EntradaTexto rotulo="Id da seção" valor={secao.id} monoespacada editavel={editavel} aoAlterar={(id) => alterar(indice, { id: id.trim() })} />
              {editavel && (
                <span className="flex items-center gap-2">
                  <span className="flex items-center gap-1 rounded-full border border-borda px-2.5 py-1 text-xs">
                    <i className={`bi ${ICONES_FORMATO[secao.formato]}`} aria-hidden="true"></i> {nomeDoFormato(secao.formato)}
                  </span>
                  {removendo === secao.id ? (
                    <>
                      <button type="button" className={botaoPerigo} onClick={() => remover(secao)}>Remover</button>
                      <button type="button" className={botaoContorno} onClick={() => setRemovendo(null)}>Manter</button>
                    </>
                  ) : (
                    <button type="button" className={botaoPerigo} aria-label={`Remover a seção ${secao.rotulo}`} onClick={() => setRemovendo(secao.id)}>
                      <i className="bi bi-trash" aria-hidden="true"></i>
                    </button>
                  )}
                </span>
              )}
            </div>
            {itens(secao, indice)}
          </li>
        ))}
      </ol>
    </SecaoFicha>
  );
}
