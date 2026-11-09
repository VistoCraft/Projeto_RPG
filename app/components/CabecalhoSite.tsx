import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AlternarTema, Tema } from "./useTema";
import type { EstadoSessao } from "./useSessao";
import BotaoTema from "./BotaoTema";
import { botaoContorno, conteudoPagina } from "./estilos";

type CabecalhoSiteProps = {
  tema: Tema;
  alternarTema: AlternarTema;
  sessao: EstadoSessao;
};

type ItemMenu = { rotulo: string; href: string; icone: string };

const itensMenu: ItemMenu[] = [
  { rotulo: "Início", href: "/", icone: "bi-house" },
  { rotulo: "Mesas", href: "/mesas", icone: "bi-grid" },
];

const itemMenu = "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors hover:bg-texto/5";

function estaAtivo(caminho: string, href: string): boolean {
  return href === "/" ? caminho === "/" : caminho.startsWith(href);
}

export default function CabecalhoSite({ tema, alternarTema, sessao: { sessao, sair } }: CabecalhoSiteProps) {
  const caminho = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-borda bg-fundo/85 backdrop-blur">
      <div className={`${conteudoPagina} flex min-h-16 flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2`}>
        <div className="flex items-center gap-6">
          <Link href="/" aria-label="Página inicial">
            <img className="w-[96px]" src="/img/Logo.png" alt="Logo RPG" />
          </Link>
          <nav aria-label="Principal" className="flex items-center gap-1">
            {itensMenu.map(({ rotulo, href, icone }) => {
              const ativo = estaAtivo(caminho, href);
              return (
                <Link key={href} href={href} aria-current={ativo ? "page" : undefined} className={`${itemMenu} ${ativo ? "bg-arcano/15 text-destaque" : ""}`}>
                  <i className={`bi ${icone}`} aria-hidden="true"></i>
                  {rotulo}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {sessao.estado === "visitante" && (
            <>
              <Link className={itemMenu} href="/login">Entrar</Link>
              <Link className="rounded-md bg-arcano-texto-claro px-4 py-2 text-sm font-bold text-white hover:brightness-110" href="/cadastro">Criar conta</Link>
            </>
          )}
          {sessao.estado === "logado" && (
            <>
              <span className="flex items-center gap-2 rounded-full border border-borda py-1 pr-3 pl-1 text-sm">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-arcano/20 text-destaque">
                  <i className="bi bi-person-fill" aria-hidden="true"></i>
                </span>
                {sessao.perfil.apelido ?? sessao.perfil.email}
              </span>
              <button type="button" className={`${botaoContorno} text-sm`} onClick={() => void sair()}>
                <i className="bi bi-box-arrow-right" aria-hidden="true"></i> Sair
              </button>
            </>
          )}
          <BotaoTema tema={tema} alternar={alternarTema} />
        </div>
      </div>
    </header>
  );
}
