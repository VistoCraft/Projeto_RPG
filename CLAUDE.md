# Guia de edição — Projeto_RPG

Ficha interativa de jogador para RPG, feita em **Next.js 16 (App Router)** com **React 19**, em **TypeScript** (`strict`, arquivos `.ts`/`.tsx`). A interface é em português.

## Comandos

Use **Yarn** (v1). Não use npm: não deve existir `package-lock.json`, só `yarn.lock`.

| Comando             | O que faz                                            |
| ------------------- | ---------------------------------------------------- |
| `yarn install`      | Instala as dependências                              |
| `yarn dev`          | Servidor de desenvolvimento em http://localhost:3000 |
| `yarn build`        | Build de produção (use para validar mudanças)        |
| `yarn start`        | Roda o build de produção                             |
| `yarn add <pacote>` | Adiciona uma dependência                             |

## Estrutura

```
ai/                    # Documentação do projeto (NN-nome.md; 00-regras tem prioridade)
app/
  globals.css          # Tailwind: @import, @theme (paleta, tokens de papel, fontes) e @layer base (.dark, option)
  layout.tsx           # HTML raiz (classe "dark"), metadata, fontes (next/font), globals.css e bootstrap-icons
  page.tsx             # Rota "/" — só renderiza <Ficha />
  (autenticacao)/      # Route group: layout com TelaAutenticacao, rotas /login e /cadastro
  components/
    Ficha.tsx          # "use client" — monta a página e guarda o estado
    usePersistido.ts   # Hook genérico: useState + leitura/escrita no localStorage
    useDetalhes.ts     # Hook: estado dos detalhes (chave "detalhes")
    useBarras.ts       # Hook: Vida/Sanidade/Esforço e ajuste por −/+ (chave "barras")
    useTema.ts         # Hook: tema claro/escuro e classe "dark" no <html> (chave "tema")
    BotaoTema.tsx      # Botão que alterna o tema
    DivisorRunico.tsx  # Linha decorativa com runas abaixo do título
    Detalhes.tsx       # Formulário "Detalhes Pessoais"
    Status.tsx         # Ícones, barras (Vida/Sanidade/Esforço), condições, Dano Extra/Corpo/Exposição
    Barra.tsx          # Barra de progresso com botões −/+
    Atributos.tsx      # Grade de atributos com botão de rolagem
    Pericias.tsx       # Grade de perícias (usada 2x: favoritas e completa)
    Combate.tsx        # Tabela de armas
    Cabecalho.tsx      # Título de seção com botões "ver" / "editar"
    estilos.ts         # Combinações de classes Tailwind reutilizadas (cartao, campoNumero, botaoPrincipal, link...)
    autenticacao/      # Telas de login e cadastro: TelaAutenticacao, CartaoFormulario, CampoFormulario,
                       #   FormularioLogin, FormularioCadastro, useEnvioFormulario, rotas.ts
src/
  dominio/             # Tipos de domínio (Credenciais, ResultadoAutenticacao)
  providers/           # FetchRestProvider e a instância api (URL em NEXT_PUBLIC_API_URL)
  repositories/        # Únicas chamadas HTTP (regra R6), com DTO → domínio
public/img/            # Imagens, servidas em /img/...
```

## Convenções

- **TypeScript**: componentes em `.tsx`, o resto em `.ts`. Tipe as props de cada componente com um `type <Nome>Props`. Os tipos `Detalhes` e `Alterar` são exportados de `useDetalhes.ts`; `Barras`, `BarraId`, `ValorBarra` e `AjustarBarra` de `useBarras.ts`; `Tema` e `AlternarTema` de `useTema.ts`; `Pericia` de `Pericias.tsx`. Não crie arquivos `.js`. O `yarn build` roda a checagem de tipos.
- **Nomes em português**: componentes, variáveis, funções, constantes de estilo e tokens do tema (`detalhes`, `alterar`, `cartao`, `bg-vida`...). Siga o mesmo padrão.
- **Listas viram arrays**: campos repetidos (atributos, perícias, condições, colunas da tabela) ficam em um array no topo do componente e são renderizados com `.map`. Para adicionar um atributo ou perícia, basta incluir um item no array.
- **Client components**: só `Ficha.tsx` e os hooks (`use*.ts`) têm `"use client"`. Os outros componentes são importados por `Ficha`, então também rodam no cliente. Coloque `"use client"` apenas em componentes novos que usem hooks e sejam importados fora de `Ficha`.
- **Estilo = Tailwind CSS (v4), sempre** (regra R8 em `ai/00-regras.md`). Classes utilitárias no `className`. Não crie arquivo `.css`, não use CSS Modules, Bootstrap nem `style={{}}` fixo. Cores do projeto são tokens no `@theme` de `app/globals.css`. Nos componentes use os tokens de papel (`bg-fundo`, `bg-superficie`, `border-borda`, `text-texto`, `text-destaque`, `text-acento`), que já trocam no tema escuro; não use `dark:` nem `white`/`black`. Títulos com `font-titulo`, texto com `font-texto`. Identidade visual em `../Projeto_RPG_Planejamento/03-identidade-visual.md`. Combinações repetidas ficam em `app/components/estilos.ts`.
- **Ícones**: `bootstrap-icons` (classes `bi bi-*`), importado em `app/layout.tsx`. É o único pacote do Bootstrap no projeto.
- **Imagens**: arquivos em `public/img/`, referenciados com caminho absoluto (`/img/d21.png`), tanto no `src` quanto em classe Tailwind (`bg-[url(/img/d21.png)]`). Hoje usamos `<img>` simples, não `next/image`.

## Backend

- A API é o `../Projeto_RPG_Backend` (ASP.NET Core), em `http://localhost:5228`. Para testar login e cadastro, suba os dois.
- A URL vem de `NEXT_PUBLIC_API_URL` (exemplo em `.env.example`); sem ela, o padrão é `http://localhost:5228`. Não commite arquivos `.env`.
- A sessão é o cookie do Identity: toda chamada passa por `FetchRestProvider`, que usa `credentials: "include"`.

## Estado e persistência

- Todo estado salvo usa `usePersistido(chave, inicial)`. Dado de natureza diferente ganha hook e chave próprios (ex.: `useBarras`, chave `"barras"`), chamado em `Ficha` e passado por props.
- `useDetalhes()` retorna `[detalhes, alterar]`. `alterar` usa o `name` do input como chave, então o `name` precisa ser igual à chave em `detalhesIniciais`.
- Não leia `localStorage` durante o render, só em `useEffect`. Ler no render causa erro de hidratação.
- Campos salvos, o que ainda não é salvo e o passo a passo para persistir um campo novo: [`ai/05-estado-e-persistencia.md`](ai/05-estado-e-persistencia.md).

## Documentação em `ai/`

**Leia primeiro [`ai/00-regras.md`](ai/00-regras.md).** As regras de lá têm prioridade sobre este arquivo e sobre os outros documentos de `ai/`. A R2 diz o que atualizar e onde a cada mudança.

| Arquivo | Conteúdo |
| --- | --- |
| [`ai/00-regras.md`](ai/00-regras.md) | Regras rígidas (prioridade máxima) |
| [`ai/01-contexto-do-projeto.md`](ai/01-contexto-do-projeto.md) | O que é o projeto, histórico e regras do jogo |
| [`ai/02-arquitetura.md`](ai/02-arquitetura.md) | Montagem da página, fluxo de dados e layout |
| [`ai/03-componentes.md`](ai/03-componentes.md) | Componentes, props e dados |
| [`ai/04-tecnologias.md`](ai/04-tecnologias.md) | Stack, dependências e configuração |
| [`ai/05-estado-e-persistencia.md`](ai/05-estado-e-persistencia.md) | Estado, `localStorage` e hidratação |
| [`ai/06-decisoes.md`](ai/06-decisoes.md) | Registro de decisões com data |
| [`ai/07-pendencias.md`](ai/07-pendencias.md) | Pendências, bugs e débitos técnicos |

Os arquivos seguem o padrão `NN-nome-em-kebab-case.md`. Arquivo novo em `ai/` precisa entrar nesta tabela.

## Antes de concluir uma mudança

1. Rode `yarn build` e confira se passa sem erros.
2. Se mexeu em estado ou localStorage, teste no navegador com `yarn dev`: edite um campo, recarregue a página e veja se o valor continua lá.
3. Atualize os arquivos de `ai/` afetados pela mudança.
