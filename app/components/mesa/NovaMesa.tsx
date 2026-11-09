"use client";

import useTema from "../useTema";
import useSessao from "../useSessao";
import CabecalhoSite from "../CabecalhoSite";
import AvisoLogin from "../AvisoLogin";
import PainelLateral from "../PainelLateral";
import FormularioNovaMesa from "./FormularioNovaMesa";

const dicas = [
  { icone: "bi-key", texto: "A mesa ganha um código de convite para chamar o grupo." },
  { icone: "bi-globe2", texto: "Mesas públicas aparecem no hub; privadas só entram pelo código." },
  { icone: "bi-people", texto: "Quem entra chega como espectador e você escolhe o papel de cada um." },
  { icone: "bi-journal-text", texto: "O template vira uma cópia da mesa, que você pode ajustar depois." },
];

export default function NovaMesa() {
  const [tema, alternarTema] = useTema();
  const sessao = useSessao();
  const { estado } = sessao.sessao;

  return (
    <>
      <CabecalhoSite tema={tema} alternarTema={alternarTema} sessao={sessao} />
      <main className="grid flex-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <PainelLateral rotulo="Nova mesa" titulo="Prepare o palco da campanha" itens={dicas} />
        <div className="flex items-center justify-center px-4 py-10 sm:px-8">
          <div className="w-full max-w-[640px]">
            {estado === "visitante" && <AvisoLogin mensagem="Entre na sua conta para criar uma mesa." />}
            {estado === "logado" && <FormularioNovaMesa />}
          </div>
        </div>
      </main>
    </>
  );
}
