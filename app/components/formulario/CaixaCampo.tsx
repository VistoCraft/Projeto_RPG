import type { ReactNode } from "react";
import { campoCaixa } from "../estilos";

type CaixaCampoProps = {
  icone?: string;
  seta?: boolean;
  acao?: ReactNode;
  children: ReactNode;
};

const iconeLateral = "pointer-events-none absolute top-1/2 -translate-y-1/2 text-texto/55 transition-colors peer-focus:text-destaque";

export function classeCampo(icone?: string, temDireita = false): string {
  return `${campoCaixa} ${icone ? "pl-10" : "pl-3"} ${temDireita ? "pr-10" : "pr-3"}`;
}

export default function CaixaCampo({ icone, seta = false, acao, children }: CaixaCampoProps) {
  return (
    <div className="relative">
      {children}
      {icone && <i aria-hidden="true" className={`bi bi-${icone} ${iconeLateral} left-3.5`} />}
      {seta && <i aria-hidden="true" className={`bi bi-chevron-down ${iconeLateral} right-3.5 text-xs`} />}
      {acao && <div className="absolute top-1/2 right-1.5 -translate-y-1/2">{acao}</div>}
    </div>
  );
}
