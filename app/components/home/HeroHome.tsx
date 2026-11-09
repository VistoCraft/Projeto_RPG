import Link from "next/link";
import { chamadaPrincipal, chamadaSecundaria, faixaDestaque } from "../estilos";

type HeroHomeProps = {
  logado: boolean;
};

export default function HeroHome({ logado }: HeroHomeProps) {
  return (
    <section className={`${faixaDestaque} flex flex-col items-center gap-6 py-16`}>
      <h1 className="max-w-[640px] font-titulo text-[2.75rem] leading-tight font-bold">Sua mesa de RPG, onde o grupo estiver</h1>
      <p className="max-w-[560px] text-lg">
        Reúna os jogadores, distribua as fichas e role os dados juntos, tudo no navegador.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        {logado ? (
          <Link className={chamadaPrincipal} href="/mesas">Ir para as mesas</Link>
        ) : (
          <>
            <Link className={chamadaPrincipal} href="/cadastro">Criar conta</Link>
            <Link className={chamadaSecundaria} href="/mesas">Ver mesas</Link>
          </>
        )}
      </div>
      <p className="text-sm opacity-90">Projeto pessoal de estudo: gratuito, sem anúncios e sem fins comerciais.</p>
    </section>
  );
}
