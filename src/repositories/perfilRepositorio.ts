import { api } from "../providers/api";
import type { Perfil } from "../dominio/perfil";

type PerfilDto = {
  email: string;
  apelido: string | null;
  pais: string | null;
  dataNascimento: string | null;
  comoConheceu: string | null;
  perfilCompleto: boolean;
};

export async function obterPerfil(): Promise<Perfil | null> {
  const resposta = await api.get("/perfil");
  return resposta.ok && ehPerfilDto(resposta.corpo) ? paraPerfil(resposta.corpo) : null;
}

function paraPerfil(dto: PerfilDto): Perfil {
  return { ...dto };
}

function ehPerfilDto(corpo: unknown): corpo is PerfilDto {
  return typeof corpo === "object" && corpo !== null && "email" in corpo && typeof corpo.email === "string" && "perfilCompleto" in corpo;
}
