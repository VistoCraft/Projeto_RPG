# Registro de decisões

Uma entrada por decisão, a mais recente no topo. Formato: **data — título**, depois *contexto*, *decisão* e *consequências*.

---

## 2026-10-21 — Barras com −/+ e hook genérico de persistência

- **Contexto:** os botões −/+ de Vida, Sanidade e Esforço não faziam nada. As barras mostravam valores fixos (67/100 e 50%), que nem batiam entre si.
- **Decisão:** as barras ficam no estado com `{ atual, maximo }`, salvas na chave nova `"barras"` (hook `useBarras`). Cada clique muda 1 ponto, sempre entre 0 e o máximo, e todas começam em 100/100. A lógica de ler e salvar no `localStorage` saiu do `useDetalhes` e virou o hook genérico `usePersistido`, usado pelos dois. A `Barra` foi para um arquivo próprio, `Barra.tsx`.
- **Consequências:** um dado novo para salvar é só mais um hook sobre `usePersistido`. Os detalhes já salvos não mudam (mesma chave e mesmo formato).

## 2026-10-21 — Migração dos estilos para Tailwind CSS

- **Contexto:** o estilo misturava CSS global em `styles/` (seletores de tag como `input` e `h2`) com o CSS do Bootstrap. Isso dificultava saber de onde vinha cada estilo.
- **Decisão:** usar Tailwind CSS v4 como padrão único (regra R8). As cores viraram tokens no `@theme` de `app/globals.css`, e as combinações repetidas viraram constantes em `app/components/estilos.ts`. Foram removidos a pasta `styles/` (o reset de Meyer foi trocado pelo preflight do Tailwind) e o pacote `bootstrap`. O `bootstrap-icons` ficou, só para ícones. As props que existiam só para passar nome de classe CSS foram trocadas: `Pericias` agora recebe `completa`, e `Cabecalho` não recebe mais `classeTitulo`.
- **Consequências:** o visual foi mantido, inclusive a tabela de combate com fundo branco que vinha do Bootstrap. Todo estilo novo é escrito com classe Tailwind.

## 2026-10-21 — Aplicação das regras de `00-regras.md` no código

- **Contexto:** as regras R1 a R7 foram criadas depois do código.
- **Decisão:** R1: o comentário de `useDetalhes.ts` foi removido, e os de `styles/reset.css` também, com a origem do arquivo registrada em `04-tecnologias.md`. R4 e R5 já eram cumpridas. R6 e R7 não se aplicam, porque não há HTTP nem segredos.
- **Consequências:** na mesma passada foram corrigidos os textos da tela: "Perícias favoritas", "Perícias", "Inconsciente" (id `inconsciente`), "Inteligência", "Ciência" e "Classe".

## 2026-10-21 — Regras com prioridade, no número `00`

- **Contexto:** as regras rígidas do repositório foram escritas em `07-regras.md`, mas precisavam valer acima dos outros documentos.
- **Decisão:** as regras passaram a ser `00-regras.md`, e os outros arquivos desceram uma posição (o contexto virou `01`, e assim por diante). O topo do arquivo de regras, o `01-contexto-do-projeto.md` e o `CLAUDE.md` dizem que as regras têm prioridade. A tabela "Onde escrever" da R2 passou a ser a única referência sobre o que atualizar e onde.
- **Consequências:** o `00` é reservado às regras. O índice da pasta fica no `CLAUDE.md` e no `01-contexto-do-projeto.md`.

## 2026-10-21 — Padrão de nome dos arquivos em `ai/`

- **Contexto:** os arquivos tinham nomes soltos (`arquitetura.md`, `estado.md`...), sem ordem de leitura.
- **Decisão:** usar `NN-nome-em-kebab-case.md`, com `NN` de dois dígitos. `01-contexto-do-projeto.md` é a porta de entrada e o índice (substitui o antigo `README.md` da pasta). A stack saiu de `02-arquitetura.md` e foi para `04-tecnologias.md`.
- **Consequências:** um arquivo novo pega o próximo número livre. *Revisado na entrada acima: houve uma renumeração para as regras ficarem com o `00`.*

## 2026-10-21 — Documentação de arquitetura na pasta `ai/`

- **Contexto:** o `CLAUDE.md` estava acumulando detalhes de arquitetura, estado e pendências.
- **Decisão:** o `CLAUDE.md` fica só com as regras curtas. Os detalhes vão para arquivos `.md` em `ai/`, separados por assunto.
- **Consequências:** toda mudança relevante precisa atualizar o arquivo certo em `ai/`. O roteiro está em [01-contexto-do-projeto.md](01-contexto-do-projeto.md).

## 2026-10-21 — Conversão para TypeScript

- **Contexto:** o projeto em Next.js estava em JavaScript.
- **Decisão:** usar TypeScript com `strict: true`. Componentes em `.tsx`, hook e config em `.ts`, e `tsconfig.json` no lugar do `jsconfig.json`. Os tipos compartilhados são exportados de onde nascem: `Detalhes` e `Alterar` de `useDetalhes.ts`, `Pericia` de `Pericias.tsx`.
- **Consequências:** o `yarn build` passa a checar os tipos. O `yarn add` instalou o TypeScript 7.0.2, e o Next 16.4.2 aceitou essa versão no build.

## 2026-10-21 — Erro de hidratação vinha de extensão do navegador

- **Contexto:** apareceu "Hydration failed..." no navegador.
- **Decisão:** nenhuma mudança no código. O diff mostrou uma extensão alterando o `<div hidden>` de metadados do Next (`id="brk_yuan"`). Num perfil limpo do Chrome, não houve erro.
- **Consequências:** em erros de hidratação, primeiro teste em janela anônima e leia o diff em `.next/dev/logs/next-development.log`. Veja [05-estado-e-persistencia.md](05-estado-e-persistencia.md).

## Port de HTML + jQuery para Next.js (branch `feat/nextjs-port`)

- **Contexto:** a versão original era `index.html` + `js/main.js` (jQuery), salvando cada campo no `localStorage` no evento `blur`.
- **Decisão:** reescrever em Next.js (App Router) + React. As seções viraram componentes, as listas viraram arrays com `.map` e a persistência foi para o hook `useDetalhes`, salvando a cada alteração. As imagens foram para `public/img/` e o CSS para `styles/`. O JS do Bootstrap e o jQuery foram removidos.
- **Consequências:** a chave `"detalhes"` do `localStorage` foi mantida, então quem já tinha dados salvos não os perde. Os botões que não faziam nada na versão original continuam sem ação.
