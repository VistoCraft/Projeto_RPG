"use client";

import { useCallback, useEffect, useState } from "react";
import type { Resultado } from "@/src/dominio/resultado";

export type AcaoRemota = () => Promise<Resultado<unknown>>;

export type ColecaoRemota<T> = {
  itens: T[];
  carregando: boolean;
  executando: boolean;
  erros: string[];
  executar: (acao: AcaoRemota) => Promise<boolean>;
  recarregar: () => void;
};

export default function useColecaoRemota<T>(buscar: () => Promise<Resultado<T[]>>, ativo: boolean): ColecaoRemota<T> {
  const [itens, setItens] = useState<T[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [executando, setExecutando] = useState(false);
  const [erros, setErros] = useState<string[]>([]);

  const recarregar = useCallback(() => {
    void buscar().then((resultado) => {
      if (resultado.sucesso) {
        setItens(resultado.valor);
        setErros([]);
      } else {
        setErros(resultado.erros);
      }
      setCarregando(false);
    });
  }, [buscar]);

  useEffect(() => {
    if (ativo) recarregar();
  }, [ativo, recarregar]);

  const executar = async (acao: AcaoRemota) => {
    setExecutando(true);
    setErros([]);
    const resultado = await acao();
    setExecutando(false);
    if (!resultado.sucesso) {
      setErros(resultado.erros);
      return false;
    }
    recarregar();
    return true;
  };

  return { itens, carregando, executando, erros, executar, recarregar };
}
