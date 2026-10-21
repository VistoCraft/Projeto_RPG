# Regras — hub

Regras rígidas do repositório. Valem para todo código gerado ou alterado, e têm
precedência sobre o padrão do código existente.

**Este arquivo tem prioridade sobre todos os outros de `ai/` e sobre o `CLAUDE.md`.** Leia antes
de qualquer tarefa. Em caso de conflito, vale o que está aqui.

---

## R1 — Proibido comentário no código

**Não é permitido adicionar comentários no código.** O código deve ser autoexplicativo por
meio de nomes claros para classes, métodos, funções, variáveis e organização da
implementação. Comentários só devem existir quando houver **justificativa previamente
aprovada**.

### Abrangência

Vale para todo comentário, em qualquer sintaxe:

- `//` e `/* */` em `.ts` / `.tsx`
- `{/* */}` em JSX
- `/** */` (JSDoc/TSDoc)
- `<!-- -->` em HTML
- `#` em arquivos de configuração
- comentário de "seção" ou separador visual (`// ---- helpers ----`)
- código comentado (isso é código morto — apague)
- `// TODO`, `// FIXME`, `// HACK` (vire issue, não comentário)

### Em vez de comentar

| Impulso de comentar                 | O que fazer                                         |
| ----------------------------------- | --------------------------------------------------- |
| explicar o que o bloco faz          | extrair para função com nome descritivo             |
| explicar um número mágico           | constante nomeada: `GET_REQUEST_TIMEOUT_MS = 8_000` |
| explicar condição complexa          | variável booleana nomeada: `const isEntitled = …`   |
| explicar parâmetro                  | renomear parâmetro; tipar melhor                    |
| explicar por que um caso existe     | nome do enum/tipo carrega o significado             |
| marcar seção do arquivo             | dividir em arquivos                                 |
| deixar código antigo "por garantia" | apagar — o histórico do git guarda                  |
| documentar decisão de arquitetura   | escrever em `ai/`, não no código                    |

**Contexto que não cabe em nome vai para `ai/`.** É para isso que esta pasta existe.

### Exceção

Comentário só é permitido com **justificativa previamente aprovada**, registrada antes de
escrever o código. Não vale aprovar depois do fato.

### Código legado

Ao editar um arquivo que tem comentário:

- **código comentado:** apagar;
- **comentário explicativo:** remover, movendo o conteúdo relevante para `ai/` se tiver valor;
- **`TODO`/`FIXME`:** remover e registrar como tarefa fora do código.

Não sair caçando comentário em arquivo que a tarefa não pediu para tocar.

---

## R2 — Documentação viva

Ao identificar informação relevante durante o desenvolvimento — regra de negócio, integração,
entidade, padrão, fluxo, decisão de arquitetura, débito técnico — **atualizar o documento
correspondente em `ai/`** e manter o `CLAUDE.md` sincronizado.

Documentação desatualizada é pior que documentação ausente, porque induz erro.

**Uma linha por informação.** Não é diário de bordo: nada de seção nova, tabela, exemplo,
histórico de correção ou repetição do que o código já diz. Se a informação já está documentada,
**editar a linha existente** em vez de acrescentar outra. Descoberta que não cabe em uma linha
provavelmente é detalhe de implementação — fica no código.

Onde escrever:

| Descobriu | Vai para |
| --------- | -------- |
| Regra rígida que vale para todo código | `00-regras.md` (só com aprovação) |
| Regra de negócio do RPG (rolagem, cálculo, condição) | `01-contexto-do-projeto.md` |
| Fluxo de dados, estrutura de pastas ou layout | `02-arquitetura.md` |
| Componente novo, props ou dados de um componente | `03-componentes.md` |
| Integração, dependência ou configuração | `04-tecnologias.md` |
| Entidade ou campo salvo no `localStorage` | `05-estado-e-persistencia.md` |
| Decisão de arquitetura ou de biblioteca | `06-decisoes.md`, com data |
| Débito técnico, bug ou funcionalidade faltando | `07-pendencias.md` |
| Comando, convenção curta ou padrão de código | `CLAUDE.md` |

Arquivo novo em `ai/` **exige** entrada no índice do `CLAUDE.md`.

---

## R3 — Tabela de aderência no output

Todo output de tarefa termina com:

| Princípio                         | Seguido |
| --------------------------------- | ------- |
| Clean code                        |         |
| Code splitting adequado           |         |
| Reutilização de funções genéricas |         |
| DRY, KISS, SOLID                  |         |
| Clean architecture gradual        |         |

Desvio se declara com ⚠️ ou ❌ e explicação. Não marcar ✅ sem ter feito.

---

## R4 — Limite de tamanho de arquivo

Máximo **~250 linhas** por arquivo. Passou, divide por responsabilidade
(subcomponente, hook, util, store).

---

## R5 — Zero `any`

`tsconfig` tem `strict: true`. `any` e `@ts-ignore` são proibidos em código novo.
Desconhecido é `unknown` com narrowing. Ao tocar num `any` legado no arquivo que você já está
editando, tipe-o.

---

## R6 — HTTP só em repositório

`fetch` e `axios` não aparecem em componente, hook ou página. Toda chamada vive em
`src/repositories/*.ts`, através de uma instância de `FetchRestProvider`, com mapeamento
DTO → domínio.

---

## R7 — Segredo nunca no cliente

Variável `NEXT_PUBLIC_*` está no bundle do browser. Segredo exige route handler em
`src/app/api/` com env sem o prefixo. Autorização real é sempre do backend.

---

## R8 — Tailwind CSS sempre

Todo estilo é feito com classes utilitárias do **Tailwind CSS** no `className`. Isso vale para todo componente novo e para todo estilo alterado.

- **Proibido:** arquivo `.css` novo, CSS Modules, `styled-components`/CSS-in-JS, Bootstrap ou outro framework de estilo, e `style={{}}` para estilo fixo.
- `style={{}}` só é aceito para valor **dinâmico** que vem de dado (ex.: `width` da barra de progresso).
- Cor, fonte ou medida que se repete vira token no `@theme` de `app/globals.css` (ex.: `bg-vida`), não valor solto repetido.
- Combinação de classes repetida em mais de um componente vira constante em `app/components/estilos.ts` ou um componente próprio. Não use `@apply`.
- `app/globals.css` contém só `@import "tailwindcss"`, o `@theme` e o mínimo em `@layer base` que não dá para fazer com classe (ex.: `<option>`).
- Ícones continuam com `bootstrap-icons` (`bi bi-*`), que é só uma fonte de ícones.
