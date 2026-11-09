"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import useTema from "../useTema";
import BotaoTema from "../BotaoTema";
import PainelLateral, { type ItemPainel } from "../PainelLateral";

type TelaAutenticacaoProps = {
  children: ReactNode;
};

const vantagens: ItemPainel[] = [
  { icone: "bi-people", texto: "Mesas públicas e privadas, com convite por código." },
  { icone: "bi-journal-text", texto: "Fichas no template 5e ou no modelo que o mestre montar." },
  { icone: "bi-lightning-charge", texto: "Tudo atualiza em tempo real para o grupo inteiro." },
  { icone: "bi-heart", texto: "Gratuito, sem anúncios e sem fins comerciais." },
];

const logo = (
  <Link href="/" aria-label="Página inicial">
    <img className="w-[120px]" src="/img/Logo.png" alt="Logo RPG" />
  </Link>
);

export default function TelaAutenticacao({ children }: TelaAutenticacaoProps) {
  const [tema, alternarTema] = useTema();

  return (
    <main className="grid min-h-svh flex-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <PainelLateral rotulo="Bem-vindo à mesa" titulo="Reúna o grupo e role os dados" itens={vantagens} topo={logo} />
      <div className="flex flex-col">
        <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8">
          <Link className="flex items-center gap-2 text-sm font-semibold opacity-80 hover:opacity-100" href="/">
            <i className="bi bi-arrow-left" aria-hidden="true"></i> Voltar ao início
          </Link>
          <BotaoTema tema={tema} alternar={alternarTema} />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 pb-12 sm:px-8">
          <div className="lg:hidden">{logo}</div>
          <div className="w-full max-w-[760px]">{children}</div>
        </div>
      </div>
    </main>
  );
}
