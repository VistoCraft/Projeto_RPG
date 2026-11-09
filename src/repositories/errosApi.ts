import { STATUS_SEM_CONEXAO, type RespostaRest } from "../providers/FetchRestProvider";
import type { Falha } from "../dominio/resultado";

const MENSAGEM_SEM_CONEXAO = "Não foi possível conectar ao servidor. Tente de novo em instantes.";

export function falhaDaResposta(resposta: RespostaRest, mensagensPorCodigo: Record<string, string>, mensagemPadrao: string): Falha {
  if (resposta.status === STATUS_SEM_CONEXAO) return { sucesso: false, erros: [MENSAGEM_SEM_CONEXAO] };

  const mensagens = lerCodigosDeErro(resposta.corpo)
    .map((codigo) => mensagensPorCodigo[codigo])
    .filter((mensagem) => mensagem !== undefined);

  return { sucesso: false, erros: mensagens.length > 0 ? [...new Set(mensagens)] : [mensagemPadrao] };
}

export function ehObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null;
}

function lerCodigosDeErro(corpo: unknown): string[] {
  if (!ehObjeto(corpo)) return [];

  const codigosDeValidacao = ehObjeto(corpo.errors) ? Object.keys(corpo.errors) : [];
  const codigoDoLogin = typeof corpo.detail === "string" ? [corpo.detail] : [];

  return [...codigosDeValidacao, ...codigoDoLogin];
}
