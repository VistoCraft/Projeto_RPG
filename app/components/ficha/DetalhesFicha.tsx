import type { CampoDetalhe, ValorDetalhe } from "@/src/dominio/modeloFicha";
import type { AlterarCampo } from "./useFicha";
import CampoNumeroFicha from "./CampoNumeroFicha";
import SecaoFicha from "./SecaoFicha";
import { campoFicha, rotuloFicha } from "../estilos";

type DetalhesFichaProps = {
  campos: CampoDetalhe[];
  valores: Record<string, ValorDetalhe>;
  editavel: boolean;
  aoAlterar: AlterarCampo;
};

const TAMANHO_MAXIMO_TEXTO = 200;

export default function DetalhesFicha({ campos, valores, editavel, aoAlterar }: DetalhesFichaProps) {
  return (
    <SecaoFicha id="detalhes" titulo="Detalhes" icone="bi-person-lines-fill">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,200px),1fr))] gap-x-5 gap-y-4">
        {campos.map((campo) => {
          const id = `detalhe-${campo.id}`;
          const caminho = `detalhes.${campo.id}`;
          const valor = valores[campo.id];
          return (
            <div key={campo.id} className="flex flex-col gap-1">
              <label className={rotuloFicha} htmlFor={id}>{campo.rotulo}</label>
              {campo.tipo === "numero" && (
                <CampoNumeroFicha
                  id={id}
                  rotulo={campo.rotulo}
                  valor={typeof valor === "number" ? valor : campo.minimo ?? 0}
                  minimo={campo.minimo}
                  maximo={campo.maximo}
                  editavel={editavel}
                  aoAlterar={(numero) => aoAlterar(caminho, numero)}
                />
              )}
              {campo.tipo === "lista" && (
                <select
                  id={id}
                  className={`${campoFicha} w-full ${editavel ? "cursor-pointer" : "appearance-none"}`}
                  value={typeof valor === "string" ? valor : ""}
                  disabled={!editavel}
                  onChange={(evento) => aoAlterar(caminho, evento.target.value || null)}
                >
                  <option value="">{editavel ? "Escolha..." : "—"}</option>
                  {(campo.opcoes ?? []).map((opcao) => <option key={opcao} value={opcao}>{opcao}</option>)}
                </select>
              )}
              {campo.tipo === "texto" && (
                <input
                  id={id}
                  className={`${campoFicha} w-full`}
                  type="text"
                  value={typeof valor === "string" ? valor : ""}
                  maxLength={TAMANHO_MAXIMO_TEXTO}
                  placeholder={editavel ? "" : "—"}
                  disabled={!editavel}
                  onChange={(evento) => aoAlterar(caminho, evento.target.value)}
                />
              )}
            </div>
          );
        })}
      </div>
    </SecaoFicha>
  );
}
