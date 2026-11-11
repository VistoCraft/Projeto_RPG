import { api } from "../providers/api";
import type { DadosTemplate, DetalheTemplate, Template } from "../dominio/template";
import type { ModeloFicha } from "../dominio/modeloFicha";
import type { Falha, Resultado } from "../dominio/resultado";
import type { RespostaRest } from "../providers/FetchRestProvider";
import { ehObjeto, falhaDaResposta } from "./errosApi";
import { mensagensDeModelo } from "./errosModelo";

const ROTA_TEMPLATES = "/templates";
const MENSAGEM_FALHA = "Não foi possível salvar o template.";
const MENSAGEM_NAO_ENCONTRADO = "Template não encontrado.";
const STATUS_NAO_ENCONTRADO = 404;

const mensagens: Record<string, string> = {
  NomeTemplateObrigatorio: "Informe o nome do template.",
  NomeTemplateInvalido: "O nome do template pode ter até 80 caracteres.",
  DescricaoTemplateInvalida: "A descrição pode ter até 500 caracteres.",
  LimiteDeTemplates: "Você chegou ao limite de 50 templates.",
};

type DetalheTemplateDto = { resumo: Template; modeloFicha: ModeloFicha; modeloFichaSimplificada: ModeloFicha; podeEditar: boolean };

export async function listarTemplates(): Promise<Template[]> {
  const resposta = await api.get(ROTA_TEMPLATES);
  return resposta.ok && Array.isArray(resposta.corpo) ? resposta.corpo.filter(ehTemplate) : [];
}

export async function obterTemplate(id: string): Promise<Resultado<DetalheTemplate>> {
  return resultadoDetalhe(await api.get(`${ROTA_TEMPLATES}/${id}`));
}

export async function criarTemplate(dados: DadosTemplate): Promise<Resultado<DetalheTemplate>> {
  return resultadoDetalhe(await api.post(ROTA_TEMPLATES, corpo(dados)));
}

export async function atualizarTemplate(id: string, dados: DadosTemplate): Promise<Resultado<DetalheTemplate>> {
  return resultadoDetalhe(await api.put(`${ROTA_TEMPLATES}/${id}`, corpo(dados)));
}

export async function excluirTemplate(id: string): Promise<Resultado<null>> {
  const resposta = await api.delete(`${ROTA_TEMPLATES}/${id}`);
  return resposta.ok ? { sucesso: true, valor: null } : falha(resposta);
}

function corpo(dados: DadosTemplate) {
  return { ...dados, nome: dados.nome.trim(), descricao: dados.descricao.trim() || null };
}

function resultadoDetalhe(resposta: RespostaRest): Resultado<DetalheTemplate> {
  if (!resposta.ok || !ehDetalheDto(resposta.corpo)) return falha(resposta);
  const { resumo, modeloFicha, modeloFichaSimplificada, podeEditar } = resposta.corpo;
  return { sucesso: true, valor: { ...resumo, modeloFicha, modeloFichaSimplificada, podeEditar } };
}

function falha(resposta: RespostaRest): Falha {
  if (resposta.status === STATUS_NAO_ENCONTRADO) return { sucesso: false, erros: [MENSAGEM_NAO_ENCONTRADO] };
  const doModelo = mensagensDeModelo(resposta.corpo, ["TemplateEmUso"]);
  if (doModelo.length > 0) return { sucesso: false, erros: doModelo };
  return falhaDaResposta(resposta, mensagens, MENSAGEM_FALHA);
}

function ehTemplate(valor: unknown): valor is Template {
  return ehObjeto(valor) && typeof valor.id === "string" && typeof valor.nome === "string";
}

function ehDetalheDto(valor: unknown): valor is DetalheTemplateDto {
  return ehObjeto(valor) && ehTemplate(valor.resumo) && ehObjeto(valor.modeloFicha) && ehObjeto(valor.modeloFichaSimplificada);
}
