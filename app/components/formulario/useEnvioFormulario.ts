"use client";

import { useState, type FormEvent } from "react";
import type { Falha } from "@/src/dominio/resultado";

type ResultadoEnvio = { sucesso: true } | Falha;

export type EnvioFormulario = {
  enviando: boolean;
  erros: string[];
  enviar: (evento: FormEvent<HTMLFormElement>) => void;
};

export default function useEnvioFormulario<R extends ResultadoEnvio>(
  acao: () => Promise<R>,
  aoConcluir: (resultado: Exclude<R, Falha>) => void,
): EnvioFormulario {
  const [enviando, setEnviando] = useState(false);
  const [erros, setErros] = useState<string[]>([]);

  const executar = async () => {
    setEnviando(true);
    setErros([]);
    const resultado = await acao();
    if (resultado.sucesso === false) {
      setErros(resultado.erros);
      setEnviando(false);
      return;
    }
    aoConcluir(resultado as Exclude<R, Falha>);
  };

  const enviar = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    void executar();
  };

  return { enviando, erros, enviar };
}
