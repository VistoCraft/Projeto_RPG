import { campoNumero, cartao, rotulo, tituloSecao } from "./estilos";

const atributos = [
  { id: "atr_aparencia", nome: "Aparência" },
  { id: "atr_constituicao", nome: "Constituição" },
  { id: "atr_destreza", nome: "Destreza" },
  { id: "atr_educacao", nome: "Educação" },
  { id: "atr_forca", nome: "Força" },
  { id: "atr_inteligencia", nome: "Inteligência" },
  { id: "atr_poder", nome: "Poder" },
  { id: "atr_sorte", nome: "Sorte" },
];

const rotuloAtributo = `${rotulo} p-[5px]`;

export default function Atributos() {
  return (
    <section className={`${cartao} grid grid-cols-4 gap-5`}>
      <h2 className={`${tituloSecao} col-span-4 border-b border-borda pb-[15px]`}>Atributos</h2>
      {atributos.map(({ id, nome }) => (
        <article className="text-center" key={id}>
          <button className="mx-auto block h-10 w-10 rounded-full"><img className="h-10 w-10 rounded-full" src="/img/d21.png" alt="" /></button>
          <label className={rotuloAtributo} htmlFor={id}>{nome}</label>
          <input className={campoNumero} type="text" id={id} name={id} defaultValue="0" />
        </article>
      ))}
      <article></article>
      <article className="text-center">
        <label className={rotuloAtributo} htmlFor="atr_movimento">Movimento</label>
        <input className={campoNumero} type="text" id="atr_movimento" name="atr_movimento" defaultValue="0" />
      </article>
      <article className="text-center">
        <label className={rotuloAtributo} htmlFor="atr_tamanho">Tamanho</label>
        <input className={campoNumero} type="text" id="atr_tamanho" name="atr_tamanho" defaultValue="0" />
      </article>
      <article></article>
    </section>
  );
}
