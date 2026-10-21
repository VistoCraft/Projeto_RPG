"use client";

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

export default function usePersistido<T extends object>(chave: string, inicial: T): [T, Dispatch<SetStateAction<T>>] {
  const [valor, setValor] = useState<T>(inicial);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    try {
      const salvo: Partial<T> | null = JSON.parse(localStorage.getItem(chave) ?? "null");
      if (salvo) setValor({ ...inicial, ...salvo });
    } catch {}
    setCarregado(true);
  }, [chave]);

  useEffect(() => {
    if (carregado) localStorage.setItem(chave, JSON.stringify(valor));
  }, [chave, valor, carregado]);

  return [valor, setValor];
}
