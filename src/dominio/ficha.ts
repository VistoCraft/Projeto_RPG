import type { Participante } from "./mesa";
import type { ConteudoFicha, ModeloFicha } from "./modeloFicha";
import type { Opcao } from "./perfil";

export type TipoFicha = "completa" | "simplificada";

export type ResumoFicha = {
  id: string;
  nome: string;
  tipo: TipoFicha;
  donoId: string | null;
  dono: string | null;
  visivelParaJogadores: boolean;
  ehMinha: boolean;
  podeEditar: boolean;
  atualizadaEm: string;
};

export type DetalheFicha = ResumoFicha & {
  conteudo: ConteudoFicha;
  modelo: ModeloFicha;
  versaoModelo: number;
};

export type DadosFicha = {
  nome: string;
  donoId: string | null;
  visivelParaJogadores: boolean;
};

export type DadosNovaFicha = DadosFicha & { tipo: TipoFicha };

export const TAMANHO_MAXIMO_NOME_FICHA = 60;

export const ROTULOS_TIPO_FICHA: Record<TipoFicha, string> = {
  completa: "Personagens",
  simplificada: "Pets e NPCs",
};

export const ROTULO_TIPO_FICHA: Record<TipoFicha, string> = {
  completa: "Personagem",
  simplificada: "Pet ou NPC",
};

export const OPCOES_TIPO_FICHA: Opcao[] = [
  { valor: "completa", rotulo: "Completa: personagem de jogador ou NPC importante" },
  { valor: "simplificada", rotulo: "Simplificada: pet, montaria ou NPC de apoio" },
];

export const TIPOS_FICHA: TipoFicha[] = ["completa", "simplificada"];

export function tipoFichaDoValor(valor: string): TipoFicha {
  return valor === "simplificada" ? "simplificada" : "completa";
}

export function jogadoresDaMesa(participantes: Participante[]): Participante[] {
  return participantes.filter((participante) => participante.papel === "jogador");
}

export function paraDadosFicha(ficha: ResumoFicha): DadosFicha {
  return { nome: ficha.nome, donoId: ficha.donoId, visivelParaJogadores: ficha.visivelParaJogadores };
}
