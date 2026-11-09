"use client";

import useTema from "../useTema";
import useSessao from "../useSessao";
import CabecalhoSite from "../CabecalhoSite";
import HeroHome from "./HeroHome";
import RecursosHome from "./RecursosHome";
import PassosHome from "./PassosHome";
import ChamadaFinalHome from "./ChamadaFinalHome";

export default function Home() {
  const [tema, alternarTema] = useTema();
  const sessao = useSessao();
  const logado = sessao.sessao.estado === "logado";

  return (
    <>
      <CabecalhoSite tema={tema} alternarTema={alternarTema} sessao={sessao} />
      <main className="flex flex-1 flex-col">
        <HeroHome logado={logado} />
        <RecursosHome />
        <PassosHome />
        <ChamadaFinalHome logado={logado} />
      </main>
    </>
  );
}
