export type Credenciais = {
  email: string;
  senha: string;
};

export type ResultadoAutenticacao = { sucesso: true } | { sucesso: false; erros: string[] };
