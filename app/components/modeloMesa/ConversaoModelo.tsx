import { TIPOS_FICHA, type TipoFicha } from "@/src/dominio/ficha";
import {
  fichasAConverter,
  origensPossiveis,
  ROTULOS_TIPO_ITEM,
  type ConversaoModelos,
  type PreviaConversao,
  type PreviaTipo,
} from "@/src/dominio/modeloMesa";
import ListaErros from "../formulario/ListaErros";
import { botaoCompacto, botaoContorno, campoFicha, cartao, rotuloFicha, tituloPainel } from "../estilos";

type ConversaoModeloProps = {
  previa: PreviaConversao;
  conversao: ConversaoModelos;
  aoAlterar: (tipo: TipoFicha, destino: string, origem: string | null) => void;
  aoVoltar: () => void;
  aoAplicar: () => void;
  aplicando: boolean;
  erros: string[];
};

const TITULOS: Record<TipoFicha, string> = { completa: "Ficha completa", simplificada: "Ficha simplificada" };

const plural = (quantidade: number, singular: string, varias: string) => `${quantidade} ${quantidade === 1 ? singular : varias}`;

export default function ConversaoModelo({ previa, conversao, aoAlterar, aoVoltar, aoAplicar, aplicando, erros }: ConversaoModeloProps) {
  const total = fichasAConverter(previa);
  const nadaMudou = !previa.completa.muda && !previa.simplificada.muda;

  return (
    <section className={`${cartao} flex flex-col gap-5`} aria-labelledby="titulo-conversao">
      <div className="flex flex-col gap-1">
        <h2 id="titulo-conversao" className={tituloPainel}><i className="bi bi-arrow-left-right text-destaque" aria-hidden="true"></i> Conversão das fichas</h2>
        <p className="text-sm opacity-80">
          Escolha de onde vem o valor de cada campo do modelo novo. Campos com o mesmo nome já vêm escolhidos. Antes de converter,
          cada ficha ganha um backup da versão atual.
        </p>
      </div>
      {TIPOS_FICHA.map((tipo) => (
        <ConversaoDoTipo key={tipo} titulo={TITULOS[tipo]} previa={previa[tipo]} escolhas={conversao[tipo]} aoAlterar={(destino, origem) => aoAlterar(tipo, destino, origem)} />
      ))}
      <ListaErros erros={erros} />
      <div className="flex flex-wrap items-center gap-3 border-t border-borda pt-4">
        <button type="button" className={botaoContorno} onClick={aoVoltar}>
          <i className="bi bi-arrow-left" aria-hidden="true"></i> Voltar ao editor
        </button>
        <button type="button" className={botaoCompacto} disabled={aplicando || nadaMudou} onClick={aoAplicar}>
          <i className="bi bi-check2-circle" aria-hidden="true"></i>{" "}
          {aplicando ? "Aplicando..." : total > 0 ? `Aplicar e converter ${plural(total, "ficha", "fichas")}` : "Aplicar modelo"}
        </button>
        {nadaMudou && <span className="text-sm opacity-80">O modelo está igual ao atual; não há nada a aplicar.</span>}
      </div>
    </section>
  );
}

type ConversaoDoTipoProps = {
  titulo: string;
  previa: PreviaTipo;
  escolhas: Record<string, string | null>;
  aoAlterar: (destino: string, origem: string | null) => void;
};

function ConversaoDoTipo({ titulo, previa, escolhas, aoAlterar }: ConversaoDoTipoProps) {
  if (!previa.muda) return <p className="text-sm opacity-80"><strong>{titulo}:</strong> sem mudanças, as fichas continuam como estão.</p>;
  if (previa.fichas === 0) return <p className="text-sm opacity-80"><strong>{titulo}:</strong> o modelo muda, mas não há fichas deste tipo para converter.</p>;

  return (
    <fieldset className="flex flex-col gap-2 rounded-md border border-borda p-4">
      <legend className="px-1 font-semibold">{titulo} · {plural(previa.fichas, "ficha", "fichas")}</legend>
      <div className="grid gap-x-4 gap-y-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-center">
        <span className={`${rotuloFicha} hidden sm:block`}>Campo no modelo novo</span>
        <span className={`${rotuloFicha} hidden sm:block`}>Vem de</span>
        {previa.itensNovos.map((item) => {
          const escolhida = escolhas[item.caminho] ?? "";
          const idCampo = `origem-${item.caminho}`;
          return (
            <div key={item.caminho} className="contents">
              <label htmlFor={idCampo} className="flex flex-wrap items-baseline gap-2 pt-2 sm:pt-0">
                <span>{item.rotulo}</span>
                <span className={rotuloFicha}>{ROTULOS_TIPO_ITEM[item.tipo]}</span>
              </label>
              <select
                id={idCampo}
                className={`${campoFicha} cursor-pointer ${escolhida ? "" : "text-texto/60"}`}
                value={escolhida}
                onChange={(evento) => aoAlterar(item.caminho, evento.target.value || null)}
              >
                <option value="">Começa vazio</option>
                {origensPossiveis(item, previa).map((origem) => (
                  <option key={origem.caminho} value={origem.caminho}>{origem.rotulo}</option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
