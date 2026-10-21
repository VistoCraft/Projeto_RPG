# Arquitetura

Tecnologias e configuração: [04-tecnologias.md](04-tecnologias.md). Contexto e histórico: [01-contexto-do-projeto.md](01-contexto-do-projeto.md).

## Como a página é montada

Rotas: `/` (ficha), `/login` e `/cadastro`. As duas últimas ficam no route group `app/(autenticacao)/`, que tem um layout próprio (`TelaAutenticacao`). Login e cadastro falam com o backend (`Projeto_RPG_Backend`); a ficha ainda não.

```
app/layout.tsx          (Server Component)  <html class="dark">, <body>, metadata, fontes, globals.css e bootstrap-icons
└─ app/page.tsx         (Server Component)  só renderiza <Ficha />
   └─ Ficha.tsx         ("use client")      dono do estado, monta as seções
      ├─ BotaoTema      alterna claro / escuro             ← tema, alternarTema
      ├─ DivisorRunico  linha com runas abaixo do título
      ├─ Detalhes       formulário de dados pessoais       ← detalhes, alterar
      ├─ Status         ícones, barras, condições, extras  ← detalhes, alterar, barras, ajustarBarra
      │  └─ Barra (x3)  Vida / Sanidade / Esforço com −/+
      ├─ Atributos      grade de atributos + botão d20
      ├─ Pericias       perícias favoritas (prefixo "fav_")
      │  └─ Cabecalho
      ├─ Combate        tabela de armas
      │  └─ Cabecalho
      └─ Pericias       todas as perícias
         └─ Cabecalho
```

Como `Ficha.tsx` tem `"use client"`, tudo o que ele importa também vira client component. Na prática, o servidor só gera o HTML inicial (pré-renderização estática) e o React assume no navegador (hidratação).

## Telas de autenticação

```
app/(autenticacao)/layout.tsx  ─► TelaAutenticacao ("use client": useTema, BotaoTema, DivisorRunico)
├─ login/page.tsx    ─► FormularioLogin    ─► entrar()                      ─┐
└─ cadastro/page.tsx ─► FormularioCadastro ─► cadastrar() e depois entrar()  ─┤
                                                                              ▼
        src/repositories/autenticacaoRepositorio ─► src/providers/api (FetchRestProvider) ─► POST /auth/register, /auth/login?useCookies=true
```

- Os dois formulários usam `CartaoFormulario` (título, erros, botão, rodapé) e `useEnvioFormulario` (estado `enviando` / `erros`).
- Deu certo: `router.push(ROTA_APOS_LOGIN)` (`/`). O backend grava o cookie de sessão.
- O repositório converte os códigos de erro do Identity (`DuplicateUserName`, `PasswordTooShort`, `Failed`...) em mensagens em português.

## Fluxo de dados

```
localStorage["detalhes"]            localStorage["barras"]        localStorage["tema"]
      │  usePersistido: lê em useEffect (depois da hidratação), salva a cada mudança
      ▼                                   ▼
useDetalhes() ─► [detalhes, alterar]   useBarras() ─► [barras, ajustarBarra]   useTema() ─► [tema, alternarTema]
                       │ props                              │ props
                       ▼                                    ▼
          Detalhes / Status (inputs)          Status ─► Barra (botões −/+)
```

- Só os **detalhes**, as **barras** e o **tema** passam pelo estado do React. Atributos, perícias, condições e combate ainda são estáticos ou não controlados (`defaultValue`). Veja [05-estado-e-persistencia.md](05-estado-e-persistencia.md).
- Os dados descem por props a partir de `Ficha`. Não há Context nem biblioteca de estado. O padrão é um hook por tipo de dado, todos sobre `usePersistido`. Se a quantidade de props passando por `Status` crescer demais, avalie um Context. Registre a escolha em [06-decisoes.md](06-decisoes.md).

## Layout

Feito com classes Tailwind direto no JSX (regra R8):

- `main` (`Ficha.tsx`) é `grid grid-cols-2 gap-[30px] w-[940px] mx-auto`: grid de **2 colunas**, largura fixa de **940px** e centralizado. Ainda não é responsivo.
- A ordem no grid segue a ordem do JSX em `Ficha.tsx`:

| Linha | Coluna 1 | Coluna 2 |
| --- | --- | --- |
| 1 | Cabeçalho: logo, título e `BotaoTema` (`col-span-2`) | |
| 1b | `DivisorRunico` (`col-span-2`) | |
| 2 | `Detalhes` | `Status` |
| 3 | `Atributos` (`grid-cols-4`) | `Pericias` favoritas (`grid-cols-4`) |
| 4 | `Combate` (`col-span-2`) | |
| 5 | `Pericias` completa (`col-span-2`, `grid-cols-8`) | |

- Identidade visual: `Projeto_RPG_Planejamento/03-identidade-visual.md`. As cores são tokens no `@theme static` de `app/globals.css`: a paleta (`pergaminho`, `nevoa`, `abismo`, `noite`, `arcano`, `essencia`, `mare`...), as barras (`vida`, `sanidade`, `esforco`) e os tokens de papel (`fundo`, `superficie`, `borda`, `texto`, `destaque`, `acento`, `trilho`). Componentes usam os tokens de papel (`bg-superficie`, `text-destaque`); a classe `.dark` no `<html>` troca o valor deles, então não é preciso `dark:` nas classes.
- Fontes: `font-titulo` (Almendra) em títulos e `font-texto` (Literata) no resto, carregadas por `next/font/google` em `layout.tsx`.
- As combinações de classes usadas em mais de um componente ficam em `app/components/estilos.ts`: `cartao`, `tituloSecao`, `rotulo`, `campoLinha`, `campoNumero` e `botaoContorno`.
- O reset de estilos é o *preflight* do próprio Tailwind.
