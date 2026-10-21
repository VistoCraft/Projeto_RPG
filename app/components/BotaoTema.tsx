import type { AlternarTema, Tema } from "./useTema";
import { botaoContorno } from "./estilos";

type BotaoTemaProps = {
  tema: Tema;
  alternar: AlternarTema;
};

const trocaDeTema: Record<Tema, { icone: string; rotulo: string }> = {
  escuro: { icone: "bi-sun", rotulo: "Usar tema claro" },
  claro: { icone: "bi-moon-stars", rotulo: "Usar tema escuro" },
};

export default function BotaoTema({ tema, alternar }: BotaoTemaProps) {
  const { icone, rotulo } = trocaDeTema[tema];

  return (
    <button type="button" className={`${botaoContorno} justify-self-end text-[20px]`} aria-label={rotulo} title={rotulo} onClick={alternar}>
      <i className={`bi ${icone}`}></i>
    </button>
  );
}
