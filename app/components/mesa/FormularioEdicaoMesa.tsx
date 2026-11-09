import { useState, type FormEvent } from "react";
import { atualizarMesa } from "@/src/repositories/mesasRepositorio";
import {
  OPCOES_VISIBILIDADE,
  TAMANHO_MAXIMO_DESCRICAO_MESA,
  visibilidadeDoValor,
  type DetalheMesa,
  type VisibilidadeMesa,
} from "@/src/dominio/mesa";
import type { EstadoMesa } from "./useMesa";
import CampoFormulario from "../formulario/CampoFormulario";
import CampoAreaTexto from "../formulario/CampoAreaTexto";
import CampoSelecao from "../formulario/CampoSelecao";
import ListaErros from "../formulario/ListaErros";
import { botaoContorno } from "../estilos";

type FormularioEdicaoMesaProps = {
  mesa: DetalheMesa;
  estado: EstadoMesa;
  aoFechar: () => void;
};

export default function FormularioEdicaoMesa({ mesa, estado, aoFechar }: FormularioEdicaoMesaProps) {
  const [nome, setNome] = useState(mesa.nome);
  const [descricao, setDescricao] = useState(mesa.descricao ?? "");
  const [visibilidade, setVisibilidade] = useState<VisibilidadeMesa>(mesa.visibilidade);
  const [erros, setErros] = useState<string[]>([]);
  const [salvando, setSalvando] = useState(false);
  const mudouAlgo = nome.trim() !== mesa.nome || (descricao.trim() || null) !== mesa.descricao || visibilidade !== mesa.visibilidade;

  const salvar = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setSalvando(true);
    setErros([]);
    const dados = { nome: nome.trim(), descricao: descricao.trim() || null, visibilidade, entradaBloqueada: mesa.entradaBloqueada };
    const resultado = await atualizarMesa(mesa.id, dados);
    setSalvando(false);
    if (!resultado.sucesso) {
      setErros(resultado.erros);
      return;
    }
    estado.substituir(resultado.valor);
    aoFechar();
  };

  return (
    <form className="flex flex-col rounded-md border border-borda p-4" onSubmit={(evento) => void salvar(evento)} aria-label="Editar dados da mesa">
      <CampoFormulario id="edicaoNome" nome="Nome da mesa" tipo="text" valor={nome} aoAlterar={setNome} autoComplete="off" />
      <CampoAreaTexto id="edicaoDescricao" nome="Descrição (opcional)" valor={descricao} aoAlterar={setDescricao} tamanhoMaximo={TAMANHO_MAXIMO_DESCRICAO_MESA} />
      <CampoSelecao
        id="edicaoVisibilidade"
        nome="Quem pode ver a mesa"
        valor={visibilidade}
        aoAlterar={(valor) => setVisibilidade(visibilidadeDoValor(valor))}
        opcoes={OPCOES_VISIBILIDADE}
        textoVazio="Escolha a visibilidade"
        obrigatorio
      />
      <ListaErros erros={erros} />
      <div className="flex justify-end gap-3">
        <button type="button" className={botaoContorno} onClick={aoFechar}>Cancelar</button>
        <button type="submit" className={botaoContorno} disabled={!mudouAlgo || salvando}>
          {salvando ? "Salvando..." : "Salvar alterações"}
        </button>
      </div>
    </form>
  );
}
