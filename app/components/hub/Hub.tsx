"use client";

import { useState } from "react";
import Link from "next/link";
import type { FiltroMesas } from "@/src/dominio/mesa";
import useTema from "../useTema";
import useSessao from "../useSessao";
import useMesas from "./useMesas";
import CabecalhoSite from "../CabecalhoSite";
import FaixaPagina from "../FaixaPagina";
import AvisoVisitante from "./AvisoVisitante";
import EntrarComCodigo from "./EntrarComCodigo";
import FiltrosMesas from "./FiltrosMesas";
import ListaMesas from "./ListaMesas";
import { chamadaPrincipal, conteudoPagina } from "../estilos";

const FILTRO_INICIAL: FiltroMesas = { busca: "", status: "", minhas: false };

export default function Hub() {
  const [tema, alternarTema] = useTema();
  const sessao = useSessao();
  const [filtro, setFiltro] = useState<FiltroMesas>(FILTRO_INICIAL);
  const { estado } = sessao.sessao;
  const logado = estado === "logado";
  const mesas = useMesas(filtro, estado !== "carregando");

  return (
    <>
      <CabecalhoSite tema={tema} alternarTema={alternarTema} sessao={sessao} />
      <main className="flex flex-1 flex-col">
        <FaixaPagina
          rotulo={<span className="tracking-[0.2em] uppercase opacity-80">Hub de mesas</span>}
          titulo="Encontre sua próxima campanha"
          descricao="Escolha uma mesa e reúna seu grupo para a próxima sessão."
        >
          {logado && (
            <Link className={chamadaPrincipal} href="/mesas/nova">
              <i className="bi bi-plus-lg" aria-hidden="true"></i> Criar mesa
            </Link>
          )}
        </FaixaPagina>
        <div className={`${conteudoPagina} grid flex-1 items-start gap-8 py-8 lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr]`}>
          <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
            {estado === "visitante" && <AvisoVisitante />}
            {logado && <EntrarComCodigo />}
            <FiltrosMesas filtro={filtro} aoAlterar={setFiltro} logado={logado} />
          </aside>
          <ListaMesas estado={mesas} />
        </div>
      </main>
    </>
  );
}
