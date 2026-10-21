"use client";

import useDetalhes from "./useDetalhes";
import useBarras from "./useBarras";
import Detalhes from "./Detalhes";
import Status from "./Status";
import Atributos from "./Atributos";
import Pericias from "./Pericias";
import Combate from "./Combate";
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

  return (
    <main className="mx-auto grid w-[940px] grid-cols-2 gap-[30px]">
      <section className="col-span-2 text-center">
        <img className="mx-auto w-1/5" src="/img/Logo.png" alt="Logo RPG" />
        <h1 className="mb-2 text-[2.5rem] leading-tight font-medium">Ficha do jogador</h1>
      </section>
      <Detalhes detalhes={detalhes} alterar={alterar} />
      <Status detalhes={detalhes} alterar={alterar} barras={barras} ajustarBarra={ajustarBarra} />
      <Atributos />
      <Pericias titulo="Perícias favoritas" prefixo="fav_" pericias={pericias} />
      <Combate />
      <Pericias titulo="Perícias" pericias={pericias} completa />
    </main>
  );
}
