import { api } from "../providers/api";
import { STATUS_SEM_CONEXAO, type RespostaRest } from "../providers/FetchRestProvider";
import type { Credenciais, ResultadoAutenticacao } from "../dominio/autenticacao";

type CredenciaisDto = {
  email: string;
  password: string;
};

const MENSAGEM_SEM_CONEXAO = "Não foi possível conectar ao servidor. Tente de novo em instantes.";
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
};

export async function cadastrar(credenciais: Credenciais): Promise<ResultadoAutenticacao> {
  const resposta = await api.post("/auth/register", paraDto(credenciais));
  return paraResultado(resposta, MENSAGEM_CADASTRO_FALHOU);
}

export async function entrar(credenciais: Credenciais): Promise<ResultadoAutenticacao> {
  const resposta = await api.post("/auth/login?useCookies=true", paraDto(credenciais));
  return paraResultado(resposta, MENSAGEM_LOGIN_INVALIDO);
}

function paraDto({ email, senha }: Credenciais): CredenciaisDto {
  return { email: email.trim(), password: senha };
}

function paraResultado(resposta: RespostaRest, mensagemPadrao: string): ResultadoAutenticacao {
  if (resposta.ok) return { sucesso: true };
  if (resposta.status === STATUS_SEM_CONEXAO) return { sucesso: false, erros: [MENSAGEM_SEM_CONEXAO] };

  const mensagens = lerCodigosDeErro(resposta.corpo)
    .map((codigo) => mensagensPorCodigo[codigo])
    .filter((mensagem) => mensagem !== undefined);

  return { sucesso: false, erros: mensagens.length > 0 ? [...new Set(mensagens)] : [mensagemPadrao] };
}

function lerCodigosDeErro(corpo: unknown): string[] {
  if (typeof corpo !== "object" || corpo === null) return [];

  const codigosDeValidacao = "errors" in corpo && typeof corpo.errors === "object" && corpo.errors !== null ? Object.keys(corpo.errors) : [];
  const codigoDoLogin = "detail" in corpo && typeof corpo.detail === "string" ? [corpo.detail] : [];

  return [...codigosDeValidacao, ...codigoDoLogin];
}
