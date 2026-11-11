"use client";

import { useEffect, useState } from "react";
import { obterModeloMesa } from "@/src/repositories/modeloMesaRepositorio";
import type { ModeloMesa } from "@/src/dominio/modeloMesa";

export type EstadoModeloMesa = {
  modeloMesa: ModeloMesa | null;
  carregando: boolean;
  erros: string[];
  definir: (modeloMesa: ModeloMesa) => void;
};

export default function useModeloMesa(mesaId: string, ativo: boolean): EstadoModeloMesa {
  const [modeloMesa, setModeloMesa] = useState<ModeloMesa | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erros, setErros] = useState<string[]>([]);

  useEffect(() => {
    if (!ativo) return;
    let vivo = true;
    void obterModeloMesa(mesaId).then((resultado) => {
      if (!vivo) return;
      if (resultado.sucesso) setModeloMesa(resultado.valor);
      else setErros(resultado.erros);
      setCarregando(false);
    });
    return () => {
      vivo = false;
    };
  }, [mesaId, ativo]);

  return { modeloMesa, carregando, erros, definir: setModeloMesa };
}
