import { cartao } from "../estilos";

type Area = {
  icone: string;
  titulo: string;
  texto: string;
};

const areas: Area[] = [
  { icone: "bi-chat-dots", titulo: "Chat", texto: "Mensagens e rolagens em tempo real chegam na fase 5." },
  { icone: "bi-journal-text", titulo: "Fichas", texto: "As fichas da mesa chegam na fase 4." },
  { icone: "bi-grid-3x3", titulo: "Tabuleiro", texto: "O mapa com tokens chega na fase 6." },
];

export default function AreasMesa() {
  return (
    <section aria-label="Áreas da mesa" className="grid gap-5 md:grid-cols-3">
      {areas.map(({ icone, titulo, texto }) => (
        <article key={titulo} className={`${cartao} flex flex-col items-center gap-2 text-center opacity-80`}>
          <i className={`bi ${icone} text-[28px] text-destaque`} aria-hidden="true"></i>
          <h2 className="font-titulo text-[20px] font-bold">{titulo}</h2>
          <p className="text-sm">{texto}</p>
          <span className="rounded-full border border-borda px-3 py-0.5 text-xs">Em breve</span>
        </article>
      ))}
    </section>
  );
}
