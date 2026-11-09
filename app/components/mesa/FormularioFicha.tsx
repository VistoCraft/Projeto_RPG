import { useState, type FormEvent } from "react";
import { OPCOES_TIPO_FICHA, tipoFichaDoValor, type DadosNovaFicha, type ResumoFicha, type TipoFicha } from "@/src/dominio/ficha";
import type { Participante } from "@/src/dominio/mesa";
import CampoFormulario from "../formulario/CampoFormulario";
import CampoSelecao from "../formulario/CampoSelecao";
import { botaoCompacto, botaoContorno } from "../estilos";

type FormularioFichaProps = {
  ficha: ResumoFicha | null;
  jogadores: Participante[];
  executando: boolean;
  aoSalvar: (dados: DadosNovaFicha) => Promise<boolean>;
  aoFechar: () => void;
};

const TIPO_PADRAO: TipoFicha = "completa";

export default function FormularioFicha({ ficha, jogadores, executando, aoSalvar, aoFechar }: FormularioFichaProps) {
  const [nome, setNome] = useState(ficha?.nome ?? "");
  const [tipo, setTipo] = useState<TipoFicha>(ficha?.tipo ?? TIPO_PADRAO);
  const [donoId, setDonoId] = useState(ficha?.donoId ?? "");
  const [visivel, setVisivel] = useState(ficha?.visivelParaJogadores ?? false);
  const opcoesJogador = jogadores.map((jogador) => ({ valor: jogador.usuarioId, rotulo: jogador.apelido }));
  const idPrefixo = ficha ? `ficha-${ficha.id}` : "nova-ficha";

  const salvar = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const salvou = await aoSalvar({ nome, tipo, donoId: donoId || null, visivelParaJogadores: visivel });
    if (salvou) aoFechar();
  };

  return (
    <form className="flex flex-col rounded-md border border-arcano/40 bg-fundo p-4" onSubmit={(evento) => void salvar(evento)} aria-label={ficha ? `Editar ${ficha.nome}` : "Nova ficha"}>
      <CampoFormulario id={`${idPrefixo}-nome`} nome="Nome do personagem" tipo="text" valor={nome} aoAlterar={setNome} autoComplete="off" icone="person-vcard" />
      {!ficha && (
        <CampoSelecao
          id={`${idPrefixo}-tipo`}
          nome="Tipo de ficha"
          valor={tipo}
          aoAlterar={(valor) => setTipo(tipoFichaDoValor(valor))}
          opcoes={OPCOES_TIPO_FICHA}
          textoVazio="Escolha o tipo"
          obrigatorio
          icone="layers"
        />
      )}
      <CampoSelecao
        id={`${idPrefixo}-jogador`}
        nome="Jogador"
        valor={donoId}
        aoAlterar={setDonoId}
        opcoes={opcoesJogador}
        textoVazio="Sem jogador (NPC do mestre)"
        obrigatorio={false}
        icone="person"
      />
      {jogadores.length === 0 && (
        <p className="-mt-3 mb-5 text-xs opacity-75">Só jogadores recebem fichas. Mude o papel da pessoa para Jogador em Participantes.</p>
      )}
      <label className="mb-5 flex cursor-pointer items-center gap-3 text-sm">
        <input className="h-4 w-4 cursor-pointer accent-arcano" type="checkbox" checked={visivel} onChange={(evento) => setVisivel(evento.target.checked)} />
        Os outros jogadores podem ver esta ficha
      </label>
      <div className="flex justify-end gap-3">
        <button type="button" className={botaoContorno} onClick={aoFechar}>Cancelar</button>
        <button type="submit" className={botaoCompacto} disabled={executando}>
          {executando ? "Salvando..." : ficha ? "Salvar" : "Criar ficha"}
        </button>
      </div>
    </form>
  );
}
