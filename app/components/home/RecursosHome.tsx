import { cartao, conteudoPagina, rotuloSecao } from "../estilos";

type Recurso = {
  icone: string;
  titulo: string;
  texto: string;
};

const recursos: Recurso[] = [
  {
    icone: "bi-people",
    titulo: "Mesas públicas e privadas",
    texto: "Crie uma campanha e convide o grupo por código, ou deixe a mesa aberta para novos jogadores.",
  },
  {
    icone: "bi-journal-text",
    titulo: "Fichas no seu sistema",
    texto: "Comece pelo template 5e ou monte a sua própria ficha. O mestre distribui as fichas e cada jogador cuida das suas.",
  },
  {
    icone: "bi-chat-dots",
    titulo: "Chat e rolagens",
    texto: "Converse com a mesa e role os dados pelo chat, com o resultado à vista de todos.",
  },
  {
    icone: "bi-grid-3x3",
    titulo: "Tabuleiro compartilhado",
    texto: "Mapa com grade e tokens ligados às fichas, que se movem em tempo real para todo o grupo.",
  },
];

export default function RecursosHome() {
  return (
    <section aria-labelledby="titulo-recursos" className={`${conteudoPagina} flex flex-col gap-10 py-20`}>
      <header className="flex flex-col gap-3">
        <span className={rotuloSecao}>Recursos</span>
        <h2 id="titulo-recursos" className="font-titulo text-[2.25rem] leading-tight font-bold">Tudo o que a sessão precisa</h2>
      </header>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {recursos.map(({ icone, titulo, texto }) => (
          <article key={titulo} className={`${cartao} flex flex-col gap-4 transition hover:-translate-y-1 hover:border-arcano`}>
            <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-arcano/15 text-[24px] text-destaque">
              <i className={`bi ${icone}`} aria-hidden="true"></i>
            </span>
            <h3 className="font-titulo text-[22px] leading-tight font-bold">{titulo}</h3>
            <p className="opacity-85">{texto}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
