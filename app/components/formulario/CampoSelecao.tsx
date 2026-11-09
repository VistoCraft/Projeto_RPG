import type { Opcao } from "@/src/dominio/perfil";
import CaixaCampo, { classeCampo } from "./CaixaCampo";
import { grupoCampo, rotuloCampo } from "../estilos";

type CampoSelecaoProps = {
  id: string;
  nome: string;
  valor: string;
  aoAlterar: (valor: string) => void;
  opcoes: Opcao[];
  textoVazio: string;
  obrigatorio: boolean;
  autoComplete?: string;
  icone?: string;
};

export default function CampoSelecao({ id, nome, valor, aoAlterar, opcoes, textoVazio, obrigatorio, autoComplete, icone }: CampoSelecaoProps) {
  return (
    <div className={grupoCampo}>
      <label className={rotuloCampo} htmlFor={id}>{nome}</label>
      <CaixaCampo icone={icone} seta>
        <select
          className={`${classeCampo(icone, true)} cursor-pointer appearance-none ${valor ? "" : "text-texto/60"}`}
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
      </CaixaCampo>
    </div>
  );
}
