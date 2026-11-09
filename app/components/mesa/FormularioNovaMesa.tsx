import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { criarMesa } from "@/src/repositories/mesasRepositorio";
import { OPCOES_VISIBILIDADE, TAMANHO_MAXIMO_DESCRICAO_MESA, visibilidadeDoValor, type VisibilidadeMesa } from "@/src/dominio/mesa";
import type { Opcao } from "@/src/dominio/perfil";
import useTemplates from "./useTemplates";
import useEnvioFormulario from "../formulario/useEnvioFormulario";
import CartaoFormulario from "../formulario/CartaoFormulario";
import CampoFormulario from "../formulario/CampoFormulario";
import CampoAreaTexto from "../formulario/CampoAreaTexto";
import CampoSelecao from "../formulario/CampoSelecao";
import { link } from "../estilos";

export default function FormularioNovaMesa() {
  const router = useRouter();
  const templates = useTemplates();
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [visibilidade, setVisibilidade] = useState<VisibilidadeMesa>("publica");

  const opcoesTemplate: Opcao[] = templates.map((template) => ({
    valor: template.id,
    rotulo: template.padrao ? template.nome : `${template.nome} (meu template)`,
  }));

  const envio = useEnvioFormulario(
    () => criarMesa({ nome, descricao, templateId, visibilidade }),
    (resultado) => router.push(`/mesas/${resultado.valor.id}`),
  );

  const rodape = <Link className={link} href="/mesas">Voltar para as mesas</Link>;

  return (
    <CartaoFormulario titulo="Criar mesa" textoBotao="Criar mesa" envio={envio} rodape={rodape}>
      <CampoFormulario id="nome" nome="Nome da mesa" tipo="text" valor={nome} aoAlterar={setNome} autoComplete="off" icone="dice-5" />
      <CampoAreaTexto id="descricao" nome="Descrição (opcional)" valor={descricao} aoAlterar={setDescricao} tamanhoMaximo={TAMANHO_MAXIMO_DESCRICAO_MESA} />
      <CampoSelecao id="template" nome="Template de ficha" valor={templateId} aoAlterar={setTemplateId} opcoes={opcoesTemplate} textoVazio="Escolha o template" obrigatorio icone="file-earmark-text" />
      <CampoSelecao
        id="visibilidade"
        nome="Quem pode ver a mesa"
        valor={visibilidade}
        aoAlterar={(valor) => setVisibilidade(visibilidadeDoValor(valor))}
        opcoes={OPCOES_VISIBILIDADE}
        textoVazio="Escolha a visibilidade"
        icone="eye"
        obrigatorio
      />
    </CartaoFormulario>
  );
}
