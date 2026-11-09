"use client";

import { useEffect, useState } from "react";
import { listarPaises } from "@/src/dominio/paises";
import type { Opcao } from "@/src/dominio/perfil";

const IDIOMA = "pt-BR";

export default function usePaises(): Opcao[] {
  const [paises, setPaises] = useState<Opcao[]>([]);

  useEffect(() => {
    setPaises(listarPaises(IDIOMA));
  }, []);

  return paises;
}
