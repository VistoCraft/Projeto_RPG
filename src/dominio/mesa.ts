import type { Opcao } from "./perfil";

export type VisibilidadeMesa = "publica" | "privada";

export type StatusMesa = "ativa" | "encerrada";

export type PapelParticipante = "dono" | "ajudante" | "jogador" | "espectador";

export type Mesa = {
  id: string;
  nome: string;
  descricao: string | null;
  template: string;
  dono: string | null;
  jogadores: number;
  espectadores: number;
  visibilidade: VisibilidadeMesa;
  status: StatusMesa;
  entradaBloqueada: boolean;
  meuPapel: PapelParticipante | null;
};

export type Participante = {
  usuarioId: string;
  apelido: string;
  papel: PapelParticipante;
};

export type DetalheMesa = Mesa & {
  participantes: Participante[];
  codigoConvite: string | null;
};

export type FiltroMesas = {
  busca: string;
  status: StatusMesa | "";
  minhas: boolean;
};

export type DadosNovaMesa = {
  nome: string;
  descricao: string;
  templateId: string;
  visibilidade: VisibilidadeMesa;
};

export type DadosEdicaoMesa = {
  nome: string;
  descricao: string | null;
  visibilidade: VisibilidadeMesa;
  entradaBloqueada: boolean;
};

export const OPCOES_VISIBILIDADE: Opcao[] = [
  { valor: "publica", rotulo: "Pública: aparece no hub e qualquer pessoa logada entra como espectadora" },
  { valor: "privada", rotulo: "Privada: só entra quem tiver o código de convite" },
];

export function visibilidadeDoValor(valor: string): VisibilidadeMesa {
  return valor === "privada" ? "privada" : "publica";
}

export const TAMANHO_MAXIMO_NOME_MESA = 80;
export const TAMANHO_MAXIMO_DESCRICAO_MESA = 500;

export const ROTULOS_PAPEL: Record<PapelParticipante, string> = {
  dono: "Mestre (dono)",
  ajudante: "Ajudante",
  jogador: "Jogador",
  espectador: "Espectador",
};

const PAPEIS_ATRIBUIVEIS: PapelParticipante[] = ["ajudante", "jogador", "espectador"];

export function podeGerenciar(papel: PapelParticipante | null): boolean {
  return papel === "dono" || papel === "ajudante";
}

export function papeisAtribuiveis(ator: PapelParticipante, alvo: PapelParticipante): PapelParticipante[] {
  if (alvo === "dono") return [];
  if (ator === "dono") return PAPEIS_ATRIBUIVEIS;
  if (ator === "ajudante" && alvo !== "ajudante") return PAPEIS_ATRIBUIVEIS.filter((papel) => papel !== "ajudante");
  return [];
}

export function podeRemover(ator: PapelParticipante, alvo: PapelParticipante): boolean {
  if (alvo === "dono") return false;
  return ator === "dono" || (ator === "ajudante" && alvo !== "ajudante");
}

export function paraDadosEdicao(mesa: DetalheMesa): DadosEdicaoMesa {
  return { nome: mesa.nome, descricao: mesa.descricao, visibilidade: mesa.visibilidade, entradaBloqueada: mesa.entradaBloqueada };
}
