import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { entrarComCodigo } from "@/src/repositories/mesasRepositorio";
import CaixaCampo, { classeCampo } from "../formulario/CaixaCampo";
import { botaoContorno, cartao, rotuloCampo } from "../estilos";

const TAMANHO_CODIGO = 8;

export default function EntrarComCodigo() {
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
    <form className={`${cartao} flex flex-col gap-3`} onSubmit={entrar}>
      <label className={rotuloCampo} htmlFor="codigoConvite">Tem um código de convite?</label>
      <CaixaCampo icone="key">
        <input
          className={`${classeCampo("key")} font-mono tracking-[0.3em] uppercase`}
          id="codigoConvite"
          value={codigo}
          onChange={(evento) => setCodigo(evento.target.value)}
          placeholder="CÓDIGO"
          maxLength={TAMANHO_CODIGO}
          minLength={TAMANHO_CODIGO}
          autoComplete="off"
          required
        />
      </CaixaCampo>
      <button type="submit" className={`${botaoContorno} py-2`} disabled={enviando}>
        <i className="bi bi-box-arrow-in-right" aria-hidden="true"></i> Entrar com código
      </button>
      {erros.length > 0 && <p role="alert" className="text-sm text-vida">{erros.join(" ")}</p>}
    </form>
  );
}
