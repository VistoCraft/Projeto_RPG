"use client";

import { useEffect, useState } from "react";
import { obterPerfil } from "@/src/repositories/perfilRepositorio";
import { sair as sairDaConta } from "@/src/repositories/autenticacaoRepositorio";
import type { Perfil } from "@/src/dominio/perfil";

export type Sessao = { estado: "carregando" } | { estado: "visitante" } | { estado: "logado"; perfil: Perfil };

export type EstadoSessao = {
  sessao: Sessao;
  sair: () => Promise<void>;
};

export default function useSessao(): EstadoSessao {
  const [sessao, setSessao] = useState<Sessao>({ estado: "carregando" });

  useEffect(() => {
    let ativo = true;
    void obterPerfil().then((perfil) => {
      if (ativo) setSessao(perfil ? { estado: "logado", perfil } : { estado: "visitante" });
    });
    return () => {
      ativo = false;
    };
  }, []);

  const sair = async () => {
    await sairDaConta();
    setSessao({ estado: "visitante" });
  };

  return { sessao, sair };
}
