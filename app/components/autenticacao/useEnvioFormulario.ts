"use client";

import { useState, type FormEvent } from "react";
import type { ResultadoAutenticacao } from "@/src/dominio/autenticacao";

export type EnvioFormulario = {
  enviando: boolean;
  erros: string[];
  enviar: (evento: FormEvent<HTMLFormElement>) => void;
};

export default function useEnvioFormulario(acao: () => Promise<ResultadoAutenticacao>, aoConcluir: () => void): EnvioFormulario {
  const [enviando, setEnviando] = useState(false);
  const [erros, setErros] = useState<string[]>([]);

  const executar = async () => {
    setEnviando(true);
    setErros([]);
    const resultado = await acao();
    if (resultado.sucesso) {
      aoConcluir();
      return;
    }
    setErros(resultado.erros);
    setEnviando(false);
  };

  const enviar = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    void executar();
  };

  return { enviando, erros, enviar };
}
