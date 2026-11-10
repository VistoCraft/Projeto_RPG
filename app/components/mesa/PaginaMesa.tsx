"use client";

import { useParams, useRouter } from "next/navigation";
import { podeGerenciarMesa } from "@/src/dominio/mesa";
import useTema from "../useTema";
import useSessao from "../useSessao";
import useMesa from "./useMesa";
import useTempoRealMesa from "./useTempoRealMesa";
import useFichas from "./useFichas";
import usePropostas from "./usePropostas";
import CabecalhoSite from "../CabecalhoSite";
import AvisoLogin from "../AvisoLogin";
import CabecalhoMesa from "./CabecalhoMesa";
import PainelGerencia from "./PainelGerencia";
import ListaParticipantes from "./ListaParticipantes";
import AreasMesa from "./AreasMesa";
import PainelFichas from "./PainelFichas";
import { cartao, conteudoPagina } from "../estilos";

export default function PaginaMesa() {
  const { id } = useParams<{ id: string }>();
  const [tema, alternarTema] = useTema();
  const sessao = useSessao();
  const logado = sessao.sessao.estado === "logado";
  const router = useRouter();
  const estado = useMesa(id, logado);
  const { mesa, carregando, erros } = estado;
  const participa = mesa?.meuPapel != null;
  const fichas = useFichas(id, participa);
  const propostas = usePropostas(id, participa);
  useTempoRealMesa(id, logado, {
    aoAtualizar: () => {
      estado.recarregar();
      if (participa) {
        fichas.recarregar();
        propostas.recarregar();
      }
    },
    aoExcluir: () => router.push("/mesas"),
    aoAtualizarFichas: () => {
      if (participa) fichas.recarregar();
    },
    aoAtualizarPropostas: () => {
      if (participa) propostas.recarregar();
    },
  });

  return (
    <>
      <CabecalhoSite tema={tema} alternarTema={alternarTema} sessao={sessao} />
      <main className="flex flex-1 flex-col">
        {mesa && <CabecalhoMesa mesa={mesa} estado={estado} />}
        <div className={`${conteudoPagina} flex flex-1 flex-col gap-6 py-8`}>
          {sessao.sessao.estado === "visitante" && (
            <div className="mx-auto w-full max-w-md py-10">
              <AvisoLogin mensagem="Entre na sua conta para ver esta mesa." />
            </div>
          )}
          {logado && carregando && <p className="py-16 text-center opacity-80">Carregando mesa...</p>}
          {erros.length > 0 && <p role="alert" className="rounded-md border border-vida bg-vida/10 p-3 text-center text-sm">{erros.join(" ")}</p>}
          {mesa && (
            <>
              {mesa.status === "encerrada" && (
                <p role="note" className="rounded-md border border-borda bg-superficie p-3 text-center text-sm">
                  <i className="bi bi-archive" aria-hidden="true"></i> Esta mesa foi encerrada e está disponível só para leitura.
                </p>
              )}
              <div className="grid flex-1 items-start gap-6 xl:grid-cols-[1fr_400px]">
                <AreasMesa fichas={participa ? <PainelFichas mesa={mesa} estado={fichas} propostas={propostas} /> : <AvisoFichas />} />
                <aside className="flex flex-col gap-6">
                  {podeGerenciarMesa(mesa.meuPapel) && <PainelGerencia mesa={mesa} estado={estado} />}
                  <ListaParticipantes mesa={mesa} estado={estado} />
                </aside>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}

function AvisoFichas() {
  return (
    <p className={`${cartao} text-center text-sm opacity-80 md:col-span-2`}>
      <i className="bi bi-journal-text text-destaque" aria-hidden="true"></i> Entre na mesa para ver as fichas.
    </p>
  );
}
