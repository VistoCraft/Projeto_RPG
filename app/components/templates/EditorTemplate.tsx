import { useState } from "react";
import { limparModelo } from "@/src/dominio/editorModelo";
import type { ModeloFicha } from "@/src/dominio/modeloFicha";
import type { TipoFicha } from "@/src/dominio/ficha";
import { TAMANHO_MAXIMO_DESCRICAO_TEMPLATE, TAMANHO_MAXIMO_NOME_TEMPLATE, type DadosTemplate } from "@/src/dominio/template";
import EditorModelosFicha from "./EditorModelosFicha";
import { EntradaTexto } from "./CamposEditor";
import ListaErros from "../formulario/ListaErros";
import { botaoCompacto } from "../estilos";

type EditorTemplateProps = {
  inicial: DadosTemplate;
  editavel: boolean;
  textoSalvar: string;
  aoSalvar: (dados: DadosTemplate) => Promise<string[]>;
};

export default function EditorTemplate({ inicial, editavel, textoSalvar, aoSalvar }: EditorTemplateProps) {
  const [dados, setDados] = useState(inicial);
  const [erros, setErros] = useState<string[]>([]);
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);

  const alterarModelo = (tipo: TipoFicha, novo: ModeloFicha) => {
    setSalvo(false);
    setDados((atual) => (tipo === "completa" ? { ...atual, modeloFicha: novo } : { ...atual, modeloFichaSimplificada: novo }));
  };

  const salvar = async () => {
    setSalvando(true);
    const errosDoServidor = await aoSalvar({
      ...dados,
      modeloFicha: limparModelo(dados.modeloFicha),
      modeloFichaSimplificada: limparModelo(dados.modeloFichaSimplificada),
    });
    setErros(errosDoServidor);
    setSalvo(errosDoServidor.length === 0);
    setSalvando(false);
  };

  const topo = (
    <>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto] lg:items-end">
        <EntradaTexto rotulo="Nome do template" valor={dados.nome} tamanhoMaximo={TAMANHO_MAXIMO_NOME_TEMPLATE} editavel={editavel} aoAlterar={(nome) => setDados({ ...dados, nome })} />
        <EntradaTexto rotulo="Descrição (opcional)" valor={dados.descricao} tamanhoMaximo={TAMANHO_MAXIMO_DESCRICAO_TEMPLATE} editavel={editavel} aoAlterar={(descricao) => setDados({ ...dados, descricao })} />
        {editavel && (
          <button type="button" className={botaoCompacto} disabled={salvando} onClick={() => void salvar()}>
            <i className="bi bi-floppy" aria-hidden="true"></i> {salvando ? "Salvando..." : textoSalvar}
          </button>
        )}
      </div>
      {salvo && <p role="status" className="text-sm font-semibold text-acento"><i className="bi bi-check2-circle" aria-hidden="true"></i> Template salvo.</p>}
      <ListaErros erros={erros} />
    </>
  );

  return (
    <EditorModelosFicha
      modelos={{ completa: dados.modeloFicha, simplificada: dados.modeloFichaSimplificada }}
      editavel={editavel}
      aoAlterar={alterarModelo}
      rotulo="Dados do template"
      topo={topo}
    />
  );
}
