import type { DetalheMesa, Mesa, Participante } from "../dominio/mesa";
import type { Resultado } from "../dominio/resultado";
import type { RespostaRest } from "../providers/FetchRestProvider";
import { ehObjeto, falhaDaResposta } from "./errosApi";

type ResumoMesaDto = Mesa;

type DetalheMesaDto = {
  resumo: ResumoMesaDto;
  participantes: Participante[];
  codigoConvite: string | null;
};

type PaginaMesasDto = {
  itens: ResumoMesaDto[];
  total: number;
};

const MENSAGEM_FALHA_MESA = "Não foi possível concluir a ação na mesa.";
const MENSAGEM_MESA_NAO_ENCONTRADA = "Mesa não encontrada. Ela pode ter sido excluída ou ser privada.";
const MENSAGEM_SEM_PERMISSAO = "Você não tem permissão para fazer isso nesta mesa.";
const STATUS_SEM_PERMISSAO = 403;
const STATUS_NAO_ENCONTRADO = 404;

export const mensagensMesa: Record<string, string> = {
  NomeObrigatorio: "Informe o nome da mesa.",
  NomeInvalido: "O nome da mesa precisa ter de 3 a 80 caracteres.",
  DescricaoInvalida: "A descrição pode ter até 500 caracteres.",
  VisibilidadeInvalida: "Escolha se a mesa é pública ou privada.",
  TemplateInvalido: "Escolha um template de ficha válido.",
  MesaEncerrada: "A mesa está encerrada e só pode ser lida.",
  EntradaBloqueada: "O mestre bloqueou a entrada de novas pessoas nesta mesa.",
  CodigoConviteInvalido: "Código de convite não encontrado.",
  DonoNaoPodeSair: "O mestre não pode sair da própria mesa. Encerre ou exclua a mesa.",
  PapelInvalido: "Escolha um papel válido.",
  StatusInvalido: "Filtro de status inválido.",
};

export function resultadoDetalhe(resposta: RespostaRest): Resultado<DetalheMesa> {
  if (resposta.ok && ehDetalheMesaDto(resposta.corpo)) return { sucesso: true, valor: paraDetalhe(resposta.corpo) };
  return falhaMesa(resposta);
}

export function resultadoVazio(resposta: RespostaRest): Resultado<null> {
  return resposta.ok ? { sucesso: true, valor: null } : falhaMesa(resposta);
}

export function resultadoPagina(resposta: RespostaRest): Resultado<Mesa[]> {
  if (resposta.ok && ehPaginaMesasDto(resposta.corpo)) return { sucesso: true, valor: resposta.corpo.itens };
  return falhaMesa(resposta);
}

function falhaMesa(resposta: RespostaRest) {
  if (resposta.status === STATUS_NAO_ENCONTRADO) return { sucesso: false as const, erros: [MENSAGEM_MESA_NAO_ENCONTRADA] };
  if (resposta.status === STATUS_SEM_PERMISSAO) return { sucesso: false as const, erros: [MENSAGEM_SEM_PERMISSAO] };
  return falhaDaResposta(resposta, mensagensMesa, MENSAGEM_FALHA_MESA);
}

function paraDetalhe(dto: DetalheMesaDto): DetalheMesa {
  return { ...dto.resumo, participantes: dto.participantes, codigoConvite: dto.codigoConvite };
}

function ehResumoMesaDto(valor: unknown): valor is ResumoMesaDto {
  return ehObjeto(valor) && typeof valor.id === "string" && typeof valor.nome === "string" && typeof valor.status === "string";
}

function ehDetalheMesaDto(valor: unknown): valor is DetalheMesaDto {
  return ehObjeto(valor) && ehResumoMesaDto(valor.resumo) && Array.isArray(valor.participantes);
}

function ehPaginaMesasDto(valor: unknown): valor is PaginaMesasDto {
  return ehObjeto(valor) && Array.isArray(valor.itens) && valor.itens.every(ehResumoMesaDto);
}
