"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cadastrar } from "@/src/repositories/autenticacaoRepositorio";
import type { ResultadoAutenticacao } from "@/src/dominio/autenticacao";
import { IDADE_MINIMA, OPCOES_COMO_CONHECEU } from "@/src/dominio/perfil";
import useEnvioFormulario from "../formulario/useEnvioFormulario";
import usePaises from "./usePaises";
import CartaoFormulario from "../formulario/CartaoFormulario";
import CampoFormulario from "../formulario/CampoFormulario";
import CampoSelecao from "../formulario/CampoSelecao";
import CampoAceiteTermos from "./CampoAceiteTermos";
import { link } from "../estilos";

const ROTA_DEPOIS_DO_CADASTRO = "/mesas";

const DICA_APELIDO = "De 3 a 30 letras, números, \".\", \"_\" ou \"-\". É o nome que os outros jogadores veem.";
const DICA_SENHA = "Mínimo de 6 caracteres, com letra maiúscula, minúscula, número e símbolo.";
const DICA_NASCIMENTO = `É preciso ter ${IDADE_MINIMA} anos ou mais.`;

const MENSAGEM_SENHAS_DIFERENTES = "As senhas não são iguais.";

export default function FormularioCadastro() {
  const router = useRouter();
  const paises = usePaises();
  const [apelido, setApelido] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [pais, setPais] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [comoConheceu, setComoConheceu] = useState("");
  const [aceitouTermos, setAceitouTermos] = useState(false);

  const criarConta = async (): Promise<ResultadoAutenticacao> => {
    if (senha !== confirmacao) return { sucesso: false, erros: [MENSAGEM_SENHAS_DIFERENTES] };
    return cadastrar({ email, senha, apelido, pais, dataNascimento, comoConheceu: comoConheceu || null, aceitouTermos });
  };

  const envio = useEnvioFormulario(criarConta, () => router.push(ROTA_DEPOIS_DO_CADASTRO));

  const rodape = (
    <>
      Já tem conta? <Link className={link} href="/login">Entrar</Link>
    </>
  );

  return (
    <CartaoFormulario titulo="Criar conta" textoBotao="Criar conta" envio={envio} rodape={rodape}>
      <CampoFormulario id="apelido" nome="Nickname" tipo="text" valor={apelido} aoAlterar={setApelido} autoComplete="nickname" dica={DICA_APELIDO} />
      <CampoFormulario id="email" nome="E-mail" tipo="email" valor={email} aoAlterar={setEmail} autoComplete="email" />
      <CampoFormulario id="senha" nome="Senha" tipo="password" valor={senha} aoAlterar={setSenha} autoComplete="new-password" dica={DICA_SENHA} />
      <CampoFormulario id="confirmacao" nome="Confirmar senha" tipo="password" valor={confirmacao} aoAlterar={setConfirmacao} autoComplete="new-password" />
      <CampoSelecao id="pais" nome="País" valor={pais} aoAlterar={setPais} opcoes={paises} textoVazio="Escolha o país" obrigatorio autoComplete="country" />
      <CampoFormulario id="dataNascimento" nome="Data de nascimento" tipo="date" valor={dataNascimento} aoAlterar={setDataNascimento} autoComplete="bday" dica={DICA_NASCIMENTO} />
      <CampoSelecao id="comoConheceu" nome="Como conheceu o site? (opcional)" valor={comoConheceu} aoAlterar={setComoConheceu} opcoes={OPCOES_COMO_CONHECEU} textoVazio="Prefiro não dizer" obrigatorio={false} />
      <CampoAceiteTermos aceito={aceitouTermos} aoAlterar={setAceitouTermos} />
    </CartaoFormulario>
  );
}
