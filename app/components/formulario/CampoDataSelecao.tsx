import { useEffect, useState } from "react";
import CaixaCampo from "./CaixaCampo";
import { campoCaixa, dicaCampo, grupoCampo, rotuloCampo } from "../estilos";

type CampoDataSelecaoProps = {
  id: string;
  nome: string;
  aoAlterar: (dataIso: string) => void;
  anosAtras: { minimo: number; maximo: number };
  dica?: string;
};

const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
const DIAS_NO_MES_PADRAO = 31;

function diasNoMes(mes: string, ano: string): number {
  if (!mes) return DIAS_NO_MES_PADRAO;
  return new Date(Number(ano) || 2000, Number(mes), 0).getDate();
}

function doisDigitos(numero: number | string): string {
  return String(numero).padStart(2, "0");
}

export default function CampoDataSelecao({ id, nome, aoAlterar, anosAtras, dica }: CampoDataSelecaoProps) {
  const [dia, setDia] = useState("");
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");
  const [anos, setAnos] = useState<number[]>([]);
  const idDica = `${id}-dica`;
  const totalDias = diasNoMes(mes, ano);
  const diaValido = dia && Number(dia) <= totalDias ? dia : "";

  useEffect(() => {
    const anoAtual = new Date().getFullYear();
    const quantidade = anosAtras.maximo - anosAtras.minimo + 1;
    setAnos(Array.from({ length: quantidade }, (_, indice) => anoAtual - anosAtras.minimo - indice));
  }, [anosAtras.minimo, anosAtras.maximo]);

  useEffect(() => {
    aoAlterar(diaValido && mes && ano ? `${ano}-${doisDigitos(mes)}-${doisDigitos(diaValido)}` : "");
  }, [diaValido, mes, ano, aoAlterar]);

  const seletor = (preenchido: string) => `${campoCaixa} cursor-pointer pr-7 pl-3 appearance-none ${preenchido ? "" : "text-texto/60"}`;

  return (
    <fieldset className={grupoCampo} aria-describedby={dica ? idDica : undefined}>
      <legend className={rotuloCampo}>{nome}</legend>
      <div className="grid grid-cols-[1.1fr_1.8fr_1.3fr] gap-2">
        <CaixaCampo seta>
          <select className={seletor(diaValido)} id={id} aria-label="Dia" value={diaValido} onChange={(evento) => setDia(evento.target.value)} required>
            <option value="">Dia</option>
            {Array.from({ length: totalDias }, (_, indice) => indice + 1).map((numero) => (
              <option key={numero} value={numero}>{numero}</option>
            ))}
          </select>
        </CaixaCampo>
        <CaixaCampo seta>
          <select className={seletor(mes)} aria-label="Mês" value={mes} onChange={(evento) => setMes(evento.target.value)} required>
            <option value="">Mês</option>
            {MESES.map((nomeMes, indice) => <option key={nomeMes} value={indice + 1}>{nomeMes}</option>)}
          </select>
        </CaixaCampo>
        <CaixaCampo seta>
          <select className={seletor(ano)} aria-label="Ano" value={ano} onChange={(evento) => setAno(evento.target.value)} required>
            <option value="">Ano</option>
            {anos.map((numero) => <option key={numero} value={numero}>{numero}</option>)}
          </select>
        </CaixaCampo>
      </div>
      {dica && <p id={idDica} className={dicaCampo}>{dica}</p>}
    </fieldset>
  );
}
