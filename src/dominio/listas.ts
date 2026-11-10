export function moverItem<T>(lista: T[], de: number, para: number): T[] {
  if (de === para || de < 0 || de >= lista.length || para < 0 || para >= lista.length) return lista;
  const copia = [...lista];
  const [item] = copia.splice(de, 1);
  copia.splice(para, 0, item);
  return copia;
}
