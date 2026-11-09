import type { Mesa } from "@/src/dominio/mesa";

type SeloMesaProps = {
  mesa: Pick<Mesa, "status" | "entradaBloqueada">;
};

type Aparencia = { rotulo: string; classes: string };

const APARENCIA_ABERTA: Aparencia = { rotulo: "Aberta", classes: "border-acento text-acento" };
const APARENCIA_BLOQUEADA: Aparencia = { rotulo: "Entrada bloqueada", classes: "border-destaque text-destaque" };
const APARENCIA_ENCERRADA: Aparencia = { rotulo: "Encerrada", classes: "border-borda opacity-70" };

function aparenciaDe({ status, entradaBloqueada }: SeloMesaProps["mesa"]): Aparencia {
  if (status === "encerrada") return APARENCIA_ENCERRADA;
  return entradaBloqueada ? APARENCIA_BLOQUEADA : APARENCIA_ABERTA;
}

export default function SeloMesa({ mesa }: SeloMesaProps) {
  const { rotulo, classes } = aparenciaDe(mesa);
  return <span className={`shrink-0 rounded-full border px-3 py-0.5 text-sm ${classes}`}>{rotulo}</span>;
}
