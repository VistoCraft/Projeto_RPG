"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { podeGerenciar } from "@/src/dominio/mesa";
import useTema from "../useTema";
import useSessao from "../useSessao";
import useMesa from "./useMesa";
import CabecalhoSite from "../CabecalhoSite";
import AvisoLogin from "../AvisoLogin";
import CabecalhoMesa from "./CabecalhoMesa";
import PainelGerencia from "./PainelGerencia";
import ListaParticipantes from "./ListaParticipantes";
import AreasMesa from "./AreasMesa";
import { link } from "../estilos";

export default function PaginaMesa() {
  const { id } = useParams<{ id: string }>();
  const [tema, alternarTema] = useTema();
  const sessao = useSessao();
  const logado = sessao.sessao.estado === "logado";
  const estado = useMesa(id, logado);
  const { mesa, carregando, erros } = estado;

  return (
    <main className="mx-auto flex w-full max-w-[940px] flex-1 flex-col gap-6 px-4 pt-5">
      <CabecalhoSite tema={tema} alternarTema={alternarTema} sessao={sessao} />
      <Link className={`${link} self-start`} href="/mesas"><i className="bi bi-arrow-left" aria-hidden="true"></i> Todas as mesas</Link>
      {sessao.sessao.estado === "visitante" && <AvisoLogin mensagem="Entre na sua conta para ver esta mesa." />}
      {logado && carregando && <p className="text-center opacity-80">Carregando mesa...</p>}
      {erros.length > 0 && <p role="alert" className="rounded-md border border-vida bg-vida/10 p-3 text-center text-sm">{erros.join(" ")}</p>}
      {mesa && (
        <>
          <CabecalhoMesa mesa={mesa} estado={estado} />
          {mesa.status === "encerrada" && (
            <p role="note" className="rounded-md border border-borda p-3 text-center text-sm">
              <i className="bi bi-archive" aria-hidden="true"></i> Esta mesa foi encerrada e está disponível só para leitura.
            </p>
          )}
          {podeGerenciar(mesa.meuPapel) && <PainelGerencia mesa={mesa} estado={estado} />}
          <ListaParticipantes mesa={mesa} estado={estado} />
          <AreasMesa />
        </>
      )}
    </main>
  );
}
