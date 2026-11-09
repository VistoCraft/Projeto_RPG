import { campoLinha, rotulo } from "../estilos";

type CampoAreaTextoProps = {
  id: string;
  nome: string;
  valor: string;
  aoAlterar: (valor: string) => void;
  tamanhoMaximo: number;
};

export default function CampoAreaTexto({ id, nome, valor, aoAlterar, tamanhoMaximo }: CampoAreaTextoProps) {
  return (
    <div className="flex flex-col">
      <label className={rotulo} htmlFor={id}>{nome}</label>
      <textarea
        className={`${campoLinha} min-h-24 w-full resize-y`}
        id={id}
        name={id}
        value={valor}
        maxLength={tamanhoMaximo}
        onChange={(evento) => aoAlterar(evento.target.value)}
      />
      <p className="-mt-2 mb-[15px] text-right text-xs opacity-70">{valor.length}/{tamanhoMaximo}</p>
    </div>
  );
}
