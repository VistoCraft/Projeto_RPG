"use client";

import { useCallback } from "react";
import { excluirDaBiblioteca, listarBiblioteca } from "@/src/repositories/bibliotecaRepositorio";
import useTema from "../useTema";
import useSessao from "../useSessao";
import useColecaoRemota from "../useColecaoRemota";
import CabecalhoSite from "../CabecalhoSite";
import FaixaPagina from "../FaixaPagina";
import AvisoLogin from "../AvisoLogin";
import ListaErros from "../formulario/ListaErros";
import CartaoBiblioteca from "./CartaoBiblioteca";
import { cartao, conteudoPagina } from "../estilos";

export default function PaginaBiblioteca() {
  const [tema, alternarTema] = useTema();
  const sessao = useSessao();
  const logado = sessao.sessao.estado === "logado";
  const buscar = useCallback(() => listarBiblioteca(), []);
  const { itens: fichas, carregando, executando, erros, executar } = useColecaoRemota(buscar, logado);

  return (
    <>
      <CabecalhoSite tema={tema} alternarTema={alternarTema} sessao={sessao} />
      <main className="flex flex-1 flex-col">
        <FaixaPagina
          rotulo={<span className="tracking-[0.2em] uppercase opacity-80">Biblioteca</span>}
          titulo="Seus personagens guardados"
          descricao="Cópias das suas fichas, para guardar e levar a outras mesas com o mesmo modelo de ficha."
        />
        <div className={`${conteudoPagina} flex flex-1 flex-col gap-6 py-8`}>
          {sessao.sessao.estado === "visitante" && (
            <div className="mx-auto w-full max-w-md py-10">
              <AvisoLogin mensagem="Entre na sua conta para ver a sua biblioteca." />
            </div>
          )}
          <ListaErros erros={erros} />
          {logado && carregando && <p className="py-16 text-center opacity-80">Carregando a biblioteca...</p>}
          {logado && !carregando && fichas.length === 0 && erros.length === 0 && (
            <div className={`${cartao} flex flex-col items-center gap-2 py-16 text-center`}>
              <i className="bi bi-bookmark text-[32px] text-destaque" aria-hidden="true"></i>
              <p className="font-titulo text-[20px] font-bold">Sua biblioteca está vazia</p>
              <p className="max-w-[56ch] text-sm opacity-75">
                Numa mesa, use o botão <i className="bi bi-bookmark-plus" aria-hidden="true"></i> ao lado de uma ficha sua para guardar uma cópia aqui.
                Quando uma mesa é excluída, as fichas que eram suas também vêm para cá.
              </p>
            </div>
          )}
          {fichas.length > 0 && (
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-5">
              {fichas.map((ficha) => (
                <CartaoBiblioteca key={ficha.id} ficha={ficha} executando={executando} aoExcluir={() => void executar(() => excluirDaBiblioteca(ficha.id))} />
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}
