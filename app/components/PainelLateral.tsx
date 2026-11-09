import type { ReactNode } from "react";
import DivisorRunico from "./DivisorRunico";
import { brilhoFaixa, faixaTela } from "./estilos";

export type ItemPainel = { icone: string; texto: string };

type PainelLateralProps = {
  rotulo: string;
  titulo: string;
  itens: ItemPainel[];
  topo?: ReactNode;
};

export default function PainelLateral({ rotulo, titulo, itens, topo }: PainelLateralProps) {
  return (
    <aside className={`${faixaTela} hidden lg:flex`}>
      <div className={brilhoFaixa} aria-hidden="true"></div>
      <div className="relative flex w-full flex-col justify-center gap-8 px-10 py-12 xl:px-16">
        {topo}
        <span className="text-xs font-bold tracking-[0.25em] uppercase opacity-80">{rotulo}</span>
        <h2 className="max-w-[18ch] font-titulo text-[2.5rem] leading-[1.1] font-bold xl:text-[3rem]">{titulo}</h2>
        <DivisorRunico />
        <ul className="flex flex-col gap-5">
          {itens.map(({ icone, texto }) => (
            <li key={texto} className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pergaminho/15 text-lg">
                <i className={`bi ${icone}`} aria-hidden="true"></i>
              </span>
              <p className="pt-2 opacity-90">{texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
