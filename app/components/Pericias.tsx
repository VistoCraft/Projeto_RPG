import Cabecalho from "./Cabecalho";
import { campoNumero, cartao } from "./estilos";

export type Pericia = {
  id: string;
  nome: string;
};

type PericiasProps = {
  titulo: string;
  prefixo?: string;
  pericias: Pericia[];
  completa?: boolean;
};

export default function Pericias({ titulo, prefixo = "", pericias, completa = false }: PericiasProps) {
  const larguraSecao = completa ? "col-span-2 mb-[10px]" : "";
  const grade = completa ? "grid-cols-8 gap-5" : "grid-cols-4";

  return (
    <section className={`${cartao} ${larguraSecao}`}>
      <Cabecalho titulo={titulo} />
      <section className={`grid content-between pb-[5px] ${grade}`}>
        {pericias.map(({ id, nome }) => (
          <article className="text-center" key={id}>
            <button className="mx-auto block h-[10px] w-[10px] bg-neutral-200 active:bg-[purple]"></button>
            <input className={campoNumero} type="text" id={prefixo + id} name={id} defaultValue="0" />
            <label className="block" htmlFor={prefixo + id}>{nome}</label>
          </article>
        ))}
      </section>
    </section>
  );
}
