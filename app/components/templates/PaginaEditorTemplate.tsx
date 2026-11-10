"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { atualizarTemplate, criarTemplate, obterTemplate } from "@/src/repositories/templatesRepositorio";
import { MODELO_VAZIO } from "@/src/dominio/editorModelo";
import type { DadosTemplate, DetalheTemplate } from "@/src/dominio/template";
import useTema from "../useTema";
import useSessao from "../useSessao";
import CabecalhoSite from "../CabecalhoSite";
import FaixaPagina from "../FaixaPagina";
import AvisoLogin from "../AvisoLogin";
import ListaErros from "../formulario/ListaErros";
import EditorTemplate from "./EditorTemplate";
import { chamadaSecundaria, conteudoPagina } from "../estilos";

type PaginaEditorTemplateProps =
  | { modo: "novo"; baseId: string | null }
  | { modo: "existente"; templateId: string };

const NOVO_EM_BRANCO: DadosTemplate = { nome: "", descricao: "", modeloFicha: MODELO_VAZIO, modeloFichaSimplificada: MODELO_VAZIO };

function copiaDe(base: DetalheTemplate): DadosTemplate {
  return { nome: `Cópia de ${base.nome}`.slice(0, 80), descricao: "", modeloFicha: base.modeloFicha, modeloFichaSimplificada: base.modeloFichaSimplificada };
}

function paraDados(template: DetalheTemplate): DadosTemplate {
  return { nome: template.nome, descricao: template.descricao ?? "", modeloFicha: template.modeloFicha, modeloFichaSimplificada: template.modeloFichaSimplificada };
}

export default function PaginaEditorTemplate(props: PaginaEditorTemplateProps) {
  const [tema, alternarTema] = useTema();
  const sessao = useSessao();
  const router = useRouter();
  const { estado } = sessao.sessao;
  const idParaCarregar = props.modo === "novo" ? props.baseId : props.templateId;
  const [template, setTemplate] = useState<DetalheTemplate | null>(null);
  const [erros, setErros] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(idParaCarregar !== null);

  useEffect(() => {
    if (estado === "carregando" || !idParaCarregar) return;
    let ativo = true;
    void obterTemplate(idParaCarregar).then((resultado) => {
      if (!ativo) return;
      if (resultado.sucesso) setTemplate(resultado.valor);
      else setErros(resultado.erros);
      setCarregando(false);
    });
    return () => {
      ativo = false;
    };
  }, [estado, idParaCarregar]);

  const novo = props.modo === "novo";
  const editavel = estado === "logado" && (novo || Boolean(template?.podeEditar));
  const inicial = novo ? (template ? copiaDe(template) : NOVO_EM_BRANCO) : template ? paraDados(template) : null;

  const salvar = async (dados: DadosTemplate): Promise<string[]> => {
    if (novo) {
      const resultado = await criarTemplate(dados);
      if (resultado.sucesso) router.replace(`/templates/${resultado.valor.id}`);
      return resultado.sucesso ? [] : resultado.erros;
    }
    const resultado = await atualizarTemplate(props.templateId, dados);
    return resultado.sucesso ? [] : resultado.erros;
  };

  const titulo = novo ? "Novo template" : template?.nome ?? "Template";
  const rotulo = (
    <Link className="flex items-center gap-1 opacity-85 hover:underline hover:opacity-100" href="/templates">
      <i className="bi bi-arrow-left" aria-hidden="true"></i> Templates
    </Link>
  );

  return (
    <>
      <CabecalhoSite tema={tema} alternarTema={alternarTema} sessao={sessao} />
      <main className="flex flex-1 flex-col">
        <FaixaPagina rotulo={rotulo} titulo={titulo} descricao={template && !editavel ? "Template padrão do site, só para leitura." : undefined}>
          {template && !editavel && estado === "logado" && (
            <Link className={chamadaSecundaria} href={`/templates/novo?base=${template.id}`}>
              <i className="bi bi-copy" aria-hidden="true"></i> Criar cópia para editar
            </Link>
          )}
        </FaixaPagina>
        <div className={`${conteudoPagina} flex flex-1 flex-col gap-6 py-8`}>
          {novo && estado === "visitante" && (
            <div className="mx-auto w-full max-w-md py-10">
              <AvisoLogin mensagem="Entre na sua conta para criar templates." />
            </div>
          )}
          <ListaErros erros={erros} />
          {carregando && <p className="py-16 text-center opacity-80">Carregando template...</p>}
          {!carregando && inicial && (estado === "logado" || !novo) && (
            <EditorTemplate key={template?.id ?? "novo"} inicial={inicial} editavel={editavel} textoSalvar={novo ? "Criar template" : "Salvar"} aoSalvar={salvar} />
          )}
        </div>
      </main>
    </>
  );
}
