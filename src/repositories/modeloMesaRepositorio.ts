import { api } from "../providers/api";
import { limparModelo } from "../dominio/editorModelo";
import type { BackupFicha, ConversaoModelos, DetalheBackup, ModeloAlterado, ModeloMesa, ModelosFicha, PreviaConversao } from "../dominio/modeloMesa";
import type { Resultado } from "../dominio/resultado";
import { resultadoBackup, resultadoBackups, resultadoModeloAlterado, resultadoModeloMesa, resultadoPrevia } from "./modeloMesaDto";

const rotaModelo = (mesaId: string) => `/mesas/${mesaId}/modelo-ficha`;
const rotaBackups = (mesaId: string, fichaId: string) => `/mesas/${mesaId}/fichas/${fichaId}/backups`;

function corpoModelos(modelos: ModelosFicha) {
  return { modeloFicha: limparModelo(modelos.completa), modeloFichaSimplificada: limparModelo(modelos.simplificada) };
}

export async function obterModeloMesa(mesaId: string): Promise<Resultado<ModeloMesa>> {
  return resultadoModeloMesa(await api.get(rotaModelo(mesaId)));
}

export async function previaConversao(mesaId: string, modelos: ModelosFicha): Promise<Resultado<PreviaConversao>> {
  return resultadoPrevia(await api.post(`${rotaModelo(mesaId)}/previa`, corpoModelos(modelos)));
}

export async function alterarModeloMesa(mesaId: string, modelos: ModelosFicha, conversao: ConversaoModelos): Promise<Resultado<ModeloAlterado>> {
  return resultadoModeloAlterado(await api.put(rotaModelo(mesaId), { ...corpoModelos(modelos), conversao }));
}

export async function listarBackups(mesaId: string, fichaId: string): Promise<Resultado<BackupFicha[]>> {
  return resultadoBackups(await api.get(rotaBackups(mesaId, fichaId)));
}

export async function obterBackup(mesaId: string, fichaId: string, backupId: string): Promise<Resultado<DetalheBackup>> {
  return resultadoBackup(await api.get(`${rotaBackups(mesaId, fichaId)}/${backupId}`));
}
