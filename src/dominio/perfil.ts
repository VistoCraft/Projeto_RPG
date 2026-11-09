export const IDADE_MINIMA = 18;

export type Perfil = {
  email: string;
  apelido: string | null;
  pais: string | null;
  dataNascimento: string | null;
  comoConheceu: string | null;
  perfilCompleto: boolean;
};

export type Opcao = {
  valor: string;
  rotulo: string;
};

export const OPCOES_COMO_CONHECEU: Opcao[] = [
  { valor: "amigos", rotulo: "Indicação de amigos" },
  { valor: "redes-sociais", rotulo: "Redes sociais" },
  { valor: "pesquisa", rotulo: "Pesquisa na internet" },
  { valor: "youtube-twitch", rotulo: "YouTube ou Twitch" },
  { valor: "discord", rotulo: "Discord" },
  { valor: "outro", rotulo: "Outro" },
];
