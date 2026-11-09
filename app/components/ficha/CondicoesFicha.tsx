import type { CondicaoModelo } from "@/src/dominio/modeloFicha";
import type { AlterarCampo } from "./useFicha";
import SecaoFicha from "./SecaoFicha";

type CondicoesFichaProps = {
  condicoes: CondicaoModelo[];
  marcadas: string[];
  editavel: boolean;
  aoAlterar: AlterarCampo;
};

export default function CondicoesFicha({ condicoes, marcadas, editavel, aoAlterar }: CondicoesFichaProps) {
  const alternar = (id: string) =>
    aoAlterar("condicoes", marcadas.includes(id) ? marcadas.filter((marcada) => marcada !== id) : [...marcadas, id]);

  return (
    <SecaoFicha id="condicoes" titulo="Condições" icone="bi-exclamation-diamond">
      <ul className="flex flex-wrap gap-2">
        {condicoes.map((condicao) => {
          const ativa = marcadas.includes(condicao.id);
          return (
            <li key={condicao.id}>
              <button
                type="button"
                aria-pressed={ativa}
                disabled={!editavel}
                onClick={() => alternar(condicao.id)}
                className={`cursor-pointer rounded-full border px-3 py-1 text-sm transition-colors disabled:cursor-default ${
                  ativa ? "border-vida bg-vida/15 font-semibold text-vida" : "border-borda opacity-70 hover:opacity-100 disabled:hover:opacity-70"
                }`}
              >
                {ativa && <i className="bi bi-check2 mr-1" aria-hidden="true"></i>}
                {condicao.rotulo}
              </button>
            </li>
          );
        })}
      </ul>
    </SecaoFicha>
  );
}
