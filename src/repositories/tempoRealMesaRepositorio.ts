import { conexaoMesa, type OuvinteEvento } from "../providers/ConexaoTempoReal";
import type { CamposAlterados } from "../dominio/modeloFicha";

const EVENTO_MESA_ATUALIZADA = "MesaAtualizada";
const EVENTO_MESA_EXCLUIDA = "MesaExcluida";
const EVENTO_FICHAS_ATUALIZADAS = "FichasAtualizadas";
const EVENTO_FICHA_ATUALIZADA = "FichaAtualizada";
const EVENTO_PROPOSTAS_ATUALIZADAS = "PropostasAtualizadas";

export type EventosMesa = {
  aoAtualizar: () => void;
  aoExcluir: () => void;
  aoAtualizarFichas: () => void;
  aoAtualizarPropostas: () => void;
};

export function assinarMesa(mesaId: string, eventos: EventosMesa): () => void {
  const seForEstaMesa = (acao: () => void): OuvinteEvento => (idRecebido) => {
    if (idRecebido === mesaId) acao();
  };
  const aoAtualizar = seForEstaMesa(eventos.aoAtualizar);
  const aoExcluir = seForEstaMesa(eventos.aoExcluir);
  const aoAtualizarFichas = seForEstaMesa(eventos.aoAtualizarFichas);
  const aoAtualizarPropostas = seForEstaMesa(eventos.aoAtualizarPropostas);

  const inscricao = Promise.all([
    conexaoMesa.ouvir(EVENTO_MESA_ATUALIZADA, aoAtualizar),
    conexaoMesa.ouvir(EVENTO_MESA_EXCLUIDA, aoExcluir),
    conexaoMesa.ouvir(EVENTO_FICHAS_ATUALIZADAS, aoAtualizarFichas),
    conexaoMesa.ouvir(EVENTO_PROPOSTAS_ATUALIZADAS, aoAtualizarPropostas),
  ]).then(() => conexaoMesa.acompanharMesa(mesaId)).catch(() => undefined);

  return () => {
    void inscricao.then(() => Promise.all([
      conexaoMesa.pararDeOuvir(EVENTO_MESA_ATUALIZADA, aoAtualizar),
      conexaoMesa.pararDeOuvir(EVENTO_MESA_EXCLUIDA, aoExcluir),
      conexaoMesa.pararDeOuvir(EVENTO_FICHAS_ATUALIZADAS, aoAtualizarFichas),
      conexaoMesa.pararDeOuvir(EVENTO_PROPOSTAS_ATUALIZADAS, aoAtualizarPropostas),
      conexaoMesa.deixarMesa(mesaId),
    ])).catch(() => undefined);
  };
}

export type EventosFicha = {
  aoAlterarCampos: (campos: CamposAlterados) => void;
  aoAtualizarFichas: () => void;
};

type FichaAtualizadaDto = { mesaId: string; fichaId: string; campos: CamposAlterados };

function ehFichaAtualizada(valor: unknown): valor is FichaAtualizadaDto {
  return typeof valor === "object" && valor !== null && "fichaId" in valor && "campos" in valor;
}

export function assinarFicha(mesaId: string, fichaId: string, eventos: EventosFicha): () => void {
  const aoAlterarCampos: OuvinteEvento = (evento) => {
    if (ehFichaAtualizada(evento) && evento.fichaId === fichaId) eventos.aoAlterarCampos(evento.campos);
  };
  const aoAtualizarFichas: OuvinteEvento = (idRecebido) => {
    if (idRecebido === mesaId) eventos.aoAtualizarFichas();
  };

  const inscricao = Promise.all([
    conexaoMesa.ouvir(EVENTO_FICHA_ATUALIZADA, aoAlterarCampos),
    conexaoMesa.ouvir(EVENTO_FICHAS_ATUALIZADAS, aoAtualizarFichas),
  ]).then(() => conexaoMesa.acompanharMesa(mesaId)).catch(() => undefined);

  return () => {
    void inscricao.then(() => Promise.all([
      conexaoMesa.pararDeOuvir(EVENTO_FICHA_ATUALIZADA, aoAlterarCampos),
      conexaoMesa.pararDeOuvir(EVENTO_FICHAS_ATUALIZADAS, aoAtualizarFichas),
      conexaoMesa.deixarMesa(mesaId),
    ])).catch(() => undefined);
  };
}
