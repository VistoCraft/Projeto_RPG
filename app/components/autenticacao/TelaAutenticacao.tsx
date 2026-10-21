"use client";

import type { ReactNode } from "react";
import useTema from "../useTema";
import BotaoTema from "../BotaoTema";
import DivisorRunico from "../DivisorRunico";

type TelaAutenticacaoProps = {
  children: ReactNode;
};

export default function TelaAutenticacao({ children }: TelaAutenticacaoProps) {
  const [tema, alternarTema] = useTema();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[440px] flex-col justify-center gap-6 px-4 py-10">
      <header className="grid grid-cols-[1fr_auto_1fr] items-center">
        <div></div>
        <img className="w-[140px]" src="/img/Logo.png" alt="Logo RPG" />
        <BotaoTema tema={tema} alternar={alternarTema} />
      </header>
      <DivisorRunico />
      {children}
    </main>
  );
}
