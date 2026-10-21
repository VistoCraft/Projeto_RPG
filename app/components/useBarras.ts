"use client";

import usePersistido from "./usePersistido";

const CHAVE = "barras";

const VALOR_MAXIMO_PADRAO = 100;

export type BarraId = "vida" | "sanidade" | "esforco";

export type ValorBarra = {
  atual: number;
  maximo: number;
};

export type Barras = Record<BarraId, ValorBarra>;

export type AjustarBarra = (id: BarraId, variacao: number) => void;

const barraCheia: ValorBarra = { atual: VALOR_MAXIMO_PADRAO, maximo: VALOR_MAXIMO_PADRAO };

const barrasIniciais: Barras = {
  vida: barraCheia,
  sanidade: barraCheia,
  esforco: barraCheia,
};

function limitar(valor: number, minimo: number, maximo: number) {
  return Math.min(Math.max(valor, minimo), maximo);
}

export default function useBarras(): [Barras, AjustarBarra] {
  const [barras, setBarras] = usePersistido<Barras>(CHAVE, barrasIniciais);

  const ajustar: AjustarBarra = (id, variacao) => {
    setBarras((atuais) => {
      const barra = atuais[id];
      return { ...atuais, [id]: { ...barra, atual: limitar(barra.atual + variacao, 0, barra.maximo) } };
    });
  };

  return [barras, ajustar];
}
