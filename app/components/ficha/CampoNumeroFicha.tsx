import { useState } from "react";
import { campoFicha } from "../estilos";

type CampoNumeroFichaProps = {
  id?: string;
  rotulo: string;
  valor: number;
  minimo?: number | null;
  maximo?: number | null;
  editavel: boolean;
  aoAlterar: (valor: number) => void;
  classes?: string;
};

function dentroDosLimites(numero: number, minimo?: number | null, maximo?: number | null): boolean {
  return Number.isInteger(numero) && (minimo == null || numero >= minimo) && (maximo == null || numero <= maximo);
}

export default function CampoNumeroFicha({ id, rotulo, valor, minimo, maximo, editavel, aoAlterar, classes = "w-full" }: CampoNumeroFichaProps) {
  const [rascunho, setRascunho] = useState<string | null>(null);
  const texto = rascunho ?? String(valor);
  const invalido = rascunho !== null && !dentroDosLimites(Number(rascunho), minimo, maximo);

  const digitar = (novoTexto: string) => {
    setRascunho(novoTexto);
    const numero = Number(novoTexto);
    if (novoTexto.trim() !== "" && dentroDosLimites(numero, minimo, maximo)) aoAlterar(numero);
  };

  return (
    <input
      id={id}
      className={`${campoFicha} tabular-nums ${classes}`}
      type="text"
      inputMode="numeric"
      aria-label={rotulo}
      aria-invalid={invalido}
      title={minimo != null || maximo != null ? `De ${minimo ?? "−∞"} a ${maximo ?? "∞"}` : undefined}
      value={texto}
      disabled={!editavel}
      onChange={(evento) => digitar(evento.target.value)}
      onBlur={() => setRascunho(null)}
    />
  );
}
