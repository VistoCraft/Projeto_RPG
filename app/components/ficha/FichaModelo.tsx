import type { ContextoFormula } from "@/src/dominio/formula";
import type { ConteudoFicha, ModeloFicha } from "@/src/dominio/modeloFicha";
import type { AlterarCampo } from "./useFicha";
import DetalhesFicha from "./DetalhesFicha";
import BarrasFicha from "./BarrasFicha";
import AtributosFicha from "./AtributosFicha";
import CondicoesFicha from "./CondicoesFicha";
import PericiasFicha from "./PericiasFicha";
import CombateFicha from "./CombateFicha";

type FichaModeloProps = {
  modelo: ModeloFicha;
  conteudo: ConteudoFicha;
  editavel: boolean;
  aoAlterar: AlterarCampo;
};

function contextoDaFicha(conteudo: ConteudoFicha): ContextoFormula {
  return {
    valor: (id) => {
      if (id in conteudo.atributos) return conteudo.atributos[id];
      const detalhe = conteudo.detalhes[id];
      if (typeof detalhe === "number") return detalhe;
      if (id in conteudo.pericias) return conteudo.pericias[id].valor;
      if (id in conteudo.barras) return conteudo.barras[id].atual;
      return null;
    },
    treinada: (id) => conteudo.pericias[id]?.treinada === true,
  };
}

export default function FichaModelo({ modelo, conteudo, editavel, aoAlterar }: FichaModeloProps) {
  const contexto = contextoDaFicha(conteudo);
  const detalhes = modelo.detalhes ?? [];
  const barras = modelo.barras ?? [];
  const atributos = modelo.atributos ?? [];
  const condicoes = modelo.condicoes ?? [];
  const pericias = modelo.pericias ?? [];
  const colunas = modelo.combate?.colunas ?? [];
  const temColunaEsquerda = barras.length > 0 || atributos.length > 0 || condicoes.length > 0;

  return (
    <div className="flex flex-col gap-6">
      {detalhes.length > 0 && <DetalhesFicha campos={detalhes} valores={conteudo.detalhes} editavel={editavel} aoAlterar={aoAlterar} />}
      <div className={`grid items-start gap-6 ${temColunaEsquerda && pericias.length > 0 ? "xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] 2xl:grid-cols-[minmax(0,5fr)_minmax(0,4fr)]" : ""}`}>
        {temColunaEsquerda && (
          <div className="flex flex-col gap-6">
            {barras.length > 0 && <BarrasFicha barras={barras} valores={conteudo.barras} editavel={editavel} aoAlterar={aoAlterar} />}
            {atributos.length > 0 && (
              <AtributosFicha atributos={atributos} valores={conteudo.atributos} contexto={contexto} editavel={editavel} aoAlterar={aoAlterar} />
            )}
            {condicoes.length > 0 && <CondicoesFicha condicoes={condicoes} marcadas={conteudo.condicoes} editavel={editavel} aoAlterar={aoAlterar} />}
          </div>
        )}
        {pericias.length > 0 && (
          <PericiasFicha pericias={pericias} atributos={atributos} estados={conteudo.pericias} contexto={contexto} editavel={editavel} aoAlterar={aoAlterar} />
        )}
      </div>
      {colunas.length > 0 && <CombateFicha colunas={colunas} linhas={conteudo.combate} contexto={contexto} editavel={editavel} aoAlterar={aoAlterar} />}
    </div>
  );
}
