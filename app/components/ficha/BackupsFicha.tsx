import { useEffect, useState } from "react";
import { listarBackups, obterBackup } from "@/src/repositories/modeloMesaRepositorio";
import type { BackupFicha, DetalheBackup } from "@/src/dominio/modeloMesa";
import ListaErros from "../formulario/ListaErros";
import FichaModelo from "./FichaModelo";
import { botaoContorno, cartao, tituloPainel } from "../estilos";

type BackupsFichaProps = {
  mesaId: string;
  fichaId: string;
  aoFechar: () => void;
};

const FORMATO_DATA: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" };

const semAlteracao = () => undefined;

const formatarData = (iso: string) => new Date(iso).toLocaleString("pt-BR", FORMATO_DATA);

export default function BackupsFicha({ mesaId, fichaId, aoFechar }: BackupsFichaProps) {
  const [backups, setBackups] = useState<BackupFicha[] | null>(null);
  const [aberto, setAberto] = useState<DetalheBackup | null>(null);
  const [erros, setErros] = useState<string[]>([]);

  useEffect(() => {
    let vivo = true;
    void listarBackups(mesaId, fichaId).then((resultado) => {
      if (!vivo) return;
      if (resultado.sucesso) setBackups(resultado.valor);
      else setErros(resultado.erros);
    });
    return () => {
      vivo = false;
    };
  }, [mesaId, fichaId]);

  const abrir = async (backupId: string) => {
    const resultado = await obterBackup(mesaId, fichaId, backupId);
    if (resultado.sucesso) setAberto(resultado.valor);
    else setErros(resultado.erros);
  };

  return (
    <section className={`${cartao} flex flex-col gap-4`} aria-labelledby="titulo-backups">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="titulo-backups" className={tituloPainel}><i className="bi bi-clock-history text-destaque" aria-hidden="true"></i> Versões antigas</h2>
        <button type="button" className={botaoContorno} onClick={aoFechar}>
          <i className="bi bi-x-lg" aria-hidden="true"></i> Fechar
        </button>
      </div>
      <p className="text-sm opacity-80">Cópias guardadas antes de cada mudança no modelo da mesa. São só para consulta.</p>
      <ListaErros erros={erros} />
      {backups === null && erros.length === 0 && <p className="text-sm opacity-80">Carregando...</p>}
      {backups?.length === 0 && <p className="text-sm opacity-80">Esta ficha ainda não tem versões antigas.</p>}
      {backups && backups.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {backups.map((backup) => (
            <li key={backup.id}>
              <button
                type="button"
                aria-pressed={aberto?.id === backup.id}
                className={`${botaoContorno} ${aberto?.id === backup.id ? "border-arcano bg-arcano/15" : ""}`}
                onClick={() => void abrir(backup.id)}
              >
                Versão {backup.versaoModelo} · {formatarData(backup.criadoEm)}
              </button>
            </li>
          ))}
        </ul>
      )}
      {aberto && <FichaModelo modelo={aberto.modelo} conteudo={aberto.conteudo} editavel={false} aoAlterar={semAlteracao} />}
    </section>
  );
}
