import type { Alterar, Detalhes } from "./useDetalhes";
import type { AjustarBarra, Barras } from "./useBarras";
import Barra from "./Barra";
import { campoNumero, rotulo } from "./estilos";

type Condicao = {
  id: string;
  nome: string;
};

const condicoesVida: Condicao[] = [
  { id: "lesaoG", nome: "Lesão Grave" },
  { id: "inconsciente", nome: "Inconsciente" },
  { id: "morrendo", nome: "Morrendo" },
];

const condicoesSanidade: Condicao[] = [
  { id: "traumatizado", nome: "Traumatizado" },
  { id: "enlouquecido", nome: "Enlouquecido" },
];

type StatusProps = {
  detalhes: Detalhes;
  alterar: Alterar;
  barras: Barras;
  ajustarBarra: AjustarBarra;
};

export default function Status({ detalhes, alterar, barras, ajustarBarra }: StatusProps) {
  return (
    <section className="flex flex-col">
      <div className="flex justify-around">
        <img className="w-[100px] rounded-full border-[3px] border-white" src="/img/icon.jpg" alt="Icone" />
        <img className="w-[100px] rounded-full" src="/img/d21.png" alt="" />
      </div>
      <Barra titulo="Vida" corBarra="bg-vida" valor={barras.vida} ajustar={(variacao) => ajustarBarra("vida", variacao)} />
      <Condicoes nome="condicao_vida" condicoes={condicoesVida} />
      <Barra titulo="Sanidade" corBarra="bg-sanidade" valor={barras.sanidade} ajustar={(variacao) => ajustarBarra("sanidade", variacao)} />
      <Condicoes nome="condicao_sanidade" condicoes={condicoesSanidade} />
      <Barra titulo="Esforço" corBarra="bg-esforco" valor={barras.esforco} ajustar={(variacao) => ajustarBarra("esforco", variacao)} />
      <div className="m-auto grid grid-cols-3 items-center justify-items-center gap-x-5 gap-y-[5px]">
        <label className={rotulo} htmlFor="dextra">Dano Extra</label>
        <label className={rotulo} htmlFor="corpo">Corpo</label>
        <div className="text-center">
          <label className={rotulo} htmlFor="exPara">Exposição</label>
          <label className={rotulo} htmlFor="exPara">Paranormal</label>
        </div>
        <input className={campoNumero} type="text" id="dextra" name="dextra" value={detalhes.dextra} onChange={alterar} />
        <input className={campoNumero} type="text" id="corpo" name="corpo" value={detalhes.corpo} onChange={alterar} />
        <input className={campoNumero} type="text" id="exPara" name="exPara" value={detalhes.exPara} onChange={alterar} />
      </div>
    </section>
  );
}

function Condicoes({ nome, condicoes }: { nome: string; condicoes: Condicao[] }) {
  return (
    <div className="flex justify-evenly">
      {condicoes.map((condicao) => (
        <span key={condicao.id}>
          <input type="checkbox" id={condicao.id} name={nome} value={condicao.id} />
          <label htmlFor={condicao.id}>{condicao.nome}</label>
        </span>
      ))}
    </div>
  );
}
