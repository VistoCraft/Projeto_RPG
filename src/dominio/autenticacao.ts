export type Credenciais = {
  email: string;
  senha: string;
};

export type DadosCadastro = Credenciais & {
  apelido: string;
  pais: string;
  dataNascimento: string;
  comoConheceu: string | null;
  aceitouTermos: boolean;
};

export type ResultadoAutenticacao = { sucesso: true } | { sucesso: false; erros: string[] };
