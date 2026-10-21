import { campoLinha, rotulo } from "../estilos";

type CampoFormularioProps = {
  id: string;
  nome: string;
  tipo: "email" | "password";
  valor: string;
  aoAlterar: (valor: string) => void;
  autoComplete: string;
  dica?: string;
};

export default function CampoFormulario({ id, nome, tipo, valor, aoAlterar, autoComplete, dica }: CampoFormularioProps) {
  const idDica = `${id}-dica`;

  return (
    <div className="flex flex-col">
      <label className={rotulo} htmlFor={id}>{nome}</label>
      <input
        className={`${campoLinha} w-full`}
        type={tipo}
        id={id}
        name={id}
        value={valor}
        onChange={(evento) => aoAlterar(evento.target.value)}
        autoComplete={autoComplete}
        aria-describedby={dica ? idDica : undefined}
        required
      />
      {dica && <p id={idDica} className="-mt-2 mb-[15px] text-sm opacity-80">{dica}</p>}
    </div>
  );
}
