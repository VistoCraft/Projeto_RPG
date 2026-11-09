import Link from "next/link";
import { link } from "./estilos";

const ANO_ATUAL = new Date().getFullYear();

export default function Rodape() {
  return (
    <footer className="mx-auto mt-10 flex w-full max-w-[940px] flex-col gap-2 border-t border-borda px-4 py-5 text-center text-sm">
      <p className="opacity-80">Projeto pessoal de estudo, gratuito e sem fins comerciais.</p>
      <nav className="flex justify-center gap-4">
        <Link className={link} href="/termos">Termos de uso</Link>
        <Link className={link} href="/privacidade">Privacidade</Link>
      </nav>
      <p className="opacity-80">Desenvolvido por <strong>Victor Prezia</strong> · {ANO_ATUAL}</p>
    </footer>
  );
}
