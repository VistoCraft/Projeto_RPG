import Link from "next/link";
import type { AlternarTema, Tema } from "../useTema";
import BotaoTema from "../BotaoTema";
import { link } from "../estilos";

type CabecalhoHubProps = {
  tema: Tema;
  alternarTema: AlternarTema;
};

export default function CabecalhoHub({ tema, alternarTema }: CabecalhoHubProps) {
  return (
    <header className="flex items-center justify-between gap-4">
      <img className="w-[120px]" src="/img/Logo.png" alt="Logo RPG" />
      <nav className="flex items-center gap-4">
        <Link className={link} href="/login">Entrar</Link>
        <Link className={link} href="/cadastro">Criar conta</Link>
        <BotaoTema tema={tema} alternar={alternarTema} />
      </nav>
    </header>
  );
}
