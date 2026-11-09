"use client";

import { useEffect, useRef } from "react";
import { assinarMesa, type EventosMesa } from "@/src/repositories/tempoRealMesaRepositorio";

export default function useTempoRealMesa(mesaId: string, ativo: boolean, eventos: EventosMesa): void {
  const eventosAtuais = useRef(eventos);

  useEffect(() => {
    eventosAtuais.current = eventos;
  });

  useEffect(() => {
    if (!ativo) return;
    return assinarMesa(mesaId, {
      aoAtualizar: () => eventosAtuais.current.aoAtualizar(),
      aoExcluir: () => eventosAtuais.current.aoExcluir(),
    });
  }, [mesaId, ativo]);
}
