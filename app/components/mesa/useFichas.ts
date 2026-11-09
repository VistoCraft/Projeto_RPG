"use client";

import { useCallback, useEffect, useState } from "react";
import { listarFichas } from "@/src/repositories/fichasRepositorio";
import type { ResumoFicha } from "@/src/dominio/ficha";
import type { Resultado } from "@/src/dominio/resultado";

export type AcaoFicha = () => Promise<Resultado<unknown>>;

export type EstadoFichas = {
  fichas: ResumoFicha[];
  carregando: boolean;
  executando: boolean;
  erros: string[];
  executar: (acao: AcaoFicha) => Promise<boolean>;
  recarregar: () => void;
};

export default function useFichas(mesaId: string, ativo: boolean): EstadoFichas {
  const [fichas, setFichas] = useState<ResumoFicha[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [executando, setExecutando] = useState(false);
  const [erros, setErros] = useState<string[]>([]);

  const recarregar = useCallback(() => {
    void listarFichas(mesaId).then((resultado) => {
      if (resultado.sucesso) {
        setFichas(resultado.valor);
        setErros([]);
      } else {
        setErros(resultado.erros);
      }
      setCarregando(false);
    });
  }, [mesaId]);

  useEffect(() => {
    if (ativo) recarregar();
  }, [ativo, recarregar]);

  const executar = async (acao: AcaoFicha) => {
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

  return { fichas, carregando, executando, erros, executar, recarregar };
}
