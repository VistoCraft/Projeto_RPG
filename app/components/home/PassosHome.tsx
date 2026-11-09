import { tituloSecao } from "../estilos";

type Passo = {
  titulo: string;
  texto: string;
};

const passos: Passo[] = [
  { titulo: "Crie sua conta", texto: "Escolha um nickname e entre em poucos segundos." },
  { titulo: "Escolha uma mesa", texto: "Entre numa mesa pública, use um código de convite ou crie a sua." },
  { titulo: "Jogue com o grupo", texto: "Fichas, chat e tabuleiro ficam juntos na página da mesa." },
];

export default function PassosHome() {
  return (
    <section aria-labelledby="titulo-passos" className="flex flex-col gap-5">
      <h2 id="titulo-passos" className={tituloSecao}>Como funciona</h2>
      <ol className="grid gap-5 sm:grid-cols-3">
        {passos.map(({ titulo, texto }, indice) => (
          <li key={titulo} className="flex flex-col items-center gap-2 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-destaque font-titulo text-[22px] font-bold text-destaque">
              {indice + 1}
            </span>
            <h3 className="font-titulo text-[20px] font-bold">{titulo}</h3>
            <p className="opacity-80">{texto}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
