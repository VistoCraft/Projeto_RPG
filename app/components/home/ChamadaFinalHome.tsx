import Link from "next/link";
import DivisorRunico from "../DivisorRunico";
import { chamadaPrincipal, conteudoPagina } from "../estilos";

type ChamadaFinalHomeProps = {
  logado: boolean;
};

export default function ChamadaFinalHome({ logado }: ChamadaFinalHomeProps) {
  return (
    <section className={`${conteudoPagina} flex flex-col items-center gap-6 py-20 text-center`}>
      <DivisorRunico />
      <h2 className="font-titulo text-[2.25rem] leading-tight font-bold">A próxima sessão começa aqui</h2>
      <p className="max-w-[56ch] text-lg opacity-85">Abra uma mesa, chame o grupo pelo código de convite e deixe o resto com a gente.</p>
      <Link className={chamadaPrincipal} href={logado ? "/mesas/nova" : "/cadastro"}>
        {logado ? "Criar uma mesa" : "Começar agora"}
      </Link>
    </section>
  );
}
