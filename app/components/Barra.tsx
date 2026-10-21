import type { ValorBarra } from "./useBarras";

const PASSO = 1;

type BarraProps = {
  titulo: string;
  corBarra: string;
  valor: ValorBarra;
  ajustar: (variacao: number) => void;
};

export default function Barra({ titulo, corBarra, valor, ajustar }: BarraProps) {
  const percentual = valor.maximo > 0 ? (valor.atual / valor.maximo) * 100 : 0;

  return (
    <div className="grid grid-cols-[1fr_80%_1fr] gap-[5px]">
      <h4 className="col-span-3 mb-2 pt-[5px] pl-[10px] text-[20px] leading-tight font-medium">{titulo}</h4>
      <BotaoBarra icone="bi-dash-circle" rotulo={`Diminuir ${titulo}`} aoClicar={() => ajustar(-PASSO)} />
      <div className="m-[10px] flex h-5 w-[95%] overflow-hidden rounded-[3px] bg-trilho text-[0.75rem]">
        <p className="absolute mt-[2px] ml-[170px]">{valor.atual}/{valor.maximo}</p>
        <div
          className={`block h-full transition-[width] duration-200 ${corBarra}`}
          role="progressbar"
          aria-label={titulo}
          style={{ width: `${percentual}%` }}
          aria-valuenow={valor.atual}
          aria-valuemin={0}
          aria-valuemax={valor.maximo}
        ></div>
      </div>
      <BotaoBarra icone="bi-plus-circle" rotulo={`Aumentar ${titulo}`} aoClicar={() => ajustar(PASSO)} />
    </div>
  );
}

type BotaoBarraProps = {
  icone: string;
  rotulo: string;
  aoClicar: () => void;
};

function BotaoBarra({ icone, rotulo, aoClicar }: BotaoBarraProps) {
  return (
    <button type="button" className="m-[5px] ml-[10px] h-5 w-5 cursor-pointer" aria-label={rotulo} onClick={aoClicar}>
      <i className={`bi ${icone} text-[20px] text-white`}></i>
    </button>
  );
}
