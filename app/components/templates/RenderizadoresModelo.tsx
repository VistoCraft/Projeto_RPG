import {
  corDoValor,
  numeroOuNulo,
  OPCOES_COR_BARRA,
  OPCOES_TIPO_CAMPO,
  OPCOES_TIPO_COLUNA,
  tipoCampoDoValor,
  tipoColunaDoValor,
} from "@/src/dominio/editorModelo";
import { avaliarFormula, descreverFormula, type ContextoFormula } from "@/src/dominio/formula";
import type { AtributoModelo, BarraModelo, CampoDetalhe, ColunaCombate, ModeloFicha } from "@/src/dominio/modeloFicha";
import type { AlterarItem } from "./ListaEditavel";
import { EntradaNumero, EntradaSelecao, EntradaTexto } from "./CamposEditor";

const grade = "grid gap-3 sm:grid-cols-2 xl:grid-cols-4";

export function contextoDeExemplo(modelo: ModeloFicha): ContextoFormula {
  const extras = modelo.secoesExtras ?? [];
  const valores = new Map<string, number>([
    ...(modelo.atributos ?? []).map((atributo): [string, number] => [atributo.id, atributo.padrao]),
    ...(modelo.detalhes ?? []).filter((campo) => campo.tipo === "numero").map((campo): [string, number] => [campo.id, campo.minimo ?? 0]),
    ...(modelo.pericias ?? []).map((pericia): [string, number] => [pericia.id, 0]),
    ...(modelo.barras ?? []).map((barra): [string, number] => [barra.id, barra.maximoPadrao]),
    ...extras.flatMap((secao) => (secao.valores ?? []).map((valor): [string, number] => [valor.id, valor.padrao])),
    ...extras.flatMap((secao) => (secao.barras ?? []).map((barra): [string, number] => [barra.id, barra.maximoPadrao])),
    ...extras.flatMap((secao) => (secao.campos ?? []).filter((campo) => campo.tipo === "numero").map((campo): [string, number] => [campo.id, campo.minimo ?? 0])),
  ]);
  return { valor: (id) => valores.get(id) ?? null, treinada: () => false };
}

export function DicaFormula({ formula, contexto }: { formula: string | null | undefined; contexto: ContextoFormula }) {
  if (!formula?.trim()) return null;
  const resultado = avaliarFormula(formula, contexto);
  return resultado ? (
    <span className="font-mono text-xs text-destaque">= {descreverFormula(resultado)} <span className="opacity-60">(com os valores padrão)</span></span>
  ) : (
    <span className="text-xs text-vida">Não consegui calcular: confira os ids e as funções.</span>
  );
}

export function LinhaCampo({ campo, mudar, editavel }: { campo: CampoDetalhe; mudar: AlterarItem<CampoDetalhe>; editavel: boolean }) {
  return (
    <div className={grade}>
      <EntradaSelecao rotulo="Tipo" valor={campo.tipo} opcoes={OPCOES_TIPO_CAMPO} editavel={editavel} aoAlterar={(tipo) => mudar({ tipo: tipoCampoDoValor(tipo) })} />
      {campo.tipo === "numero" && (
        <>
          <EntradaNumero rotulo="Mínimo" valor={campo.minimo} editavel={editavel} aoAlterar={(texto) => mudar({ minimo: numeroOuNulo(texto) })} />
          <EntradaNumero rotulo="Máximo" valor={campo.maximo} editavel={editavel} aoAlterar={(texto) => mudar({ maximo: numeroOuNulo(texto) })} />
        </>
      )}
      {campo.tipo === "lista" && (
        <EntradaTexto
          rotulo="Opções (separadas por vírgula)"
          classes="sm:col-span-2 xl:col-span-3"
          valor={(campo.opcoes ?? []).join(", ")}
          editavel={editavel}
          aoAlterar={(texto) => mudar({ opcoes: texto.split(",").map((opcao) => opcao.trimStart()) })}
        />
      )}
    </div>
  );
}

type LinhaValorProps = { valor: AtributoModelo; mudar: AlterarItem<AtributoModelo>; editavel: boolean; contexto: ContextoFormula };

export function LinhaValor({ valor, mudar, editavel, contexto }: LinhaValorProps) {
  return (
    <div className={grade}>
      <EntradaNumero rotulo="Mínimo" valor={valor.minimo} editavel={editavel} aoAlterar={(texto) => mudar({ minimo: numeroOuNulo(texto) ?? 0 })} />
      <EntradaNumero rotulo="Máximo" valor={valor.maximo} editavel={editavel} aoAlterar={(texto) => mudar({ maximo: numeroOuNulo(texto) ?? 0 })} />
      <EntradaNumero rotulo="Padrão" valor={valor.padrao} editavel={editavel} aoAlterar={(texto) => mudar({ padrao: numeroOuNulo(texto) ?? 0 })} />
      <EntradaTexto
        rotulo="Rolagem"
        monoespacada
        valor={valor.rolagem ?? ""}
        editavel={editavel}
        aoAlterar={(rolagem) => mudar({ rolagem: rolagem || null })}
        dica={<DicaFormula formula={valor.rolagem} contexto={contexto} />}
      />
    </div>
  );
}

export function LinhaBarra({ barra, mudar, editavel }: { barra: BarraModelo; mudar: AlterarItem<BarraModelo>; editavel: boolean }) {
  return (
    <div className={grade}>
      <EntradaSelecao rotulo="Cor" valor={barra.cor} opcoes={OPCOES_COR_BARRA} editavel={editavel} aoAlterar={(cor) => mudar({ cor: corDoValor(cor) })} />
      <EntradaNumero rotulo="Máximo padrão" valor={barra.maximoPadrao} editavel={editavel} aoAlterar={(texto) => mudar({ maximoPadrao: numeroOuNulo(texto) ?? 1 })} />
    </div>
  );
}

export function LinhaColuna({ coluna, mudar, editavel }: { coluna: ColunaCombate; mudar: AlterarItem<ColunaCombate>; editavel: boolean }) {
  return (
    <div className={grade}>
      <EntradaSelecao rotulo="Tipo" valor={coluna.tipo} opcoes={OPCOES_TIPO_COLUNA} editavel={editavel} aoAlterar={(tipo) => mudar({ tipo: tipoColunaDoValor(tipo) })} />
    </div>
  );
}
