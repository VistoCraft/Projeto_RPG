# Estado e persistência

## Como funciona hoje

- Todo estado salvo passa por `usePersistido(chave, inicial)` (`app/components/usePersistido.ts`). Hoje há três chaves: `"detalhes"` (`useDetalhes`), `"barras"` (`useBarras`) e `"tema"` (`useTema`).
- **Leitura:** um `useEffect` lê `localStorage[chave]` uma única vez, depois da hidratação. Ele mescla com o valor inicial, então chaves novas ganham o valor padrão mesmo em dados salvos antigos. JSON inválido é ignorado (`try/catch`).
- **Escrita:** outro `useEffect` salva o objeto inteiro a cada mudança. A flag `carregado` impede que o estado inicial vazio sobrescreva os dados salvos antes da leitura.
- **Alteração dos detalhes:** `alterar` é um `onChange` genérico. Ele usa o atributo `name` do input como chave: `{ ...atual, [name]: value }`.

## O que é salvo

| Chave | Campo | Componente |
| --- | --- | --- |
| `nome`, `jogador`, `classe`, `idade`, `origem`, `patente` | Texto | `Detalhes.tsx` |
| `sexo` | Select `M` / `F` / `N` (padrão `N`) | `Detalhes.tsx` |
| `dextra`, `corpo`, `exPara` | Texto (padrão `"0"`) | `Status.tsx` |

Todos os valores de `"detalhes"` são `string`.

| Chave `"barras"` | Formato | Componente |
| --- | --- | --- |
| `vida`, `sanidade`, `esforco` | `{ atual: number; maximo: number }` (padrão 100/100) | `Barra.tsx`, via `Status.tsx` |

| Chave `"tema"` | Formato | Componente |
| --- | --- | --- |
| `tema` | `"claro"` \| `"escuro"` (padrão `"escuro"`) | `BotaoTema.tsx`, via `Ficha.tsx` |

- Os botões −/+ mudam `atual` de 1 em 1, sempre entre 0 e `maximo`. O `maximo` ainda não é editável na tela.

## O que ainda **não** é salvo

| Dado | Situação atual |
| --- | --- |
| Atributos | `defaultValue="0"`, não controlado |
| Perícias (as duas seções) | `defaultValue="0"`, não controlado. As duas seções não estão ligadas entre si. |
| Condições (checkboxes) | Não controlados |
| Tabela de combate | Dados de exemplo fixos em `Combate.tsx` |

## Persistir um campo novo nos detalhes

1. Adicione a chave com o valor padrão em `detalhesIniciais` (`useDetalhes.ts`). O tipo `Detalhes` se atualiza sozinho.
2. Se o input usa `Campo` (`Detalhes.tsx`), inclua a chave no tipo `CampoId`.
3. No input: `name="<chave>"`, `value={detalhes.<chave>}` e `onChange={alterar}`.
4. Atualize a tabela "O que é salvo" acima.

Para dados de outra natureza (números, listas, booleanos), como barras, armas ou condições, não force tudo dentro de `Detalhes`, que só tem strings. Crie uma chave nova no `localStorage` com um hook próprio sobre `usePersistido`, como em `useBarras`. Registre a escolha em [06-decisoes.md](06-decisoes.md).

## Regras sobre hidratação

- **Nunca leia `localStorage`, `window`, `Date.now()` ou `Math.random()` durante o render.** O HTML do servidor tem que ser igual ao primeiro render do cliente. Use `useEffect`.
- Aninhamento de HTML inválido também causa erro de hidratação. Exemplos: `<div>` dentro de `<p>`, `<button>` dentro de `<button>`, `<tr>` fora de `<tbody>`.
- **Extensões do navegador** podem alterar o HTML antes do React carregar e causar o mesmo erro, sem culpa do código. Já aconteceu: uma extensão injetou `id="brk_yuan"` no `<div hidden>` de metadados do Next. Para conferir, abra a página em janela anônima.
- O diff exato de um erro de hidratação aparece em `.next/dev/logs/next-development.log`.
