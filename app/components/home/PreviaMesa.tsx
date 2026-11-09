type Atributo = { sigla: string; valor: number };

type Mensagem = { autor: string; texto: string; rolagem?: string };

const atributos: Atributo[] = [
  { sigla: "FOR", valor: 8 },
  { sigla: "DES", valor: 14 },
  { sigla: "CON", valor: 12 },
  { sigla: "INT", valor: 17 },
  { sigla: "SAB", valor: 13 },
  { sigla: "CAR", valor: 10 },
];

const mensagens: Mensagem[] = [
  { autor: "Mestre", texto: "A porta da torre range e uma névoa azul escapa pelas frestas." },
  { autor: "Lyra", texto: "Investigação na runa da porta", rolagem: "1d20 + 5 = 19" },
  { autor: "Bram", texto: "Fico de guarda com o escudo erguido." },
];

const casasTabuleiro = 48;
const tokens: Record<number, string> = { 13: "bg-essencia", 22: "bg-arcano", 34: "bg-vida" };

function modificador(valor: number): string {
  const mod = Math.floor((valor - 10) / 2);
  return mod >= 0 ? `+${mod}` : String(mod);
}

export default function PreviaMesa() {
  return (
    <div aria-hidden="true" className="hidden select-none lg:block">
      <div className="grid rotate-1 grid-cols-[1.1fr_1fr] gap-4 rounded-xl border border-pergaminho/20 bg-noite/70 p-4 text-luar shadow-2xl backdrop-blur">
        <div className="flex flex-col gap-3 rounded-lg bg-abismo p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-titulo text-xl font-bold">Lyra Vensari</p>
              <p className="text-xs opacity-70">Maga · nível 3</p>
            </div>
            <span className="rounded-full border border-essencia px-2 py-0.5 text-xs text-essencia">Ficha</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-abismo-claro">
            <div className="h-full w-3/4 rounded-full bg-vida"></div>
          </div>
          <p className="-mt-1 text-xs opacity-70">PV 14 / 18</p>
          <div className="grid grid-cols-3 gap-2">
            {atributos.map(({ sigla, valor }) => (
              <div key={sigla} className="flex flex-col items-center rounded-md border border-abismo-claro py-1.5">
                <span className="text-[10px] tracking-widest opacity-60">{sigla}</span>
                <span className="font-titulo text-lg font-bold">{modificador(valor)}</span>
                <span className="text-[10px] opacity-60">{valor}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-8 gap-px overflow-hidden rounded-lg bg-abismo-claro p-px">
            {Array.from({ length: casasTabuleiro }, (_, indice) => (
              <span key={indice} className="flex aspect-square items-center justify-center bg-abismo">
                {tokens[indice] && <span className={`h-3/5 w-3/5 rounded-full ring-2 ring-luar/70 ${tokens[indice]}`}></span>}
              </span>
            ))}
          </div>
          <ul className="flex flex-col gap-2 rounded-lg bg-abismo p-3 text-xs">
            {mensagens.map(({ autor, texto, rolagem }) => (
              <li key={texto}>
                <span className="font-bold text-arcano-texto-escuro">{autor}:</span> {texto}
                {rolagem && <span className="ml-1 rounded bg-essencia/15 px-1.5 py-0.5 font-mono text-essencia">{rolagem}</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
