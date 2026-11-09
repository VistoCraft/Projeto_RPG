import type { ReactNode } from "react";
import { cartao, tituloPainel } from "../estilos";

type SecaoFichaProps = {
  id: string;
  titulo: string;
  icone: string;
  acoes?: ReactNode;
  classes?: string;
  children: ReactNode;
};

export default function SecaoFicha({ id, titulo, icone, acoes, classes = "", children }: SecaoFichaProps) {
  return (
    <section className={`${cartao} flex flex-col gap-4 ${classes}`} aria-labelledby={`titulo-${id}`}>
      <header className="flex flex-wrap items-center gap-3">
        <h2 id={`titulo-${id}`} className={tituloPainel}>
          <i className={`bi ${icone} text-destaque`} aria-hidden="true"></i> {titulo}
        </h2>
        {acoes && <div className="ml-auto flex flex-wrap items-center gap-2">{acoes}</div>}
      </header>
      {children}
    </section>
  );
}
