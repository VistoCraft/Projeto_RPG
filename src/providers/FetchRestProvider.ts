export const STATUS_SEM_CONEXAO = 0;

export type RespostaRest = {
  ok: boolean;
  status: number;
  corpo: unknown;
};

export default class FetchRestProvider {
  private readonly urlBase: string;

  constructor(urlBase: string) {
    this.urlBase = urlBase;
  }

  async post(caminho: string, corpo: unknown): Promise<RespostaRest> {
    try {
      const resposta = await fetch(`${this.urlBase}${caminho}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpo),
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
