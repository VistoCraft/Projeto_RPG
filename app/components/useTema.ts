"use client";

import { useEffect } from "react";
import usePersistido from "./usePersistido";

const CHAVE = "tema";

const CLASSE_TEMA_ESCURO = "dark";

export type Tema = "claro" | "escuro";

export type AlternarTema = () => void;

const preferenciaInicial: { tema: Tema } = { tema: "escuro" };

export default function useTema(): [Tema, AlternarTema] {
  const [preferencia, setPreferencia] = usePersistido(CHAVE, preferenciaInicial);

  useEffect(() => {
    document.documentElement.classList.toggle(CLASSE_TEMA_ESCURO, preferencia.tema === "escuro");
  }, [preferencia.tema]);

  const alternar: AlternarTema = () => {
    setPreferencia(({ tema }) => ({ tema: tema === "escuro" ? "claro" : "escuro" }));
  };

  return [preferencia.tema, alternar];
}
