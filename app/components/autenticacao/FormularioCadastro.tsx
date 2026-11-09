"use client";

import { useState } from "react";
import Link from "next/link";
import { cadastrar, entrar } from "@/src/repositories/autenticacaoRepositorio";
import type { ResultadoAutenticacao } from "@/src/dominio/autenticacao";
import useEnvioFormulario from "./useEnvioFormulario";
import CartaoFormulario from "./CartaoFormulario";
import CampoFormulario from "./CampoFormulario";
import { link } from "../estilos";

const DICA_SENHA = "Mínimo de 6 caracteres, com letra maiúscula, minúscula, número e símbolo.";

const MENSAGEM_SENHAS_DIFERENTES = "As senhas não são iguais.";
const MENSAGEM_SUCESSO = "Conta criada e login feito com sucesso.";

export default function FormularioCadastro() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");

  const cadastrarEEntrar = async (): Promise<ResultadoAutenticacao> => {
    if (senha !== confirmacao) return { sucesso: false, erros: [MENSAGEM_SENHAS_DIFERENTES] };
    const cadastro = await cadastrar({ email, senha });
    return cadastro.sucesso ? entrar({ email, senha }) : cadastro;
  };

  const envio = useEnvioFormulario(cadastrarEEntrar);

  const rodape = (
    <>
      Já tem conta? <Link className={link} href="/login">Entrar</Link>
    </>
  );

  return (
    <CartaoFormulario titulo="Criar conta" textoBotao="Criar conta" mensagemSucesso={MENSAGEM_SUCESSO} envio={envio} rodape={rodape}>
      <CampoFormulario id="email" nome="E-mail" tipo="email" valor={email} aoAlterar={setEmail} autoComplete="email" />
      <CampoFormulario id="senha" nome="Senha" tipo="password" valor={senha} aoAlterar={setSenha} autoComplete="new-password" dica={DICA_SENHA} />
      <CampoFormulario id="confirmacao" nome="Confirmar senha" tipo="password" valor={confirmacao} aoAlterar={setConfirmacao} autoComplete="new-password" />
    </CartaoFormulario>
  );
}
