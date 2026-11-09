import type { Mesa } from "../dominio/mesa";

const MESAS_DE_EXEMPLO: Mesa[] = [
  { id: "1", nome: "Sombras sobre a Cidade", mestre: "Ana", sistema: "Ordem Paranormal", jogadores: 3, limiteJogadores: 5, status: "aberta" },
  { id: "2", nome: "A Torre do Arcano", mestre: "Bruno", sistema: "D&D 5e", jogadores: 4, limiteJogadores: 4, status: "em-sessao" },
  { id: "3", nome: "Expedição ao Abismo", mestre: "Carla", sistema: "Call of Cthulhu", jogadores: 2, limiteJogadores: 6, status: "aberta" },
  { id: "4", nome: "Crônicas da Névoa", mestre: "Diego", sistema: "Ordem Paranormal", jogadores: 5, limiteJogadores: 5, status: "encerrada" },
];

export async function listarMesas(): Promise<Mesa[]> {
  return MESAS_DE_EXEMPLO;
}
