import { modificador } from "./modeloFicha";

export type ContextoFormula = {
  valor: (id: string) => number | null;
  treinada: (id: string) => boolean;
};

export type ResultadoFormula = {
  dados: { quantidade: number; lados: number }[];
  constante: number;
};

type Valor = { dados: Map<number, number>; constante: number };

class FormulaNaoSuportada extends Error {}

const constante = (numero: number): Valor => ({ dados: new Map(), constante: numero });

const semDados = (valor: Valor) => valor.dados.size === 0;

function somar(a: Valor, b: Valor, sinal: 1 | -1): Valor {
  const dados = new Map(a.dados);
  b.dados.forEach((quantidade, lados) => dados.set(lados, (dados.get(lados) ?? 0) + sinal * quantidade));
  [...dados].filter(([, quantidade]) => quantidade === 0).forEach(([lados]) => dados.delete(lados));
  return { dados, constante: a.constante + sinal * b.constante };
}

function escalar(valor: Valor, fator: number): Valor {
  return { dados: new Map([...valor.dados].map(([lados, quantidade]) => [lados, quantidade * fator])), constante: valor.constante * fator };
}

function exigirConstante(valor: Valor): number {
  if (!semDados(valor)) throw new FormulaNaoSuportada();
  return valor.constante;
}

const FUNCAO_TREINADA = "treinada";

const funcoes: Record<string, (argumentos: Valor[]) => Valor> = {
  mod: ([x]) => constante(modificador(exigirConstante(argumento(x)))),
  piso: ([x]) => constante(Math.floor(exigirConstante(argumento(x)))),
  teto: ([x]) => constante(Math.ceil(exigirConstante(argumento(x)))),
  max: ([a, b]) => constante(Math.max(exigirConstante(argumento(a)), exigirConstante(argumento(b)))),
  min: ([a, b]) => constante(Math.min(exigirConstante(argumento(a)), exigirConstante(argumento(b)))),
  dados: ([quantidade, lados]) => ({
    dados: new Map([[Math.floor(exigirConstante(argumento(lados))), Math.floor(exigirConstante(argumento(quantidade)))]]),
    constante: 0,
  }),
};

function argumento(valor: Valor | undefined): Valor {
  if (!valor) throw new FormulaNaoSuportada();
  return valor;
}

class Leitor {
  private posicao = 0;

  constructor(private readonly texto: string, private readonly contexto: ContextoFormula) {}

  ler(): Valor {
    const valor = this.expressao();
    this.pularEspacos();
    if (this.posicao < this.texto.length) throw new FormulaNaoSuportada();
    return valor;
  }

  private expressao(): Valor {
    let valor = this.termo();
    for (;;) {
      if (this.consumir("+")) valor = somar(valor, this.termo(), 1);
      else if (this.consumir("-")) valor = somar(valor, this.termo(), -1);
      else return valor;
    }
  }

  private termo(): Valor {
    let valor = this.fator();
    for (;;) {
      if (this.consumir("*")) {
        const direita = this.fator();
        valor = semDados(direita) ? escalar(valor, direita.constante) : escalar(direita, exigirConstante(valor));
      } else if (this.consumir("/")) {
        const divisor = exigirConstante(this.fator());
        if (divisor === 0) throw new FormulaNaoSuportada();
        valor = constante(exigirConstante(valor) / divisor);
      } else {
        return valor;
      }
    }
  }

  private fator(): Valor {
    this.pularEspacos();
    if (this.consumir("-")) return escalar(this.fator(), -1);
    if (this.consumir("(")) {
      const valor = this.expressao();
      if (!this.consumir(")")) throw new FormulaNaoSuportada();
      return valor;
    }
    const caractere = this.texto[this.posicao] ?? "";
    if (/[0-9]/.test(caractere) || (caractere === "d" && /[0-9]/.test(this.texto[this.posicao + 1] ?? ""))) return this.numeroOuDado();
    if (/[a-z]/.test(caractere)) return this.nomeOuFuncao();
    throw new FormulaNaoSuportada();
  }

  private numeroOuDado(): Valor {
    const quantidade = this.digitos();
    if (this.texto[this.posicao] !== "d") return constante(Number(quantidade));
    this.posicao++;
    const lados = this.digitos();
    if (!lados) throw new FormulaNaoSuportada();
    return { dados: new Map([[Number(lados), quantidade ? Number(quantidade) : 1]]), constante: 0 };
  }

  private nomeOuFuncao(): Valor {
    const inicio = this.posicao;
    while (/[a-z0-9_]/.test(this.texto[this.posicao] ?? "")) this.posicao++;
    const nome = this.texto.slice(inicio, this.posicao);

    if (!this.consumir("(")) {
      const valor = this.contexto.valor(nome);
      if (valor === null) throw new FormulaNaoSuportada();
      return constante(valor);
    }

    if (nome === FUNCAO_TREINADA) {
      this.pularEspacos();
      const pericia = this.identificador();
      if (!this.consumir(")")) throw new FormulaNaoSuportada();
      return constante(this.contexto.treinada(pericia) ? 1 : 0);
    }

    const funcao = funcoes[nome];
    if (!funcao) throw new FormulaNaoSuportada();
    const argumentos: Valor[] = [];
    do argumentos.push(this.expressao());
    while (this.consumir(","));
    if (!this.consumir(")")) throw new FormulaNaoSuportada();
    return funcao(argumentos);
  }

  private identificador(): string {
    const inicio = this.posicao;
    while (/[a-z0-9_]/.test(this.texto[this.posicao] ?? "")) this.posicao++;
    return this.texto.slice(inicio, this.posicao);
  }

  private digitos(): string {
    const inicio = this.posicao;
    while (/[0-9]/.test(this.texto[this.posicao] ?? "")) this.posicao++;
    return this.texto.slice(inicio, this.posicao);
  }

  private consumir(esperado: string): boolean {
    this.pularEspacos();
    if (this.texto[this.posicao] !== esperado) return false;
    this.posicao++;
    return true;
  }

  private pularEspacos(): void {
    while (this.texto[this.posicao] === " ") this.posicao++;
  }
}

export function avaliarFormula(formula: string, contexto: ContextoFormula): ResultadoFormula | null {
  try {
    const valor = new Leitor(formula, contexto).ler();
    const dados = [...valor.dados].map(([lados, quantidade]) => ({ quantidade, lados })).sort((a, b) => b.lados - a.lados);
    return { dados, constante: Math.floor(valor.constante) };
  } catch {
    return null;
  }
}

export function descreverFormula(resultado: ResultadoFormula): string {
  const partes = resultado.dados.map(({ quantidade, lados }, indice) => {
    const texto = `${Math.abs(quantidade)}d${lados}`;
    if (indice === 0) return quantidade < 0 ? `−${texto}` : texto;
    return quantidade < 0 ? `− ${texto}` : `+ ${texto}`;
  });
  if (resultado.constante !== 0 || partes.length === 0) {
    const numero = Math.abs(resultado.constante);
    partes.push(partes.length === 0 ? String(resultado.constante) : resultado.constante < 0 ? `− ${numero}` : `+ ${numero}`);
  }
  return partes.join(" ");
}
