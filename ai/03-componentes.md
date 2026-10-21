# Componentes

Todos ficam em `app/components/`. Os arrays de dados (atributos, perícias, condições, colunas) ficam no topo de cada arquivo e são renderizados com `.map`.

## `Ficha.tsx`

- `"use client"`. É a raiz da ficha e o único dono de estado.
- Chama `useDetalhes()` e passa `detalhes` / `alterar` para `Detalhes` e `Status`.
- Chama `useBarras()` e passa `barras` / `ajustarBarra` para `Status`.
- Chama `useTema()` e passa `tema` / `alternarTema` para `BotaoTema`, no cabeçalho com o logo e o título. Logo abaixo vem o `DivisorRunico`.
- Define o array `pericias: Pericia[]`, usado nas duas seções de perícias.
- Renderiza `Pericias` duas vezes:
  - **favoritas**: `prefixo="fav_"` (4 colunas). Título "Perícias favoritas".
  - **completa**: `completa`, sem prefixo (8 colunas, ocupa a largura toda).

## `usePersistido.ts`

Hook genérico: `usePersistido<T extends object>(chave, inicial)` retorna `[valor, setValor]`, como um `useState` que lê e salva no `localStorage`. É a base de `useDetalhes` e `useBarras`. Detalhes em [05-estado-e-persistencia.md](05-estado-e-persistencia.md).

## `useBarras.ts`

| Export | Tipo |
| --- | --- |
| `default useBarras()` | `() => [Barras, AjustarBarra]` |
| `type BarraId` | `"vida" \| "sanidade" \| "esforco"` |
| `type ValorBarra` | `{ atual: number; maximo: number }` |
| `type Barras` | `Record<BarraId, ValorBarra>` |
| `type AjustarBarra` | `(id: BarraId, variacao: number) => void` |

- Todas começam cheias: 100/100 (`VALOR_MAXIMO_PADRAO`).
- `ajustar` soma a `variacao` ao valor atual e limita o resultado entre `0` e o `maximo`.

## `useTema.ts`

- `useTema()` retorna `[Tema, AlternarTema]`; `type Tema = "claro" | "escuro"` (padrão `"escuro"`), chave `"tema"`.
- Um `useEffect` liga ou desliga a classe `dark` no `<html>`.

## `BotaoTema.tsx`

- Props: `{ tema: Tema; alternar: AlternarTema }`. Botão com ícone de sol (no escuro) ou lua (no claro) e `aria-label` "Usar tema claro/escuro".

## `DivisorRunico.tsx`

- Sem props. Linha em degradê de `essencia` para `arcano` com a constante `RUNAS` no centro, decorativa (`aria-hidden`).

## `useDetalhes.ts`

Hook de estado e persistência. Exporta:

| Export | Tipo |
| --- | --- |
| `default useDetalhes()` | `() => [Detalhes, Alterar]` |
| `type Detalhes` | Formato do objeto salvo (deduzido de `detalhesIniciais`) |
| `type Alterar` | `(e: ChangeEvent<HTMLInputElement \| HTMLSelectElement>) => void` |

Detalhes em [05-estado-e-persistencia.md](05-estado-e-persistencia.md).

## `Detalhes.tsx`

- Props: `{ detalhes: Detalhes; alterar: Alterar }`.
- Formulário "Detalhes Pessoais", com `onSubmit` bloqueado (`preventDefault`).
- Campos de texto vêm do array `campos`. Cada um usa o subcomponente `Campo`, cujo `id` é do tipo `CampoId`.
- `sexo` é um `<select>` com as opções `M` / `F` / `N`.

## `Status.tsx`

- Props: `{ detalhes: Detalhes; alterar: Alterar; barras: Barras; ajustarBarra: AjustarBarra }`.
- Topo: retrato (`/img/icon.jpg`) e dado (`/img/d21.png`).
- Renderiza 3 `Barra`: Vida, Sanidade e Esforço, cada uma ligada a `ajustarBarra(id, variacao)`.
- `Condicoes` (subcomponente): checkboxes não controlados. Arrays `condicoesVida` e `condicoesSanidade`.
- Inputs controlados para `dextra`, `corpo` e `exPara`.

## `Barra.tsx`

- Props: `titulo`, `corBarra` (token Tailwind: `bg-vida`, `bg-sanidade` ou `bg-esforco`), `valor: ValorBarra` e `ajustar: (variacao: number) => void`.
- Botões −/+ (`BotaoBarra`, com `aria-label` "Diminuir/Aumentar <titulo>") chamam `ajustar(∓PASSO)`, com `PASSO = 1`.
- Mostra `atual/maximo` na mesma linha do título, à direita. A largura da barra é `atual / maximo` em %, via `style` (valor dinâmico, permitido pela R8), com transição de 200 ms.

## `Atributos.tsx`

- Sem props.
- Array `atributos` com 8 itens (ids `atr_*`). Cada um tem um botão de rolagem (imagem d21) e um input `defaultValue="0"`.
- `Movimento` e `Tamanho` ficam fora do array, sem botão de rolagem. Há `<article>` vazios para alinhar o grid.

## `Pericias.tsx`

- Exporta `type Pericia = { id: string; nome: string }`.
- Props: `titulo`, `prefixo?` (padrão `""`), `pericias: Pericia[]` e `completa?` (padrão `false`). `completa` troca a grade de 4 para 8 colunas e faz a seção ocupar as 2 colunas da página.
- O `id` do input é `prefixo + id`, para não repetir ids entre as duas seções. O `name` fica sem prefixo.
- Cada item tem um botão quadrado de favoritar (ainda sem ação).

## `Combate.tsx`

- Sem props.
- Array `colunas` (cabeçalho) e `armas` (4 linhas iguais de **exemplo**, geradas com `Array.from`).

## `Cabecalho.tsx`

- Props: `{ titulo: string }`.
- Título da seção, botões "ver" / "editar" (ainda sem ação) e uma linha divisória.
- Usado por `Pericias` e `Combate`.

## `estilos.ts`

Constantes com combinações de classes Tailwind usadas em mais de um componente (regra R8):

| Constante | Uso |
| --- | --- |
| `cartao` | Fundo `superficie`, borda `borda`, cantos arredondados, padding e sombra leve das seções |
| `tituloSecao` | Título `h2` das seções |
| `rotulo` | `<label>` dos campos |
| `campoLinha` | Input/select de texto com linha embaixo (`Detalhes`) |
| `campoNumero` | Input numérico grande e centralizado (atributos, perícias, status) |
| `botaoContorno` | Botões "ver" / "editar" e `BotaoTema` |
| `botaoPrincipal` | Botão de ação principal (largura toda, fundo `arcano-texto-claro`, texto branco) |
| `link` | Link em `acento`, sublinhado no hover |

## `autenticacao/`

| Arquivo | Papel |
| --- | --- |
| `TelaAutenticacao.tsx` | `"use client"`. Moldura das telas: logo, `BotaoTema`, `DivisorRunico` e `children`, centralizados (máx. 440px) |
| `CartaoFormulario.tsx` | Props `titulo`, `textoBotao`, `envio: EnvioFormulario`, `rodape`, `children`. Mostra os erros com `role="alert"` e desativa o botão enquanto envia |
| `CampoFormulario.tsx` | Props `id`, `nome`, `tipo` (`email` / `password`), `valor`, `aoAlterar`, `autoComplete`, `dica?`. Input `required` com rótulo e dica ligada por `aria-describedby` |
| `useEnvioFormulario.ts` | `(acao, aoConcluir) => { enviando, erros, enviar }`. Chama `acao()` no submit; sucesso chama `aoConcluir`, falha guarda os erros |
| `FormularioLogin.tsx` | `"use client"`. E-mail e senha, chama `entrar` |
| `FormularioCadastro.tsx` | `"use client"`. E-mail, senha e confirmação. Confere se as senhas batem, chama `cadastrar` e depois `entrar` |
| `rotas.ts` | `ROTA_APOS_LOGIN = "/"` |

## Ao criar um componente novo

1. Arquivo `.tsx` em `app/components/`, com nome em português e PascalCase.
2. Tipe as props com `type <Nome>Props`.
3. Estilize só com classes Tailwind. Reaproveite as constantes de `estilos.ts`; se uma combinação nova se repetir, adicione lá.
4. Só use `"use client"` se ele tiver hooks **e** for importado fora de `Ficha`.
5. Adicione uma seção neste arquivo e atualize a árvore em [02-arquitetura.md](02-arquitetura.md).
