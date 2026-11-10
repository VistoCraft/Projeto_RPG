import type {
  AtributoModelo,
  BarraModelo,
  CampoDetalhe,
  ColunaCombate,
  CondicaoModelo,
  CorBarra,
  FormatoSecao,
  ModeloFicha,
  SecaoExtra,
  PericiaModelo,
  TipoCampo,
  TipoColunaCombate,
} from "./modeloFicha";
import type { Opcao } from "./perfil";
import { limparEstilo } from "./estiloFicha";
import { secoesDisponiveis } from "./layoutFicha";

export const VERSAO_MODELO = 1;
export const TAMANHO_MAXIMO_ID = 32;
export const TAMANHO_MAXIMO_ROTULO = 60;
export const ITENS_MAXIMOS_POR_SECAO = 100;

export const MODELO_VAZIO: ModeloFicha = { versao: VERSAO_MODELO, detalhes: [], atributos: [], pericias: [], barras: [], condicoes: [], combate: { colunas: [] } };

export const OPCOES_TIPO_CAMPO: Opcao[] = [
  { valor: "texto", rotulo: "Texto" },
  { valor: "numero", rotulo: "Número" },
  { valor: "lista", rotulo: "Lista de opções" },
];

export const OPCOES_TIPO_COLUNA: Opcao[] = [
  { valor: "texto", rotulo: "Texto" },
  { valor: "numero", rotulo: "Número" },
  { valor: "rolagem", rotulo: "Rolagem (fórmula)" },
];

export const OPCOES_COR_BARRA: Opcao[] = [
  { valor: "vida", rotulo: "Vermelho (vida)" },
  { valor: "sanidade", rotulo: "Azul (sanidade)" },
  { valor: "esforco", rotulo: "Roxo (esforço)" },
  { valor: "arcano", rotulo: "Arcano" },
  { valor: "essencia", rotulo: "Verde (essência)" },
  { valor: "mare", rotulo: "Azul-maré" },
];

const PREFIXO_ID_INVALIDO = "c_";

export function idDoRotulo(rotulo: string): string {
  const base = rotulo
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  const comLetra = /^[a-z]/.test(base) && !/^d\d+$/.test(base) ? base : `${PREFIXO_ID_INVALIDO}${base}`;
  return comLetra.slice(0, TAMANHO_MAXIMO_ID).replace(/_+$/g, "");
}

export function idDisponivel(base: string, usados: Set<string>): string {
  if (!usados.has(base)) return base;
  let sufixo = 2;
  while (usados.has(`${base}_${sufixo}`)) sufixo++;
  return `${base}_${sufixo}`;
}

export function idsDoModelo(modelo: ModeloFicha): Set<string> {
  const extras = modelo.secoesExtras ?? [];
  return new Set([
    ...extras.map((secao) => secao.id),
    ...extras.flatMap((secao) => [
      ...(secao.campos ?? []),
      ...(secao.valores ?? []),
      ...(secao.barras ?? []),
      ...(secao.marcadores ?? []),
      ...(secao.colunas ?? []),
    ].map((item) => item.id)),
    ...(modelo.detalhes ?? []).map((item) => item.id),
    ...(modelo.atributos ?? []).map((item) => item.id),
    ...(modelo.pericias ?? []).map((item) => item.id),
    ...(modelo.barras ?? []).map((item) => item.id),
    ...(modelo.condicoes ?? []).map((item) => item.id),
    ...(modelo.combate?.colunas ?? []).map((item) => item.id),
  ]);
}

export const NOVOS_ITENS = {
  detalhe: (id: string): CampoDetalhe => ({ id, rotulo: "Novo campo", tipo: "texto" }),
  atributo: (id: string): AtributoModelo => ({ id, rotulo: "Novo atributo", minimo: 1, maximo: 30, padrao: 10, rolagem: `1d20 + mod(${id})` }),
  pericia: (id: string): PericiaModelo => ({ id, rotulo: "Nova perícia", atributo: null, rolagem: "1d20" }),
  barra: (id: string): BarraModelo => ({ id, rotulo: "Nova barra", cor: "vida", maximoPadrao: 10 }),
  condicao: (id: string): CondicaoModelo => ({ id, rotulo: "Nova condição" }),
  coluna: (id: string): ColunaCombate => ({ id, rotulo: "Nova coluna", tipo: "texto" }),
};

export function tipoCampoDoValor(valor: string): TipoCampo {
  return valor === "numero" || valor === "lista" ? valor : "texto";
}

export function tipoColunaDoValor(valor: string): TipoColunaCombate {
  return valor === "numero" || valor === "rolagem" ? valor : "texto";
}

const CORES_BARRA: CorBarra[] = ["vida", "sanidade", "esforco", "arcano", "essencia", "mare"];

export function corDoValor(valor: string): CorBarra {
  return CORES_BARRA.find((cor) => cor === valor) ?? "vida";
}

export function numeroOuNulo(texto: string): number | null {
  const numero = Number(texto);
  return texto.trim() === "" || !Number.isInteger(numero) ? null : numero;
}

export function limparModelo(modelo: ModeloFicha): ModeloFicha {
  return {
    ...modelo,
    versao: VERSAO_MODELO,
    detalhes: (modelo.detalhes ?? []).map((campo) => ({
      ...campo,
      rotulo: campo.rotulo.trim(),
      opcoes: campo.tipo === "lista" ? (campo.opcoes ?? []).map((opcao) => opcao.trim()).filter(Boolean) : null,
      minimo: campo.tipo === "numero" ? campo.minimo ?? null : null,
      maximo: campo.tipo === "numero" ? campo.maximo ?? null : null,
    })),
    atributos: (modelo.atributos ?? []).map((atributo) => ({ ...atributo, rotulo: atributo.rotulo.trim(), rolagem: atributo.rolagem?.trim() || null })),
    pericias: (modelo.pericias ?? []).map((pericia) => ({ ...pericia, rotulo: pericia.rotulo.trim(), rolagem: pericia.rolagem?.trim() || null })),
    barras: (modelo.barras ?? []).map((barra) => ({ ...barra, rotulo: barra.rotulo.trim() })),
    condicoes: (modelo.condicoes ?? []).map((condicao) => ({ ...condicao, rotulo: condicao.rotulo.trim() })),
    combate: { colunas: (modelo.combate?.colunas ?? []).map((coluna) => ({ ...coluna, rotulo: coluna.rotulo.trim() })) },
    secoesExtras: (modelo.secoesExtras ?? []).map(limparSecao),
    estilo: limparEstilo(modelo.estilo, new Set(secoesDisponiveis(modelo).map((secao) => secao.id))),
  };
}

function limparSecao(secao: SecaoExtra): SecaoExtra {
  const limpo = limparModelo({
    versao: VERSAO_MODELO,
    detalhes: secao.campos,
    atributos: secao.valores,
    barras: secao.barras,
    condicoes: secao.marcadores,
    combate: { colunas: secao.colunas ?? [] },
  });
  return {
    id: secao.id,
    rotulo: secao.rotulo.trim(),
    formato: secao.formato,
    campos: secao.formato === "campos" ? limpo.detalhes : null,
    valores: secao.formato === "valores" ? limpo.atributos : null,
    barras: secao.formato === "barras" ? limpo.barras : null,
    marcadores: secao.formato === "marcadores" ? limpo.condicoes : null,
    colunas: secao.formato === "tabela" ? limpo.combate?.colunas : null,
  };
}

export type Renomeacao = { de: string; para: string };

export function renomearId(modelo: ModeloFicha, { de, para }: Renomeacao): ModeloFicha {
  if (!de || !para || de === para) return modelo;
  const referencia = new RegExp(`(?<![a-z0-9_])${de}(?![a-z0-9_])`, "g");
  const trocar = (formula?: string | null) => formula?.replace(referencia, para) ?? formula;
  return {
    ...modelo,
    atributos: (modelo.atributos ?? []).map((atributo) => ({ ...atributo, rolagem: trocar(atributo.rolagem) })),
    pericias: (modelo.pericias ?? []).map((pericia) => ({
      ...pericia,
      atributo: pericia.atributo === de ? para : pericia.atributo,
      rolagem: trocar(pericia.rolagem),
    })),
    secoesExtras: (modelo.secoesExtras ?? []).map((secao) => ({
      ...secao,
      valores: secao.valores?.map((valor) => ({ ...valor, rolagem: trocar(valor.rolagem) })),
    })),
  };
}

export const SECOES_EXTRAS_MAXIMAS = 20;

export const FORMATOS_SECAO: { formato: FormatoSecao; rotulo: string; descricao: string; exemplo: string }[] = [
  { formato: "campos", rotulo: "Campos", descricao: "Textos, números ou listas de opções", exemplo: "Aparência, Moedas" },
  { formato: "valores", rotulo: "Valores", descricao: "Números com mínimo, máximo e fórmula de rolagem", exemplo: "Recursos, Poderes" },
  { formato: "barras", rotulo: "Barras", descricao: "Atual e máximo, com barra colorida", exemplo: "Mana, Energia" },
  { formato: "marcadores", rotulo: "Marcadores", descricao: "Itens que se marcam e desmarcam", exemplo: "Idiomas, Proficiências" },
  { formato: "tabela", rotulo: "Tabela", descricao: "Linhas livres com colunas definidas", exemplo: "Inventário, Magias" },
  { formato: "anotacoes", rotulo: "Anotações", descricao: "Texto livre", exemplo: "História, Notas" },
];

export type ModeloPronto = { nome: string; icone: string; criar: (usados: Set<string>) => SecaoExtra };

function novoId(base: string, usados: Set<string>): string {
  const id = idDisponivel(base, usados);
  usados.add(id);
  return id;
}

export function novaSecao(formato: FormatoSecao, usados: Set<string>): SecaoExtra {
  const info = FORMATOS_SECAO.find((item) => item.formato === formato);
  const rotulo = `Nova seção (${info?.rotulo.toLowerCase() ?? formato})`;
  return { id: novoId(idDoRotulo(rotulo), usados), rotulo, formato };
}

export const MODELOS_PRONTOS: ModeloPronto[] = [
  {
    nome: "Inventário",
    icone: "bi-backpack",
    criar: (usados) => ({
      id: novoId("inventario", usados),
      rotulo: "Inventário",
      formato: "tabela",
      colunas: [
        { id: novoId("item", usados), rotulo: "Item", tipo: "texto" },
        { id: novoId("quantidade", usados), rotulo: "Qtd.", tipo: "numero" },
        { id: novoId("peso", usados), rotulo: "Peso", tipo: "texto" },
        { id: novoId("observacao", usados), rotulo: "Observação", tipo: "texto" },
      ],
    }),
  },
  {
    nome: "Magias",
    icone: "bi-stars",
    criar: (usados) => ({
      id: novoId("magias", usados),
      rotulo: "Magias",
      formato: "tabela",
      colunas: [
        { id: novoId("magia", usados), rotulo: "Magia", tipo: "texto" },
        { id: novoId("circulo", usados), rotulo: "Nível", tipo: "numero" },
        { id: novoId("alcance_magia", usados), rotulo: "Alcance", tipo: "texto" },
        { id: novoId("efeito", usados), rotulo: "Efeito (rolagem)", tipo: "rolagem" },
      ],
    }),
  },
  {
    nome: "Moedas",
    icone: "bi-coin",
    criar: (usados) => ({
      id: novoId("moedas", usados),
      rotulo: "Moedas",
      formato: "campos",
      campos: ["Cobre", "Prata", "Ouro", "Platina"].map((nome): CampoDetalhe => ({ id: novoId(idDoRotulo(nome), usados), rotulo: nome, tipo: "numero", minimo: 0 })),
    }),
  },
  {
    nome: "Idiomas",
    icone: "bi-translate",
    criar: (usados) => ({
      id: novoId("idiomas", usados),
      rotulo: "Idiomas",
      formato: "marcadores",
      marcadores: [{ id: novoId("idioma_comum", usados), rotulo: "Comum" }],
    }),
  },
  {
    nome: "Energia",
    icone: "bi-battery-charging",
    criar: (usados) => ({
      id: novoId("energia", usados),
      rotulo: "Energia",
      formato: "barras",
      barras: [{ id: novoId("mana", usados), rotulo: "Mana", cor: "arcano", maximoPadrao: 10 }],
    }),
  },
  {
    nome: "História",
    icone: "bi-journal-richtext",
    criar: (usados) => ({ id: novoId("historia", usados), rotulo: "História e anotações", formato: "anotacoes" }),
  },
];
