import { classeCampo } from "./CaixaCampo";
import { dicaCampo, grupoCampo, rotuloCampo } from "../estilos";

type CampoAreaTextoProps = {
  id: string;
  nome: string;
  valor: string;
  aoAlterar: (valor: string) => void;
  tamanhoMaximo: number;
};

export default function CampoAreaTexto({ id, nome, valor, aoAlterar, tamanhoMaximo }: CampoAreaTextoProps) {
  return (
    <div className={grupoCampo}>
      <label className={rotuloCampo} htmlFor={id}>{nome}</label>
      <textarea
        className={`${classeCampo()} min-h-24 resize-y`}
        id={id}
        name={id}
        value={valor}
        maxLength={tamanhoMaximo}
        onChange={(evento) => aoAlterar(evento.target.value)}
      />
      <p className={`${dicaCampo} text-right tabular-nums`}>{valor.length}/{tamanhoMaximo}</p>
    </div>
  );
}
