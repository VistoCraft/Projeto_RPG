"use client";

import { useEffect, useState } from "react";
import { obterMesa } from "@/src/repositories/mesasRepositorio";
import type { DetalheMesa } from "@/src/dominio/mesa";
import type { Resultado } from "@/src/dominio/resultado";

export type AcaoMesa = () => Promise<Resultado<DetalheMesa>>;

export type EstadoMesa = {
  mesa: DetalheMesa | null;
  carregando: boolean;
  executando: boolean;
  erros: string[];
  executar: (acao: AcaoMesa) => Promise<void>;
  substituir: (mesa: DetalheMesa) => void;
};

export default function useMesa(id: string, logado: boolean): EstadoMesa {
  const [mesa, setMesa] = useState<DetalheMesa | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [executando, setExecutando] = useState(false);
  const [erros, setErros] = useState<string[]>([]);

  useEffect(() => {
    if (!logado) return;

    let ativo = true;
    void obterMesa(id).then((resultado) => {
      if (!ativo) return;
      if (resultado.sucesso) setMesa(resultado.valor);
      else setErros(resultado.erros);
      setCarregando(false);
    });
    return () => {
      ativo = false;
    };
  }, [id, logado]);

  const executar = async (acao: AcaoMesa) => {
    setExecutando(true);
    setErros([]);
    const resultado = await acao();
    if (resultado.sucesso) setMesa(resultado.valor);
    else setErros(resultado.erros);
    setExecutando(false);
  };

  const substituir = (atualizada: DetalheMesa) => {
    setErros([]);
    setMesa(atualizada);
  };

  return { mesa, carregando, executando, erros, executar, substituir };
}
