"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { alterarCamposFicha, obterFicha } from "@/src/repositories/fichasRepositorio";
import { assinarFicha } from "@/src/repositories/tempoRealMesaRepositorio";
import { aplicarCampos, type CamposAlterados } from "@/src/dominio/modeloFicha";
import type { DetalheFicha } from "@/src/dominio/ficha";

export type SituacaoGravacao = "salvo" | "pendente" | "salvando" | "erro";

export type AlterarCampo = (caminho: string, valor: unknown) => void;

export type EstadoFicha = {
  ficha: DetalheFicha | null;
  carregando: boolean;
  erros: string[];
  situacao: SituacaoGravacao;
  alterar: AlterarCampo;
};

const ESPERA_PARA_GRAVAR_MS = 400;
const PROTECAO_DA_EDICAO_LOCAL_MS = 1500;

export default function useFicha(mesaId: string, fichaId: string, ativo: boolean): EstadoFicha {
  const [ficha, setFicha] = useState<DetalheFicha | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erros, setErros] = useState<string[]>([]);
  const [situacao, setSituacao] = useState<SituacaoGravacao>("salvo");
  const pendentes = useRef<CamposAlterados>({});
  const editadosEm = useRef<Record<string, number>>({});
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);

  const carregar = useCallback(() => {
    void obterFicha(mesaId, fichaId).then((resultado) => {
      if (resultado.sucesso) {
        const comPendentes = { ...resultado.valor, conteudo: aplicarCampos(resultado.valor.conteudo, pendentes.current) };
        setFicha(comPendentes);
        setErros([]);
      } else {
        setFicha(null);
        setErros(resultado.erros);
      }
      setCarregando(false);
    });
  }, [mesaId, fichaId]);

  const enviar = useCallback(async () => {
    temporizador.current = null;
    const campos = pendentes.current;
    if (Object.keys(campos).length === 0) return;
    pendentes.current = {};
    setSituacao("salvando");
    const resultado = await alterarCamposFicha(mesaId, fichaId, campos);
    if (resultado.sucesso) {
      setSituacao(Object.keys(pendentes.current).length > 0 ? "pendente" : "salvo");
      return;
    }
    setErros(resultado.erros);
    setSituacao("erro");
    carregar();
  }, [mesaId, fichaId, carregar]);

  const receber = useCallback((campos: CamposAlterados) => {
    const agora = Date.now();
    const deFora = Object.fromEntries(
      Object.entries(campos).filter(([caminho]) =>
        !(caminho in pendentes.current) && agora - (editadosEm.current[caminho] ?? 0) > PROTECAO_DA_EDICAO_LOCAL_MS),
    );
    if (Object.keys(deFora).length === 0) return;
    setFicha((atual) => (atual ? { ...atual, conteudo: aplicarCampos(atual.conteudo, deFora) } : atual));
  }, []);

  useEffect(() => {
    if (!ativo) return;
    carregar();
    return assinarFicha(mesaId, fichaId, { aoAlterarCampos: receber, aoAtualizarFichas: carregar });
  }, [ativo, mesaId, fichaId, carregar, receber]);

  useEffect(() => () => {
    if (temporizador.current) {
      clearTimeout(temporizador.current);
      void enviar();
    }
  }, [enviar]);

  const alterar: AlterarCampo = (caminho, valor) => {
    pendentes.current = { ...pendentes.current, [caminho]: valor };
    editadosEm.current[caminho] = Date.now();
    setFicha((atual) => (atual ? { ...atual, conteudo: aplicarCampos(atual.conteudo, { [caminho]: valor }) } : atual));
    setSituacao("pendente");
    setErros([]);
    if (temporizador.current) clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => void enviar(), ESPERA_PARA_GRAVAR_MS);
  };

  return { ficha, carregando, erros, situacao, alterar };
}
