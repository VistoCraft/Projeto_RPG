# Tecnologias

## Stack

| Camada | Tecnologia |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19 |
| Linguagem | TypeScript (`strict`), arquivos `.ts` / `.tsx` |
| Estilo | Tailwind CSS v4 (sempre, regra R8) + Bootstrap Icons para ícones |
| Persistência | `localStorage` para a ficha; contas no backend (`Projeto_RPG_Backend`, ASP.NET Core + PostgreSQL) |
| HTTP | `fetch` só dentro de `src/providers/FetchRestProvider.ts`, chamado pelos repositórios de `src/repositories/` (regra R6) |
| Pacotes | Yarn v1 (nunca npm) |

## Dependências (`package.json`)

| Pacote | Tipo | Uso |
| --- | --- | --- |
| `next`, `react`, `react-dom` | produção | Framework e UI |
| `bootstrap-icons` | produção | Ícones `bi bi-*` (ex.: botões −/+ das barras) |
| `next/font/google` | (vem com o `next`) | Almendra e Literata, baixadas no build e servidas pelo próprio site |
| `tailwindcss`, `@tailwindcss/postcss`, `postcss` | desenvolvimento | Tailwind v4, integrado ao Next via PostCSS |
| `typescript` | desenvolvimento | Checagem de tipos. O `yarn add` instalou a 7.0.2. |
| `@types/react`, `@types/react-dom`, `@types/node` | desenvolvimento | Tipos |

## Tailwind

- Versão 4: não há `tailwind.config`. Os tokens de cor ficam no `@theme static` de `app/globals.css` (`static` gera todas as variáveis, porque `.dark` referencia cores que nenhuma classe usa direto). As fontes ficam no `@theme inline`, apontando para as variáveis do `next/font`.
- O *preflight* do Tailwind faz o reset dos estilos do navegador.

## Arquivos de configuração

| Arquivo | Papel |
| --- | --- |
| `package.json` | Scripts `dev` / `build` / `start` e dependências |
| `yarn.lock` | Versões travadas. Não deve existir `package-lock.json`. |
| `tsconfig.json` | TypeScript `strict`, atalho `@/*` → raiz do projeto |
| `next.config.ts` | Configuração do Next (vazia por enquanto) |
| `postcss.config.mjs` | Carrega o plugin `@tailwindcss/postcss` |
| `app/globals.css` | Entrada do Tailwind e tokens do tema |
| `.env.example` | `NEXT_PUBLIC_API_URL` (URL do backend). Copie para `.env.local` se precisar de outro valor; o padrão é `http://localhost:5228` |
| `next-env.d.ts` | Gerado pelo Next; está no `.gitignore` |
| `.gitignore` | Ignora `node_modules/`, `.next/`, `out/`, logs e `.env*.local` |

## Ferramentas úteis

- `yarn build` compila e checa os tipos. É a validação principal, já que não há testes automatizados.
- `.next/dev/logs/next-development.log` guarda os logs do `yarn dev`, incluindo erros do navegador com o diff completo de hidratação.
