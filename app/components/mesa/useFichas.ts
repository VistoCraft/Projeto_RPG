"use client";

import { useCallback } from "react";
import { listarFichas } from "@/src/repositories/fichasRepositorio";
import type { ResumoFicha } from "@/src/dominio/ficha";
import useColecaoRemota, { type ColecaoRemota } from "../useColecaoRemota";

export type EstadoFichas = ColecaoRemota<ResumoFicha>;

export default function useFichas(mesaId: string, ativo: boolean): EstadoFichas {
  const buscar = useCallback(() => listarFichas(mesaId), [mesaId]);
  return useColecaoRemota(buscar, ativo);
}
