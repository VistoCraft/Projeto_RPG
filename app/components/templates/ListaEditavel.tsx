import type { ReactNode } from "react";
import { idDisponivel, idDoRotulo, ITENS_MAXIMOS_POR_SECAO, TAMANHO_MAXIMO_ROTULO, type Renomeacao } from "@/src/dominio/editorModelo";
import { moverItem } from "@/src/dominio/listas";
import SecaoFicha from "../ficha/SecaoFicha";
import useReordenacao from "./useReordenacao";
import { EntradaTexto } from "./CamposEditor";
import { botaoCompacto, botaoContorno, botaoPerigo, rotuloFicha } from "../estilos";

type ItemComId = { id: string; rotulo: string };

export type AlterarItem<T> = (parcial: Partial<T>) => void;

type ListaEditavelProps<T extends ItemComId> = {
  id: string;
  titulo: string;
  icone: string;
  descricao: string;
  itens: T[];
  idsUsados: Set<string>;
  editavel: boolean;
  novoItem: (id: string) => T;
  aoAlterar: (itens: T[], renomeacao?: Renomeacao) => void;
  renderizar: (item: T, alterar: AlterarItem<T>) => ReactNode;
  embutida?: boolean;
};

export default function ListaEditavel<T extends ItemComId>({
  id, titulo, icone, descricao, itens, idsUsados, editavel, novoItem, aoAlterar, renderizar, embutida = false,
}: ListaEditavelProps<T>) {
  const outrosIds = (item: T) => new Set([...idsUsados].filter((usado) => usado !== item.id));

  const substituir = (indice: number, anterior: T, item: T) => {
    const renomeou = item.id !== anterior.id && !outrosIds(anterior).has(item.id);
    aoAlterar(itens.map((atual, posicao) => (posicao === indice ? item : atual)), renomeou ? { de: anterior.id, para: item.id } : undefined);
  };

  const alterarRotulo = (indice: number, item: T, rotulo: string) => {
    const idAutomatico = item.id === idDoRotulo(item.rotulo);
    const id = idAutomatico && rotulo.trim() ? idDisponivel(idDoRotulo(rotulo), outrosIds(item)) : item.id;
    substituir(indice, item, { ...item, rotulo, id });
  };

  const mover = (de: number, para: number) => aoAlterar(moverItem(itens, de, para));
  const reordenacao = useReordenacao(mover, editavel);

  const adicionar = () => {
    const rotuloPadrao = novoItem("").rotulo;
    aoAlterar([...itens, novoItem(idDisponivel(idDoRotulo(rotuloPadrao), idsUsados))]);
  };

  const acoes = editavel && itens.length < ITENS_MAXIMOS_POR_SECAO && (
    <button type="button" className={botaoCompacto} onClick={adicionar}>
      <i className="bi bi-plus-lg" aria-hidden="true"></i> Adicionar
    </button>
  );

  const conteudo = (
    <>
      {descricao && <p className={`text-sm opacity-70 ${embutida ? "" : "-mt-2"}`}>{descricao}</p>}
      {itens.length === 0 && <p className="rounded-md border border-dashed border-borda p-4 text-center text-sm opacity-70">Nenhum item nesta seção.</p>}
      <ol className="flex flex-col gap-2">
        {itens.map((item, indice) => (
          <li
            key={indice}
            {...reordenacao.propsItem(indice)}
            className={`flex flex-col gap-3 rounded-md border bg-fundo p-3 transition ${
              reordenacao.alvo === indice && reordenacao.arrastando !== indice ? "border-arcano ring-2 ring-arcano/30" : "border-borda"
            } ${reordenacao.arrastando === indice ? "opacity-50" : ""}`}
          >
            <div className={`grid gap-3 sm:items-end ${editavel ? "sm:grid-cols-[auto_minmax(0,1.4fr)_minmax(0,1fr)_auto]" : "sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]"}`}>
              {editavel && (
                <span
                  {...reordenacao.propsAlca(indice)}
                  className="hidden cursor-grab self-center rounded px-1 py-2 text-lg opacity-60 hover:bg-texto/5 hover:opacity-100 active:cursor-grabbing sm:block"
                  title="Arraste para mudar a ordem"
                  aria-hidden="true"
                >
                  <i className="bi bi-grip-vertical"></i>
                </span>
              )}
              <EntradaTexto rotulo="Nome" valor={item.rotulo} tamanhoMaximo={TAMANHO_MAXIMO_ROTULO} editavel={editavel} aoAlterar={(rotulo) => alterarRotulo(indice, item, rotulo)} />
              <EntradaTexto rotulo="Id (usado nas fórmulas)" valor={item.id} monoespacada editavel={editavel} aoAlterar={(novoId) => substituir(indice, item, { ...item, id: novoId.trim() })} />
              {editavel && (
                <span className="flex gap-1">
                  <button type="button" className={botaoContorno} aria-label={`Subir ${item.rotulo}`} disabled={indice === 0} onClick={() => mover(indice, indice - 1)}>
                    <i className="bi bi-arrow-up" aria-hidden="true"></i>
                  </button>
                  <button type="button" className={botaoContorno} aria-label={`Descer ${item.rotulo}`} disabled={indice === itens.length - 1} onClick={() => mover(indice, indice + 1)}>
                    <i className="bi bi-arrow-down" aria-hidden="true"></i>
                  </button>
                  <button type="button" className={botaoPerigo} aria-label={`Remover ${item.rotulo}`} onClick={() => aoAlterar(itens.filter((_, posicao) => posicao !== indice))}>
                    <i className="bi bi-trash" aria-hidden="true"></i>
                  </button>
                </span>
              )}
            </div>
            {renderizar(item, (parcial) => substituir(indice, item, { ...item, ...parcial }))}
          </li>
        ))}
      </ol>
    </>
  );

  if (embutida) {
    return (
      <div className="flex flex-col gap-3" aria-label={titulo}>
        <div className="flex flex-wrap items-center gap-2">
          <span className={rotuloFicha}>{titulo} ({itens.length})</span>
          {acoes && <span className="ml-auto">{acoes}</span>}
        </div>
        {conteudo}
      </div>
    );
  }

  return (
    <SecaoFicha id={`editor-${id}`} titulo={`${titulo} (${itens.length})`} icone={icone} acoes={acoes}>
      {conteudo}
    </SecaoFicha>
  );
}
