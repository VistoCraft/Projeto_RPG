"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { obterDaBiblioteca } from "@/src/repositories/bibliotecaRepositorio";
import type { DetalheBiblioteca } from "@/src/dominio/biblioteca";
import { ROTULO_TIPO_FICHA } from "@/src/dominio/ficha";
import useTema from "../useTema";
import useSessao from "../useSessao";
import CabecalhoSite from "../CabecalhoSite";
import FaixaPagina from "../FaixaPagina";
import AvisoLogin from "../AvisoLogin";
import ListaErros from "../formulario/ListaErros";
import FichaModelo from "../ficha/FichaModelo";
import { conteudoPagina } from "../estilos";

const chip = "flex items-center gap-1.5 rounded-full border border-pergaminho/30 bg-pergaminho/10 px-3 py-1";

const semAlteracao = () => undefined;

export default function PaginaFichaBiblioteca() {
  const { fichaId } = useParams<{ fichaId: string }>();
  const [tema, alternarTema] = useTema();
  const sessao = useSessao();
  const logado = sessao.sessao.estado === "logado";
  const [ficha, setFicha] = useState<DetalheBiblioteca | null>(null);
  const [erros, setErros] = useState<string[]>([]);

  useEffect(() => {
    if (!logado) return;
    let ativo = true;
    void obterDaBiblioteca(fichaId).then((resultado) => {
      if (!ativo) return;
      if (resultado.sucesso) setFicha(resultado.valor);
      else setErros(resultado.erros);
    });
    return () => {
      ativo = false;
    };
  }, [fichaId, logado]);

  const rotulo = (
    <>
      <Link className="flex items-center gap-1 opacity-85 hover:underline hover:opacity-100" href="/biblioteca">
        <i className="bi bi-arrow-left" aria-hidden="true"></i> Biblioteca
      </Link>
      {ficha && (
        <>
          <span className={chip}><i className="bi bi-layers" aria-hidden="true"></i>{ROTULO_TIPO_FICHA[ficha.tipo]}</span>
          <span className={chip}><i className="bi bi-journal-text" aria-hidden="true"></i>{ficha.template}</span>
          <span className={chip}><i className="bi bi-lock" aria-hidden="true"></i>Cópia guardada (só leitura)</span>
        </>
      )}
    </>
  );

  return (
    <>
      <CabecalhoSite tema={tema} alternarTema={alternarTema} sessao={sessao} />
      <main className="flex flex-1 flex-col">
        <FaixaPagina rotulo={rotulo} titulo={ficha?.nome ?? "Ficha da biblioteca"} />
        <div className={`${conteudoPagina} flex flex-1 flex-col gap-6 py-8`}>
          {sessao.sessao.estado === "visitante" && (
            <div className="mx-auto w-full max-w-md py-10">
              <AvisoLogin mensagem="Entre na sua conta para ver a sua biblioteca." />
            </div>
          )}
          <ListaErros erros={erros} />
          {logado && !ficha && erros.length === 0 && <p className="py-16 text-center opacity-80">Carregando ficha...</p>}
          {ficha && <FichaModelo modelo={ficha.modelo} conteudo={ficha.conteudo} editavel={false} aoAlterar={semAlteracao} />}
        </div>
      </main>
    </>
  );
}
