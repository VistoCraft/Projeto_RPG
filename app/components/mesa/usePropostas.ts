"use client";

import { useCallback } from "react";
import { listarPropostas } from "@/src/repositories/bibliotecaRepositorio";
import type { Proposta } from "@/src/dominio/biblioteca";
import useColecaoRemota, { type ColecaoRemota } from "../useColecaoRemota";

export type EstadoPropostas = ColecaoRemota<Proposta>;

export default function usePropostas(mesaId: string, ativo: boolean): EstadoPropostas {
  const buscar = useCallback(() => listarPropostas(mesaId), [mesaId]);
  return useColecaoRemota(buscar, ativo);
}
