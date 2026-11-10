import type { FormatoSecao, ModeloFicha } from "./modeloFicha";

export type SecaoFichaId = string;

export type InfoSecao = { id: SecaoFichaId; rotulo: string; icone: string };

export type DivisaoLinha = "uma" | "duas" | "larga-estreita" | "estreita-larga" | "tres";

export type LinhaLayout = { divisao: DivisaoLinha; colunas: SecaoFichaId[][] };

export type LayoutFicha = { linhas: LinhaLayout[] };

export type DestinoSecao = { linha: number; coluna: number; antesDe?: SecaoFichaId } | "fora";

export const LINHAS_MAXIMAS_LAYOUT = 12;

export const SECOES_FICHA: InfoSecao[] = [
  { id: "detalhes", rotulo: "Detalhes", icone: "bi-person-lines-fill" },
  { id: "barras", rotulo: "Status", icone: "bi-heart-pulse" },
  { id: "atributos", rotulo: "Atributos", icone: "bi-lightning-charge" },
  { id: "condicoes", rotulo: "Condições", icone: "bi-exclamation-diamond" },
  { id: "pericias", rotulo: "Perícias", icone: "bi-list-check" },
  { id: "combate", rotulo: "Ataques", icone: "bi-crosshair" },
];

export const DIVISOES: Record<DivisaoLinha, { rotulo: string; colunas: number; ficha: string; editor: string }> = {
  uma: { rotulo: "1 coluna", colunas: 1, ficha: "", editor: "grid-cols-1" },
  duas: { rotulo: "2 colunas iguais", colunas: 2, ficha: "xl:grid-cols-2", editor: "grid-cols-2" },
  "larga-estreita": { rotulo: "Larga + estreita", colunas: 2, ficha: "xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]", editor: "grid-cols-[3fr_2fr]" },
  "estreita-larga": { rotulo: "Estreita + larga", colunas: 2, ficha: "xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]", editor: "grid-cols-[2fr_3fr]" },
  tres: { rotulo: "3 colunas", colunas: 3, ficha: "lg:grid-cols-3", editor: "grid-cols-3" },
};

export const ORDEM_DIVISOES: DivisaoLinha[] = ["uma", "duas", "larga-estreita", "estreita-larga", "tres"];

export const LAYOUT_PADRAO: LayoutFicha = {
  linhas: [
    { divisao: "uma", colunas: [["detalhes"]] },
    { divisao: "larga-estreita", colunas: [["barras", "atributos", "condicoes"], ["pericias"]] },
    { divisao: "uma", colunas: [["combate"]] },
  ],
};

export const ICONES_FORMATO: Record<FormatoSecao, string> = {
  campos: "bi-input-cursor-text",
  valores: "bi-123",
  barras: "bi-bar-chart-steps",
  marcadores: "bi-tags",
  tabela: "bi-table",
  anotacoes: "bi-journal-richtext",
};

export function secoesDisponiveis(modelo: ModeloFicha): InfoSecao[] {
  const extras = (modelo.secoesExtras ?? []).map((secao) => ({ id: secao.id, rotulo: secao.rotulo || secao.id, icone: ICONES_FORMATO[secao.formato] }));
  return [...SECOES_FICHA, ...extras];
}

export function divisaoDoValor(valor: string): DivisaoLinha {
  return ORDEM_DIVISOES.find((divisao) => divisao === valor) ?? "uma";
}

export function secoesForaDoLayout(layout: LayoutFicha, disponiveis: InfoSecao[]): SecaoFichaId[] {
  const usadas = new Set(layout.linhas.flatMap((linha) => linha.colunas.flat()));
  return disponiveis.map((secao) => secao.id).filter((id) => !usadas.has(id));
}

export function semSecoesInexistentes(layout: LayoutFicha, disponiveis: InfoSecao[]): LayoutFicha {
  const existentes = new Set(disponiveis.map((secao) => secao.id));
  return { linhas: layout.linhas.map((linha) => ({ ...linha, colunas: linha.colunas.map((coluna) => coluna.filter((secao) => existentes.has(secao))) })) };
}

export function renomearSecao(layout: LayoutFicha, de: SecaoFichaId, para: SecaoFichaId): LayoutFicha {
  return { linhas: layout.linhas.map((linha) => ({ ...linha, colunas: linha.colunas.map((coluna) => coluna.map((secao) => (secao === de ? para : secao))) })) };
}

export function comSecaoNova(layout: LayoutFicha, secao: SecaoFichaId): LayoutFicha {
  return layout.linhas.length >= LINHAS_MAXIMAS_LAYOUT ? layout : { linhas: [...layout.linhas, { divisao: "uma", colunas: [[secao]] }] };
}

export function layoutParaEditar(layout?: LayoutFicha | null): LayoutFicha {
  return layout && layout.linhas.length > 0 ? layout : LAYOUT_PADRAO;
}

export function layoutParaExibir(layout: LayoutFicha | null | undefined, disponiveis: InfoSecao[]): LayoutFicha {
  const base = semSecoesInexistentes(layoutParaEditar(layout), disponiveis);
  const fora = secoesForaDoLayout(base, disponiveis);
  return fora.length === 0 ? base : { linhas: [...base.linhas, { divisao: "uma", colunas: [fora] }] };
}

function semSecao(layout: LayoutFicha, secao: SecaoFichaId): LayoutFicha {
  return { linhas: layout.linhas.map((linha) => ({ ...linha, colunas: linha.colunas.map((coluna) => coluna.filter((item) => item !== secao)) })) };
}

export function moverSecao(layout: LayoutFicha, secao: SecaoFichaId, destino: DestinoSecao): LayoutFicha {
  const limpo = semSecao(layout, secao);
  if (destino === "fora") return limpo;
  return {
    linhas: limpo.linhas.map((linha, indiceLinha) =>
      indiceLinha !== destino.linha
        ? linha
        : {
            ...linha,
            colunas: linha.colunas.map((coluna, indiceColuna) => {
              if (indiceColuna !== destino.coluna) return coluna;
              const posicao = destino.antesDe ? coluna.indexOf(destino.antesDe) : -1;
              return posicao < 0 ? [...coluna, secao] : [...coluna.slice(0, posicao), secao, ...coluna.slice(posicao)];
            }),
          }),
  };
}

export function mudarDivisao(layout: LayoutFicha, indice: number, divisao: DivisaoLinha): LayoutFicha {
  const quantidade = DIVISOES[divisao].colunas;
  return {
    linhas: layout.linhas.map((linha, posicao) => {
      if (posicao !== indice) return linha;
      const mantidas = linha.colunas.slice(0, quantidade);
      const sobra = linha.colunas.slice(quantidade).flat();
      const colunas = Array.from({ length: quantidade }, (_, coluna) => mantidas[coluna] ?? []);
      colunas[quantidade - 1] = [...colunas[quantidade - 1], ...sobra];
      return { divisao, colunas };
    }),
  };
}

export function adicionarLinha(layout: LayoutFicha): LayoutFicha {
  return layout.linhas.length >= LINHAS_MAXIMAS_LAYOUT ? layout : { linhas: [...layout.linhas, { divisao: "duas", colunas: [[], []] }] };
}

export function removerLinha(layout: LayoutFicha, indice: number): LayoutFicha {
  return { linhas: layout.linhas.filter((_, posicao) => posicao !== indice) };
}
