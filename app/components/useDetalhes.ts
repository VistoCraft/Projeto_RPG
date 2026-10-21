"use client";

import type { ChangeEvent } from "react";
import usePersistido from "./usePersistido";

const CHAVE = "detalhes";

const detalhesIniciais = {
  nome: "",
  jogador: "",
  classe: "",
  idade: "",
  sexo: "N",
  origem: "",
  patente: "",
  dextra: "0",
  corpo: "0",
  exPara: "0",
};

export type Detalhes = typeof detalhesIniciais;
export type Alterar = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;

export default function useDetalhes(): [Detalhes, Alterar] {
  const [detalhes, setDetalhes] = usePersistido<Detalhes>(CHAVE, detalhesIniciais);

  const alterar: Alterar = (e) => {
    const { name, value } = e.target;
    setDetalhes((atual) => ({ ...atual, [name]: value }));
  };

  return [detalhes, alterar];
}
