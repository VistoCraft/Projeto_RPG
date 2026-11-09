import { api } from "../providers/api";
import type { Template } from "../dominio/template";
import { ehObjeto } from "./errosApi";

export async function listarTemplates(): Promise<Template[]> {
  const resposta = await api.get("/templates");
  return resposta.ok && Array.isArray(resposta.corpo) ? resposta.corpo.filter(ehTemplate) : [];
}

function ehTemplate(valor: unknown): valor is Template {
  return ehObjeto(valor) && typeof valor.id === "string" && typeof valor.nome === "string";
}
