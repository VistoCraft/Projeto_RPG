"use client";

import { useState, type DragEvent } from "react";

export type Reordenacao = {
  arrastando: number | null;
  alvo: number | null;
  propsItem: (indice: number) => {
    draggable: boolean;
    onDragStart: (evento: DragEvent) => void;
    onDragOver: (evento: DragEvent) => void;
    onDragLeave: () => void;
    onDrop: (evento: DragEvent) => void;
    onDragEnd: () => void;
  };
  propsAlca: (indice: number) => {
    onPointerDown: () => void;
    onPointerUp: () => void;
  };
};

export default function useReordenacao(aoMover: (de: number, para: number) => void, ativo: boolean): Reordenacao {
  const [liberado, setLiberado] = useState<number | null>(null);
  const [arrastando, setArrastando] = useState<number | null>(null);
  const [alvo, setAlvo] = useState<number | null>(null);

  const encerrar = () => {
    setLiberado(null);
    setArrastando(null);
    setAlvo(null);
  };

  return {
    arrastando,
    alvo,
    propsItem: (indice) => ({
      draggable: ativo && liberado === indice,
      onDragStart: (evento) => {
        evento.stopPropagation();
        evento.dataTransfer.effectAllowed = "move";
        evento.dataTransfer.setData("text/plain", String(indice));
        setArrastando(indice);
      },
      onDragOver: (evento) => {
        if (arrastando === null) return;
        evento.preventDefault();
        evento.stopPropagation();
        setAlvo(indice);
      },
      onDragLeave: () => setAlvo((atual) => (atual === indice ? null : atual)),
      onDrop: (evento) => {
        if (arrastando === null) return;
        evento.preventDefault();
        evento.stopPropagation();
        aoMover(arrastando, indice);
        encerrar();
      },
      onDragEnd: encerrar,
    }),
    propsAlca: (indice) => ({
      onPointerDown: () => setLiberado(indice),
      onPointerUp: () => setLiberado(null),
    }),
  };
}
