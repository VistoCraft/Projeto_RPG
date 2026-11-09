"use client";

import { useState } from "react";
import type { FiltroMesas } from "@/src/dominio/mesa";
import useTema from "../useTema";
import useSessao from "../useSessao";
import useMesas from "./useMesas";
import CabecalhoSite from "../CabecalhoSite";
import BannerHub from "./BannerHub";
import AvisoVisitante from "./AvisoVisitante";
import AcoesHub from "./AcoesHub";
import FiltrosMesas from "./FiltrosMesas";
import ListaMesas from "./ListaMesas";
import DivisorRunico from "../DivisorRunico";

const FILTRO_INICIAL: FiltroMesas = { busca: "", status: "", minhas: false };

export default function Hub() {
  const [tema, alternarTema] = useTema();
  const sessao = useSessao();
  const [filtro, setFiltro] = useState<FiltroMesas>(FILTRO_INICIAL);
  const { estado } = sessao.sessao;
  const mesas = useMesas(filtro, estado !== "carregando");

  return (
    <main className="mx-auto flex w-full max-w-[940px] flex-1 flex-col gap-6 px-4 pt-5">
      <CabecalhoSite tema={tema} alternarTema={alternarTema} sessao={sessao} />
      <BannerHub />
      {estado === "visitante" && <AvisoVisitante />}
      {estado === "logado" && <AcoesHub />}
      <DivisorRunico />
      <FiltrosMesas filtro={filtro} aoAlterar={setFiltro} logado={estado === "logado"} />
      <ListaMesas estado={mesas} />
    </main>
  );
}
