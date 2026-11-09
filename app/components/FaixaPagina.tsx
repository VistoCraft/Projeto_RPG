import type { ReactNode } from "react";
import { brilhoFaixa, conteudoPagina, faixaTela } from "./estilos";

type FaixaPaginaProps = {
  rotulo?: ReactNode;
  titulo: ReactNode;
  descricao?: ReactNode;
  children?: ReactNode;
  ladoALado?: boolean;
};

const layoutPadrao = {
  linha: "flex flex-col gap-6 py-10 lg:flex-row lg:items-end lg:justify-between lg:py-12",
  texto: "flex max-w-3xl flex-col gap-3",
  lado: "flex flex-wrap items-center gap-3",
};

const layoutLadoALado = {
  linha: "grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:items-center lg:gap-12 lg:py-14",
  texto: "flex flex-col gap-3",
  lado: "w-full",
};

export default function FaixaPagina({ rotulo, titulo, descricao, children, ladoALado = false }: FaixaPaginaProps) {
  const layout = ladoALado ? layoutLadoALado : layoutPadrao;

  return (
    <section className={faixaTela}>
      <div className={brilhoFaixa} aria-hidden="true"></div>
      <div className={`${conteudoPagina} relative ${layout.linha}`}>
        <div className={layout.texto}>
          {rotulo && <div className="flex flex-wrap items-center gap-3 text-sm">{rotulo}</div>}
          <h1 className="font-titulo text-[2.25rem] leading-tight font-bold md:text-[2.75rem] 2xl:text-[3.25rem]">{titulo}</h1>
          {descricao && <div className="text-lg opacity-90">{descricao}</div>}
        </div>
        {children && <div className={layout.lado}>{children}</div>}
      </div>
    </section>
  );
}
