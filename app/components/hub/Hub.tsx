"use client";

import useTema from "../useTema";
import useMesas from "./useMesas";
import CabecalhoHub from "./CabecalhoHub";
import BannerHub from "./BannerHub";
import ListaMesas from "./ListaMesas";
import DivisorRunico from "../DivisorRunico";

export default function Hub() {
  const [tema, alternarTema] = useTema();
  const mesas = useMesas();

  return (
    <main className="mx-auto flex w-full max-w-[940px] flex-1 flex-col gap-6 px-4 pt-5">
      <CabecalhoHub tema={tema} alternarTema={alternarTema} />
      <BannerHub />
      <DivisorRunico />
      <ListaMesas estado={mesas} />
    </main>
  );
}
