import { useId, type CSSProperties } from "react";
import {
  atributosDaFicha,
  comEstiloDaSecao,
  CORES_SUGERIDAS,
  ESTILOS_PRONTOS,
  estiloCompleto,
  limparEstilo,
  OPCOES_BORDA,
  OPCOES_CANTOS,
  OPCOES_DENSIDADE,
  OPCOES_FONTE,
  OPCOES_TEMA,
  OPCOES_TITULO,
  type BordaFicha,
  type EstiloFicha,
  type Opcao,
  type TituloFicha,
} from "@/src/dominio/estiloFicha";
import { secoesDisponiveis } from "@/src/dominio/layoutFicha";
import type { ModeloFicha } from "@/src/dominio/modeloFicha";
import SecaoFicha from "../ficha/SecaoFicha";
import { EntradaSelecao } from "./CamposEditor";
import { rotuloFicha } from "../estilos";

type EditorEstiloProps = {
  modelo: ModeloFicha;
  editavel: boolean;
  aoAlterar: (estilo: EstiloFicha) => void;
};

type CampoCorProps = {
  rotulo: string;
  cor: string | null;
  textoVazio: string;
  editavel: boolean;
  comSugestoes?: boolean;
  aoAlterar: (cor: string | null) => void;
};

function CampoCor({ rotulo, cor, textoVazio, editavel, comSugestoes = false, aoAlterar }: CampoCorProps) {
  const id = useId();
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <label className={rotuloFicha} htmlFor={id}>{rotulo}</label>
      <div className="flex flex-wrap items-center gap-2">
        <input
          id={id}
          type="color"
          className="h-9 w-12 shrink-0 cursor-pointer rounded-md border border-texto/20 bg-fundo p-1 disabled:cursor-default"
          value={cor ?? "#7f56d9"}
          disabled={!editavel}
          onChange={(evento) => aoAlterar(evento.target.value)}
        />
        <span className="text-sm tabular-nums opacity-75">{cor ?? textoVazio}</span>
        {editavel && cor && (
          <button type="button" className="cursor-pointer text-sm font-semibold text-acento hover:underline" onClick={() => aoAlterar(null)}>
            Limpar
          </button>
        )}
      </div>
      {editavel && comSugestoes && (
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Cores sugeridas">
          {CORES_SUGERIDAS.map((sugestao) => (
            <button
              key={sugestao}
              type="button"
              title={sugestao}
              aria-label={`Usar a cor ${sugestao}`}
              aria-pressed={cor === sugestao}
              className={`h-6 w-6 cursor-pointer rounded-full border-2 bg-(--amostra) ${cor === sugestao ? "border-texto" : "border-transparent"}`}
              style={{ "--amostra": sugestao } as CSSProperties}
              onClick={() => aoAlterar(sugestao)}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
}

function mesmoEstilo(a: EstiloFicha, b: EstiloFicha): boolean {
  const semSecoes = (estilo: EstiloFicha) => JSON.stringify(limparEstilo({ ...estilo, secoes: null }, new Set()));
  return semSecoes(a) === semSecoes(b);
}

export default function EditorEstilo({ modelo, editavel, aoAlterar }: EditorEstiloProps) {
  const estilo = modelo.estilo ?? {};
  const completo = estiloCompleto(estilo);
  const mudar = (parcial: Partial<EstiloFicha>) => aoAlterar({ ...estilo, ...parcial });
  const selecao = <T extends string>(rotulo: string, valor: T, opcoes: Opcao<T>[], chave: keyof EstiloFicha) => (
    <EntradaSelecao rotulo={rotulo} valor={valor} opcoes={opcoes} editavel={editavel} aoAlterar={(novo) => mudar({ [chave]: novo })} />
  );

  return (
    <SecaoFicha id="editor-estilo" titulo="Estilo da ficha" icone="bi-palette">
      <p className="-mt-2 text-sm opacity-70">
        Cores, fontes e molduras da ficha deste template. A prévia ao lado mostra o resultado; cada seção pode ter cor, borda e título próprios.
      </p>

      <div className="flex flex-col gap-2">
        <span className={rotuloFicha}>Estilos prontos</span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 2xl:grid-cols-4">
          {ESTILOS_PRONTOS.map((pronto) => {
            const ativo = mesmoEstilo(estilo, pronto.estilo);
            return (
              <button
                key={pronto.nome}
                type="button"
                disabled={!editavel}
                aria-pressed={ativo}
                onClick={() => aoAlterar({ ...pronto.estilo, secoes: estilo.secoes })}
                className={`flex cursor-pointer flex-col gap-2 rounded-md border p-2 text-left transition-colors disabled:cursor-default ${
                  ativo ? "border-destaque ring-2 ring-destaque/30" : "border-borda hover:border-destaque/60"
                }`}
              >
                <span {...atributosDaFicha(pronto.estilo)} className="flex items-center gap-2 rounded-md border border-borda bg-fundo p-2 font-texto text-texto">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-superficie font-titulo text-lg font-bold text-destaque">Aa</span>
                  <span className="flex flex-1 flex-col gap-1">
                    <span className="h-1.5 w-3/4 rounded-full bg-destaque"></span>
                    <span className="h-1.5 w-1/2 rounded-full bg-acento"></span>
                  </span>
                </span>
                <span className="text-sm font-semibold">{pronto.nome}</span>
                <span className="text-xs opacity-70">{pronto.descricao}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {selecao("Tema de cores", completo.tema, OPCOES_TEMA, "tema")}
        {selecao("Fonte dos títulos", completo.fonteTitulo, OPCOES_FONTE, "fonteTitulo")}
        {selecao("Fonte do texto", completo.fonteTexto, OPCOES_FONTE, "fonteTexto")}
        {selecao("Espaçamento", completo.densidade, OPCOES_DENSIDADE, "densidade")}
        {selecao("Cantos", completo.cantos, OPCOES_CANTOS, "cantos")}
        {selecao("Bordas das seções", completo.borda, OPCOES_BORDA, "borda")}
        {selecao("Títulos das seções", completo.titulo, OPCOES_TITULO, "titulo")}
        <CampoCor rotulo="Cor de destaque" cor={completo.cor} textoVazio="A do tema" editavel={editavel} comSugestoes aoAlterar={(cor) => mudar({ cor })} />
      </div>

      <details className="rounded-md border border-borda bg-fundo p-3">
        <summary className="cursor-pointer font-semibold">
          Estilo por seção <span className="text-sm font-normal opacity-70">({Object.keys(estilo.secoes ?? {}).length} personalizada(s))</span>
        </summary>
        <ul className="mt-3 flex flex-col gap-3">
          {secoesDisponiveis(modelo).map((secao) => {
            const propria = estilo.secoes?.[secao.id] ?? {};
            const mudarSecao = (parcial: { cor?: string | null; borda?: BordaFicha | null; titulo?: TituloFicha | null }) =>
              aoAlterar(comEstiloDaSecao(estilo, secao.id, parcial));
            return (
              <li key={secao.id} className="grid gap-3 border-t border-borda pt-3 first:border-t-0 first:pt-0 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)] xl:items-end">
                <span className="flex items-center gap-2 font-semibold xl:self-center">
                  <i className={`bi ${secao.icone} text-destaque`} aria-hidden="true"></i> {secao.rotulo}
                </span>
                <CampoCor rotulo="Cor" cor={propria.cor ?? null} textoVazio="A da ficha" editavel={editavel} aoAlterar={(cor) => mudarSecao({ cor })} />
                <EntradaSelecao rotulo="Borda" valor={propria.borda ?? ""} opcoes={OPCOES_BORDA} textoVazio="Igual à ficha" editavel={editavel}
                  aoAlterar={(borda) => mudarSecao({ borda: (borda || null) as BordaFicha | null })} />
                <EntradaSelecao rotulo="Título" valor={propria.titulo ?? ""} opcoes={OPCOES_TITULO} textoVazio="Igual à ficha" editavel={editavel}
                  aoAlterar={(titulo) => mudarSecao({ titulo: (titulo || null) as TituloFicha | null })} />
              </li>
            );
          })}
        </ul>
      </details>
    </SecaoFicha>
  );
}
