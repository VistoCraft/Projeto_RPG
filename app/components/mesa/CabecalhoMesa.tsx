import Link from "next/link";
import { useRouter } from "next/navigation";
import { entrarNaMesa, sairDaMesa } from "@/src/repositories/mesasRepositorio";
import { ROTULOS_PAPEL, type DetalheMesa } from "@/src/dominio/mesa";
import type { EstadoMesa } from "./useMesa";
import FaixaPagina from "../FaixaPagina";
import { rotuloDoSelo } from "../SeloMesa";
import { chamadaPrincipal, chamadaSecundaria } from "../estilos";

type CabecalhoMesaProps = {
  mesa: DetalheMesa;
  estado: EstadoMesa;
};

type Informacao = { icone: string; texto: string };

const chip = "flex items-center gap-1.5 rounded-full border border-pergaminho/30 bg-pergaminho/10 px-3 py-1";

export default function CabecalhoMesa({ mesa, estado }: CabecalhoMesaProps) {
  const router = useRouter();
  const podeEntrar = mesa.meuPapel === null && mesa.status === "ativa" && !mesa.entradaBloqueada;
  const podeSair = mesa.meuPapel !== null && mesa.meuPapel !== "dono";

  const informacoes: Informacao[] = [
    { icone: "bi-person-badge", texto: `Mestre: ${mesa.dono ?? "—"}` },
    { icone: "bi-journal-text", texto: mesa.template },
    { icone: mesa.visibilidade === "privada" ? "bi-lock" : "bi-globe2", texto: mesa.visibilidade === "privada" ? "Privada" : "Pública" },
  ];

  const sair = async () => {
    const resultado = await sairDaMesa(mesa.id);
    if (resultado.sucesso) router.push("/mesas");
  };

  const rotulo = (
    <>
      <Link className="flex items-center gap-1 opacity-85 hover:opacity-100 hover:underline" href="/mesas">
        <i className="bi bi-arrow-left" aria-hidden="true"></i> Mesas
      </Link>
      <span className={`${chip} font-semibold`}>{rotuloDoSelo(mesa)}</span>
      {informacoes.map(({ icone, texto }) => (
        <span key={icone} className={chip}><i className={`bi ${icone}`} aria-hidden="true"></i>{texto}</span>
      ))}
    </>
  );

  const descricao = (
    <>
      {mesa.descricao && <p className="whitespace-pre-line">{mesa.descricao}</p>}
      {mesa.meuPapel && <p className="mt-2 text-base font-bold">Você participa como {ROTULOS_PAPEL[mesa.meuPapel].toLowerCase()}</p>}
      {mesa.meuPapel === null && !podeEntrar && <p className="mt-2 text-base">A mesa não está recebendo novas pessoas agora.</p>}
    </>
  );

  return (
    <FaixaPagina rotulo={rotulo} titulo={mesa.nome} descricao={descricao}>
      {podeEntrar && (
        <button type="button" className={`${chamadaPrincipal} cursor-pointer`} disabled={estado.executando} onClick={() => void estado.executar(() => entrarNaMesa(mesa.id))}>
          <i className="bi bi-door-open" aria-hidden="true"></i> Entrar como espectador
        </button>
      )}
      {podeSair && (
        <button type="button" className={`${chamadaSecundaria} cursor-pointer`} onClick={() => void sair()}>
          <i className="bi bi-box-arrow-left" aria-hidden="true"></i> Sair da mesa
        </button>
      )}
    </FaixaPagina>
  );
}
