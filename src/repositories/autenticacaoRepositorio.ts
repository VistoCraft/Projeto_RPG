import { api } from "../providers/api";
import type { RespostaRest } from "../providers/FetchRestProvider";
import { falhaDaResposta } from "./errosApi";
import type { Credenciais, DadosCadastro, ResultadoAutenticacao } from "../dominio/autenticacao";
import { IDADE_MINIMA } from "../dominio/perfil";
import { VERSAO_TERMOS } from "../dominio/termos";

type CredenciaisDto = {
  email: string;
  password: string;
};

type CadastroDto = {
  email: string;
  senha: string;
  apelido: string;
  pais: string;
  dataNascimento: string;
  comoConheceu: string | null;
  aceitouTermos: boolean;
  versaoTermos: string;
};

const MENSAGEM_LOGIN_INVALIDO = "E-mail ou senha incorretos.";
const MENSAGEM_CADASTRO_FALHOU = "Não foi possível criar a conta.";

const mensagensPorCodigo: Record<string, string> = {
  DuplicateUserName: "Este e-mail já está cadastrado.",
  DuplicateEmail: "Este e-mail já está cadastrado.",
  InvalidEmail: "Informe um e-mail válido.",
  InvalidUserName: "Informe um e-mail válido.",
  PasswordTooShort: "A senha precisa ter pelo menos 6 caracteres.",
  PasswordRequiresDigit: "A senha precisa ter pelo menos um número.",
  PasswordRequiresLower: "A senha precisa ter pelo menos uma letra minúscula.",
  PasswordRequiresUpper: "A senha precisa ter pelo menos uma letra maiúscula.",
  PasswordRequiresNonAlphanumeric: "A senha precisa ter pelo menos um símbolo (ex.: ! @ #).",
  LockedOut: "Conta bloqueada por excesso de tentativas. Tente de novo mais tarde.",
  NotAllowed: "Esta conta ainda não pode entrar.",
  ApelidoObrigatorio: "Informe um nickname.",
  ApelidoInvalido: "O nickname precisa ter de 3 a 30 letras, números, \".\", \"_\" ou \"-\", sem espaços.",
  ApelidoEmUso: "Este nickname já está em uso.",
  PaisInvalido: "Escolha o seu país.",
  DataNascimentoObrigatoria: "Informe a data de nascimento.",
  DataNascimentoInvalida: "Informe uma data de nascimento válida.",
  IdadeMinima: `É preciso ter pelo menos ${IDADE_MINIMA} anos para criar uma conta.`,
  ComoConheceuInvalido: "Resposta muito longa em \"Como conheceu o site\".",
  TermosNaoAceitos: "É preciso aceitar os termos de uso e a política de privacidade.",
  TermosDesatualizados: "Os termos foram atualizados. Recarregue a página e leia a versão nova.",
};

export async function cadastrar(dados: DadosCadastro): Promise<ResultadoAutenticacao> {
  const resposta = await api.post("/auth/cadastro", paraCadastroDto(dados));
  return paraResultado(resposta, MENSAGEM_CADASTRO_FALHOU);
}

export async function entrar(credenciais: Credenciais): Promise<ResultadoAutenticacao> {
  const resposta = await api.post("/auth/login?useCookies=true", paraCredenciaisDto(credenciais));
  return paraResultado(resposta, MENSAGEM_LOGIN_INVALIDO);
}

export async function sair(): Promise<void> {
  await api.post("/auth/sair");
}

function paraCredenciaisDto({ email, senha }: Credenciais): CredenciaisDto {
  return { email: email.trim(), password: senha };
}

function paraCadastroDto(dados: DadosCadastro): CadastroDto {
  return { ...dados, email: dados.email.trim(), apelido: dados.apelido.trim(), versaoTermos: VERSAO_TERMOS };
}

function paraResultado(resposta: RespostaRest, mensagemPadrao: string): ResultadoAutenticacao {
  return resposta.ok ? { sucesso: true } : falhaDaResposta(resposta, mensagensPorCodigo, mensagemPadrao);
}
