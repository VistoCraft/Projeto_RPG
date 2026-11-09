import type { EstadoMesas } from "./useMesas";
import CartaoMesa from "./CartaoMesa";

type ListaMesasProps = {
  estado: EstadoMesas;
};

export default function ListaMesas({ estado: { mesas, carregando, erros } }: ListaMesasProps) {
  return (
    <section aria-label="Mesas" aria-busy={carregando} className="flex flex-col gap-5">
      {carregando && <p className="text-center opacity-80">Carregando mesas...</p>}
      {!carregando && erros.length > 0 && <p role="alert" className="text-center text-vida">{erros.join(" ")}</p>}
      {!carregando && erros.length === 0 && mesas.length === 0 && <p className="text-center opacity-80">Nenhuma mesa encontrada.</p>}
      <div className="grid gap-5 sm:grid-cols-2">
        {mesas.map((mesa) => <CartaoMesa key={mesa.id} mesa={mesa} />)}
      </div>
    </section>
  );
}
