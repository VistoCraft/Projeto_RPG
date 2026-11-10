import { useState } from "react";
import { limparModelo } from "@/src/dominio/editorModelo";
import { normalizarConteudo, type ModeloFicha } from "@/src/dominio/modeloFicha";
import { TAMANHO_MAXIMO_DESCRICAO_TEMPLATE, TAMANHO_MAXIMO_NOME_TEMPLATE, type DadosTemplate } from "@/src/dominio/template";
import EditorModelo from "./EditorModelo";
import { EntradaTexto } from "./CamposEditor";
import FichaModelo from "../ficha/FichaModelo";
import ListaErros from "../formulario/ListaErros";
import { botaoCompacto, cartao, rotuloFicha, tituloPainel } from "../estilos";

type Aba = "completa" | "simplificada";

type EditorTemplateProps = {
  inicial: DadosTemplate;
  editavel: boolean;
  textoSalvar: string;
  aoSalvar: (dados: DadosTemplate) => Promise<string[]>;
};

const ABAS: { aba: Aba; rotulo: string; dica: string }[] = [
  { aba: "completa", rotulo: "Ficha completa", dica: "Personagens dos jogadores e NPCs importantes" },
  { aba: "simplificada", rotulo: "Ficha simplificada", dica: "Pets, montarias e NPCs de apoio" },
];

const semAlteracao = () => undefined;

export default function EditorTemplate({ inicial, editavel, textoSalvar, aoSalvar }: EditorTemplateProps) {
  const [dados, setDados] = useState(inicial);
  const [aba, setAba] = useState<Aba>("completa");
  const [erros, setErros] = useState<string[]>([]);
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const modelo = aba === "completa" ? dados.modeloFicha : dados.modeloFichaSimplificada;

  const alterarModelo = (novo: ModeloFicha) => {
    setSalvo(false);
    setDados((atual) => (aba === "completa" ? { ...atual, modeloFicha: novo } : { ...atual, modeloFichaSimplificada: novo }));
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

  return (
    <div className="flex flex-col gap-6">
      <section className={`${cartao} flex flex-col gap-4`} aria-label="Dados do template">
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
        <div role="tablist" aria-label="Modelos do template" className="grid gap-2 sm:grid-cols-2">
          {ABAS.map((item) => (
            <button
              key={item.aba}
              type="button"
              role="tab"
              aria-selected={aba === item.aba}
              onClick={() => setAba(item.aba)}
              className={`flex cursor-pointer flex-col items-start rounded-md border px-4 py-2 text-left transition-colors ${
                aba === item.aba ? "border-arcano bg-arcano/15" : "border-borda hover:border-arcano/60"
              }`}
            >
              <span className="font-semibold">{item.rotulo}</span>
              <span className={rotuloFicha}>{item.dica}</span>
            </button>
          ))}
        </div>
      </section>
      <div className={`grid items-start gap-6 ${editavel ? "2xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]" : ""}`}>
        {editavel && <EditorModelo key={aba} modelo={modelo} editavel={editavel} aoAlterar={alterarModelo} />}
        <section aria-labelledby="titulo-previa" className="flex flex-col gap-3 2xl:sticky 2xl:top-24">
          <h2 id="titulo-previa" className={tituloPainel}>
            <i className="bi bi-eye text-destaque" aria-hidden="true"></i> Prévia da ficha {aba === "completa" ? "completa" : "simplificada"}
          </h2>
          <FichaModelo modelo={modelo} conteudo={normalizarConteudo({}, modelo)} editavel={false} aoAlterar={semAlteracao} />
        </section>
      </div>
    </div>
  );
}
