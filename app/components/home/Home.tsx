"use client";

import useTema from "../useTema";
import useSessao from "../useSessao";
import CabecalhoSite from "../CabecalhoSite";
import DivisorRunico from "../DivisorRunico";
import HeroHome from "./HeroHome";
import RecursosHome from "./RecursosHome";
import PassosHome from "./PassosHome";

export default function Home() {
  const [tema, alternarTema] = useTema();
  const sessao = useSessao();

  return (
    <main className="mx-auto flex w-full max-w-[940px] flex-1 flex-col gap-10 px-4 pt-5">
      <CabecalhoSite tema={tema} alternarTema={alternarTema} sessao={sessao} />
      <HeroHome logado={sessao.sessao.estado === "logado"} />
      <DivisorRunico />
      <RecursosHome />
      <PassosHome />
    </main>
  );
}
