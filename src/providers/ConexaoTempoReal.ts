import { HubConnectionBuilder, HubConnectionState, LogLevel, type HubConnection } from "@microsoft/signalr";
import { URL_API } from "./api";

const ROTA_HUB_MESA = "/hubs/mesa";
const METODO_ENTRAR = "EntrarNaMesa";
const METODO_SAIR = "SairDaMesa";

export type OuvinteEvento = (...argumentos: unknown[]) => void;

export default class ConexaoTempoReal {
  private conexao: HubConnection | null = null;
  private iniciando: Promise<void> | null = null;
  private readonly mesasAcompanhadas = new Map<string, number>();

  async acompanharMesa(mesaId: string): Promise<void> {
    this.mesasAcompanhadas.set(mesaId, (this.mesasAcompanhadas.get(mesaId) ?? 0) + 1);
    const conexao = await this.conectar();
    await conexao.invoke(METODO_ENTRAR, mesaId);
  }

  async deixarMesa(mesaId: string): Promise<void> {
    const restantes = (this.mesasAcompanhadas.get(mesaId) ?? 1) - 1;
    if (restantes > 0) {
      this.mesasAcompanhadas.set(mesaId, restantes);
      return;
    }
    this.mesasAcompanhadas.delete(mesaId);
    const conexao = await this.conectar();
    await conexao.invoke(METODO_SAIR, mesaId);
  }

  async ouvir(evento: string, ouvinte: OuvinteEvento): Promise<void> {
    (await this.conectar()).on(evento, ouvinte);
  }

  async pararDeOuvir(evento: string, ouvinte: OuvinteEvento): Promise<void> {
    (await this.conectar()).off(evento, ouvinte);
  }

  private async conectar(): Promise<HubConnection> {
    const conexao = this.conexao ?? this.criar();
    if (conexao.state === HubConnectionState.Disconnected) {
      this.iniciando ??= conexao.start().finally(() => {
        this.iniciando = null;
      });
    }
    if (this.iniciando) await this.iniciando;
    return conexao;
  }

  private criar(): HubConnection {
    const conexao = new HubConnectionBuilder()
      .withUrl(`${URL_API}${ROTA_HUB_MESA}`, { withCredentials: true })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();
    conexao.onreconnected(() => {
      this.mesasAcompanhadas.forEach((_, mesaId) => void conexao.invoke(METODO_ENTRAR, mesaId).catch(() => undefined));
    });
    this.conexao = conexao;
    return conexao;
  }
}

export const conexaoMesa = new ConexaoTempoReal();
