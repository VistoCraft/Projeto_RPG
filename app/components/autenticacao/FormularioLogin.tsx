"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { entrar } from "@/src/repositories/autenticacaoRepositorio";
import useEnvioFormulario from "./useEnvioFormulario";
import CartaoFormulario from "./CartaoFormulario";
import CampoFormulario from "./CampoFormulario";
import { link } from "../estilos";

const ROTA_DEPOIS_DO_LOGIN = "/mesas";

export default function FormularioLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const envio = useEnvioFormulario(() => entrar({ email, senha }), () => router.push(ROTA_DEPOIS_DO_LOGIN));

  const rodape = (
    <>
      Ainda não tem conta? <Link className={link} href="/cadastro">Criar conta</Link>
    </>
  );

  return (
    <CartaoFormulario titulo="Entrar" textoBotao="Entrar" envio={envio} rodape={rodape}>
      <CampoFormulario id="email" nome="E-mail" tipo="email" valor={email} aoAlterar={setEmail} autoComplete="email" />
      <CampoFormulario id="senha" nome="Senha" tipo="password" valor={senha} aoAlterar={setSenha} autoComplete="current-password" />
    </CartaoFormulario>
  );
}
