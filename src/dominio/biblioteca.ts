import type { TipoFicha } from "./ficha";
import type { ConteudoFicha, ModeloFicha } from "./modeloFicha";

export type ResumoBiblioteca = {
  id: string;
  nome: string;
  tipo: TipoFicha;
  templateId: string;
  template: string;
  atualizadaEm: string;
};

export type DetalheBiblioteca = ResumoBiblioteca & {
  conteudo: ConteudoFicha;
  modelo: ModeloFicha;
};

export type StatusProposta = "pendente" | "aceita" | "recusada";

export type Proposta = {
  id: string;
  fichaId: string;
  ficha: string;
  tipo: TipoFicha;
  jogadorId: string;
  jogador: string;
  status: StatusProposta;
  criadaEm: string;
};
