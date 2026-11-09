import Link from "next/link";
import type { AlternarTema, Tema } from "./useTema";
import type { EstadoSessao } from "./useSessao";
import BotaoTema from "./BotaoTema";
import { botaoContorno, link } from "./estilos";

type CabecalhoSiteProps = {
  tema: Tema;
  alternarTema: AlternarTema;
  sessao: EstadoSessao;
};

export default function CabecalhoSite({ tema, alternarTema, sessao: { sessao, sair } }: CabecalhoSiteProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <Link href="/" aria-label="Página inicial">
        <img className="w-[120px]" src="/img/Logo.png" alt="Logo RPG" />
      </Link>
      <nav className="flex flex-wrap items-center gap-4">
        <Link className={link} href="/mesas">Mesas</Link>
        {sessao.estado === "visitante" && (
          <>
            <Link className={link} href="/login">Entrar</Link>
            <Link className={link} href="/cadastro">Criar conta</Link>
          </>
        )}
        {sessao.estado === "logado" && (
          <>
            <span className="flex items-center gap-2">
              <i className="bi bi-person-circle text-destaque" aria-hidden="true"></i>
              {sessao.perfil.apelido ?? sessao.perfil.email}
            </span>
            <button type="button" className={botaoContorno} onClick={() => void sair()}>Sair</button>
          </>
        )}
        <BotaoTema tema={tema} alternar={alternarTema} />
      </nav>
    </header>
  );
}
