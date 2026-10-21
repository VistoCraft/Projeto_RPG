"use client";

import useDetalhes from "./useDetalhes";
import useBarras from "./useBarras";
import useTema from "./useTema";
import Detalhes from "./Detalhes";
import Status from "./Status";
import Atributos from "./Atributos";
import Pericias from "./Pericias";
import Combate from "./Combate";
import BotaoTema from "./BotaoTema";
import DivisorRunico from "./DivisorRunico";
import type { Pericia } from "./Pericias";

const pericias: Pericia[] = [
  { id: "ciencia", nome: "Ciência" },
  { id: "engenharia", nome: "Engenharia" },
  { id: "arma_de_fogo", nome: "Armas de Fogo" },
  { id: "pilotagem", nome: "Pilotagem" },
  { id: "acalmar", nome: "Acalmar" },
];

export default function Ficha() {
  const [detalhes, alterar] = useDetalhes();
  const [barras, ajustarBarra] = useBarras();
  const [tema, alternarTema] = useTema();

  return (
    <main className="mx-auto grid w-[940px] grid-cols-2 gap-[30px]">
      <header className="col-span-2 grid grid-cols-[1fr_auto_1fr] items-center pt-5">
        <div></div>
        <div className="text-center">
          <img className="mx-auto w-[188px]" src="/img/Logo.png" alt="Logo RPG" />
          <h1 className="mb-2 font-titulo text-[2.5rem] leading-tight font-bold">Ficha do jogador</h1>
        </div>
        <BotaoTema tema={tema} alternar={alternarTema} />
      </header>
      <DivisorRunico />
      <Detalhes detalhes={detalhes} alterar={alterar} />
      <Status detalhes={detalhes} alterar={alterar} barras={barras} ajustarBarra={ajustarBarra} />
      <Atributos />
      <Pericias titulo="Perícias favoritas" prefixo="fav_" pericias={pericias} />
      <Combate />
      <Pericias titulo="Perícias" pericias={pericias} completa />
    </main>
  );
}
