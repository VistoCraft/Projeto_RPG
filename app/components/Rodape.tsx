import Link from "next/link";
import { conteudoPagina, link } from "./estilos";

const ANO_ATUAL = new Date().getFullYear();

export default function Rodape() {
  return (
    <footer className="mt-auto border-t border-borda bg-superficie/40">
      <div className={`${conteudoPagina} flex flex-col items-center gap-3 py-6 text-center text-sm md:flex-row md:justify-between md:text-left`}>
        <p className="opacity-80">Projeto pessoal de estudo, gratuito e sem fins comerciais.</p>
        <nav aria-label="Informações legais" className="flex gap-5">
          <Link className={link} href="/termos">Termos de uso</Link>
          <Link className={link} href="/privacidade">Privacidade</Link>
          <Link className={link} href="/creditos">Créditos</Link>
        </nav>
        <p className="opacity-80">Desenvolvido por <strong>Victor Prezia</strong> · {ANO_ATUAL}</p>
      </div>
    </footer>
  );
}
