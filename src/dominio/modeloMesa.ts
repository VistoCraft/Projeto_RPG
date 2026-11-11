import type { TipoFicha } from "./ficha";
import type { ConteudoFicha, ModeloFicha } from "./modeloFicha";

export type ModelosFicha = Record<TipoFicha, ModeloFicha>;

export type ModeloMesa = {
  templateId: string;
  modelos: ModelosFicha;
  versaoModelo: number;
};

export type TipoItemModelo = "valor" | "pericia" | "barra" | "marcador" | "coluna";

export type ItemModelo = {
  caminho: string;
  rotulo: string;
  tipo: TipoItemModelo;
};

export type ItemNovo = ItemModelo & { origemPadrao: string | null };

export type PreviaTipo = {
  muda: boolean;
  fichas: number;
  itensAtuais: ItemModelo[];
  itensNovos: ItemNovo[];
};

export type PreviaConversao = Record<TipoFicha, PreviaTipo>;

export type Conversao = Record<string, string | null>;

export type ConversaoModelos = Record<TipoFicha, Conversao>;

export type ModeloAlterado = {
  modelo: ModeloMesa;
  fichasConvertidas: number;
};

export type BackupFicha = {
  id: string;
  versaoModelo: number;
  criadoEm: string;
};

export type DetalheBackup = BackupFicha & {
  conteudo: ConteudoFicha;
  modelo: ModeloFicha;
};

export const ROTULOS_TIPO_ITEM: Record<TipoItemModelo, string> = {
  valor: "valor",
  pericia: "perícia",
  barra: "barra",
  marcador: "marcador",
  coluna: "coluna de tabela",
};

export function conversaoPadrao(previa: PreviaTipo): Conversao {
  return Object.fromEntries(previa.itensNovos.map((item) => [item.caminho, item.origemPadrao]));
}

export function origensPossiveis(item: ItemModelo, previa: PreviaTipo): ItemModelo[] {
  return previa.itensAtuais.filter((atual) => atual.tipo === item.tipo);
}

export function fichasAConverter(previa: PreviaConversao): number {
  return (previa.completa.muda ? previa.completa.fichas : 0) + (previa.simplificada.muda ? previa.simplificada.fichas : 0);
}
