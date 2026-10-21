import { botaoContorno, tituloSecao } from "./estilos";

export default function Cabecalho({ titulo }: { titulo: string }) {
  return (
    <>
      <section className="grid grid-cols-4 content-between pb-[5px]">
        <div></div>
        <h2 className={`${tituloSecao} col-span-2 justify-self-center`}>{titulo}</h2>
        <div className="text-end">
          <button className={botaoContorno}>ver</button>
          <button className={botaoContorno}>editar</button>
        </div>
      </section>
      <div className="mb-5 border-b border-white"></div>
    </>
  );
}
