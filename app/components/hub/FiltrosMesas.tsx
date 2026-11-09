import type { FiltroMesas, StatusMesa } from "@/src/dominio/mesa";
import { campoLinha } from "../estilos";

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

function statusDoValor(valor: string): StatusMesa | "" {
  return opcoesStatus.find((opcao) => opcao.valor === valor)?.valor ?? "";
}

export default function FiltrosMesas({ filtro, aoAlterar, logado }: FiltrosMesasProps) {
  return (
    <div role="search" className="flex flex-wrap items-end gap-4">
      <label className="flex min-w-[200px] flex-1 flex-col text-sm">
        Buscar pelo nome
        <input
          className={campoLinha}
          type="search"
          value={filtro.busca}
          onChange={(evento) => aoAlterar({ ...filtro, busca: evento.target.value })}
          placeholder="Ex.: Torre do Arcano"
        />
      </label>
      <label className="flex flex-col text-sm">
        Situação
        <select
          className={campoLinha}
          value={filtro.status}
          onChange={(evento) => aoAlterar({ ...filtro, status: statusDoValor(evento.target.value) })}
        >
          {opcoesStatus.map((opcao) => <option key={opcao.valor} value={opcao.valor}>{opcao.rotulo}</option>)}
        </select>
      </label>
      {logado && (
        <label className="mb-[15px] flex items-center gap-2 text-sm">
          <input
            className="h-4 w-4 accent-arcano"
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
