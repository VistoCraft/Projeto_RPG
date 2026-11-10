import { useState } from "react";
import { PERICIA_PADRAO, type AtributoModelo, type EstadoPericia, type PericiaModelo } from "@/src/dominio/modeloFicha";
import { avaliarFormula, descreverFormula, type ContextoFormula } from "@/src/dominio/formula";
import type { AlterarCampo } from "./useFicha";
import SecaoFicha from "./SecaoFicha";
import { campoFicha, rotuloFicha } from "../estilos";

type PericiasFichaProps = {
  pericias: PericiaModelo[];
  atributos: AtributoModelo[];
  estados: Record<string, EstadoPericia>;
  contexto: ContextoFormula;
  editavel: boolean;
  aoAlterar: AlterarCampo;
};

const LETRAS_SIGLA = 3;

function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

export default function PericiasFicha({ pericias, atributos, estados, contexto, editavel, aoAlterar }: PericiasFichaProps) {
  const [busca, setBusca] = useState("");
  const termo = normalizar(busca.trim());
  const visiveis = termo ? pericias.filter((pericia) => normalizar(pericia.rotulo).includes(termo)) : pericias;
  const favoritas = pericias.filter((pericia) => estados[pericia.id]?.favorita);

  const sigla = (atributoId?: string | null) =>
    atributos.find((atributo) => atributo.id === atributoId)?.rotulo.slice(0, LETRAS_SIGLA).toUpperCase() ?? "";

  const linha = (pericia: PericiaModelo, prefixo: string) => {
    const estado = estados[pericia.id] ?? PERICIA_PADRAO;
    const rolagem = pericia.rolagem ? avaliarFormula(pericia.rolagem, contexto) : null;
    const idTreinada = `${prefixo}-treinada-${pericia.id}`;
    return (
      <li key={pericia.id} className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-texto/5">
        <button
          type="button"
          className={`cursor-pointer text-sm disabled:cursor-default ${estado.favorita ? "text-essencia" : "opacity-40 hover:opacity-80"}`}
          aria-label={estado.favorita ? `Tirar ${pericia.rotulo} das favoritas` : `Favoritar ${pericia.rotulo}`}
          aria-pressed={estado.favorita}
          disabled={!editavel}
          onClick={() => aoAlterar(`pericias.${pericia.id}.favorita`, !estado.favorita)}
        >
          <i className={`bi ${estado.favorita ? "bi-star-fill" : "bi-star"}`} aria-hidden="true"></i>
        </button>
        <input
          id={idTreinada}
          className="h-4 w-4 shrink-0 cursor-pointer accent-destaque disabled:cursor-default"
          type="checkbox"
          checked={estado.treinada}
          disabled={!editavel}
          onChange={(evento) => aoAlterar(`pericias.${pericia.id}.treinada`, evento.target.checked)}
          title="Treinada"
        />
        <label htmlFor={idTreinada} className="min-w-0 flex-1 truncate text-sm">
          {pericia.rotulo}
          <span className="sr-only">{estado.treinada ? " (treinada)" : ""}</span>
        </label>
        {pericia.atributo && <span className="w-9 text-[10px] font-bold tracking-wider opacity-55">{sigla(pericia.atributo)}</span>}
        <span className="w-24 text-right font-mono text-sm font-semibold text-destaque tabular-nums" title={pericia.rolagem ?? undefined}>
          {rolagem ? descreverFormula(rolagem) : "—"}
        </span>
      </li>
    );
  };

  const campoBusca = (
    <input
      className={`${campoFicha} w-44 text-sm`}
      type="search"
      aria-label="Buscar perícia"
      placeholder="Buscar perícia"
      value={busca}
      onChange={(evento) => setBusca(evento.target.value)}
    />
  );

  return (
    <SecaoFicha id="pericias" titulo="Perícias" icone="bi-list-check" acoes={campoBusca}>
      {favoritas.length > 0 && !termo && (
        <div className="flex flex-col gap-1 rounded-lg border border-essencia/40 bg-essencia/5 p-2">
          <span className={`${rotuloFicha} px-2`}>Favoritas</span>
          <ul className="flex flex-col">{favoritas.map((pericia) => linha(pericia, "favorita"))}</ul>
        </div>
      )}
      <ul className="flex flex-col">{visiveis.map((pericia) => linha(pericia, "todas"))}</ul>
      {visiveis.length === 0 && <p className="text-sm opacity-70">Nenhuma perícia com esse nome.</p>}
      <p className="text-xs opacity-60">
        <i className="bi bi-star" aria-hidden="true"></i> favorita · caixa marcada = treinada · o valor à direita é a rolagem calculada pela fórmula do modelo
      </p>
    </SecaoFicha>
  );
}
