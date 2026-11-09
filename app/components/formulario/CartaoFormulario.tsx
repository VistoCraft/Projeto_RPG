import type { ReactNode } from "react";
import type { EnvioFormulario } from "./useEnvioFormulario";
import ListaErros from "./ListaErros";
import { botaoPrincipal, cartaoBase } from "../estilos";

type CartaoFormularioProps = {
  titulo: string;
  textoBotao: string;
  envio: EnvioFormulario;
  rodape: ReactNode;
  children: ReactNode;
  estreito?: boolean;
};

export default function CartaoFormulario({ titulo, textoBotao, envio, rodape, children, estreito = false }: CartaoFormularioProps) {
  return (
    <form className={`${cartaoBase} flex w-full flex-col p-6 sm:p-8 ${estreito ? "mx-auto max-w-[440px]" : ""}`} onSubmit={envio.enviar}>
      <h1 className="mb-6 font-titulo text-[2rem] leading-tight font-bold">{titulo}</h1>
      {children}
      <ListaErros erros={envio.erros} />
      <button type="submit" className={botaoPrincipal} disabled={envio.enviando}>
        {envio.enviando ? "Aguarde..." : textoBotao}
      </button>
      <p className="mt-5 text-center text-sm">{rodape}</p>
    </form>
  );
}
