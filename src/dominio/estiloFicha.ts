import type { CSSProperties } from "react";

export type TemaFicha = "padrao" | "pergaminho" | "grimorio" | "floresta" | "brasa" | "gelo";
export type FonteFicha = "medieval" | "classica" | "moderna" | "maquina";
export type CantosFicha = "retos" | "suaves" | "redondos";
export type BordaFicha = "fina" | "grossa" | "destaque" | "nenhuma";
export type TituloFicha = "simples" | "linha" | "faixa";
export type DensidadeFicha = "compacta" | "normal" | "espacosa";

export type EstiloSecao = { cor?: string | null; borda?: BordaFicha | null; titulo?: TituloFicha | null };

export type EstiloFicha = {
  tema?: TemaFicha | null;
  cor?: string | null;
  fonteTitulo?: FonteFicha | null;
  fonteTexto?: FonteFicha | null;
  cantos?: CantosFicha | null;
  borda?: BordaFicha | null;
  titulo?: TituloFicha | null;
  densidade?: DensidadeFicha | null;
  secoes?: Record<string, EstiloSecao> | null;
};

export type EstiloCompleto = Required<{ [Chave in Exclude<keyof EstiloFicha, "secoes" | "cor">]: NonNullable<EstiloFicha[Chave]> }> & { cor: string | null };

export type Opcao<T extends string> = { valor: T; rotulo: string };

export const OPCOES_TEMA: Opcao<TemaFicha>[] = [
  { valor: "padrao", rotulo: "Padrão do site" },
  { valor: "pergaminho", rotulo: "Pergaminho" },
  { valor: "grimorio", rotulo: "Grimório" },
  { valor: "floresta", rotulo: "Floresta" },
  { valor: "brasa", rotulo: "Brasa" },
  { valor: "gelo", rotulo: "Gelo" },
];

export const OPCOES_FONTE: Opcao<FonteFicha>[] = [
  { valor: "medieval", rotulo: "Medieval" },
  { valor: "classica", rotulo: "Clássica (serifa)" },
  { valor: "moderna", rotulo: "Moderna (sem serifa)" },
  { valor: "maquina", rotulo: "Máquina de escrever" },
];

export const OPCOES_CANTOS: Opcao<CantosFicha>[] = [
  { valor: "retos", rotulo: "Retos" },
  { valor: "suaves", rotulo: "Suaves" },
  { valor: "redondos", rotulo: "Redondos" },
];

export const OPCOES_BORDA: Opcao<BordaFicha>[] = [
  { valor: "fina", rotulo: "Fina" },
  { valor: "grossa", rotulo: "Grossa" },
  { valor: "destaque", rotulo: "Com faixa colorida" },
  { valor: "nenhuma", rotulo: "Sem borda" },
];

export const OPCOES_TITULO: Opcao<TituloFicha>[] = [
  { valor: "simples", rotulo: "Simples" },
  { valor: "linha", rotulo: "Sublinhado" },
  { valor: "faixa", rotulo: "Faixa colorida" },
];

export const OPCOES_DENSIDADE: Opcao<DensidadeFicha>[] = [
  { valor: "compacta", rotulo: "Compacto" },
  { valor: "normal", rotulo: "Normal" },
  { valor: "espacosa", rotulo: "Espaçoso" },
];

export const ESTILO_PADRAO: EstiloCompleto = {
  tema: "padrao",
  cor: null,
  fonteTitulo: "medieval",
  fonteTexto: "classica",
  cantos: "suaves",
  borda: "fina",
  titulo: "simples",
  densidade: "normal",
};

export const CORES_SUGERIDAS = ["#7f56d9", "#c53a47", "#2c6e8f", "#00a87a", "#b8741a", "#8a4b16", "#a3317a", "#4a5568"];

export const SECOES_ESTILIZADAS_MAXIMAS = 40;

const FORMATO_COR = /^#[0-9a-f]{6}$/i;

export function corValida(cor: string | null | undefined): cor is string {
  return typeof cor === "string" && FORMATO_COR.test(cor);
}

export type EstiloPronto = { nome: string; descricao: string; estilo: EstiloFicha };

export const ESTILOS_PRONTOS: EstiloPronto[] = [
  { nome: "Clássico", descricao: "As cores e fontes do site", estilo: {} },
  { nome: "Pergaminho", descricao: "Papel envelhecido e tinta marrom", estilo: { tema: "pergaminho", titulo: "linha", fonteTexto: "classica" } },
  { nome: "Grimório", descricao: "Roxo profundo, cantos retos e faixas", estilo: { tema: "grimorio", cantos: "retos", titulo: "faixa", borda: "destaque" } },
  { nome: "Floresta", descricao: "Verdes e dourado, bem arredondado", estilo: { tema: "floresta", cantos: "redondos", titulo: "linha" } },
  { nome: "Brasa", descricao: "Vermelho e laranja, bordas grossas", estilo: { tema: "brasa", borda: "grossa", titulo: "faixa" } },
  { nome: "Gelo", descricao: "Azul frio e fonte moderna", estilo: { tema: "gelo", fonteTitulo: "moderna", fonteTexto: "moderna", cantos: "redondos" } },
  {
    nome: "Terminal",
    descricao: "Monoespaçado, compacto e verde",
    estilo: { cor: "#00a87a", fonteTitulo: "maquina", fonteTexto: "maquina", cantos: "retos", titulo: "linha", densidade: "compacta" },
  },
];

function opcaoOu<T extends string>(opcoes: Opcao<T>[], valor: string | null | undefined, padrao: T): T {
  return opcoes.find((opcao) => opcao.valor === valor)?.valor ?? padrao;
}

export function estiloCompleto(estilo?: EstiloFicha | null): EstiloCompleto {
  return {
    tema: opcaoOu(OPCOES_TEMA, estilo?.tema, ESTILO_PADRAO.tema),
    cor: corValida(estilo?.cor) ? estilo.cor : null,
    fonteTitulo: opcaoOu(OPCOES_FONTE, estilo?.fonteTitulo, ESTILO_PADRAO.fonteTitulo),
    fonteTexto: opcaoOu(OPCOES_FONTE, estilo?.fonteTexto, ESTILO_PADRAO.fonteTexto),
    cantos: opcaoOu(OPCOES_CANTOS, estilo?.cantos, ESTILO_PADRAO.cantos),
    borda: opcaoOu(OPCOES_BORDA, estilo?.borda, ESTILO_PADRAO.borda),
    titulo: opcaoOu(OPCOES_TITULO, estilo?.titulo, ESTILO_PADRAO.titulo),
    densidade: opcaoOu(OPCOES_DENSIDADE, estilo?.densidade, ESTILO_PADRAO.densidade),
  };
}

export type AparenciaSecao = { cor: string | null; borda: BordaFicha; titulo: TituloFicha };

export function aparenciaDaSecao(estilo: EstiloFicha | null | undefined, secao: string): AparenciaSecao {
  const geral = estiloCompleto(estilo);
  const propria = estilo?.secoes?.[secao];
  return {
    cor: corValida(propria?.cor) ? propria.cor : null,
    borda: opcaoOu(OPCOES_BORDA, propria?.borda, geral.borda),
    titulo: opcaoOu(OPCOES_TITULO, propria?.titulo, geral.titulo),
  };
}

type VariavelCor = CSSProperties & { "--cor-ficha"?: string };

/** Atributos do elemento raiz da ficha: os temas, fontes, cantos e espaçamento ficam no globals.css, por data-*. */
export function atributosDaFicha(estilo?: EstiloFicha | null) {
  const completo = estiloCompleto(estilo);
  const style: VariavelCor | undefined = completo.cor ? { "--cor-ficha": completo.cor } : undefined;
  return {
    "data-ficha": "",
    "data-tema-ficha": completo.tema,
    "data-fonte-titulo": completo.fonteTitulo,
    "data-fonte-texto": completo.fonteTexto,
    "data-cantos-ficha": completo.cantos,
    "data-densidade-ficha": completo.densidade,
    "data-cor-ficha": completo.cor ? "" : undefined,
    style,
  };
}

/** Atributos do invólucro de uma seção com cor própria. */
export function atributosDaSecao(cor: string | null) {
  if (!cor) return {};
  const style: VariavelCor = { "--cor-ficha": cor };
  return { "data-cor-ficha": "", style };
}

function semVazios(secao: EstiloSecao): EstiloSecao | null {
  const limpo: EstiloSecao = {};
  if (corValida(secao.cor)) limpo.cor = secao.cor.toLowerCase();
  if (secao.borda) limpo.borda = secao.borda;
  if (secao.titulo) limpo.titulo = secao.titulo;
  return Object.keys(limpo).length > 0 ? limpo : null;
}

export function comEstiloDaSecao(estilo: EstiloFicha | null | undefined, secao: string, parcial: Partial<EstiloSecao>): EstiloFicha {
  const secoes = { ...(estilo?.secoes ?? {}) };
  const nova = semVazios({ ...secoes[secao], ...parcial });
  if (nova) secoes[secao] = nova;
  else delete secoes[secao];
  return { ...estilo, secoes };
}

export function renomearSecaoNoEstilo(estilo: EstiloFicha | null | undefined, de: string, para: string): EstiloFicha | null | undefined {
  const propria = estilo?.secoes?.[de];
  if (!estilo || !propria || de === para) return estilo;
  const { [de]: _removida, ...resto } = estilo.secoes ?? {};
  return { ...estilo, secoes: { ...resto, [para]: propria } };
}

export function semSecaoNoEstilo(estilo: EstiloFicha | null | undefined, secao: string): EstiloFicha | null | undefined {
  if (!estilo?.secoes?.[secao]) return estilo;
  const { [secao]: _removida, ...resto } = estilo.secoes;
  return { ...estilo, secoes: resto };
}

/** Só grava o que difere do padrão, para o modelo continuar enxuto. */
export function limparEstilo(estilo: EstiloFicha | null | undefined, secoesExistentes: Set<string>): EstiloFicha | null {
  if (!estilo) return null;
  const completo = estiloCompleto(estilo);
  const limpo: EstiloFicha = {};
  for (const chave of ["tema", "fonteTitulo", "fonteTexto", "cantos", "borda", "titulo", "densidade"] as const) {
    if (completo[chave] !== ESTILO_PADRAO[chave]) Object.assign(limpo, { [chave]: completo[chave] });
  }
  if (completo.cor) limpo.cor = completo.cor.toLowerCase();
  const secoes = Object.entries(estilo.secoes ?? {})
    .filter(([id]) => secoesExistentes.has(id))
    .map(([id, secao]) => [id, semVazios(secao)] as const)
    .filter((par): par is readonly [string, EstiloSecao] => par[1] !== null);
  if (secoes.length > 0) limpo.secoes = Object.fromEntries(secoes);
  return Object.keys(limpo).length > 0 ? limpo : null;
}
