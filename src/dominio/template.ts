import type { ModeloFicha } from "./modeloFicha";

export type Template = {
  id: string;
  nome: string;
  descricao: string | null;
  padrao: boolean;
};

export type DetalheTemplate = Template & {
  modeloFicha: ModeloFicha;
  modeloFichaSimplificada: ModeloFicha;
  podeEditar: boolean;
};

export type DadosTemplate = {
  nome: string;
  descricao: string;
  modeloFicha: ModeloFicha;
  modeloFichaSimplificada: ModeloFicha;
};

export const TAMANHO_MAXIMO_NOME_TEMPLATE = 80;
export const TAMANHO_MAXIMO_DESCRICAO_TEMPLATE = 500;
