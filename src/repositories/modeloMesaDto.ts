import type { BackupFicha, DetalheBackup, ItemModelo, ItemNovo, ModeloAlterado, ModeloMesa, PreviaConversao, PreviaTipo } from "../dominio/modeloMesa";
import { normalizarConteudo, type ModeloFicha } from "../dominio/modeloFicha";
import type { Falha, Resultado } from "../dominio/resultado";
import type { RespostaRest } from "../providers/FetchRestProvider";
import { ehObjeto, falhaDaResposta } from "./errosApi";
import { mensagensDeModelo } from "./errosModelo";
import { mensagensMesa } from "./mesasDto";

const MENSAGEM_FALHA = "Não foi possível concluir a ação no modelo da ficha.";
const MENSAGEM_NAO_ENCONTRADO = "Não encontrado. A mesa ou a ficha pode ter sido excluída.";
const MENSAGEM_SEM_PERMISSAO = "Só o mestre e o co-mestre podem alterar o modelo da ficha.";
const STATUS_SEM_PERMISSAO = 403;
const STATUS_NAO_ENCONTRADO = 404;
const CODIGO_CONVERSAO_INVALIDA = "ConversaoInvalida";

type ModeloMesaDto = { templateId: string; modeloFicha: ModeloFicha; modeloFichaSimplificada: ModeloFicha; versaoModelo: number };

export function resultadoModeloMesa(resposta: RespostaRest): Resultado<ModeloMesa> {
  return resposta.ok && ehModeloMesaDto(resposta.corpo) ? { sucesso: true, valor: paraModeloMesa(resposta.corpo) } : falhaModelo(resposta);
}

export function resultadoModeloAlterado(resposta: RespostaRest): Resultado<ModeloAlterado> {
  const corpo = resposta.corpo;
  if (!resposta.ok || !ehObjeto(corpo) || !ehModeloMesaDto(corpo.modelo) || typeof corpo.fichasConvertidas !== "number") return falhaModelo(resposta);
  return { sucesso: true, valor: { modelo: paraModeloMesa(corpo.modelo), fichasConvertidas: corpo.fichasConvertidas } };
}

export function resultadoPrevia(resposta: RespostaRest): Resultado<PreviaConversao> {
  const corpo = resposta.corpo;
  if (!resposta.ok || !ehObjeto(corpo) || !ehPreviaTipo(corpo.completa) || !ehPreviaTipo(corpo.simplificada)) return falhaModelo(resposta);
  return { sucesso: true, valor: { completa: corpo.completa, simplificada: corpo.simplificada } };
}

export function resultadoBackups(resposta: RespostaRest): Resultado<BackupFicha[]> {
  if (resposta.ok && Array.isArray(resposta.corpo) && resposta.corpo.every(ehBackup)) return { sucesso: true, valor: resposta.corpo };
  return falhaModelo(resposta);
}

export function resultadoBackup(resposta: RespostaRest): Resultado<DetalheBackup> {
  const corpo = resposta.corpo;
  if (!resposta.ok || !ehObjeto(corpo) || !ehBackup(corpo.resumo) || !ehObjeto(corpo.modelo)) return falhaModelo(resposta);
  const modelo = corpo.modelo as ModeloFicha;
  return { sucesso: true, valor: { ...corpo.resumo, modelo, conteudo: normalizarConteudo(corpo.dados, modelo) } };
}

function falhaModelo(resposta: RespostaRest): Falha {
  if (resposta.status === STATUS_NAO_ENCONTRADO) return { sucesso: false, erros: [MENSAGEM_NAO_ENCONTRADO] };
  if (resposta.status === STATUS_SEM_PERMISSAO) return { sucesso: false, erros: [MENSAGEM_SEM_PERMISSAO] };
  const doModelo = mensagensDeModelo(resposta.corpo, [CODIGO_CONVERSAO_INVALIDA]);
  if (doModelo.length > 0) return { sucesso: false, erros: doModelo };
  return falhaDaResposta(resposta, mensagensMesa, MENSAGEM_FALHA);
}

function paraModeloMesa({ templateId, modeloFicha, modeloFichaSimplificada, versaoModelo }: ModeloMesaDto): ModeloMesa {
  return { templateId, versaoModelo, modelos: { completa: modeloFicha, simplificada: modeloFichaSimplificada } };
}

function ehModeloMesaDto(valor: unknown): valor is ModeloMesaDto {
  return ehObjeto(valor) && typeof valor.templateId === "string" && ehObjeto(valor.modeloFicha)
    && ehObjeto(valor.modeloFichaSimplificada) && typeof valor.versaoModelo === "number";
}

function ehItem(valor: unknown): valor is ItemModelo {
  return ehObjeto(valor) && typeof valor.caminho === "string" && typeof valor.rotulo === "string" && typeof valor.tipo === "string";
}

function ehItemNovo(valor: unknown): valor is ItemNovo {
  if (!ehObjeto(valor) || !ehItem(valor)) return false;
  const { origemPadrao } = valor as Record<string, unknown>;
  return origemPadrao === null || typeof origemPadrao === "string";
}

function ehPreviaTipo(valor: unknown): valor is PreviaTipo {
  return ehObjeto(valor) && typeof valor.muda === "boolean" && typeof valor.fichas === "number"
    && Array.isArray(valor.itensAtuais) && valor.itensAtuais.every(ehItem)
    && Array.isArray(valor.itensNovos) && valor.itensNovos.every(ehItemNovo);
}

function ehBackup(valor: unknown): valor is BackupFicha {
  return ehObjeto(valor) && typeof valor.id === "string" && typeof valor.versaoModelo === "number" && typeof valor.criadoEm === "string";
}
