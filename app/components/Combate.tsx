import Cabecalho from "./Cabecalho";
import { cartao } from "./estilos";

const colunas = ["Nome", "Tipo", "Dano", "nun. Atual", "nun. Maximo", "Ataque", "Alcance", "Defeito", "Área"];

const armas = Array.from({ length: 4 }, () => ({
  nome: "balestra",
  tipo: "perfurante",
  dano: "1d6",
  atual: 5,
  maximo: 10,
  ataque: "destreza",
  alcance: "20m",
  defeito: 1,
  area: "1quadrado",
}));

const celula = "p-2 text-center align-top font-normal";

export default function Combate() {
  return (
    <section className={`${cartao} col-span-2 mb-[10px]`}>
      <Cabecalho titulo="Combate" />
      <table className="mb-4 w-full bg-white text-texto-tabela">
        <thead>
          <tr className="border-b border-linha-tabela">
            {colunas.map((coluna) => <th key={coluna} className={celula} scope="col">{coluna}</th>)}
          </tr>
        </thead>
        <tbody>
          {armas.map((arma, i) => (
            <tr key={i} className="border-b border-linha-tabela hover:bg-black/[.075]">
              <th className={celula} scope="row">{arma.nome}</th>
              <td className={celula}>{arma.tipo}</td>
              <td className={celula}>{arma.dano}</td>
              <td className={celula}>{arma.atual}</td>
              <td className={celula}>{arma.maximo}</td>
              <td className={celula}>{arma.ataque}</td>
              <td className={celula}>{arma.alcance}</td>
              <td className={celula}>{arma.defeito}</td>
              <td className={celula}>{arma.area}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
