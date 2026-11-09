import Link from "next/link";
import { link } from "../estilos";

export default function AvisoVisitante() {
  return (
    <div role="note" className="flex flex-col gap-2 rounded-lg border border-acento/60 bg-acento/10 p-5 text-sm">
      <p className="flex items-center gap-2 font-semibold text-acento">
        <i className="bi bi-eye" aria-hidden="true"></i> Modo visitante
      </p>
      <p>
        Você está vendo as mesas públicas. <Link className={link} href="/cadastro">Crie uma conta</Link> ou{" "}
        <Link className={link} href="/login">entre</Link> para criar mesas e participar.
      </p>
    </div>
  );
}
