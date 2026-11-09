import Link from "next/link";
import { ROTULOS_PAPEL, type Mesa } from "@/src/dominio/mesa";
import SeloMesa from "../SeloMesa";
import { cartaoBase } from "../estilos";

type CartaoMesaProps = {
  mesa: Mesa;
};

export default function CartaoMesa({ mesa }: CartaoMesaProps) {
  return (
    <Link href={`/mesas/${mesa.id}`} className={`${cartaoBase} group flex flex-col gap-4 overflow-hidden transition hover:-translate-y-0.5 hover:border-arcano hover:shadow-lg`}>
      <div className="h-1.5 bg-linear-to-r from-arcano via-mare to-essencia opacity-70 transition-opacity group-hover:opacity-100"></div>
      <div className="flex flex-1 flex-col gap-4 px-5 pb-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-titulo text-[22px] leading-tight font-bold">
            {mesa.visibilidade === "privada" && <i className="bi bi-lock me-2 text-[18px]" aria-label="Mesa privada"></i>}
            {mesa.nome}
          </h3>
          <SeloMesa mesa={mesa} />
        </div>
        <p className="line-clamp-2 min-h-[2lh] text-sm opacity-80">{mesa.descricao || "Sem descrição."}</p>
        <dl className="mt-auto grid grid-cols-3 gap-2 border-t border-borda pt-4 text-sm">
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs opacity-70"><i className="bi bi-person-badge" aria-hidden="true"></i> Mestre</dt>
            <dd className="truncate font-semibold">{mesa.dono ?? "—"}</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs opacity-70"><i className="bi bi-journal-text" aria-hidden="true"></i> Ficha</dt>
            <dd className="truncate font-semibold">{mesa.template}</dd>
          </div>
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs opacity-70"><i className="bi bi-people" aria-hidden="true"></i> Pessoas</dt>
            <dd className="font-semibold tabular-nums" title={`${mesa.jogadores} jogadores · ${mesa.espectadores} espectadores`}>
              {mesa.jogadores} + {mesa.espectadores}
            </dd>
          </div>
        </dl>
        {mesa.meuPapel && (
          <p className="rounded-md bg-arcano/10 px-3 py-1.5 text-sm font-semibold text-destaque">
            Você participa como {ROTULOS_PAPEL[mesa.meuPapel].toLowerCase()}
          </p>
        )}
      </div>
    </Link>
  );
}
