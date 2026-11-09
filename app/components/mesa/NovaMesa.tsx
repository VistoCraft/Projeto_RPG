"use client";

import useTema from "../useTema";
import useSessao from "../useSessao";
import CabecalhoSite from "../CabecalhoSite";
import AvisoLogin from "../AvisoLogin";
import FormularioNovaMesa from "./FormularioNovaMesa";

export default function NovaMesa() {
  const [tema, alternarTema] = useTema();
  const sessao = useSessao();
  const { estado } = sessao.sessao;

  return (
    <main className="mx-auto flex w-full max-w-[940px] flex-1 flex-col gap-6 px-4 pt-5">
      <CabecalhoSite tema={tema} alternarTema={alternarTema} sessao={sessao} />
      <div className="mx-auto w-full max-w-[560px]">
        {estado === "visitante" && <AvisoLogin mensagem="Entre na sua conta para criar uma mesa." />}
        {estado === "logado" && <FormularioNovaMesa />}
      </div>
    </main>
  );
}
