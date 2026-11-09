"use client";

import { useState, type FormEvent } from "react";
import type { ResultadoAutenticacao } from "@/src/dominio/autenticacao";

export type EnvioFormulario = {
  enviando: boolean;
  concluido: boolean;
  erros: string[];
  enviar: (evento: FormEvent<HTMLFormElement>) => void;
};

export default function useEnvioFormulario(acao: () => Promise<ResultadoAutenticacao>): EnvioFormulario {
  const [enviando, setEnviando] = useState(false);
  const [concluido, setConcluido] = useState(false);
  const [erros, setErros] = useState<string[]>([]);

  const executar = async () => {
    setEnviando(true);
    setConcluido(false);
    setErros([]);
    const resultado = await acao();
    if (resultado.sucesso) setConcluido(true);
    else setErros(resultado.erros);
    setEnviando(false);
  };

  const enviar = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    void executar();
  };

  return { enviando, concluido, erros, enviar };
}
