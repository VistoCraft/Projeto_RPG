import { cartaoBase } from "../estilos";

type Area = {
  icone: string;
  titulo: string;
  texto: string;
  fase: string;
  classes: string;
};

const areas: Area[] = [
  { icone: "bi-grid-3x3", titulo: "Tabuleiro", texto: "Mapa com grade e tokens ligados às fichas.", fase: "Fase 6", classes: "md:col-span-2 min-h-[360px]" },
  { icone: "bi-journal-text", titulo: "Fichas", texto: "As fichas da mesa, distribuídas pelo mestre.", fase: "Fase 4", classes: "min-h-[220px]" },
  { icone: "bi-chat-dots", titulo: "Chat", texto: "Mensagens e rolagens em tempo real.", fase: "Fase 5", classes: "min-h-[220px]" },
];

export default function AreasMesa() {
  return (
    <section aria-label="Áreas da mesa" className="grid gap-6 md:grid-cols-2">
      {areas.map(({ icone, titulo, texto, fase, classes }) => (
        <article
          key={titulo}
          className={`${cartaoBase} relative flex flex-col items-center justify-center gap-3 overflow-hidden border-dashed p-6 text-center ${classes}`}
        >
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--color-borda)_1px,transparent_1px),linear-gradient(90deg,var(--color-borda)_1px,transparent_1px)] bg-size-[32px_32px] opacity-40" aria-hidden="true"></div>
          <span className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-arcano/15 text-[28px] text-destaque">
            <i className={`bi ${icone}`} aria-hidden="true"></i>
          </span>
          <h2 className="relative font-titulo text-[24px] font-bold">{titulo}</h2>
          <p className="relative max-w-[40ch] text-sm opacity-80">{texto}</p>
          <span className="relative rounded-full border border-borda bg-fundo px-3 py-0.5 text-xs">Em breve · {fase}</span>
        </article>
      ))}
    </section>
  );
}
