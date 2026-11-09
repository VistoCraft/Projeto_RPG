import type { Opcao } from "@/src/dominio/perfil";
import { campoLinha, rotulo } from "../estilos";

type CampoSelecaoProps = {
  id: string;
  nome: string;
  valor: string;
  aoAlterar: (valor: string) => void;
  opcoes: Opcao[];
  textoVazio: string;
  obrigatorio: boolean;
  autoComplete?: string;
};

export default function CampoSelecao({ id, nome, valor, aoAlterar, opcoes, textoVazio, obrigatorio, autoComplete }: CampoSelecaoProps) {
  return (
    <div className="flex flex-col">
      <label className={rotulo} htmlFor={id}>{nome}</label>
      <select
        className={`${campoLinha} w-full`}
        id={id}
        name={id}
        value={valor}
        onChange={(evento) => aoAlterar(evento.target.value)}
        autoComplete={autoComplete}
        required={obrigatorio}
      >
        <option value="">{textoVazio}</option>
        {opcoes.map((opcao) => <option key={opcao.valor} value={opcao.valor}>{opcao.rotulo}</option>)}
      </select>
    </div>
  );
}
