import { useId, useMemo, useState, type KeyboardEvent } from "react";
import type { Opcao } from "@/src/dominio/perfil";
import CaixaCampo, { classeCampo } from "./CaixaCampo";
import { grupoCampo, rotuloCampo } from "../estilos";

type CampoBuscaSelecaoProps = {
  id: string;
  nome: string;
  valor: string;
  aoAlterar: (valor: string) => void;
  opcoes: Opcao[];
  textoAjuda: string;
  autoComplete?: string;
  icone?: string;
};

function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
}

export default function CampoBuscaSelecao({ id, nome, valor, aoAlterar, opcoes, textoAjuda, autoComplete, icone }: CampoBuscaSelecaoProps) {
  const idLista = useId();
  const rotuloSelecionado = opcoes.find((opcao) => opcao.valor === valor)?.rotulo ?? "";
  const [busca, setBusca] = useState<string | null>(null);
  const [aberto, setAberto] = useState(false);
  const [indiceAtivo, setIndiceAtivo] = useState(0);
  const texto = busca ?? rotuloSelecionado;

  const filtradas = useMemo(() => {
    const termo = normalizar(busca ?? "");
    return termo ? opcoes.filter((opcao) => normalizar(opcao.rotulo).includes(termo)) : opcoes;
  }, [busca, opcoes]);

  const escolher = (opcao: Opcao) => {
    aoAlterar(opcao.valor);
    setBusca(null);
    setAberto(false);
  };

  const digitar = (novoTexto: string) => {
    setBusca(novoTexto);
    setAberto(true);
    setIndiceAtivo(0);
    if (valor) aoAlterar("");
  };

  const sair = () => {
    const exata = filtradas.find((opcao) => normalizar(opcao.rotulo) === normalizar(busca ?? ""));
    if (exata) escolher(exata);
    setAberto(false);
  };

  const teclar = (evento: KeyboardEvent<HTMLInputElement>) => {
    if (evento.key === "ArrowDown" || evento.key === "ArrowUp") {
      evento.preventDefault();
      const passo = evento.key === "ArrowDown" ? 1 : -1;
      setAberto(true);
      setIndiceAtivo((atual) => Math.min(Math.max(atual + passo, 0), Math.max(filtradas.length - 1, 0)));
    } else if (evento.key === "Enter" && aberto && filtradas[indiceAtivo]) {
      evento.preventDefault();
      escolher(filtradas[indiceAtivo]);
    } else if (evento.key === "Escape") {
      setAberto(false);
    }
  };

  const idOpcao = (indice: number) => `${idLista}-${indice}`;

  return (
    <div className={grupoCampo}>
      <label className={rotuloCampo} htmlFor={id}>{nome}</label>
      <div className="relative">
        <CaixaCampo icone={icone} seta>
          <input
            className={classeCampo(icone, true)}
            id={id}
            name={id}
            role="combobox"
            aria-expanded={aberto}
            aria-controls={idLista}
            aria-autocomplete="list"
            aria-activedescendant={aberto && filtradas[indiceAtivo] ? idOpcao(indiceAtivo) : undefined}
            aria-invalid={!aberto && texto !== "" && !valor}
            value={texto}
            placeholder={textoAjuda}
            autoComplete={autoComplete ?? "off"}
            onChange={(evento) => digitar(evento.target.value)}
            onFocus={() => setAberto(true)}
            onBlur={sair}
            onKeyDown={teclar}
            required
          />
        </CaixaCampo>
        {aberto && (
          <ul id={idLista} role="listbox" className="absolute top-full z-10 mt-1.5 max-h-64 w-full overflow-y-auto rounded-md border border-texto/15 bg-superficie p-1 shadow-xl">
            {filtradas.length === 0 && <li className="px-3 py-2 text-sm opacity-70"><i aria-hidden="true" className="bi bi-search mr-2" />Nada encontrado</li>}
            {filtradas.map((opcao, indice) => (
              <li
                key={opcao.valor}
                id={idOpcao(indice)}
                role="option"
                aria-selected={opcao.valor === valor}
                className={`flex cursor-pointer items-center justify-between rounded px-3 py-2 text-sm ${indice === indiceAtivo ? "bg-arcano/15" : ""} ${opcao.valor === valor ? "font-semibold text-destaque" : ""}`}
                onMouseDown={(evento) => evento.preventDefault()}
                onMouseEnter={() => setIndiceAtivo(indice)}
                onClick={() => escolher(opcao)}
              >
                {opcao.rotulo}
                {opcao.valor === valor && <i aria-hidden="true" className="bi bi-check2" />}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
