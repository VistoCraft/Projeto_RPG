"use client";

import { useEffect, useState } from "react";
import { listarTemplates } from "@/src/repositories/templatesRepositorio";
import type { Template } from "@/src/dominio/template";

export default function useTemplates(): Template[] {
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    let ativo = true;
    void listarTemplates().then((lista) => {
      if (ativo) setTemplates(lista);
    });
    return () => {
      ativo = false;
    };
  }, []);

  return templates;
}
