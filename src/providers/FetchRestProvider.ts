export const STATUS_SEM_CONEXAO = 0;

export type RespostaRest = {
  ok: boolean;
  status: number;
  corpo: unknown;
};

type MetodoHttp = "GET" | "POST";

export default class FetchRestProvider {
  private readonly urlBase: string;

  constructor(urlBase: string) {
    this.urlBase = urlBase;
  }

  get(caminho: string): Promise<RespostaRest> {
    return this.requisitar("GET", caminho);
  }

  post(caminho: string, corpo?: unknown): Promise<RespostaRest> {
    return this.requisitar("POST", caminho, corpo);
  }

  private async requisitar(metodo: MetodoHttp, caminho: string, corpo?: unknown): Promise<RespostaRest> {
    try {
      const resposta = await fetch(`${this.urlBase}${caminho}`, {
        method: metodo,
        credentials: "include",
        headers: corpo === undefined ? undefined : { "Content-Type": "application/json" },
        body: corpo === undefined ? undefined : JSON.stringify(corpo),
      });
      return { ok: resposta.ok, status: resposta.status, corpo: await lerCorpo(resposta) };
    } catch {
      return { ok: false, status: STATUS_SEM_CONEXAO, corpo: null };
    }
  }
}

async function lerCorpo(resposta: Response): Promise<unknown> {
  const texto = await resposta.text();
  try {
    return texto ? JSON.parse(texto) : null;
  } catch {
    return texto;
  }
}
