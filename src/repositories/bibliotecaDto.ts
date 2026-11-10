import type { DetalheBiblioteca, Proposta, ResumoBiblioteca } from "../dominio/biblioteca";
import { normalizarConteudo, type ModeloFicha } from "../dominio/modeloFicha";
import type { Falha, Resultado } from "../dominio/resultado";
import type { RespostaRest } from "../providers/FetchRestProvider";
import { ehObjeto, falhaDaResposta } from "./errosApi";
import { mensagensMesa } from "./mesasDto";

const MENSAGEM_FALHA = "Não foi possível concluir a ação.";
const MENSAGEM_NAO_ENCONTRADA = "Não encontrada. Ela pode ter sido excluída.";
const MENSAGEM_SEM_PERMISSAO = "Só a equipe da mesa pode responder propostas.";
const STATUS_SEM_PERMISSAO = 403;
const STATUS_NAO_ENCONTRADO = 404;

const mensagens: Record<string, string> = {
  ...mensagensMesa,
  SoODonoSalva: "Só o jogador que recebeu a ficha pode salvá-la na biblioteca.",
  SoJogadorPropoe: "Só jogadores podem propor fichas. Peça ao mestre para mudar o seu papel.",
  FichaDaBibliotecaInvalida: "Escolha uma ficha da sua biblioteca.",
  FichaIncompativel: "Esta ficha usa outro modelo de ficha e não pode entrar nesta mesa.",
  PropostaRepetida: "Você já propôs esta ficha nesta mesa. Aguarde a resposta do mestre.",
  PropostaRespondida: "Esta proposta já foi respondida.",
  JogadorForaDaMesa: "Quem propôs não é mais jogador desta mesa.",
};

type DetalheBibliotecaDto = { resumo: ResumoBiblioteca; dados: unknown; modelo: ModeloFicha };

export function resultadoListaBiblioteca(resposta: RespostaRest): Resultado<ResumoBiblioteca[]> {
  if (resposta.ok && Array.isArray(resposta.corpo) && resposta.corpo.every(ehResumoBiblioteca)) return { sucesso: true, valor: resposta.corpo };
  return falha(resposta);
}

export function resultadoResumoBiblioteca(resposta: RespostaRest): Resultado<ResumoBiblioteca> {
  if (resposta.ok && ehResumoBiblioteca(resposta.corpo)) return { sucesso: true, valor: resposta.corpo };
  return falha(resposta);
}

export function resultadoDetalheBiblioteca(resposta: RespostaRest): Resultado<DetalheBiblioteca> {
  if (!resposta.ok || !ehDetalheBiblioteca(resposta.corpo)) return falha(resposta);
  const { resumo, dados, modelo } = resposta.corpo;
  return { sucesso: true, valor: { ...resumo, conteudo: normalizarConteudo(dados, modelo), modelo } };
}

export function resultadoListaPropostas(resposta: RespostaRest): Resultado<Proposta[]> {
  if (resposta.ok && Array.isArray(resposta.corpo) && resposta.corpo.every(ehProposta)) return { sucesso: true, valor: resposta.corpo };
  return falha(resposta);
}

export function resultadoProposta(resposta: RespostaRest): Resultado<Proposta> {
  if (resposta.ok && ehProposta(resposta.corpo)) return { sucesso: true, valor: resposta.corpo };
  return falha(resposta);
}

export function resultadoVazioBiblioteca(resposta: RespostaRest): Resultado<null> {
  return resposta.ok ? { sucesso: true, valor: null } : falha(resposta);
}

function falha(resposta: RespostaRest): Falha {
  if (resposta.status === STATUS_NAO_ENCONTRADO) return { sucesso: false, erros: [MENSAGEM_NAO_ENCONTRADA] };
  if (resposta.status === STATUS_SEM_PERMISSAO) return { sucesso: false, erros: [MENSAGEM_SEM_PERMISSAO] };
  return falhaDaResposta(resposta, mensagens, MENSAGEM_FALHA);
}

function ehResumoBiblioteca(valor: unknown): valor is ResumoBiblioteca {
  return ehObjeto(valor) && typeof valor.id === "string" && typeof valor.nome === "string" && typeof valor.templateId === "string";
}

function ehDetalheBiblioteca(valor: unknown): valor is DetalheBibliotecaDto {
  return ehObjeto(valor) && ehResumoBiblioteca(valor.resumo) && ehObjeto(valor.modelo);
}

function ehProposta(valor: unknown): valor is Proposta {
  return ehObjeto(valor) && typeof valor.id === "string" && typeof valor.fichaId === "string" && typeof valor.status === "string";
}
