import type { FiltroMesas, StatusMesa } from "@/src/dominio/mesa";
import CaixaCampo, { classeCampo } from "../formulario/CaixaCampo";
import { cartao, rotuloCampo } from "../estilos";

type FiltrosMesasProps = {
  filtro: FiltroMesas;
  aoAlterar: (filtro: FiltroMesas) => void;
  logado: boolean;
};

const opcoesStatus: { valor: StatusMesa | ""; rotulo: string }[] = [
  { valor: "", rotulo: "Todas" },
  { valor: "ativa", rotulo: "Ativas" },
  { valor: "encerrada", rotulo: "Encerradas" },
];

export default function FiltrosMesas({ filtro, aoAlterar, logado }: FiltrosMesasProps) {
  return (
    <div role="search" className={`${cartao} flex flex-col gap-5`}>
      <h2 className="flex items-center gap-2 font-titulo text-[20px] font-bold">
        <i className="bi bi-funnel text-destaque" aria-hidden="true"></i> Filtros
      </h2>
      <div className="flex flex-col">
        <label className={rotuloCampo} htmlFor="buscaMesas">Buscar pelo nome</label>
        <CaixaCampo icone="search">
          <input
            className={classeCampo("search")}
            id="buscaMesas"
            type="search"
            value={filtro.busca}
            onChange={(evento) => aoAlterar({ ...filtro, busca: evento.target.value })}
            placeholder="Ex.: Torre do Arcano"
          />
        </CaixaCampo>
      </div>
      <fieldset className="flex flex-col">
        <legend className={rotuloCampo}>Situação</legend>
        <div className="grid grid-cols-3 gap-1 rounded-md border border-texto/20 bg-fundo p-1">
          {opcoesStatus.map((opcao) => {
            const ativo = filtro.status === opcao.valor;
            return (
              <button
                key={opcao.valor}
                type="button"
                aria-pressed={ativo}
                className={`cursor-pointer rounded px-1 py-1.5 text-[13px] transition-colors ${ativo ? "bg-arcano-texto-claro font-semibold text-white" : "hover:bg-texto/5"}`}
                onClick={() => aoAlterar({ ...filtro, status: opcao.valor })}
              >
                {opcao.rotulo}
              </button>
            );
          })}
        </div>
      </fieldset>
      {logado && (
        <label className="flex cursor-pointer items-center gap-3 text-sm">
          <input
            className="h-4 w-4 cursor-pointer accent-arcano"
            type="checkbox"
            checked={filtro.minhas}
            onChange={(evento) => aoAlterar({ ...filtro, minhas: evento.target.checked })}
          />
          Só as minhas mesas
        </label>
      )}
    </div>
  );
}
