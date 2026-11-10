import { useState } from "react";
import { aceitarProposta, cancelarProposta, listarBiblioteca, proporFicha, recusarProposta } from "@/src/repositories/bibliotecaRepositorio";
import type { ResumoBiblioteca } from "@/src/dominio/biblioteca";
import { ROTULO_TIPO_FICHA } from "@/src/dominio/ficha";
import { podeCuidarDeFichasETabuleiro, type DetalheMesa } from "@/src/dominio/mesa";
import type { EstadoPropostas } from "./usePropostas";
import ListaErros from "../formulario/ListaErros";
import { botaoCompacto, botaoContorno, botaoPerigo, link } from "../estilos";

type PainelPropostasProps = {
  mesa: DetalheMesa;
  estado: EstadoPropostas;
};

const caixa = "flex flex-col gap-3 rounded-md border border-essencia/40 bg-essencia/5 p-3";
const linha = "flex flex-wrap items-center gap-3 rounded-md bg-fundo px-3 py-2 text-sm";

export default function PainelPropostas({ mesa, estado }: PainelPropostasProps) {
  const [escolhendo, setEscolhendo] = useState(false);
  const [biblioteca, setBiblioteca] = useState<ResumoBiblioteca[] | null>(null);
  const [errosBiblioteca, setErrosBiblioteca] = useState<string[]>([]);
  const { itens: propostas, executando, erros, executar } = estado;
  const ativa = mesa.status === "ativa";
  const equipe = ativa && podeCuidarDeFichasETabuleiro(mesa.meuPapel);
  const jogador = ativa && mesa.meuPapel === "jogador";

  if (!equipe && !jogador) return null;
  if (equipe && propostas.length === 0) return null;

  const abrirBiblioteca = async () => {
    setEscolhendo(true);
    const resultado = await listarBiblioteca();
    setBiblioteca(resultado.sucesso ? resultado.valor : []);
    setErrosBiblioteca(resultado.sucesso ? [] : resultado.erros);
  };

  const propor = async (fichaId: string) => {
    if (await executar(() => proporFicha(mesa.id, fichaId))) setEscolhendo(false);
  };

  const jaProposta = (fichaId: string) => propostas.some((proposta) => proposta.fichaId === fichaId);

  return (
    <div className={caixa}>
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <i className="bi bi-inbox text-acento" aria-hidden="true"></i>
          {equipe ? "Fichas propostas pelos jogadores" : "Trazer uma ficha da sua biblioteca"}
        </h3>
        {jogador && !escolhendo && (
          <button type="button" className={`${botaoContorno} ml-auto text-sm`} onClick={() => void abrirBiblioteca()}>
            <i className="bi bi-bookmark" aria-hidden="true"></i> Escolher da biblioteca
          </button>
        )}
      </div>
      <ListaErros erros={[...erros, ...errosBiblioteca]} />
      {jogador && escolhendo && (
        <div className="flex flex-col gap-2">
          {biblioteca === null && <p className="text-sm opacity-75">Carregando a biblioteca...</p>}
          {biblioteca?.length === 0 && (
            <p className="text-sm opacity-80">Sua biblioteca está vazia. Salve uma ficha sua com o botão de marcador.</p>
          )}
          {biblioteca?.map((ficha) => (
            <div key={ficha.id} className={linha}>
              <span className="min-w-0 flex-1 truncate font-semibold">{ficha.nome}</span>
              <span className="text-xs opacity-70">{ROTULO_TIPO_FICHA[ficha.tipo]} · {ficha.template}</span>
              <button type="button" className={botaoCompacto} disabled={executando || jaProposta(ficha.id)} onClick={() => void propor(ficha.id)}>
                {jaProposta(ficha.id) ? "Já proposta" : "Propor"}
              </button>
            </div>
          ))}
          <button type="button" className={`${link} self-start text-sm`} onClick={() => setEscolhendo(false)}>Fechar</button>
        </div>
      )}
      {propostas.length > 0 && (
        <ul className="flex flex-col gap-2" aria-label="Propostas pendentes">
          {propostas.map((proposta) => (
            <li key={proposta.id} className={linha}>
              <span className="min-w-0 flex-1">
                <strong>{proposta.ficha}</strong>{" "}
                <span className="opacity-70">({ROTULO_TIPO_FICHA[proposta.tipo].toLowerCase()}){equipe ? ` · de ${proposta.jogador}` : " · aguardando o mestre"}</span>
              </span>
              {equipe ? (
                <span className="flex gap-2">
                  <button type="button" className={botaoCompacto} disabled={executando} onClick={() => void executar(() => aceitarProposta(mesa.id, proposta.id))}>
                    Aceitar
                  </button>
                  <button type="button" className={botaoPerigo} disabled={executando} onClick={() => void executar(() => recusarProposta(mesa.id, proposta.id))}>
                    Recusar
                  </button>
                </span>
              ) : (
                <button type="button" className={botaoContorno} disabled={executando} onClick={() => void executar(() => cancelarProposta(mesa.id, proposta.id))}>
                  Cancelar
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
