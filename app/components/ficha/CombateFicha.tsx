import type { ColunaCombate, LinhaCombate } from "@/src/dominio/modeloFicha";
import { avaliarFormula, descreverFormula, type ContextoFormula } from "@/src/dominio/formula";
import type { AlterarCampo } from "./useFicha";
import SecaoFicha from "./SecaoFicha";
import { botaoCompacto, botaoPerigo, campoFicha } from "../estilos";

type CombateFichaProps = {
  colunas: ColunaCombate[];
  linhas: LinhaCombate[];
  contexto: ContextoFormula;
  editavel: boolean;
  aoAlterar: AlterarCampo;
};

const LINHAS_MAXIMAS = 50;
const TAMANHO_MAXIMO_CELULA = 200;

export default function CombateFicha({ colunas, linhas, contexto, editavel, aoAlterar }: CombateFichaProps) {
  const gravar = (novas: LinhaCombate[]) => aoAlterar("combate", novas);

  const mudarCelula = (indice: number, coluna: ColunaCombate, texto: string) => {
    const numero = Number(texto);
    const valor = coluna.tipo === "numero" ? (texto.trim() === "" || !Number.isInteger(numero) ? null : numero) : texto;
    gravar(linhas.map((linha, posicao) => (posicao === indice ? { ...linha, [coluna.id]: valor } : linha)));
  };

  const adicionar = editavel && linhas.length < LINHAS_MAXIMAS && (
    <button type="button" className={botaoCompacto} onClick={() => gravar([...linhas, {}])}>
      <i className="bi bi-plus-lg" aria-hidden="true"></i> Adicionar ataque
    </button>
  );

  return (
    <SecaoFicha id="combate" titulo="Ataques" icone="bi-crosshair" acoes={adicionar}>
      {linhas.length === 0 ? (
        <p className="rounded-md border border-dashed border-borda p-5 text-center text-sm opacity-75">Nenhum ataque ainda.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-y-1 text-sm">
            <thead>
              <tr>
                {colunas.map((coluna) => (
                  <th key={coluna.id} scope="col" className="px-1 pb-1 text-left text-xs font-semibold tracking-wide opacity-75">{coluna.rotulo}</th>
                ))}
                {editavel && <th scope="col" className="w-10"><span className="sr-only">Remover</span></th>}
              </tr>
            </thead>
            <tbody>
              {linhas.map((linha, indice) => (
                <tr key={indice}>
                  {colunas.map((coluna) => {
                    const valor = linha[coluna.id];
                    const texto = valor === null || valor === undefined ? "" : String(valor);
                    const rolagem = coluna.tipo === "rolagem" && texto ? avaliarFormula(texto, contexto) : null;
                    return (
                      <td key={coluna.id} className="px-1 align-top">
                        <input
                          className={`${campoFicha} w-full ${coluna.tipo === "rolagem" ? "font-mono" : ""}`}
                          aria-label={`${coluna.rotulo}, linha ${indice + 1}`}
                          inputMode={coluna.tipo === "numero" ? "numeric" : undefined}
                          value={texto}
                          maxLength={TAMANHO_MAXIMO_CELULA}
                          disabled={!editavel}
                          onChange={(evento) => mudarCelula(indice, coluna, evento.target.value)}
                        />
                        {rolagem && descreverFormula(rolagem) !== texto && (
                          <span className="mt-0.5 block font-mono text-xs text-destaque">= {descreverFormula(rolagem)}</span>
                        )}
                      </td>
                    );
                  })}
                  {editavel && (
                    <td className="px-1 align-top">
                      <button
                        type="button"
                        className={botaoPerigo}
                        aria-label={`Remover ataque ${indice + 1}`}
                        onClick={() => gravar(linhas.filter((_, posicao) => posicao !== indice))}
                      >
                        <i className="bi bi-x-lg" aria-hidden="true"></i>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SecaoFicha>
  );
}
