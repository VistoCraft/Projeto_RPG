import Link from "next/link";
import { link } from "../estilos";

export default function AvisoVisitante() {
  return (
    <p role="note" className="rounded-md border border-acento bg-acento/10 p-3 text-center text-sm">
      <i className="bi bi-eye" aria-hidden="true"></i> Você está vendo as mesas como visitante.{" "}
      <Link className={link} href="/cadastro">Crie uma conta</Link> ou <Link className={link} href="/login">entre</Link> para criar mesas e participar.
    </p>
  );
}
