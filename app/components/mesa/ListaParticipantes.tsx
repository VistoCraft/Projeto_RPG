import { alterarPapel, removerParticipante } from "@/src/repositories/mesasRepositorio";
import { papeisAtribuiveis, podeRemover, ROTULOS_PAPEL, type DetalheMesa, type PapelParticipante } from "@/src/dominio/mesa";
import type { EstadoMesa } from "./useMesa";
import { botaoContorno, campoLinha, cartao, tituloSecao } from "../estilos";

type ListaParticipantesProps = {
  mesa: DetalheMesa;
  estado: EstadoMesa;
};

function papelDoValor(valor: string): PapelParticipante | null {
  const papeis: PapelParticipante[] = ["ajudante", "jogador", "espectador"];
  return papeis.find((papel) => papel === valor) ?? null;
}

export default function ListaParticipantes({ mesa, estado }: ListaParticipantesProps) {
  const ator = mesa.status === "ativa" ? mesa.meuPapel : null;

  const mudarPapel = (usuarioId: string, valor: string) => {
    const papel = papelDoValor(valor);
    if (papel) void estado.executar(() => alterarPapel(mesa.id, usuarioId, papel));
  };

  return (
    <section className={`${cartao} flex flex-col gap-4`} aria-labelledby="titulo-participantes">
      <h2 id="titulo-participantes" className={tituloSecao}>Participantes ({mesa.participantes.length})</h2>
      <ul className="flex flex-col divide-y divide-borda">
        {mesa.participantes.map((participante) => {
          const opcoes = ator ? papeisAtribuiveis(ator, participante.papel) : [];
          const removivel = ator !== null && podeRemover(ator, participante.papel);
          return (
            <li key={participante.usuarioId} className="flex flex-wrap items-center justify-between gap-3 py-2">
              <span className="flex items-center gap-2">
                <i className="bi bi-person-circle text-destaque" aria-hidden="true"></i>
                {participante.apelido}
              </span>
              <span className="flex items-center gap-2">
                {opcoes.length > 0 ? (
                  <select
                    className={`${campoLinha} mb-0`}
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
