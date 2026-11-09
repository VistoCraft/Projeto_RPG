import type { Mesa, StatusMesa } from "@/src/dominio/mesa";
import { cartao } from "../estilos";

type CartaoMesaProps = {
  mesa: Mesa;
};

const aparenciaDoStatus: Record<StatusMesa, { rotulo: string; classes: string }> = {
  aberta: { rotulo: "Aberta", classes: "border-acento text-acento" },
  "em-sessao": { rotulo: "Em sessão", classes: "border-destaque text-destaque" },
  encerrada: { rotulo: "Encerrada", classes: "border-borda opacity-70" },
};

export default function CartaoMesa({ mesa }: CartaoMesaProps) {
  const status = aparenciaDoStatus[mesa.status];

  return (
    <article className={`${cartao} flex flex-col gap-3`}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-titulo text-[22px] leading-tight font-bold">{mesa.nome}</h3>
        <span className={`shrink-0 rounded-full border px-3 py-0.5 text-sm ${status.classes}`}>{status.rotulo}</span>
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
        <dt className="opacity-80"><i className="bi bi-person-badge" aria-hidden="true"></i> Mestre</dt>
        <dd>{mesa.mestre}</dd>
        <dt className="opacity-80"><i className="bi bi-book" aria-hidden="true"></i> Sistema</dt>
        <dd>{mesa.sistema}</dd>
        <dt className="opacity-80"><i className="bi bi-people" aria-hidden="true"></i> Jogadores</dt>
        <dd className="tabular-nums">{mesa.jogadores}/{mesa.limiteJogadores}</dd>
      </dl>
    </article>
  );
}
