import Link from "next/link";
import { cartao, link } from "./estilos";

type AvisoLoginProps = {
  mensagem: string;
};

export default function AvisoLogin({ mensagem }: AvisoLoginProps) {
  return (
    <section className={`${cartao} flex flex-col items-center gap-3 text-center`}>
      <i className="bi bi-door-closed text-[32px] text-destaque" aria-hidden="true"></i>
      <p>{mensagem}</p>
      <p>
        <Link className={link} href="/login">Entrar</Link> ou <Link className={link} href="/cadastro">criar uma conta</Link>
      </p>
    </section>
  );
}
