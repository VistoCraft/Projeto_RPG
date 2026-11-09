import Link from "next/link";
import { link } from "../estilos";

type CampoAceiteTermosProps = {
  aceito: boolean;
  aoAlterar: (aceito: boolean) => void;
};

export default function CampoAceiteTermos({ aceito, aoAlterar }: CampoAceiteTermosProps) {
  return (
    <label className="mb-5 flex cursor-pointer items-start gap-3 rounded-md border border-texto/15 bg-fundo/60 p-3 text-sm leading-relaxed" htmlFor="aceiteTermos">
      <input
        className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-arcano"
        type="checkbox"
        id="aceiteTermos"
        name="aceiteTermos"
        checked={aceito}
        onChange={(evento) => aoAlterar(evento.target.checked)}
        required
      />
      <span>
        Li e aceito os <Link className={link} href="/termos" target="_blank">Termos de uso</Link> e a{" "}
        <Link className={link} href="/privacidade" target="_blank">Política de privacidade</Link>. Entendo que este é um projeto de
        estudo, sem fins comerciais.
      </span>
    </label>
  );
}
