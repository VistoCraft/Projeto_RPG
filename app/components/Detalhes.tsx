import type { Alterar, Detalhes as DadosDetalhes } from "./useDetalhes";
import { campoLinha, rotulo, tituloSecao } from "./estilos";

type CampoId = "nome" | "jogador" | "classe" | "idade" | "origem" | "patente";

type DetalhesProps = {
  detalhes: DadosDetalhes;
  alterar: Alterar;
};

const campos: { id: CampoId; nome: string }[] = [
  { id: "nome", nome: "Nome" },
  { id: "jogador", nome: "Jogador" },
  { id: "classe", nome: "Classe" },
  { id: "idade", nome: "Idade" },
];

export default function Detalhes({ detalhes, alterar }: DetalhesProps) {
  return (
    <section className="m-[5px] rounded-[10px] border-2 border-white">
      <form className="flex flex-col p-[10px]" onSubmit={(e) => e.preventDefault()}>
        <h2 className={`${tituloSecao} mb-5`}>Detalhes Pessoais</h2>
        {campos.map((campo) => (
          <Campo key={campo.id} {...campo} detalhes={detalhes} alterar={alterar} />
        ))}
        <label className={rotulo} htmlFor="sexo">Sexo</label>
        <select className={`${campoLinha} cursor-pointer appearance-none`} name="sexo" id="sexo" value={detalhes.sexo} onChange={alterar}>
          <option value="M">Masculino</option>
          <option value="F">Feminino</option>
          <option value="N">Não Identificado</option>
        </select>
        <Campo id="origem" nome="Origem" detalhes={detalhes} alterar={alterar} />
        <Campo id="patente" nome="Patente" detalhes={detalhes} alterar={alterar} />
      </form>
    </section>
  );
}

type CampoProps = DetalhesProps & {
  id: CampoId;
  nome: string;
};

function Campo({ id, nome, detalhes, alterar }: CampoProps) {
  return (
    <>
      <label className={rotulo} htmlFor={id}>{nome}</label>
      <input className={campoLinha} type="text" name={id} id={id} value={detalhes[id]} onChange={alterar} />
    </>
  );
}
