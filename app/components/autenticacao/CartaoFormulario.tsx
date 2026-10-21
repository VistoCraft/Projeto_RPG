import type { ReactNode } from "react";
import type { EnvioFormulario } from "./useEnvioFormulario";
import { botaoPrincipal, cartao, tituloSecao } from "../estilos";

type CartaoFormularioProps = {
  titulo: string;
  textoBotao: string;
  envio: EnvioFormulario;
  rodape: ReactNode;
  children: ReactNode;
};

export default function CartaoFormulario({ titulo, textoBotao, envio, rodape, children }: CartaoFormularioProps) {
  return (
    <form className={`${cartao} flex flex-col`} onSubmit={envio.enviar}>
      <h1 className={`${tituloSecao} mb-6 text-[28px]`}>{titulo}</h1>
      {children}
      {envio.erros.length > 0 && (
        <ul role="alert" className="mb-4 flex flex-col gap-1 rounded-md border border-vida bg-vida/10 p-3 text-sm">
          {envio.erros.map((erro) => <li key={erro}>{erro}</li>)}
        </ul>
      )}
      <button type="submit" className={botaoPrincipal} disabled={envio.enviando}>
        {envio.enviando ? "Aguarde..." : textoBotao}
      </button>
      <p className="mt-5 text-center text-sm">{rodape}</p>
    </form>
  );
}
