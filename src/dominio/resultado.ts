export type Falha = { sucesso: false; erros: string[] };

export type Resultado<T> = { sucesso: true; valor: T } | Falha;
