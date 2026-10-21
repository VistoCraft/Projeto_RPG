# Arquitetura

Tecnologias e configuração: [04-tecnologias.md](04-tecnologias.md). Contexto e histórico: [01-contexto-do-projeto.md](01-contexto-do-projeto.md).

## Como a página é montada

Tudo roda em uma única rota (`/`). Hoje não há rotas de API nem dados vindos do servidor.

```
app/layout.tsx          (Server Component)  <html>, <body>, metadata, importa globals.css e bootstrap-icons
└─ app/page.tsx         (Server Component)  só renderiza <Ficha />
   └─ Ficha.tsx         ("use client")      dono do estado, monta as seções
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

## Fluxo de dados

```
localStorage["detalhes"]            localStorage["barras"]
      │  usePersistido: lê em useEffect (depois da hidratação), salva a cada mudança
      ▼                                   ▼
useDetalhes() ─► [detalhes, alterar]   useBarras() ─► [barras, ajustarBarra]
                       │ props                              │ props
                       ▼                                    ▼
          Detalhes / Status (inputs)          Status ─► Barra (botões −/+)
```

- Só os **detalhes** e as **barras** passam pelo estado do React. Atributos, perícias, condições e combate ainda são estáticos ou não controlados (`defaultValue`). Veja [05-estado-e-persistencia.md](05-estado-e-persistencia.md).
- Os dados descem por props a partir de `Ficha`. Não há Context nem biblioteca de estado. O padrão é um hook por tipo de dado, todos sobre `usePersistido`. Se a quantidade de props passando por `Status` crescer demais, avalie um Context. Registre a escolha em [06-decisoes.md](06-decisoes.md).

## Layout

Feito com classes Tailwind direto no JSX (regra R8):

- `main` (`Ficha.tsx`) é `grid grid-cols-2 gap-[30px] w-[940px] mx-auto`: grid de **2 colunas**, largura fixa de **940px** e centralizado. Ainda não é responsivo.
- A ordem no grid segue a ordem do JSX em `Ficha.tsx`:

| Linha | Coluna 1 | Coluna 2 |
| --- | --- | --- |
| 1 | Logo e título (`col-span-2`) | |
| 2 | `Detalhes` | `Status` |
| 3 | `Atributos` (`grid-cols-4`) | `Pericias` favoritas (`grid-cols-4`) |
| 4 | `Combate` (`col-span-2`) | |
| 5 | `Pericias` completa (`col-span-2`, `grid-cols-8`) | |

- As cores do projeto são tokens no `@theme` de `app/globals.css`: `fundo`, `trilho` (fundo das barras), `vida`, `sanidade`, `esforco`, `linha-tabela` e `texto-tabela`. Use como `bg-vida`, `text-texto-tabela` etc.
- As combinações de classes usadas em mais de um componente ficam em `app/components/estilos.ts`: `cartao`, `tituloSecao`, `rotulo`, `campoLinha`, `campoNumero` e `botaoContorno`.
- O reset de estilos é o *preflight* do próprio Tailwind.
