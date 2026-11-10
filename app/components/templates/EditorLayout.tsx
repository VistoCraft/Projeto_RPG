import { useState, type DragEvent } from "react";
import {
  adicionarLinha,
  DIVISOES,
  divisaoDoValor,
  LINHAS_MAXIMAS_LAYOUT,
  moverSecao,
  mudarDivisao,
  ORDEM_DIVISOES,
  removerLinha,
  secoesDisponiveis,
  secoesForaDoLayout,
  type DestinoSecao,
  type LayoutFicha,
  type SecaoFichaId,
} from "@/src/dominio/layoutFicha";
import type { ModeloFicha } from "@/src/dominio/modeloFicha";
import { moverItem } from "@/src/dominio/listas";
import SecaoFicha from "../ficha/SecaoFicha";
import useReordenacao from "./useReordenacao";
import { botaoCompacto, botaoPerigo, campoFicha, rotuloFicha } from "../estilos";

type EditorLayoutProps = {
  layout: LayoutFicha;
  modelo: ModeloFicha;
  editavel: boolean;
  aoAlterar: (layout: LayoutFicha) => void;
};

const FORA = "fora";

const seletorPequeno = "ml-auto cursor-pointer rounded border border-texto/20 bg-fundo px-1.5 py-0.5 text-xs text-texto outline-none hover:border-arcano/60 focus:border-arcano";

type OpcaoDestino = { chave: string; rotulo: string; destino: DestinoSecao };

function contarItens(modelo: ModeloFicha, secao: SecaoFichaId): number {
  const padrao: Record<string, number> = {
    detalhes: modelo.detalhes?.length ?? 0,
    barras: modelo.barras?.length ?? 0,
    atributos: modelo.atributos?.length ?? 0,
    condicoes: modelo.condicoes?.length ?? 0,
    pericias: modelo.pericias?.length ?? 0,
    combate: modelo.combate?.colunas.length ?? 0,
  };
  if (secao in padrao) return padrao[secao];
  const extra = modelo.secoesExtras?.find((item) => item.id === secao);
  if (!extra) return 0;
  if (extra.formato === "anotacoes") return 1;
  return [extra.campos, extra.valores, extra.barras, extra.marcadores, extra.colunas].reduce((total, lista) => total + (lista?.length ?? 0), 0);
}

function chaveDestino(destino: DestinoSecao): string {
  return destino === FORA ? FORA : `${destino.linha}-${destino.coluna}`;
}

export default function EditorLayout({ layout, modelo, editavel, aoAlterar }: EditorLayoutProps) {
  const [arrastada, setArrastada] = useState<SecaoFichaId | null>(null);
  const [alvo, setAlvo] = useState<string | null>(null);
  const linhas = useReordenacao((de, para) => aoAlterar({ linhas: moverItem(layout.linhas, de, para) }), editavel);
  const disponiveis = secoesDisponiveis(modelo);
  const fora = secoesForaDoLayout(layout, disponiveis);

  const destinos: OpcaoDestino[] = [
    ...layout.linhas.flatMap((linha, indiceLinha) =>
      linha.colunas.map((_, indiceColuna): OpcaoDestino => ({
        chave: chaveDestino({ linha: indiceLinha, coluna: indiceColuna }),
        rotulo: `Linha ${indiceLinha + 1} · coluna ${indiceColuna + 1}`,
        destino: { linha: indiceLinha, coluna: indiceColuna },
      }))),
    { chave: FORA, rotulo: "Fora da ficha", destino: FORA },
  ];

  const soltar = (evento: DragEvent, destino: DestinoSecao) => {
    evento.preventDefault();
    evento.stopPropagation();
    if (arrastada) aoAlterar(moverSecao(layout, arrastada, destino));
    setArrastada(null);
    setAlvo(null);
  };

  const sobre = (evento: DragEvent, chave: string) => {
    if (!arrastada) return;
    evento.preventDefault();
    evento.stopPropagation();
    setAlvo(chave);
  };

  const chip = (secao: SecaoFichaId, destinoAtual: DestinoSecao) => {
    const info = disponiveis.find((item) => item.id === secao);
    const itens = contarItens(modelo, secao);
    const vazio = itens === 0;
    return (
      <li
        key={secao}
        draggable={editavel}
        onDragStart={(evento) => {
          evento.stopPropagation();
          evento.dataTransfer.effectAllowed = "move";
          evento.dataTransfer.setData("text/plain", secao);
          setArrastada(secao);
        }}
        onDragEnd={() => {
          setArrastada(null);
          setAlvo(null);
        }}
        onDragOver={(evento) => sobre(evento, `${chaveDestino(destinoAtual)}:${secao}`)}
        onDrop={(evento) => soltar(evento, destinoAtual === FORA ? FORA : { ...destinoAtual, antesDe: secao })}
        className={`flex flex-wrap items-center gap-2 rounded-md border bg-superficie px-2 py-1.5 text-sm shadow-sm ${
          alvo === `${chaveDestino(destinoAtual)}:${secao}` ? "border-t-4 border-t-arcano" : "border-borda"
        } ${arrastada === secao ? "opacity-40" : ""} ${editavel ? "cursor-grab active:cursor-grabbing" : ""}`}
      >
        {editavel && <i className="bi bi-grip-vertical opacity-50" aria-hidden="true"></i>}
        <i className={`bi ${info?.icone} text-destaque`} aria-hidden="true"></i>
        <span className={`font-semibold ${vazio ? "opacity-60" : ""}`}>{info?.rotulo}</span>
        <span className="text-xs opacity-60">{vazio ? "sem itens" : `${itens} ${itens === 1 ? "item" : "itens"}`}</span>
        {editavel && (
          <select
            className={seletorPequeno}
            aria-label={`Mover ${info?.rotulo} para`}
            value={chaveDestino(destinoAtual)}
            onChange={(evento) => {
              const escolhido = destinos.find((item) => item.chave === evento.target.value);
              if (escolhido) aoAlterar(moverSecao(layout, secao, escolhido.destino));
            }}
          >
            {destinos.map((item) => <option key={item.chave} value={item.chave}>{item.rotulo}</option>)}
          </select>
        )}
      </li>
    );
  };

  const zona = (secoes: SecaoFichaId[], destino: DestinoSecao, rotulo: string) => {
    const chave = chaveDestino(destino);
    return (
      <div
        onDragOver={(evento) => sobre(evento, chave)}
        onDragLeave={() => setAlvo((atual) => (atual === chave ? null : atual))}
        onDrop={(evento) => soltar(evento, destino)}
        className={`flex min-h-20 flex-col gap-2 rounded-md border-2 border-dashed p-2 transition-colors ${
          alvo === chave ? "border-arcano bg-arcano/10" : "border-borda"
        }`}
        aria-label={rotulo}
      >
        <ul className="flex flex-col gap-2">{secoes.map((secao) => chip(secao, destino))}</ul>
        {secoes.length === 0 && <p className="m-auto text-xs opacity-60">{editavel ? "Solte uma seção aqui" : "Vazia"}</p>}
      </div>
    );
  };

  const acoes = editavel && layout.linhas.length < LINHAS_MAXIMAS_LAYOUT && (
    <button type="button" className={botaoCompacto} onClick={() => aoAlterar(adicionarLinha(layout))}>
      <i className="bi bi-plus-lg" aria-hidden="true"></i> Adicionar linha
    </button>
  );

  return (
    <SecaoFicha id="editor-layout" titulo="Organização da ficha" icone="bi-grid-1x2" acoes={acoes}>
      <p className="-mt-2 text-sm opacity-70">
        Monte o grid da ficha: escolha quantas colunas cada linha tem e arraste as seções para o lugar. Em telas pequenas, as colunas ficam uma embaixo da outra.
      </p>
      <ol className="flex flex-col gap-3">
        {layout.linhas.map((linha, indiceLinha) => (
          <li
            key={indiceLinha}
            {...linhas.propsItem(indiceLinha)}
            className={`flex flex-col gap-2 rounded-md border bg-fundo p-3 ${
              linhas.alvo === indiceLinha && linhas.arrastando !== indiceLinha ? "border-arcano ring-2 ring-arcano/30" : "border-borda"
            } ${linhas.arrastando === indiceLinha ? "opacity-50" : ""}`}
          >
            <div className="flex flex-wrap items-center gap-2">
              {editavel && (
                <span {...linhas.propsAlca(indiceLinha)} className="cursor-grab rounded px-1 text-lg opacity-60 hover:opacity-100 active:cursor-grabbing" title="Arraste para mudar a ordem das linhas" aria-hidden="true">
                  <i className="bi bi-grip-vertical"></i>
                </span>
              )}
              <span className={rotuloFicha}>Linha {indiceLinha + 1}</span>
              <select
                className={`${campoFicha} w-auto cursor-pointer text-sm`}
                aria-label={`Divisão da linha ${indiceLinha + 1}`}
                value={linha.divisao}
                disabled={!editavel}
                onChange={(evento) => aoAlterar(mudarDivisao(layout, indiceLinha, divisaoDoValor(evento.target.value)))}
              >
                {ORDEM_DIVISOES.map((divisao) => <option key={divisao} value={divisao}>{DIVISOES[divisao].rotulo}</option>)}
              </select>
              {editavel && (
                <button type="button" className={`${botaoPerigo} ml-auto`} aria-label={`Remover linha ${indiceLinha + 1}`} onClick={() => aoAlterar(removerLinha(layout, indiceLinha))}>
                  <i className="bi bi-trash" aria-hidden="true"></i>
                </button>
              )}
            </div>
            <div className={`grid gap-2 ${DIVISOES[linha.divisao].editor}`}>
              {linha.colunas.map((coluna, indiceColuna) => (
                <div key={indiceColuna}>{zona(coluna, { linha: indiceLinha, coluna: indiceColuna }, `Linha ${indiceLinha + 1}, coluna ${indiceColuna + 1}`)}</div>
              ))}
            </div>
          </li>
        ))}
      </ol>
      <div className="flex flex-col gap-1">
        <span className={rotuloFicha}>Fora da ficha (aparecem no fim, uma embaixo da outra)</span>
        {zona(fora, FORA, "Seções fora da ficha")}
      </div>
    </SecaoFicha>
  );
}
