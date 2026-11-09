import Link from "next/link";
import { ROTULOS_PAPEL, type Mesa } from "@/src/dominio/mesa";
import SeloMesa from "../SeloMesa";
import { cartao } from "../estilos";

type CartaoMesaProps = {
  mesa: Mesa;
};

export default function CartaoMesa({ mesa }: CartaoMesaProps) {
  return (
    <Link href={`/mesas/${mesa.id}`} className={`${cartao} flex flex-col gap-3 transition-colors hover:border-arcano`}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-titulo text-[22px] leading-tight font-bold">
          {mesa.visibilidade === "privada" && <i className="bi bi-lock me-2 text-[18px]" aria-label="Mesa privada"></i>}
          {mesa.nome}
        </h3>
        <SeloMesa mesa={mesa} />
      </div>
      {mesa.descricao && <p className="line-clamp-2 text-sm opacity-80">{mesa.descricao}</p>}
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
        <dt className="opacity-80"><i className="bi bi-person-badge" aria-hidden="true"></i> Mestre</dt>
        <dd>{mesa.dono ?? "—"}</dd>
        <dt className="opacity-80"><i className="bi bi-journal-text" aria-hidden="true"></i> Ficha</dt>
        <dd>{mesa.template}</dd>
        <dt className="opacity-80"><i className="bi bi-people" aria-hidden="true"></i> Pessoas</dt>
        <dd className="tabular-nums">{mesa.jogadores} jogadores · {mesa.espectadores} espectadores</dd>
      </dl>
      {mesa.meuPapel && <p className="text-sm font-bold text-destaque">Você participa como {ROTULOS_PAPEL[mesa.meuPapel].toLowerCase()}</p>}
    </Link>
  );
}
