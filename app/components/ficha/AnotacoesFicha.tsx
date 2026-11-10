import type { AlterarCampo } from "./useFicha";
import SecaoFicha, { type IdentidadeSecao } from "./SecaoFicha";
import { campoFicha } from "../estilos";

type AnotacoesFichaProps = {
  secao: IdentidadeSecao;
  texto: string;
  editavel: boolean;
  aoAlterar: AlterarCampo;
};

const TAMANHO_MAXIMO_ANOTACOES = 5000;

export default function AnotacoesFicha({ secao, texto, editavel, aoAlterar }: AnotacoesFichaProps) {
  return (
    <SecaoFicha id={secao.id} titulo={secao.titulo} icone={secao.icone}>
      {editavel ? (
        <>
          <textarea
            className={`${campoFicha} min-h-32 w-full resize-y leading-relaxed`}
            aria-label={secao.titulo}
            value={texto}
            maxLength={TAMANHO_MAXIMO_ANOTACOES}
            onChange={(evento) => aoAlterar(secao.caminho, evento.target.value)}
          />
          <span className="self-end text-xs opacity-60 tabular-nums">{texto.length}/{TAMANHO_MAXIMO_ANOTACOES}</span>
        </>
      ) : (
        <p className="whitespace-pre-line leading-relaxed">{texto || <span className="opacity-60">Sem anotações.</span>}</p>
      )}
    </SecaoFicha>
  );
}
