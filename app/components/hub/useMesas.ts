"use client";

import { useEffect, useState } from "react";
import { listarMesas } from "@/src/repositories/mesasRepositorio";
import type { Mesa } from "@/src/dominio/mesa";

export type EstadoMesas = {
  mesas: Mesa[];
  carregando: boolean;
};

export default function useMesas(): EstadoMesas {
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    void listarMesas().then((lista) => {
      if (!ativo) return;
      setMesas(lista);
      setCarregando(false);
    });
    return () => {
      ativo = false;
    };
  }, []);

  return { mesas, carregando };
}
