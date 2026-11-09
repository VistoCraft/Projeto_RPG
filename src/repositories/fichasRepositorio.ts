import { api } from "../providers/api";
import type { DadosFicha, DadosNovaFicha, DetalheFicha, ResumoFicha } from "../dominio/ficha";
import type { CamposAlterados } from "../dominio/modeloFicha";
import type { Resultado } from "../dominio/resultado";
import { resultadoDetalheFicha, resultadoFicha, resultadoSemCorpo, resultadoListaFichas } from "./fichasDto";

const rotaFichas = (mesaId: string) => `/mesas/${mesaId}/fichas`;

export async function listarFichas(mesaId: string): Promise<Resultado<ResumoFicha[]>> {
  return resultadoListaFichas(await api.get(rotaFichas(mesaId)));
}

export async function criarFicha(mesaId: string, dados: DadosNovaFicha): Promise<Resultado<ResumoFicha>> {
  return resultadoFicha(await api.post(rotaFichas(mesaId), { ...dados, nome: dados.nome.trim() }));
}

export async function atualizarFicha(mesaId: string, fichaId: string, dados: DadosFicha): Promise<Resultado<ResumoFicha>> {
  return resultadoFicha(await api.put(`${rotaFichas(mesaId)}/${fichaId}`, { ...dados, nome: dados.nome.trim() }));
}

export async function obterFicha(mesaId: string, fichaId: string): Promise<Resultado<DetalheFicha>> {
  return resultadoDetalheFicha(await api.get(`${rotaFichas(mesaId)}/${fichaId}`));
}

export async function alterarCamposFicha(mesaId: string, fichaId: string, campos: CamposAlterados): Promise<Resultado<null>> {
  return resultadoSemCorpo(await api.patch(`${rotaFichas(mesaId)}/${fichaId}`, { campos }));
}

export async function excluirFicha(mesaId: string, fichaId: string): Promise<Resultado<null>> {
  return resultadoSemCorpo(await api.delete(`${rotaFichas(mesaId)}/${fichaId}`));
}
