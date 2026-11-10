import { useState } from "react";
import { atualizarFicha, criarFicha, excluirFicha } from "@/src/repositories/fichasRepositorio";
import { salvarNaBiblioteca } from "@/src/repositories/bibliotecaRepositorio";
import { jogadoresDaMesa, ROTULOS_TIPO_FICHA, TIPOS_FICHA, type DadosNovaFicha } from "@/src/dominio/ficha";
import { podeCuidarDeFichasETabuleiro, type DetalheMesa } from "@/src/dominio/mesa";
import type { EstadoFichas } from "./useFichas";
import type { EstadoPropostas } from "./usePropostas";
import PainelPropostas from "./PainelPropostas";
import FormularioFicha from "./FormularioFicha";
import ItemFicha from "./ItemFicha";
import ListaErros from "../formulario/ListaErros";
import { botaoCompacto, cartao, tituloPainel } from "../estilos";

type PainelFichasProps = {
  mesa: DetalheMesa;
  estado: EstadoFichas;
  propostas: EstadoPropostas;
};

const NOVA_FICHA = "nova";

export default function PainelFichas({ mesa, estado, propostas }: PainelFichasProps) {
  const [emEdicao, setEmEdicao] = useState<string | null>(null);
  const { itens: fichas, carregando, executando, erros, executar } = estado;
  const ativa = mesa.status === "ativa";
  const podeCuidar = ativa && podeCuidarDeFichasETabuleiro(mesa.meuPapel);
  const jogadores = jogadoresDaMesa(mesa.participantes);
  const fecharEdicao = () => setEmEdicao(null);

  const criar = (dados: DadosNovaFicha) => executar(() => criarFicha(mesa.id, dados));

  const mensagemVazia = podeCuidar ? "Nenhuma ficha ainda. Crie a primeira e entregue a um jogador." : "O mestre ainda não te entregou nenhuma ficha.";

  return (
    <section className={`${cartao} flex flex-col gap-4 md:col-span-2`} aria-labelledby="titulo-fichas">
      <header className="flex flex-wrap items-center gap-3">
        <h2 id="titulo-fichas" className={tituloPainel}>
          <i className="bi bi-journal-text text-destaque" aria-hidden="true"></i> Fichas
          <span className="rounded-full bg-arcano/15 px-2.5 py-0.5 font-texto text-sm tabular-nums text-destaque">{fichas.length}</span>
        </h2>
        {podeCuidar && emEdicao !== NOVA_FICHA && (
          <button type="button" className={`${botaoCompacto} ml-auto`} onClick={() => setEmEdicao(NOVA_FICHA)}>
            <i className="bi bi-plus-lg" aria-hidden="true"></i> Nova ficha
          </button>
        )}
      </header>
      <ListaErros erros={erros} />
      <PainelPropostas mesa={mesa} estado={propostas} />
      {emEdicao === NOVA_FICHA && (
        <FormularioFicha ficha={null} jogadores={jogadores} executando={executando} aoSalvar={criar} aoFechar={fecharEdicao} />
      )}
      {carregando && <p className="text-sm opacity-75">Carregando fichas...</p>}
      {!carregando && fichas.length === 0 && emEdicao !== NOVA_FICHA && (
        <p className="rounded-md border border-dashed border-borda p-6 text-center text-sm opacity-80">{mensagemVazia}</p>
      )}
      {TIPOS_FICHA.map((tipo) => {
        const doTipo = fichas.filter((ficha) => ficha.tipo === tipo);
        if (doTipo.length === 0) return null;
        return (
          <div key={tipo} className="flex flex-col gap-2">
            <h3 className="text-xs font-bold tracking-[0.2em] text-acento uppercase">{ROTULOS_TIPO_FICHA[tipo]}</h3>
            <ul className="grid gap-2 xl:grid-cols-2">
              {doTipo.map((ficha) =>
                emEdicao === ficha.id ? (
                  <li key={ficha.id} className="xl:col-span-2">
                    <FormularioFicha
                      ficha={ficha}
                      jogadores={jogadores}
                      executando={executando}
                      aoSalvar={(dados) => executar(() => atualizarFicha(mesa.id, ficha.id, dados))}
                      aoFechar={fecharEdicao}
                    />
                  </li>
                ) : (
                  <ItemFicha
                    key={ficha.id}
                    mesaId={mesa.id}
                    ficha={ficha}
                    podeCuidar={podeCuidar}
                    executando={executando}
                    aoEditar={() => setEmEdicao(ficha.id)}
                    aoExcluir={() => void executar(() => excluirFicha(mesa.id, ficha.id))}
                    aoSalvarNaBiblioteca={() => executar(() => salvarNaBiblioteca(mesa.id, ficha.id))}
                  />
                ),
              )}
            </ul>
          </div>
        );
      })}
    </section>
  );
}
