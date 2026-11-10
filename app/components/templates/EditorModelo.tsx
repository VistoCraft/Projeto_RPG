import { idsDoModelo, NOVOS_ITENS, renomearId, type Renomeacao } from "@/src/dominio/editorModelo";
import type { ModeloFicha } from "@/src/dominio/modeloFicha";
import { layoutParaEditar } from "@/src/dominio/layoutFicha";
import ListaEditavel from "./ListaEditavel";
import EditorLayout from "./EditorLayout";
import EditorSecoesExtras from "./EditorSecoesExtras";
import EditorEstilo from "./EditorEstilo";
import { EntradaSelecao, EntradaTexto } from "./CamposEditor";
import { contextoDeExemplo, DicaFormula, LinhaBarra, LinhaCampo, LinhaColuna, LinhaValor } from "./RenderizadoresModelo";

type EditorModeloProps = {
  modelo: ModeloFicha;
  editavel: boolean;
  aoAlterar: (modelo: ModeloFicha) => void;
};

export default function EditorModelo({ modelo, editavel, aoAlterar }: EditorModeloProps) {
  const idsUsados = idsDoModelo(modelo);
  const contexto = contextoDeExemplo(modelo);
  const opcoesAtributo = (modelo.atributos ?? []).map((atributo) => ({ valor: atributo.id, rotulo: atributo.rotulo }));
  const alterar = (parcial: Partial<ModeloFicha>, renomeacao?: Renomeacao) => {
    const novo = { ...modelo, ...parcial };
    aoAlterar(renomeacao ? renomearId(novo, renomeacao) : novo);
  };
  const comum = { idsUsados, editavel };

  return (
    <div className="flex flex-col gap-6">
      <EditorLayout layout={layoutParaEditar(modelo.layout)} modelo={modelo} editavel={editavel} aoAlterar={(layout) => alterar({ layout })} />
      <EditorEstilo modelo={modelo} editavel={editavel} aoAlterar={(estilo) => alterar({ estilo })} />
      <EditorSecoesExtras modelo={modelo} editavel={editavel} aoAlterar={aoAlterar} />
      <ListaEditavel
        {...comum}
        id="detalhes"
        titulo="Detalhes"
        icone="bi-person-lines-fill"
        descricao="Campos de identificação: nome, classe, nível... Um campo com id “nome” recebe o nome do personagem."
        itens={modelo.detalhes ?? []}
        novoItem={NOVOS_ITENS.detalhe}
        aoAlterar={(detalhes, renomeacao) => alterar({ detalhes }, renomeacao)}
        renderizar={(campo, mudar) => <LinhaCampo campo={campo} mudar={mudar} editavel={editavel} />}
      />
      <ListaEditavel
        {...comum}
        id="atributos"
        titulo="Atributos"
        icone="bi-lightning-charge"
        descricao="Valores principais. A fórmula de rolagem pode usar ids do modelo e as funções mod, piso, teto, max, min, dados e treinada."
        itens={modelo.atributos ?? []}
        novoItem={NOVOS_ITENS.atributo}
        aoAlterar={(atributos, renomeacao) => alterar({ atributos }, renomeacao)}
        renderizar={(atributo, mudar) => <LinhaValor valor={atributo} mudar={mudar} editavel={editavel} contexto={contexto} />}
      />
      <ListaEditavel
        {...comum}
        id="pericias"
        titulo="Perícias"
        icone="bi-list-check"
        descricao="Cada perícia pode ser marcada como treinada na ficha; use treinada(id) na fórmula para somar o bônus."
        itens={modelo.pericias ?? []}
        novoItem={NOVOS_ITENS.pericia}
        aoAlterar={(pericias, renomeacao) => alterar({ pericias }, renomeacao)}
        renderizar={(pericia, mudar) => (
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <EntradaSelecao rotulo="Atributo" valor={pericia.atributo ?? ""} opcoes={opcoesAtributo} textoVazio="Nenhum" editavel={editavel} aoAlterar={(atributo) => mudar({ atributo: atributo || null })} />
            <EntradaTexto
              rotulo="Rolagem"
              monoespacada
              valor={pericia.rolagem ?? ""}
              editavel={editavel}
              aoAlterar={(rolagem) => mudar({ rolagem: rolagem || null })}
              dica={<DicaFormula formula={pericia.rolagem} contexto={contexto} />}
            />
          </div>
        )}
      />
      <ListaEditavel
        {...comum}
        id="barras"
        titulo="Barras de status"
        icone="bi-heart-pulse"
        descricao="Pontos de vida, sanidade, mana... Cada uma tem atual e máximo na ficha."
        itens={modelo.barras ?? []}
        novoItem={NOVOS_ITENS.barra}
        aoAlterar={(barras, renomeacao) => alterar({ barras }, renomeacao)}
        renderizar={(barra, mudar) => <LinhaBarra barra={barra} mudar={mudar} editavel={editavel} />}
      />
      <ListaEditavel
        {...comum}
        id="condicoes"
        titulo="Condições"
        icone="bi-exclamation-diamond"
        descricao="Estados que se marcam e desmarcam na ficha (envenenado, caído...)."
        itens={modelo.condicoes ?? []}
        novoItem={NOVOS_ITENS.condicao}
        aoAlterar={(condicoes, renomeacao) => alterar({ condicoes }, renomeacao)}
        renderizar={() => null}
      />
      <ListaEditavel
        {...comum}
        id="colunas"
        titulo="Colunas da tabela de ataques"
        icone="bi-crosshair"
        descricao="Colunas de cada linha de ataque. Coluna de rolagem mostra o resultado da fórmula digitada."
        itens={modelo.combate?.colunas ?? []}
        novoItem={NOVOS_ITENS.coluna}
        aoAlterar={(colunas, renomeacao) => alterar({ combate: { colunas } }, renomeacao)}
        renderizar={(coluna, mudar) => <LinhaColuna coluna={coluna} mudar={mudar} editavel={editavel} />}
      />
    </div>
  );
}
