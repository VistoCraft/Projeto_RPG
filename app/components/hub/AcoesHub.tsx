import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { entrarComCodigo } from "@/src/repositories/mesasRepositorio";
import { botaoContorno, campoLinha, chamadaPrincipal } from "../estilos";

const TAMANHO_CODIGO = 8;

export default function AcoesHub() {
  const router = useRouter();
  const [codigo, setCodigo] = useState("");
  const [erros, setErros] = useState<string[]>([]);
  const [enviando, setEnviando] = useState(false);

  const entrar = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setEnviando(true);
    setErros([]);
    const resultado = await entrarComCodigo(codigo);
    if (resultado.sucesso) {
      router.push(`/mesas/${resultado.valor.id}`);
      return;
    }
    setErros(resultado.erros);
    setEnviando(false);
  };

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <Link className={chamadaPrincipal} href="/mesas/nova">
        <i className="bi bi-plus-lg" aria-hidden="true"></i> Criar mesa
      </Link>
      <form className="flex flex-col gap-1" onSubmit={entrar}>
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="codigoConvite">Código de convite</label>
          <input
            className={`${campoLinha} mb-0 w-[150px] font-mono uppercase tracking-widest`}
            id="codigoConvite"
            value={codigo}
            onChange={(evento) => setCodigo(evento.target.value)}
            placeholder="CÓDIGO"
            maxLength={TAMANHO_CODIGO}
            minLength={TAMANHO_CODIGO}
            required
          />
          <button type="submit" className={botaoContorno} disabled={enviando}>Entrar com código</button>
        </div>
        {erros.length > 0 && <p role="alert" className="text-sm text-vida">{erros.join(" ")}</p>}
      </form>
    </div>
  );
}
