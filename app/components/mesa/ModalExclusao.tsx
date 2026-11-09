import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { excluirMesa } from "@/src/repositories/mesasRepositorio";
import type { DetalheMesa } from "@/src/dominio/mesa";
import { botaoContorno, campoLinha, listaMarcadores } from "../estilos";

type ModalExclusaoProps = {
  mesa: DetalheMesa;
  aoFechar: () => void;
};

export default function ModalExclusao({ mesa, aoFechar }: ModalExclusaoProps) {
  const router = useRouter();
  const dialogo = useRef<HTMLDialogElement>(null);
  const [confirmacao, setConfirmacao] = useState("");
  const [erros, setErros] = useState<string[]>([]);
  const [excluindo, setExcluindo] = useState(false);
  const nomeConfere = confirmacao.trim() === mesa.nome;

  useEffect(() => {
    dialogo.current?.showModal();
  }, []);

  const excluir = async () => {
    setExcluindo(true);
    const resultado = await excluirMesa(mesa.id);
    if (resultado.sucesso) {
      router.push("/mesas");
      return;
    }
    setErros(resultado.erros);
    setExcluindo(false);
  };

  return (
    <dialog
      ref={dialogo}
      onClose={aoFechar}
      aria-labelledby="titulo-exclusao"
      className="m-auto w-full max-w-[480px] rounded-lg border border-borda bg-superficie p-6 text-texto backdrop:bg-noite/70"
    >
      <h2 id="titulo-exclusao" className="mb-4 font-titulo text-[24px] font-bold">Excluir “{mesa.nome}”?</h2>
      <p className="mb-2">Esta ação não pode ser desfeita.</p>
      <ul className={`${listaMarcadores} mb-4 text-sm`}>
        <li><strong>Serão apagados:</strong> participantes, chat, tabuleiro e o código de convite.</li>
        <li><strong>Serão guardados:</strong> as fichas dos jogadores, na biblioteca de cada um, e o modelo de ficha da mesa, nos seus templates.</li>
      </ul>
      <label className="flex flex-col text-sm" htmlFor="confirmacaoExclusao">
        Para confirmar, digite o nome da mesa:
        <input id="confirmacaoExclusao" className={campoLinha} value={confirmacao} onChange={(evento) => setConfirmacao(evento.target.value)} autoComplete="off" />
      </label>
      {erros.length > 0 && <p role="alert" className="mb-3 text-sm text-vida">{erros.join(" ")}</p>}
      <div className="flex justify-end gap-3">
        <button type="button" className={botaoContorno} onClick={() => dialogo.current?.close()}>Cancelar</button>
        <button
          type="button"
          className="cursor-pointer rounded-md bg-vida px-4 py-1 font-bold text-pergaminho disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!nomeConfere || excluindo}
          onClick={() => void excluir()}
        >
          {excluindo ? "Excluindo..." : "Excluir mesa"}
        </button>
      </div>
    </dialog>
  );
}
