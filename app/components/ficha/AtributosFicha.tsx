import { comSinal, modificador, type AtributoModelo } from "@/src/dominio/modeloFicha";
import { avaliarFormula, descreverFormula, type ContextoFormula } from "@/src/dominio/formula";
import type { AlterarCampo } from "./useFicha";
import CampoNumeroFicha from "./CampoNumeroFicha";
import SecaoFicha, { type IdentidadeSecao } from "./SecaoFicha";

type AtributosFichaProps = {
  secao: IdentidadeSecao;
  atributos: AtributoModelo[];
  valores: Record<string, number>;
  contexto: ContextoFormula;
  editavel: boolean;
  aoAlterar: AlterarCampo;
};

export default function AtributosFicha({ secao, atributos, valores, contexto, editavel, aoAlterar }: AtributosFichaProps) {
  return (
    <SecaoFicha id={secao.id} titulo={secao.titulo} icone={secao.icone} classes="@container">
      <ul className="grid grid-cols-2 gap-3 @sm:grid-cols-3 @4xl:grid-cols-6">
        {atributos.map((atributo) => {
          const valor = valores[atributo.id] ?? atributo.padrao;
          const rolagem = atributo.rolagem ? avaliarFormula(atributo.rolagem, contexto) : null;
          return (
            <li key={atributo.id} className="flex flex-col items-center gap-1 rounded-lg border border-borda bg-fundo px-2 py-3 text-center">
              <span className="text-xs font-bold tracking-widest uppercase opacity-75">{atributo.rotulo}</span>
              <span className="font-titulo text-[2rem] leading-none font-bold text-destaque" aria-label={`Modificador ${comSinal(modificador(valor))}`}>
                {comSinal(modificador(valor))}
              </span>
              <CampoNumeroFicha
                rotulo={atributo.rotulo}
                valor={valor}
                minimo={atributo.minimo}
                maximo={atributo.maximo}
                editavel={editavel}
                aoAlterar={(numero) => aoAlterar(`${secao.caminho}.${atributo.id}`, numero)}
                classes="w-16 text-center"
              />
              {rolagem && <span className="font-mono text-xs opacity-70" title={atributo.rolagem ?? undefined}>{descreverFormula(rolagem)}</span>}
            </li>
          );
        })}
      </ul>
    </SecaoFicha>
  );
}
