import { ehObjeto } from "./errosApi";

const PREFIXO_ERRO_DE_MODELO = "Modelo";
const CAMINHO_DE_ITEM = /(detalhes|atributos|pericias|barras|condicoes|combate\.colunas)\[(\d+)\](\.rolagem)?/g;

const NOMES_DE_SECAO: Record<string, string> = {
  detalhes: "Detalhes",
  atributos: "Atributos",
  pericias: "Perícias",
  barras: "Barras",
  condicoes: "Condições",
  "combate.colunas": "Colunas de ataque",
};

export function mensagensDeModelo(corpo: unknown, outrosCodigos: string[]): string[] {
  if (!ehObjeto(corpo) || !ehObjeto(corpo.errors)) return [];
  return Object.entries(corpo.errors)
    .filter(([codigo]) => codigo.startsWith(PREFIXO_ERRO_DE_MODELO) || outrosCodigos.includes(codigo))
    .flatMap(([, lista]) => (Array.isArray(lista) ? lista.filter((item): item is string => typeof item === "string") : []))
    .map(legivel);
}

function legivel(mensagem: string): string {
  return mensagem.replace(CAMINHO_DE_ITEM, (_, secao: string, indice: string, rolagem?: string) =>
    `${NOMES_DE_SECAO[secao] ?? secao}, item ${Number(indice) + 1}${rolagem ? " (rolagem)" : ""}`);
}
