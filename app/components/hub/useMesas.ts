"use client";

import { useEffect, useState } from "react";
import { listarMesas } from "@/src/repositories/mesasRepositorio";
import type { FiltroMesas, Mesa } from "@/src/dominio/mesa";

const ESPERA_DIGITACAO_MS = 300;

export type EstadoMesas = {
  mesas: Mesa[];
  carregando: boolean;
  erros: string[];
};

export default function useMesas(filtro: FiltroMesas, sessaoPronta: boolean): EstadoMesas {
  const [estado, setEstado] = useState<EstadoMesas>({ mesas: [], carregando: true, erros: [] });

  useEffect(() => {
    if (!sessaoPronta) return;

    let ativo = true;
    setEstado((atual) => ({ ...atual, carregando: true }));
    const temporizador = setTimeout(() => {
      void listarMesas(filtro).then((resultado) => {
        if (!ativo) return;
        setEstado(resultado.sucesso
          ? { mesas: resultado.valor, carregando: false, erros: [] }
          : { mesas: [], carregando: false, erros: resultado.erros });
      });
    }, ESPERA_DIGITACAO_MS);

    return () => {
      ativo = false;
      clearTimeout(temporizador);
    };
  }, [filtro, sessaoPronta]);

  return estado;
}
