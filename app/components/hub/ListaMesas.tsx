import type { EstadoMesas } from "./useMesas";
import CartaoMesa from "./CartaoMesa";
import { cartao } from "../estilos";

type ListaMesasProps = {
  estado: EstadoMesas;
};

const mensagemEstado = `${cartao} flex flex-col items-center gap-2 py-16 text-center`;

export default function ListaMesas({ estado: { mesas, carregando, erros } }: ListaMesasProps) {
  const vazio = !carregando && erros.length === 0 && mesas.length === 0;

  return (
    <section aria-label="Mesas" aria-busy={carregando} className="flex flex-col gap-5">
      {!carregando && mesas.length > 0 && (
        <p className="text-sm opacity-75 tabular-nums">{mesas.length} {mesas.length === 1 ? "mesa encontrada" : "mesas encontradas"}</p>
      )}
      {carregando && (
        <div className={mensagemEstado}>
          <i className="bi bi-hourglass-split text-[28px] text-destaque" aria-hidden="true"></i>
          <p className="opacity-80">Carregando mesas...</p>
        </div>
      )}
      {!carregando && erros.length > 0 && <p role="alert" className={`${mensagemEstado} text-vida`}>{erros.join(" ")}</p>}
      {vazio && (
        <div className={mensagemEstado}>
          <i className="bi bi-compass text-[32px] text-destaque" aria-hidden="true"></i>
          <p className="font-titulo text-[20px] font-bold">Nenhuma mesa encontrada</p>
          <p className="text-sm opacity-75">Tente outro nome ou outra situação nos filtros.</p>
        </div>
      )}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-5">
        {mesas.map((mesa) => <CartaoMesa key={mesa.id} mesa={mesa} />)}
      </div>
    </section>
  );
}
