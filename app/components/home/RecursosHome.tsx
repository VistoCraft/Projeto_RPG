import { cartao, tituloSecao } from "../estilos";

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
    <section aria-labelledby="titulo-recursos" className="flex flex-col gap-5">
      <h2 id="titulo-recursos" className={tituloSecao}>Tudo o que a sessão precisa</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        {recursos.map(({ icone, titulo, texto }) => (
          <article key={titulo} className={`${cartao} flex gap-4`}>
            <i className={`bi ${icone} text-[28px] text-destaque`} aria-hidden="true"></i>
            <div className="flex flex-col gap-1">
              <h3 className="font-titulo text-[20px] leading-tight font-bold">{titulo}</h3>
              <p>{texto}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
