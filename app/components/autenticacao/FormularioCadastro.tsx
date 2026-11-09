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
import CampoBuscaSelecao from "../formulario/CampoBuscaSelecao";
import CampoDataSelecao from "../formulario/CampoDataSelecao";
import CampoAceiteTermos from "./CampoAceiteTermos";
import { link } from "../estilos";

const ROTA_DEPOIS_DO_CADASTRO = "/mesas";

const DICA_APELIDO = "De 3 a 30 letras, números, \".\", \"_\" ou \"-\". É o nome que os outros jogadores veem.";
const DICA_SENHA = "Mínimo de 6 caracteres, com letra maiúscula, minúscula, número e símbolo.";
const DICA_NASCIMENTO = `É preciso ter ${IDADE_MINIMA} anos ou mais.`;

const IDADE_MAXIMA_NA_LISTA = 110;
const ANOS_DE_NASCIMENTO = { minimo: IDADE_MINIMA, maximo: IDADE_MAXIMA_NA_LISTA };

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
      <div className="grid gap-x-8 md:grid-cols-2">
        <CampoFormulario id="apelido" nome="Nickname" tipo="text" valor={apelido} aoAlterar={setApelido} autoComplete="nickname" icone="person" dica={DICA_APELIDO} />
        <CampoFormulario id="email" nome="E-mail" tipo="email" valor={email} aoAlterar={setEmail} autoComplete="email" icone="envelope" />
        <CampoFormulario id="senha" nome="Senha" tipo="password" valor={senha} aoAlterar={setSenha} autoComplete="new-password" icone="lock" dica={DICA_SENHA} />
        <CampoFormulario id="confirmacao" nome="Confirmar senha" tipo="password" valor={confirmacao} aoAlterar={setConfirmacao} autoComplete="new-password" icone="shield-lock" />
        <CampoBuscaSelecao id="pais" nome="País" valor={pais} aoAlterar={setPais} opcoes={paises} textoAjuda="Digite para buscar o país" autoComplete="country-name" icone="globe2" />
        <CampoDataSelecao id="dataNascimento" nome="Data de nascimento" aoAlterar={setDataNascimento} anosAtras={ANOS_DE_NASCIMENTO} dica={DICA_NASCIMENTO} />
        <CampoSelecao id="comoConheceu" nome="Como conheceu o site? (opcional)" valor={comoConheceu} aoAlterar={setComoConheceu} opcoes={OPCOES_COMO_CONHECEU} textoVazio="Prefiro não dizer" obrigatorio={false} icone="compass" />
      </div>
      <CampoAceiteTermos aceito={aceitouTermos} aoAlterar={setAceitouTermos} />
    </CartaoFormulario>
  );
}
