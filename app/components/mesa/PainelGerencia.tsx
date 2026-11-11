import { useState } from "react";
import Link from "next/link";
import { atualizarMesa, encerrarMesa, gerarNovoCodigo, reabrirMesa } from "@/src/repositories/mesasRepositorio";
import { paraDadosEdicao, type DetalheMesa } from "@/src/dominio/mesa";
import type { EstadoMesa } from "./useMesa";
import ModalExclusao from "./ModalExclusao";
import FormularioEdicaoMesa from "./FormularioEdicaoMesa";
import { botaoContorno, botaoPerigo, cartao, tituloPainel } from "../estilos";

type PainelGerenciaProps = {
  mesa: DetalheMesa;
  estado: EstadoMesa;
};

export default function PainelGerencia({ mesa, estado }: PainelGerenciaProps) {
  const [excluindo, setExcluindo] = useState(false);
  const [editando, setEditando] = useState(false);
  const dono = mesa.meuPapel === "dono";
  const ativa = mesa.status === "ativa";
  const { executar, executando } = estado;

  const alternarEntrada = () =>
    executar(() => atualizarMesa(mesa.id, { ...paraDadosEdicao(mesa), entradaBloqueada: !mesa.entradaBloqueada }));

  return (
    <section className={`${cartao} flex flex-col gap-4`} aria-labelledby="titulo-gerencia">
      <h2 id="titulo-gerencia" className={tituloPainel}><i className="bi bi-sliders text-destaque" aria-hidden="true"></i> Gerenciar mesa</h2>
      {ativa && !editando && (
        <button type="button" className={`${botaoContorno} self-start`} onClick={() => setEditando(true)}>
          <i className="bi bi-pencil" aria-hidden="true"></i> Editar dados da mesa
        </button>
      )}
      {ativa && editando && <FormularioEdicaoMesa mesa={mesa} estado={estado} aoFechar={() => setEditando(false)} />}
      {ativa && (
        <Link className={`${botaoContorno} self-start`} href={`/mesas/${mesa.id}/modelo`}>
          <i className="bi bi-ui-checks-grid" aria-hidden="true"></i> Alterar modelo da ficha
        </Link>
      )}
      {ativa && mesa.codigoConvite && (
        <div className="flex flex-col gap-2 rounded-md border border-borda bg-fundo p-3">
          <span className="text-xs font-semibold tracking-wide opacity-75">Código de convite</span>
          <code className="font-mono text-2xl tracking-[0.3em] text-destaque">{mesa.codigoConvite}</code>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={botaoContorno} onClick={() => void navigator.clipboard.writeText(mesa.codigoConvite ?? "")}>
              <i className="bi bi-clipboard" aria-hidden="true"></i> Copiar
            </button>
            <button type="button" className={botaoContorno} disabled={executando} onClick={() => void executar(() => gerarNovoCodigo(mesa.id))}>
              <i className="bi bi-arrow-repeat" aria-hidden="true"></i> Gerar novo
            </button>
          </div>
        </div>
      )}
      {ativa && (
        <label className="flex items-center gap-3 text-sm">
          <input className="h-4 w-4 accent-arcano" type="checkbox" checked={mesa.entradaBloqueada} disabled={executando} onChange={() => void alternarEntrada()} />
          Bloquear a entrada de novas pessoas
        </label>
      )}
      <div className="flex flex-wrap gap-3 border-t border-borda pt-4">
        {ativa ? (
          <button type="button" className={botaoContorno} disabled={executando} onClick={() => void executar(() => encerrarMesa(mesa.id))}>
            <i className="bi bi-archive" aria-hidden="true"></i> Encerrar mesa
          </button>
        ) : (
          <button type="button" className={botaoContorno} disabled={executando} onClick={() => void executar(() => reabrirMesa(mesa.id))}>
            <i className="bi bi-arrow-counterclockwise" aria-hidden="true"></i> Reabrir mesa
          </button>
        )}
        {dono && (
          <button type="button" className={botaoPerigo} onClick={() => setExcluindo(true)}>
            <i className="bi bi-trash" aria-hidden="true"></i> Excluir mesa
          </button>
        )}
      </div>
      {excluindo && <ModalExclusao mesa={mesa} aoFechar={() => setExcluindo(false)} />}
    </section>
  );
}
