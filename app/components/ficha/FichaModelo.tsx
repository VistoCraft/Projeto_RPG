import type { ReactNode } from "react";
import type { ContextoFormula } from "@/src/dominio/formula";
import { DIVISOES, ICONES_FORMATO, layoutParaExibir, secoesDisponiveis, type SecaoFichaId } from "@/src/dominio/layoutFicha";
import { lerSecaoExtra, type ConteudoFicha, type ModeloFicha, type SecaoExtra } from "@/src/dominio/modeloFicha";
import type { AlterarCampo } from "./useFicha";
import { aparenciaDaSecao, atributosDaFicha, atributosDaSecao, estiloCompleto } from "@/src/dominio/estiloFicha";
import { AparenciaSecaoContexto, type IdentidadeSecao } from "./SecaoFicha";
import DetalhesFicha from "./DetalhesFicha";
import BarrasFicha from "./BarrasFicha";
import AtributosFicha from "./AtributosFicha";
import CondicoesFicha from "./CondicoesFicha";
import PericiasFicha from "./PericiasFicha";
import CombateFicha from "./CombateFicha";
import AnotacoesFicha from "./AnotacoesFicha";

type FichaModeloProps = {
  modelo: ModeloFicha;
  conteudo: ConteudoFicha;
  editavel: boolean;
  aoAlterar: AlterarCampo;
};

const PADRAO = {
  detalhes: { id: "detalhes", titulo: "Detalhes", icone: "bi-person-lines-fill", caminho: "detalhes" },
  barras: { id: "barras", titulo: "Status", icone: "bi-heart-pulse", caminho: "barras" },
  atributos: { id: "atributos", titulo: "Atributos", icone: "bi-lightning-charge", caminho: "atributos" },
  condicoes: { id: "condicoes", titulo: "Condições", icone: "bi-exclamation-diamond", caminho: "condicoes" },
  combate: { id: "combate", titulo: "Ataques", icone: "bi-crosshair", caminho: "combate" },
} satisfies Record<string, IdentidadeSecao>;

function valoresNumericosExtras(modelo: ModeloFicha, conteudo: ConteudoFicha): Map<string, number> {
  const valores = new Map<string, number>();
  for (const secao of modelo.secoesExtras ?? []) {
    const lido = lerSecaoExtra(conteudo, secao);
    if (lido.formato === "valores") Object.entries(lido.valor).forEach(([id, valor]) => valores.set(id, valor));
    if (lido.formato === "barras") Object.entries(lido.valor).forEach(([id, valor]) => valores.set(id, valor.atual));
    if (lido.formato === "campos") Object.entries(lido.valor).forEach(([id, valor]) => typeof valor === "number" && valores.set(id, valor));
  }
  return valores;
}

function contextoDaFicha(modelo: ModeloFicha, conteudo: ConteudoFicha): ContextoFormula {
  const extras = valoresNumericosExtras(modelo, conteudo);
  return {
    valor: (id) => {
      if (id in conteudo.atributos) return conteudo.atributos[id];
      const detalhe = conteudo.detalhes[id];
      if (typeof detalhe === "number") return detalhe;
      if (id in conteudo.pericias) return conteudo.pericias[id].valor;
      if (id in conteudo.barras) return conteudo.barras[id].atual;
      return extras.get(id) ?? null;
    },
    treinada: (id) => conteudo.pericias[id]?.treinada === true,
  };
}

export default function FichaModelo({ modelo, conteudo, editavel, aoAlterar }: FichaModeloProps) {
  const contexto = contextoDaFicha(modelo, conteudo);
  const comum = { editavel, aoAlterar };
  const detalhes = modelo.detalhes ?? [];
  const barras = modelo.barras ?? [];
  const atributos = modelo.atributos ?? [];
  const condicoes = modelo.condicoes ?? [];
  const pericias = modelo.pericias ?? [];
  const colunas = modelo.combate?.colunas ?? [];

  const extra = (secao: SecaoExtra): ReactNode => {
    const identidade = { id: secao.id, titulo: secao.rotulo, icone: ICONES_FORMATO[secao.formato], caminho: `extras.${secao.id}` };
    const lido = lerSecaoExtra(conteudo, secao);
    switch (lido.formato) {
      case "campos":
        return (secao.campos ?? []).length > 0 && <DetalhesFicha secao={identidade} campos={secao.campos ?? []} valores={lido.valor} {...comum} />;
      case "valores":
        return (secao.valores ?? []).length > 0 && (
          <AtributosFicha secao={identidade} atributos={secao.valores ?? []} valores={lido.valor} contexto={contexto} {...comum} />
        );
      case "barras":
        return (secao.barras ?? []).length > 0 && <BarrasFicha secao={identidade} barras={secao.barras ?? []} valores={lido.valor} {...comum} />;
      case "marcadores":
        return (secao.marcadores ?? []).length > 0 && (
          <CondicoesFicha secao={identidade} condicoes={secao.marcadores ?? []} marcadas={lido.valor} tom="neutro" {...comum} />
        );
      case "tabela":
        return (secao.colunas ?? []).length > 0 && (
          <CombateFicha secao={identidade} rotuloLinha="linha" colunas={secao.colunas ?? []} linhas={lido.valor} contexto={contexto} {...comum} />
        );
      case "anotacoes":
        return <AnotacoesFicha secao={identidade} texto={lido.valor} {...comum} />;
    }
  };

  const secoes: Record<SecaoFichaId, ReactNode> = {
    detalhes: detalhes.length > 0 && <DetalhesFicha secao={PADRAO.detalhes} campos={detalhes} valores={conteudo.detalhes} {...comum} />,
    barras: barras.length > 0 && <BarrasFicha secao={PADRAO.barras} barras={barras} valores={conteudo.barras} {...comum} />,
    atributos: atributos.length > 0 && (
      <AtributosFicha secao={PADRAO.atributos} atributos={atributos} valores={conteudo.atributos} contexto={contexto} {...comum} />
    ),
    condicoes: condicoes.length > 0 && <CondicoesFicha secao={PADRAO.condicoes} condicoes={condicoes} marcadas={conteudo.condicoes} {...comum} />,
    pericias: pericias.length > 0 && (
      <PericiasFicha pericias={pericias} atributos={atributos} estados={conteudo.pericias} contexto={contexto} {...comum} />
    ),
    combate: colunas.length > 0 && (
      <CombateFicha secao={PADRAO.combate} rotuloLinha="ataque" colunas={colunas} linhas={conteudo.combate} contexto={contexto} {...comum} />
    ),
    ...Object.fromEntries((modelo.secoesExtras ?? []).map((secao) => [secao.id, extra(secao)])),
  };

  const linhas = layoutParaExibir(modelo.layout, secoesDisponiveis(modelo)).linhas
    .map((linha) => ({ ...linha, colunas: linha.colunas.map((coluna) => coluna.filter((secao) => secoes[secao])) }))
    .filter((linha) => linha.colunas.some((coluna) => coluna.length > 0));

  const comMoldura = estiloCompleto(modelo.estilo).tema !== "padrao";
  const moldura = comMoldura ? "rounded-2xl border border-borda bg-fundo p-4 text-texto sm:p-6" : "";

  return (
    <div {...atributosDaFicha(modelo.estilo)} className={`flex flex-col gap-6 font-texto ${moldura}`}>
      {linhas.map((linha, indice) => {
        const comConteudo = linha.colunas.filter((coluna) => coluna.length > 0);
        const grade = comConteudo.length > 1 ? DIVISOES[linha.divisao].ficha : "";
        const colunasExibidas = comConteudo.length > 1 ? linha.colunas : comConteudo;
        return (
          <div key={indice} className={`grid items-start gap-6 ${grade}`}>
            {colunasExibidas.map((coluna, posicao) => (
              <div key={posicao} className="flex min-w-0 flex-col gap-6">
                {coluna.map((secao) => {
                  const aparencia = aparenciaDaSecao(modelo.estilo, secao);
                  return (
                    <AparenciaSecaoContexto.Provider key={secao} value={aparencia}>
                      <div {...atributosDaSecao(aparencia.cor)}>{secoes[secao]}</div>
                    </AparenciaSecaoContexto.Provider>
                  );
                })}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
