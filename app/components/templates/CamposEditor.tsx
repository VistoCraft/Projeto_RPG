import { useId, type ReactNode } from "react";
import type { Opcao } from "@/src/dominio/perfil";
import { campoFicha, rotuloFicha } from "../estilos";

type MolduraProps = { rotulo: string; classes?: string; children: (id: string) => ReactNode };

function Moldura({ rotulo, classes = "", children }: MolduraProps) {
  const id = useId();
  return (
    <div className={`flex min-w-0 flex-col gap-1 ${classes}`}>
      <label className={rotuloFicha} htmlFor={id}>{rotulo}</label>
      {children(id)}
    </div>
  );
}

type EntradaTextoProps = {
  rotulo: string;
  valor: string;
  aoAlterar: (valor: string) => void;
  editavel: boolean;
  monoespacada?: boolean;
  tamanhoMaximo?: number;
  classes?: string;
  dica?: ReactNode;
};

export function EntradaTexto({ rotulo, valor, aoAlterar, editavel, monoespacada = false, tamanhoMaximo, classes, dica }: EntradaTextoProps) {
  return (
    <Moldura rotulo={rotulo} classes={classes}>
      {(id) => (
        <>
          <input
            id={id}
            className={`${campoFicha} w-full ${monoespacada ? "font-mono text-sm" : ""}`}
            value={valor}
            maxLength={tamanhoMaximo}
            disabled={!editavel}
            onChange={(evento) => aoAlterar(evento.target.value)}
          />
          {dica}
        </>
      )}
    </Moldura>
  );
}

type EntradaNumeroProps = {
  rotulo: string;
  valor: number | null | undefined;
  aoAlterar: (valor: string) => void;
  editavel: boolean;
  classes?: string;
};

export function EntradaNumero({ rotulo, valor, aoAlterar, editavel, classes }: EntradaNumeroProps) {
  return (
    <Moldura rotulo={rotulo} classes={classes}>
      {(id) => (
        <input
          id={id}
          className={`${campoFicha} w-full tabular-nums`}
          inputMode="numeric"
          value={valor ?? ""}
          disabled={!editavel}
          onChange={(evento) => aoAlterar(evento.target.value)}
        />
      )}
    </Moldura>
  );
}

type EntradaSelecaoProps = {
  rotulo: string;
  valor: string;
  opcoes: Opcao[];
  aoAlterar: (valor: string) => void;
  editavel: boolean;
  textoVazio?: string;
  classes?: string;
};

export function EntradaSelecao({ rotulo, valor, opcoes, aoAlterar, editavel, textoVazio, classes }: EntradaSelecaoProps) {
  return (
    <Moldura rotulo={rotulo} classes={classes}>
      {(id) => (
        <select
          id={id}
          className={`${campoFicha} w-full ${editavel ? "cursor-pointer" : "appearance-none"}`}
          value={valor}
          disabled={!editavel}
          onChange={(evento) => aoAlterar(evento.target.value)}
        >
          {textoVazio !== undefined && <option value="">{textoVazio}</option>}
          {opcoes.map((opcao) => <option key={opcao.valor} value={opcao.valor}>{opcao.rotulo}</option>)}
        </select>
      )}
    </Moldura>
  );
}
