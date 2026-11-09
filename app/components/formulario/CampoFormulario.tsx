import { useState } from "react";
import CaixaCampo, { classeCampo } from "./CaixaCampo";
import { dicaCampo, grupoCampo, rotuloCampo } from "../estilos";

type CampoFormularioProps = {
  id: string;
  nome: string;
  tipo: "email" | "password" | "text" | "date";
  valor: string;
  aoAlterar: (valor: string) => void;
  autoComplete: string;
  dica?: string;
  icone?: string;
};

export default function CampoFormulario({ id, nome, tipo, valor, aoAlterar, autoComplete, dica, icone }: CampoFormularioProps) {
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const idDica = `${id}-dica`;
  const ehSenha = tipo === "password";

  const botaoSenha = ehSenha && (
    <button
      type="button"
      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded text-texto/60 hover:text-destaque focus-visible:outline-2 focus-visible:outline-arcano"
      aria-label={senhaVisivel ? "Ocultar senha" : "Mostrar senha"}
      aria-pressed={senhaVisivel}
      onClick={() => setSenhaVisivel((atual) => !atual)}
    >
      <i aria-hidden="true" className={`bi ${senhaVisivel ? "bi-eye-slash" : "bi-eye"}`} />
    </button>
  );

  return (
    <div className={grupoCampo}>
      <label className={rotuloCampo} htmlFor={id}>{nome}</label>
      <CaixaCampo icone={icone} acao={botaoSenha}>
        <input
          className={classeCampo(icone, ehSenha)}
          type={ehSenha && senhaVisivel ? "text" : tipo}
          id={id}
          name={id}
          value={valor}
          onChange={(evento) => aoAlterar(evento.target.value)}
          autoComplete={autoComplete}
          aria-describedby={dica ? idDica : undefined}
          required
        />
      </CaixaCampo>
      {dica && <p id={idDica} className={dicaCampo}>{dica}</p>}
    </div>
  );
}
