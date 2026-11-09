export type TipoCampo = "texto" | "numero" | "lista";

export type TipoColunaCombate = "texto" | "numero" | "rolagem";

export type CorBarra = "vida" | "sanidade" | "esforco" | "arcano" | "essencia" | "mare";

export type CampoDetalhe = {
  id: string;
  rotulo: string;
  tipo: TipoCampo;
  opcoes?: string[] | null;
  minimo?: number | null;
  maximo?: number | null;
};

export type AtributoModelo = { id: string; rotulo: string; minimo: number; maximo: number; padrao: number; rolagem?: string | null };

export type PericiaModelo = { id: string; rotulo: string; atributo?: string | null; rolagem?: string | null };

export type BarraModelo = { id: string; rotulo: string; cor: CorBarra; maximoPadrao: number };

export type CondicaoModelo = { id: string; rotulo: string };

export type ColunaCombate = { id: string; rotulo: string; tipo: TipoColunaCombate };

export type ModeloFicha = {
  versao: number;
  detalhes?: CampoDetalhe[] | null;
  atributos?: AtributoModelo[] | null;
  pericias?: PericiaModelo[] | null;
  barras?: BarraModelo[] | null;
  condicoes?: CondicaoModelo[] | null;
  combate?: { colunas: ColunaCombate[] } | null;
};

export type ValorDetalhe = string | number | null;

export type EstadoPericia = { valor: number; treinada: boolean; favorita: boolean };

export type ValorBarra = { atual: number; maximo: number };

export type LinhaCombate = Record<string, string | number | null>;

export type ConteudoFicha = {
  detalhes: Record<string, ValorDetalhe>;
  atributos: Record<string, number>;
  pericias: Record<string, EstadoPericia>;
  barras: Record<string, ValorBarra>;
  condicoes: string[];
  combate: LinhaCombate[];
};

export type CamposAlterados = Record<string, unknown>;

export const PERICIA_PADRAO: EstadoPericia = { valor: 0, treinada: false, favorita: false };

export function modificador(valor: number): number {
  return Math.floor((valor - 10) / 2);
}

export function comSinal(numero: number): string {
  return numero >= 0 ? `+${numero}` : `−${Math.abs(numero)}`;
}

export function normalizarConteudo(bruto: unknown, modelo: ModeloFicha): ConteudoFicha {
  const dados = objeto(bruto);
  const detalhes = objeto(dados.detalhes);
  const atributos = objeto(dados.atributos);
  const pericias = objeto(dados.pericias);
  const barras = objeto(dados.barras);

  return {
    detalhes: Object.fromEntries((modelo.detalhes ?? []).map((campo) => [campo.id, valorDetalhe(detalhes[campo.id])])),
    atributos: Object.fromEntries((modelo.atributos ?? []).map((atributo) => [atributo.id, numero(atributos[atributo.id], atributo.padrao)])),
    pericias: Object.fromEntries((modelo.pericias ?? []).map((pericia) => [pericia.id, estadoPericia(pericias[pericia.id])])),
    barras: Object.fromEntries((modelo.barras ?? []).map((barra) => [barra.id, valorBarra(barras[barra.id], barra.maximoPadrao)])),
    condicoes: Array.isArray(dados.condicoes) ? dados.condicoes.filter((item): item is string => typeof item === "string") : [],
    combate: Array.isArray(dados.combate) ? dados.combate.map((linha) => objeto(linha) as LinhaCombate) : [],
  };
}

export function aplicarCampos(conteudo: ConteudoFicha, campos: CamposAlterados): ConteudoFicha {
  return Object.entries(campos).reduce<ConteudoFicha>((atual, [caminho, valor]) => definirCaminho(atual, caminho.split("."), valor), conteudo);
}

function definirCaminho<T>(alvo: T, partes: string[], valor: unknown): T {
  const [primeira, ...resto] = partes;
  const atual = objeto(alvo);
  return { ...atual, [primeira]: resto.length === 0 ? valor : definirCaminho(atual[primeira], resto, valor) } as T;
}

function objeto(valor: unknown): Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor) ? (valor as Record<string, unknown>) : {};
}

function numero(valor: unknown, padrao: number): number {
  return typeof valor === "number" && Number.isFinite(valor) ? valor : padrao;
}

function valorDetalhe(valor: unknown): ValorDetalhe {
  return typeof valor === "string" || typeof valor === "number" ? valor : null;
}

function estadoPericia(valor: unknown): EstadoPericia {
  const estado = objeto(valor);
  return {
    valor: numero(estado.valor, PERICIA_PADRAO.valor),
    treinada: estado.treinada === true,
    favorita: estado.favorita === true,
  };
}

function valorBarra(valor: unknown, maximoPadrao: number): ValorBarra {
  const barra = objeto(valor);
  return { atual: numero(barra.atual, maximoPadrao), maximo: numero(barra.maximo, maximoPadrao) };
}
