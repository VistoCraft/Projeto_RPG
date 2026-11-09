import { api } from "../providers/api";
import type { DadosEdicaoMesa, DadosNovaMesa, DetalheMesa, FiltroMesas, Mesa, PapelParticipante } from "../dominio/mesa";
import type { Resultado } from "../dominio/resultado";
import { resultadoDetalhe, resultadoPagina, resultadoVazio } from "./mesasDto";

export async function listarMesas(filtro: FiltroMesas): Promise<Resultado<Mesa[]>> {
  const parametros = new URLSearchParams();
  if (filtro.busca.trim()) parametros.set("busca", filtro.busca.trim());
  if (filtro.status) parametros.set("status", filtro.status);
  if (filtro.minhas) parametros.set("minhas", "true");
  const consulta = parametros.toString();
  return resultadoPagina(await api.get(consulta ? `/mesas?${consulta}` : "/mesas"));
}

export async function obterMesa(id: string): Promise<Resultado<DetalheMesa>> {
  return resultadoDetalhe(await api.get(`/mesas/${id}`));
}

export async function criarMesa(dados: DadosNovaMesa): Promise<Resultado<DetalheMesa>> {
  const corpo = { ...dados, nome: dados.nome.trim(), descricao: dados.descricao.trim() || null };
  return resultadoDetalhe(await api.post("/mesas", corpo));
}

export async function atualizarMesa(id: string, dados: DadosEdicaoMesa): Promise<Resultado<DetalheMesa>> {
  return resultadoDetalhe(await api.put(`/mesas/${id}`, dados));
}

export async function excluirMesa(id: string): Promise<Resultado<null>> {
  return resultadoVazio(await api.delete(`/mesas/${id}`));
}

export async function encerrarMesa(id: string): Promise<Resultado<DetalheMesa>> {
  return resultadoDetalhe(await api.post(`/mesas/${id}/encerrar`));
}

export async function reabrirMesa(id: string): Promise<Resultado<DetalheMesa>> {
  return resultadoDetalhe(await api.post(`/mesas/${id}/reabrir`));
}

export async function gerarNovoCodigo(id: string): Promise<Resultado<DetalheMesa>> {
  return resultadoDetalhe(await api.post(`/mesas/${id}/codigo`));
}

export async function entrarNaMesa(id: string): Promise<Resultado<DetalheMesa>> {
  return resultadoDetalhe(await api.post(`/mesas/${id}/entrar`));
}

export async function entrarComCodigo(codigo: string): Promise<Resultado<DetalheMesa>> {
  return resultadoDetalhe(await api.post("/mesas/entrar-com-codigo", { codigo: codigo.trim().toUpperCase() }));
}

export async function sairDaMesa(id: string): Promise<Resultado<null>> {
  return resultadoVazio(await api.post(`/mesas/${id}/sair`));
}

export async function alterarPapel(id: string, usuarioId: string, papel: PapelParticipante): Promise<Resultado<DetalheMesa>> {
  return resultadoDetalhe(await api.put(`/mesas/${id}/participantes/${usuarioId}`, { papel }));
}

export async function removerParticipante(id: string, usuarioId: string): Promise<Resultado<DetalheMesa>> {
  return resultadoDetalhe(await api.delete(`/mesas/${id}/participantes/${usuarioId}`));
}
