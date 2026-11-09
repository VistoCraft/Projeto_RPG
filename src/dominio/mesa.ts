export type StatusMesa = "aberta" | "em-sessao" | "encerrada";

export type Mesa = {
  id: string;
  nome: string;
  mestre: string;
  sistema: string;
  jogadores: number;
  limiteJogadores: number;
  status: StatusMesa;
};
