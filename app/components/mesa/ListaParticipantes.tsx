import { alterarPapel, removerParticipante } from "@/src/repositories/mesasRepositorio";
import { PAPEIS_ATRIBUIVEIS, papeisAtribuiveis, podeRemover, ROTULOS_PAPEL, type DetalheMesa, type PapelParticipante } from "@/src/dominio/mesa";
import type { EstadoMesa } from "./useMesa";
import { botaoContorno, cartao, tituloPainel } from "../estilos";

type ListaParticipantesProps = {
  mesa: DetalheMesa;
  estado: EstadoMesa;
};

function papelDoValor(valor: string): PapelParticipante | null {
  return PAPEIS_ATRIBUIVEIS.find((papel) => papel === valor) ?? null;
}

export default function ListaParticipantes({ mesa, estado }: ListaParticipantesProps) {
  const ator = mesa.status === "ativa" ? mesa.meuPapel : null;

  const mudarPapel = (usuarioId: string, valor: string) => {
    const papel = papelDoValor(valor);
    if (papel) void estado.executar(() => alterarPapel(mesa.id, usuarioId, papel));
  };

  return (
    <section className={`${cartao} flex flex-col gap-4`} aria-labelledby="titulo-participantes">
      <h2 id="titulo-participantes" className={tituloPainel}>
        <i className="bi bi-people text-destaque" aria-hidden="true"></i> Participantes
        <span className="ml-auto rounded-full bg-arcano/15 px-2.5 py-0.5 font-texto text-sm tabular-nums text-destaque">{mesa.participantes.length}</span>
      </h2>
      <ul className="flex flex-col divide-y divide-borda">
        {mesa.participantes.map((participante) => {
          const opcoes = ator ? papeisAtribuiveis(ator, participante.papel) : [];
          const removivel = ator !== null && podeRemover(ator, participante.papel);
          return (
            <li key={participante.usuarioId} className="flex flex-wrap items-center justify-between gap-3 py-2">
              <span className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-arcano/15 text-sm font-bold text-destaque uppercase">{participante.apelido.slice(0, 1)}</span>
                {participante.apelido}
              </span>
              <span className="flex items-center gap-2">
                {opcoes.length > 0 ? (
                  <select
                    className="cursor-pointer rounded-md border border-texto/25 bg-fundo px-2 py-1 text-sm text-texto outline-none hover:border-arcano/60 focus:border-arcano focus:ring-2 focus:ring-arcano/25"
                    aria-label={`Papel de ${participante.apelido}`}
                    value={participante.papel}
                    disabled={estado.executando}
                    onChange={(evento) => mudarPapel(participante.usuarioId, evento.target.value)}
                  >
                    {opcoes.map((papel) => <option key={papel} value={papel}>{ROTULOS_PAPEL[papel]}</option>)}
                  </select>
                ) : (
                  <span className="text-sm opacity-80">{ROTULOS_PAPEL[participante.papel]}</span>
                )}
                {removivel && (
                  <button
                    type="button"
                    className={botaoContorno}
                    aria-label={`Remover ${participante.apelido} da mesa`}
                    disabled={estado.executando}
                    onClick={() => void estado.executar(() => removerParticipante(mesa.id, participante.usuarioId))}
                  >
                    <i className="bi bi-x-lg" aria-hidden="true"></i>
                  </button>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
