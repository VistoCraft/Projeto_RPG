"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ROTULO_TIPO_FICHA } from "@/src/dominio/ficha";
import { salvarNaBiblioteca } from "@/src/repositories/bibliotecaRepositorio";
import useTema from "../useTema";
import useSessao from "../useSessao";
import useMesa from "../mesa/useMesa";
import useFicha, { type SituacaoGravacao } from "./useFicha";
import CabecalhoSite from "../CabecalhoSite";
import FaixaPagina from "../FaixaPagina";
import AvisoLogin from "../AvisoLogin";
import ListaErros from "../formulario/ListaErros";
import FichaModelo from "./FichaModelo";
import { chamadaSecundaria, conteudoPagina } from "../estilos";

type Modo = "editar" | "ver";

const chip = "flex items-center gap-1.5 rounded-full border border-pergaminho/30 bg-pergaminho/10 px-3 py-1";

const SITUACOES: Record<SituacaoGravacao, { icone: string; texto: string }> = {
  salvo: { icone: "bi-cloud-check", texto: "Tudo salvo" },
  pendente: { icone: "bi-pencil", texto: "Alterações a salvar" },
  salvando: { icone: "bi-cloud-arrow-up", texto: "Salvando..." },
  erro: { icone: "bi-exclamation-triangle", texto: "Não foi possível salvar" },
};

export default function PaginaFicha() {
  const { id, fichaId } = useParams<{ id: string; fichaId: string }>();
  const [tema, alternarTema] = useTema();
  const sessao = useSessao();
  const logado = sessao.sessao.estado === "logado";
  const { mesa } = useMesa(id, logado);
  const { ficha, carregando, erros, situacao, alterar } = useFicha(id, fichaId, logado);
  const [modo, setModo] = useState<Modo>("editar");
  const [avisoBiblioteca, setAvisoBiblioteca] = useState<string | null>(null);

  const guardarCopia = async () => {
    const resultado = await salvarNaBiblioteca(id, fichaId);
    setAvisoBiblioteca(resultado.sucesso ? "Cópia salva na biblioteca." : resultado.erros.join(" "));
  };

  const mesaAtiva = mesa?.status === "ativa";
  const podeEditar = Boolean(ficha?.podeEditar && mesaAtiva);
  const editavel = podeEditar && modo === "editar";
  const estadoGravacao = SITUACOES[situacao];

  const rotulo = (
    <>
      <Link className="flex items-center gap-1 opacity-85 hover:underline hover:opacity-100" href={`/mesas/${id}`}>
        <i className="bi bi-arrow-left" aria-hidden="true"></i> {mesa?.nome ?? "Mesa"}
      </Link>
      {ficha && (
        <>
          <span className={chip}><i className="bi bi-layers" aria-hidden="true"></i>{ROTULO_TIPO_FICHA[ficha.tipo]}</span>
          <span className={chip}><i className="bi bi-person" aria-hidden="true"></i>{ficha.ehMinha ? "Sua ficha" : ficha.dono ?? "NPC do mestre"}</span>
          {!podeEditar && <span className={chip}><i className="bi bi-lock" aria-hidden="true"></i>Só leitura</span>}
          {podeEditar && (
            <span className={chip} role="status" aria-live="polite">
              <i className={`bi ${estadoGravacao.icone}`} aria-hidden="true"></i>{estadoGravacao.texto}
            </span>
          )}
        </>
      )}
    </>
  );

  return (
    <>
      <CabecalhoSite tema={tema} alternarTema={alternarTema} sessao={sessao} />
      <main className="flex flex-1 flex-col">
        <FaixaPagina rotulo={rotulo} titulo={ficha?.nome ?? "Ficha"}>
          {ficha?.ehMinha && (
            <button type="button" className={`${chamadaSecundaria} cursor-pointer`} onClick={() => void guardarCopia()}>
              <i className="bi bi-bookmark-plus" aria-hidden="true"></i> Salvar na biblioteca
            </button>
          )}
          {podeEditar && (
            <button
              type="button"
              className={`${chamadaSecundaria} cursor-pointer`}
              aria-pressed={modo === "ver"}
              onClick={() => setModo((atual) => (atual === "editar" ? "ver" : "editar"))}
            >
              <i className={`bi ${modo === "editar" ? "bi-eye" : "bi-pencil"}`} aria-hidden="true"></i>{" "}
              {modo === "editar" ? "Modo leitura" : "Editar ficha"}
            </button>
          )}
        </FaixaPagina>
        <div className={`${conteudoPagina} flex flex-1 flex-col gap-6 py-8`}>
          {sessao.sessao.estado === "visitante" && (
            <div className="mx-auto w-full max-w-md py-10">
              <AvisoLogin mensagem="Entre na sua conta para ver esta ficha." />
            </div>
          )}
          {logado && carregando && <p className="py-16 text-center opacity-80">Carregando ficha...</p>}
          {avisoBiblioteca && (
            <p role="status" className="rounded-md border border-acento/60 bg-acento/10 p-3 text-sm">
              <i className="bi bi-bookmark-check" aria-hidden="true"></i> {avisoBiblioteca}
            </p>
          )}
          <ListaErros erros={erros} />
          {ficha && <FichaModelo modelo={ficha.modelo} conteudo={ficha.conteudo} editavel={editavel} aoAlterar={alterar} />}
        </div>
      </main>
    </>
  );
}
