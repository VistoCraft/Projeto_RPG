import type { DetalheFicha, ResumoFicha } from "../dominio/ficha";
import { normalizarConteudo, type ModeloFicha } from "../dominio/modeloFicha";
import type { Falha, Resultado } from "../dominio/resultado";
import type { RespostaRest } from "../providers/FetchRestProvider";
import { ehObjeto, falhaDaResposta } from "./errosApi";
import { mensagensMesa } from "./mesasDto";

const MENSAGEM_FALHA_FICHA = "Não foi possível concluir a ação na ficha.";
const MENSAGEM_FICHA_NAO_ENCONTRADA = "Ficha não encontrada. Ela pode ter sido excluída.";
const MENSAGEM_SEM_PERMISSAO = "Você não tem permissão para mexer nas fichas desta mesa.";
const STATUS_SEM_PERMISSAO = 403;
const STATUS_NAO_ENCONTRADO = 404;

const mensagensFicha: Record<string, string> = {
  ...mensagensMesa,
  NomeFichaObrigatorio: "Informe o nome do personagem.",
  NomeFichaInvalido: "O nome do personagem pode ter até 60 caracteres.",
  TipoFichaInvalido: "Escolha se a ficha é completa ou simplificada.",
  JogadorInvalido: "Escolha um jogador da mesa.",
  CampoFichaInvalido: "Algum valor da ficha está fora do permitido pelo modelo. Confira e tente de novo.",
};

type DetalheFichaDto = {
  resumo: ResumoFicha;
  dados: unknown;
  modelo: ModeloFicha;
  versaoModelo: number;
};

export function resultadoDetalheFicha(resposta: RespostaRest): Resultado<DetalheFicha> {
  if (!resposta.ok || !ehDetalheFichaDto(resposta.corpo)) return falhaFicha(resposta);
  const { resumo, dados, modelo, versaoModelo } = resposta.corpo;
  return { sucesso: true, valor: { ...resumo, conteudo: normalizarConteudo(dados, modelo), modelo, versaoModelo } };
}

export function resultadoListaFichas(resposta: RespostaRest): Resultado<ResumoFicha[]> {
  if (resposta.ok && Array.isArray(resposta.corpo) && resposta.corpo.every(ehResumoFichaDto)) return { sucesso: true, valor: resposta.corpo };
  return falhaFicha(resposta);
}

export function resultadoFicha(resposta: RespostaRest): Resultado<ResumoFicha> {
  if (resposta.ok && ehResumoFichaDto(resposta.corpo)) return { sucesso: true, valor: resposta.corpo };
  return falhaFicha(resposta);
}

export function resultadoSemCorpo(resposta: RespostaRest): Resultado<null> {
  return resposta.ok ? { sucesso: true, valor: null } : falhaFicha(resposta);
}

function falhaFicha(resposta: RespostaRest): Falha {
  if (resposta.status === STATUS_NAO_ENCONTRADO) return { sucesso: false, erros: [MENSAGEM_FICHA_NAO_ENCONTRADA] };
  if (resposta.status === STATUS_SEM_PERMISSAO) return { sucesso: false, erros: [MENSAGEM_SEM_PERMISSAO] };
  return falhaDaResposta(resposta, mensagensFicha, MENSAGEM_FALHA_FICHA);
}

function ehDetalheFichaDto(valor: unknown): valor is DetalheFichaDto {
  return ehObjeto(valor) && ehResumoFichaDto(valor.resumo) && ehObjeto(valor.modelo) && typeof valor.versaoModelo === "number";
}

function ehResumoFichaDto(valor: unknown): valor is ResumoFicha {
  return ehObjeto(valor) && typeof valor.id === "string" && typeof valor.nome === "string" && typeof valor.tipo === "string";
}
