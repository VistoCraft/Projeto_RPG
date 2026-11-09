import { conteudoPagina, rotuloSecao } from "../estilos";

type Passo = {
  icone: string;
  titulo: string;
  texto: string;
};

const passos: Passo[] = [
  { icone: "bi-person-plus", titulo: "Crie sua conta", texto: "Escolha um nickname e entre em poucos segundos." },
  { icone: "bi-door-open", titulo: "Escolha uma mesa", texto: "Entre numa mesa pública, use um código de convite ou crie a sua." },
  { icone: "bi-dice-5", titulo: "Jogue com o grupo", texto: "Fichas, chat e tabuleiro ficam juntos na página da mesa." },
];

export default function PassosHome() {
  return (
    <section aria-labelledby="titulo-passos" className="border-y border-borda bg-superficie/50">
      <div className={`${conteudoPagina} flex flex-col gap-10 py-20`}>
        <header className="flex flex-col gap-3">
          <span className={rotuloSecao}>Como funciona</span>
          <h2 id="titulo-passos" className="font-titulo text-[2.25rem] leading-tight font-bold">Da conta à primeira rolagem em três passos</h2>
        </header>
        <ol className="grid gap-8 md:grid-cols-3">
          {passos.map(({ icone, titulo, texto }, indice) => (
            <li key={titulo} className="relative flex flex-col gap-3 border-l-2 border-arcano/40 pl-6">
              <span className="font-titulo text-[3rem] leading-none font-bold text-destaque/40">{String(indice + 1).padStart(2, "0")}</span>
              <h3 className="flex items-center gap-2 font-titulo text-[22px] font-bold">
                <i className={`bi ${icone} text-destaque`} aria-hidden="true"></i>
                {titulo}
              </h3>
              <p className="opacity-85">{texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
