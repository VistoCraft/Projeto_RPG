import { useRouter } from "next/navigation";
import { entrarNaMesa, sairDaMesa } from "@/src/repositories/mesasRepositorio";
import { ROTULOS_PAPEL, type DetalheMesa } from "@/src/dominio/mesa";
import type { EstadoMesa } from "./useMesa";
import SeloMesa from "../SeloMesa";
import { botaoContorno, chamadaPrincipal, faixaDestaque } from "../estilos";

type CabecalhoMesaProps = {
  mesa: DetalheMesa;
  estado: EstadoMesa;
};

export default function CabecalhoMesa({ mesa, estado }: CabecalhoMesaProps) {
  const router = useRouter();
  const podeEntrar = mesa.meuPapel === null && mesa.status === "ativa" && !mesa.entradaBloqueada;
  const podeSair = mesa.meuPapel !== null && mesa.meuPapel !== "dono";

  const sair = async () => {
    const resultado = await sairDaMesa(mesa.id);
    if (resultado.sucesso) router.push("/mesas");
  };

  return (
    <section className={`${faixaDestaque} flex flex-col items-center gap-3 py-10`}>
      <SeloMesa mesa={mesa} />
      <h1 className="font-titulo text-[2.5rem] leading-tight font-bold">{mesa.nome}</h1>
      {mesa.descricao && <p className="max-w-[640px] whitespace-pre-line">{mesa.descricao}</p>}
      <p className="text-sm opacity-90">
        Mestre: {mesa.dono ?? "—"} · Ficha: {mesa.template} · {mesa.visibilidade === "privada" ? "Privada" : "Pública"}
      </p>
      {mesa.meuPapel && <p className="text-sm font-bold">Você participa como {ROTULOS_PAPEL[mesa.meuPapel].toLowerCase()}</p>}
      {podeEntrar && (
        <button type="button" className={chamadaPrincipal} disabled={estado.executando} onClick={() => void estado.executar(() => entrarNaMesa(mesa.id))}>
          Entrar como espectador
        </button>
      )}
      {mesa.meuPapel === null && !podeEntrar && <p className="text-sm">A mesa não está recebendo novas pessoas agora.</p>}
      {podeSair && (
        <button type="button" className={`${botaoContorno} border-pergaminho/60 text-pergaminho`} onClick={() => void sair()}>
          Sair da mesa
        </button>
      )}
    </section>
  );
}
