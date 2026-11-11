import { useState, type ReactNode } from "react";
import { normalizarConteudo, type ModeloFicha } from "@/src/dominio/modeloFicha";
import type { TipoFicha } from "@/src/dominio/ficha";
import type { ModelosFicha } from "@/src/dominio/modeloMesa";
import EditorModelo from "./EditorModelo";
import FichaModelo from "../ficha/FichaModelo";
import { cartao, rotuloFicha, tituloPainel } from "../estilos";

type EditorModelosFichaProps = {
  modelos: ModelosFicha;
  editavel: boolean;
  aoAlterar: (tipo: TipoFicha, modelo: ModeloFicha) => void;
  rotulo: string;
  topo: ReactNode;
};

const ABAS: { aba: TipoFicha; rotulo: string; dica: string }[] = [
  { aba: "completa", rotulo: "Ficha completa", dica: "Personagens dos jogadores e NPCs importantes" },
  { aba: "simplificada", rotulo: "Ficha simplificada", dica: "Pets, montarias e NPCs de apoio" },
];

const semAlteracao = () => undefined;

export default function EditorModelosFicha({ modelos, editavel, aoAlterar, rotulo, topo }: EditorModelosFichaProps) {
  const [aba, setAba] = useState<TipoFicha>("completa");
  const modelo = modelos[aba];

  return (
    <div className="flex flex-col gap-6">
      <section className={`${cartao} flex flex-col gap-4`} aria-label={rotulo}>
        {topo}
        <div role="tablist" aria-label="Modelos da ficha" className="grid gap-2 sm:grid-cols-2">
          {ABAS.map((item) => (
            <button
              key={item.aba}
              type="button"
              role="tab"
              aria-selected={aba === item.aba}
              onClick={() => setAba(item.aba)}
              className={`flex cursor-pointer flex-col items-start rounded-md border px-4 py-2 text-left transition-colors ${
                aba === item.aba ? "border-arcano bg-arcano/15" : "border-borda hover:border-arcano/60"
              }`}
            >
              <span className="font-semibold">{item.rotulo}</span>
              <span className={rotuloFicha}>{item.dica}</span>
            </button>
          ))}
        </div>
      </section>
      <div className={`grid items-start gap-6 ${editavel ? "2xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]" : ""}`}>
        {editavel && <EditorModelo key={aba} modelo={modelo} editavel={editavel} aoAlterar={(novo) => aoAlterar(aba, novo)} />}
        <section aria-labelledby="titulo-previa" className="flex flex-col gap-3 2xl:sticky 2xl:top-24">
          <h2 id="titulo-previa" className={tituloPainel}>
            <i className="bi bi-eye text-destaque" aria-hidden="true"></i> Prévia da ficha {aba === "completa" ? "completa" : "simplificada"}
          </h2>
          <FichaModelo modelo={modelo} conteudo={normalizarConteudo({}, modelo)} editavel={false} aoAlterar={semAlteracao} />
        </section>
      </div>
    </div>
  );
}
