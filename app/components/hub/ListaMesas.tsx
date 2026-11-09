import type { EstadoMesas } from "./useMesas";
import CartaoMesa from "./CartaoMesa";
import { tituloSecao } from "../estilos";

type ListaMesasProps = {
  estado: EstadoMesas;
};

export default function ListaMesas({ estado: { mesas, carregando } }: ListaMesasProps) {
  return (
    <section aria-labelledby="titulo-mesas" aria-busy={carregando} className="flex flex-col gap-5">
      <h2 id="titulo-mesas" className={tituloSecao}>Mesas</h2>
      {carregando && <p className="text-center opacity-80">Carregando mesas...</p>}
      {!carregando && mesas.length === 0 && <p className="text-center opacity-80">Nenhuma mesa por aqui ainda.</p>}
      <div className="grid gap-5 sm:grid-cols-2">
        {mesas.map((mesa) => <CartaoMesa key={mesa.id} mesa={mesa} />)}
      </div>
    </section>
  );
}
