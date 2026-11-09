"use client";

import useTema from "../useTema";
import useSessao from "../useSessao";
import useMesas from "./useMesas";
import CabecalhoSite from "../CabecalhoSite";
import BannerHub from "./BannerHub";
import AvisoVisitante from "./AvisoVisitante";
import ListaMesas from "./ListaMesas";
import DivisorRunico from "../DivisorRunico";

export default function Hub() {
  const [tema, alternarTema] = useTema();
  const sessao = useSessao();
  const mesas = useMesas();

  return (
    <main className="mx-auto flex w-full max-w-[940px] flex-1 flex-col gap-6 px-4 pt-5">
      <CabecalhoSite tema={tema} alternarTema={alternarTema} sessao={sessao} />
      <BannerHub />
      {sessao.sessao.estado === "visitante" && <AvisoVisitante />}
      <DivisorRunico />
      <ListaMesas estado={mesas} />
    </main>
  );
}
