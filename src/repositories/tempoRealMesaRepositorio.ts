import { conexaoMesa, type OuvinteEvento } from "../providers/ConexaoTempoReal";

const EVENTO_MESA_ATUALIZADA = "MesaAtualizada";
const EVENTO_MESA_EXCLUIDA = "MesaExcluida";

export type EventosMesa = {
  aoAtualizar: () => void;
  aoExcluir: () => void;
};

export function assinarMesa(mesaId: string, eventos: EventosMesa): () => void {
  const seForEstaMesa = (acao: () => void): OuvinteEvento => (idRecebido) => {
    if (idRecebido === mesaId) acao();
  };
  const aoAtualizar = seForEstaMesa(eventos.aoAtualizar);
  const aoExcluir = seForEstaMesa(eventos.aoExcluir);

  const inscricao = Promise.all([
    conexaoMesa.ouvir(EVENTO_MESA_ATUALIZADA, aoAtualizar),
    conexaoMesa.ouvir(EVENTO_MESA_EXCLUIDA, aoExcluir),
  ]).then(() => conexaoMesa.acompanharMesa(mesaId)).catch(() => undefined);

  return () => {
    void inscricao.then(() => Promise.all([
      conexaoMesa.pararDeOuvir(EVENTO_MESA_ATUALIZADA, aoAtualizar),
      conexaoMesa.pararDeOuvir(EVENTO_MESA_EXCLUIDA, aoExcluir),
      conexaoMesa.deixarMesa(mesaId),
    ])).catch(() => undefined);
  };
}
