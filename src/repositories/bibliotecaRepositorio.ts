import { api } from "../providers/api";
import type { DetalheBiblioteca, Proposta, ResumoBiblioteca } from "../dominio/biblioteca";
import type { Resultado } from "../dominio/resultado";
import {
  resultadoDetalheBiblioteca,
  resultadoListaBiblioteca,
  resultadoListaPropostas,
  resultadoProposta,
  resultadoResumoBiblioteca,
  resultadoVazioBiblioteca,
} from "./bibliotecaDto";

const ROTA_BIBLIOTECA = "/biblioteca/fichas";
const rotaPropostas = (mesaId: string) => `/mesas/${mesaId}/propostas`;

export async function listarBiblioteca(): Promise<Resultado<ResumoBiblioteca[]>> {
  return resultadoListaBiblioteca(await api.get(ROTA_BIBLIOTECA));
}

export async function obterDaBiblioteca(fichaId: string): Promise<Resultado<DetalheBiblioteca>> {
  return resultadoDetalheBiblioteca(await api.get(`${ROTA_BIBLIOTECA}/${fichaId}`));
}

export async function excluirDaBiblioteca(fichaId: string): Promise<Resultado<null>> {
  return resultadoVazioBiblioteca(await api.delete(`${ROTA_BIBLIOTECA}/${fichaId}`));
}

export async function salvarNaBiblioteca(mesaId: string, fichaId: string): Promise<Resultado<ResumoBiblioteca>> {
  return resultadoResumoBiblioteca(await api.post(`/mesas/${mesaId}/fichas/${fichaId}/salvar`));
}

export async function listarPropostas(mesaId: string): Promise<Resultado<Proposta[]>> {
  return resultadoListaPropostas(await api.get(rotaPropostas(mesaId)));
}

export async function proporFicha(mesaId: string, fichaId: string): Promise<Resultado<Proposta>> {
  return resultadoProposta(await api.post(rotaPropostas(mesaId), { fichaId }));
}

export async function aceitarProposta(mesaId: string, propostaId: string): Promise<Resultado<Proposta>> {
  return resultadoProposta(await api.post(`${rotaPropostas(mesaId)}/${propostaId}/aceitar`));
}

export async function recusarProposta(mesaId: string, propostaId: string): Promise<Resultado<Proposta>> {
  return resultadoProposta(await api.post(`${rotaPropostas(mesaId)}/${propostaId}/recusar`));
}

export async function cancelarProposta(mesaId: string, propostaId: string): Promise<Resultado<null>> {
  return resultadoVazioBiblioteca(await api.delete(`${rotaPropostas(mesaId)}/${propostaId}`));
}
