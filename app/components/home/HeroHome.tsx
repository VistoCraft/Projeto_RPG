import Link from "next/link";
import PreviaMesa from "./PreviaMesa";
import { brilhoFaixa, chamadaPrincipal, chamadaSecundaria, conteudoPagina, faixaTela } from "../estilos";

type HeroHomeProps = {
  logado: boolean;
};

export default function HeroHome({ logado }: HeroHomeProps) {
  return (
    <section className={faixaTela}>
      <div className={brilhoFaixa} aria-hidden="true"></div>
      <div className={`${conteudoPagina} relative grid min-h-[calc(100svh-4rem)] items-center gap-12 py-16 lg:grid-cols-[1.1fr_1fr]`}>
        <div className="flex flex-col items-start gap-6">
          <span className="rounded-full border border-pergaminho/30 bg-pergaminho/10 px-3 py-1 text-sm">
            <i className="bi bi-stars" aria-hidden="true"></i> Gratuito, sem anúncios e direto no navegador
          </span>
          <h1 className="max-w-[16ch] font-titulo text-[2.75rem] leading-[1.05] font-bold sm:text-[3.5rem] xl:text-[4.25rem]">
            Sua mesa de RPG, onde o grupo estiver
          </h1>
          <p className="max-w-[52ch] text-lg opacity-90 xl:text-xl">
            Reúna os jogadores, distribua as fichas e role os dados juntos. Mesa, fichas, chat e tabuleiro no mesmo lugar.
          </p>
          <div className="flex flex-wrap gap-4">
            {logado ? (
              <Link className={chamadaPrincipal} href="/mesas">Ir para as mesas <i className="bi bi-arrow-right" aria-hidden="true"></i></Link>
            ) : (
              <>
                <Link className={chamadaPrincipal} href="/cadastro">Criar conta grátis</Link>
                <Link className={chamadaSecundaria} href="/mesas">Ver mesas abertas</Link>
              </>
            )}
          </div>
          <p className="text-sm opacity-80">Projeto pessoal de estudo, sem fins comerciais.</p>
        </div>
        <PreviaMesa />
      </div>
    </section>
  );
}
