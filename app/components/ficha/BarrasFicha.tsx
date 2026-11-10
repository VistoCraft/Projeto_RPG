import type { BarraModelo, CorBarra, ValorBarra } from "@/src/dominio/modeloFicha";
import type { AlterarCampo } from "./useFicha";
import CampoNumeroFicha from "./CampoNumeroFicha";
import SecaoFicha, { type IdentidadeSecao } from "./SecaoFicha";
import { botaoContorno, rotuloFicha } from "../estilos";

type BarrasFichaProps = {
  secao: IdentidadeSecao;
  barras: BarraModelo[];
  valores: Record<string, ValorBarra>;
  editavel: boolean;
  aoAlterar: AlterarCampo;
};

const CORES: Record<CorBarra, string> = {
  vida: "bg-vida",
  sanidade: "bg-sanidade",
  esforco: "bg-esforco",
  arcano: "bg-arcano",
  essencia: "bg-essencia",
  mare: "bg-mare",
};

const VALOR_MAXIMO = 1_000_000;

function porcentagem({ atual, maximo }: ValorBarra): number {
  return maximo > 0 ? Math.min(100, Math.max(0, (atual / maximo) * 100)) : 0;
}

export default function BarrasFicha({ secao, barras, valores, editavel, aoAlterar }: BarrasFichaProps) {
  return (
    <SecaoFicha id={secao.id} titulo={secao.titulo} icone={secao.icone}>
      <div className="flex flex-col gap-5">
        {barras.map((barra) => {
          const valor = valores[barra.id] ?? { atual: barra.maximoPadrao, maximo: barra.maximoPadrao };
          const mudarAtual = (atual: number) => aoAlterar(`${secao.caminho}.${barra.id}.atual`, Math.max(0, Math.min(VALOR_MAXIMO, atual)));
          return (
            <div key={barra.id} className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className={rotuloFicha}>{barra.rotulo}</span>
                <span className="flex items-center gap-1.5 text-sm">
                  {editavel && (
                    <button type="button" className={botaoContorno} aria-label={`Diminuir ${barra.rotulo}`} onClick={() => mudarAtual(valor.atual - 1)}>
                      <i className="bi bi-dash" aria-hidden="true"></i>
                    </button>
                  )}
                  <CampoNumeroFicha rotulo={`${barra.rotulo} atual`} valor={valor.atual} minimo={0} maximo={VALOR_MAXIMO} editavel={editavel} aoAlterar={mudarAtual} classes="w-16 text-center" />
                  <span className="opacity-60">/</span>
                  <CampoNumeroFicha
                    rotulo={`${barra.rotulo} máximo`}
                    valor={valor.maximo}
                    minimo={0}
                    maximo={VALOR_MAXIMO}
                    editavel={editavel}
                    aoAlterar={(maximo) => aoAlterar(`${secao.caminho}.${barra.id}.maximo`, maximo)}
                    classes="w-16 text-center"
                  />
                  {editavel && (
                    <button type="button" className={botaoContorno} aria-label={`Aumentar ${barra.rotulo}`} onClick={() => mudarAtual(valor.atual + 1)}>
                      <i className="bi bi-plus" aria-hidden="true"></i>
                    </button>
                  )}
                </span>
              </div>
              <div
                className="h-3 overflow-hidden rounded-full bg-trilho"
                role="progressbar"
                aria-label={barra.rotulo}
                aria-valuemin={0}
                aria-valuemax={valor.maximo}
                aria-valuenow={valor.atual}
              >
                <div className={`h-full rounded-full transition-[width] ${CORES[barra.cor] ?? "bg-arcano"}`} style={{ width: `${porcentagem(valor)}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </SecaoFicha>
  );
}
