# Arquitetura

Tecnologias e configuração: [04-tecnologias.md](04-tecnologias.md). Contexto e histórico: [01-contexto-do-projeto.md](01-contexto-do-projeto.md).

## Como a página é montada

Rotas: `/` (home, apresentação do produto), `/mesas` (hub, aberto a visitantes), `/mesas/nova`, `/mesas/[id]`, `/mesas/[id]/fichas/[fichaId]`, `/biblioteca`, `/biblioteca/fichas/[fichaId]`, `/templates`, `/templates/novo`, `/templates/[id]`, `/termos`, `/privacidade`, `/creditos`, `/ficha`, `/login` e `/cadastro`. Nenhum link leva à `/ficha` por enquanto. As duas últimas ficam no route group `app/(autenticacao)/`, que tem um layout próprio (`TelaAutenticacao`). Login, cadastro, mesas e a ficha da mesa falam com o backend (`Projeto_RPG_Backend`); só a ficha de teste antiga (`/ficha`) não.

```
app/layout.tsx          (Server Component)  <html class="dark">, <body> (flex coluna + <Rodape /> no fim), metadata, fontes, globals.css e bootstrap-icons
└─ app/ficha/page.tsx   (Server Component)  só renderiza <Ficha />
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

## Home (`/`) e hub (`/mesas`)

```
app/page.tsx       ─► Home ("use client": useTema, useSessao) ─► CabecalhoSite, HeroHome (+ PreviaMesa), RecursosHome, PassosHome, ChamadaFinalHome
app/mesas/page.tsx ─► Hub  ("use client": useTema, useSessao, useMesas) ─► CabecalhoSite, FaixaPagina, lateral (AvisoVisitante ou EntrarComCodigo, FiltrosMesas), ListaMesas ─► CartaoMesa
                     useSessao ─► perfilRepositorio.obterPerfil() (GET /perfil; 401 = visitante) e sair() (POST /auth/sair)
                     useMesas  ─► mesasRepositorio.listarMesas(filtro) (GET /mesas?busca&status&minhas)
app/mesas/nova     ─► NovaMesa ─► PainelLateral + FormularioNovaMesa ─► criarMesa() ─► /mesas/[id]
app/mesas/[id]     ─► PaginaMesa ("use client": useTema, useSessao, useMesa) ─► CabecalhoMesa (FaixaPagina), AreasMesa (PainelFichas + tabuleiro e chat em breve) | lateral: PainelGerencia, ListaParticipantes
                     useMesa.executar(acao) ─► mesasRepositorio (entrar, sair, papel, remover, bloquear, código, encerrar, reabrir) ─► troca a mesa pela resposta
                     useFichas (só participante) ─► fichasRepositorio (listar, criar, editar, excluir em /mesas/{id}/fichas)
                     useTempoRealMesa ─► tempoRealMesaRepositorio.assinarMesa ─► ConexaoTempoReal (SignalR /hubs/mesa)
                       MesaAtualizada → recarrega mesa, fichas e propostas · FichasAtualizadas → fichas · PropostasAtualizadas → propostas · MesaExcluida → /mesas
                     usePropostas ─► bibliotecaRepositorio (propor, aceitar, recusar, cancelar em /mesas/{id}/propostas) ─► PainelPropostas (dentro de PainelFichas)
app/templates      ─► PaginaTemplates ─► CartaoTemplate (Ver/Editar, Criar cópia, excluir)
app/templates/novo, [id] ─► PaginaEditorTemplate ─► EditorTemplate (nome, abas completa/simplificada, prévia com FichaModelo)
                     ─► EditorModelo ─► ListaEditavel por seção ─► templatesRepositorio (POST/PUT /templates; erros do modelo traduzidos para "Perícias, item 3")
app/biblioteca     ─► PaginaBiblioteca (useColecaoRemota(listarBiblioteca)) ─► CartaoBiblioteca ─► /biblioteca/fichas/[fichaId] (FichaModelo só leitura)
                       MesaAtualizada ─► useMesa.recarregar()   MesaExcluida ─► volta para /mesas
```

- As regras de papel do front (`podeGerenciar`, `papeisAtribuiveis`, `podeRemover` em `src/dominio/mesa.ts`) só escondem botões; quem decide é o backend.
- Os repositórios devolvem `Resultado<T>` (`src/dominio/resultado.ts`): `{ sucesso: true, valor }` ou `{ sucesso: false, erros }`, com os códigos traduzidos por `errosApi.ts`.

- A sessão é conferida no navegador: o cookie é do domínio da API, então o servidor do Next não o enxerga. Enquanto `useSessao` carrega, o cabeçalho não mostra os links de conta, para não piscar.

## Telas de autenticação

```
app/(autenticacao)/layout.tsx  ─► TelaAutenticacao ("use client": useTema, BotaoTema, PainelLateral)
├─ login/page.tsx    ─► FormularioLogin    ─► entrar()     ─┐
└─ cadastro/page.tsx ─► FormularioCadastro ─► cadastrar()  ─┤
                                                             ▼
        src/repositories/autenticacaoRepositorio ─► src/providers/api (FetchRestProvider) ─► POST /auth/cadastro, /auth/login?useCookies=true
```

- Os dois formulários usam `CartaoFormulario` (título, erros, botão, rodapé) e `useEnvioFormulario` (estado `enviando` / `erros`, e `aoConcluir` no sucesso).
- Deu certo: o backend grava o cookie de sessão e o formulário leva a `/mesas`. O `/auth/cadastro` já cria a conta com o perfil e faz o login.
- O repositório converte os códigos de erro do backend (`DuplicateUserName`, `PasswordTooShort`, `ApelidoEmUso`, `IdadeMinima`...) em mensagens em português.

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

## Ficha da mesa

```
app/mesas/[id]/fichas/[fichaId] ─► PaginaFicha ("use client": useTema, useSessao, useMesa, useFicha) ─► FaixaPagina + FichaModelo
  useFicha ─► fichasRepositorio.obterFicha (GET .../fichas/{fichaId}: dados + modelo) ─► normalizarConteudo
           ─► alterar(caminho, valor): muda na tela na hora, junta os campos e envia depois de 400 ms (PATCH .../fichas/{fichaId})
           ─► assinarFicha: FichaAtualizada (campos de outra pessoa, menos os editados aqui há menos de 1,5 s) · FichasAtualizadas (recarrega)
  FichaModelo(modelo, conteudo, editavel, aoAlterar) ─► Detalhes, Status (barras), Atributos, Condições, Perícias, Ataques
```

`FichaModelo` não conhece a página nem a mesa: recebe o modelo, o conteúdo, se é editável e a função de alterar. Quando existir o tabuleiro, ele pode ser aberto num painel lá dentro com o mesmo `useFicha`.

## Layout

Feito com classes Tailwind direto no JSX (regra R8).

**Páginas do site (largura total):** nenhuma página fica presa numa coluna central. O `CabecalhoSite` é uma barra fixa no topo (`sticky`) e o conteúdo usa `conteudoPagina` (margens de 16px a 64px conforme a tela, sem largura máxima). Cada raiz renderiza `<CabecalhoSite />` e um `<main className="flex flex-1 flex-col">`.

| Página | Estrutura |
| --- | --- |
| Home | Hero de tela cheia com texto à esquerda e `PreviaMesa` à direita (a partir de `lg`); recursos em 4 colunas (`xl`); passos em faixa; chamada final |
| Hub | `FaixaPagina` com "Criar mesa"; abaixo, grade lateral (280–300px, fixa ao rolar) + lista, com os cartões em `auto-fill` de no mínimo 320px |
| Mesa | `FaixaPagina` com selos, informações e ações; abaixo, `AreasMesa` + coluna lateral de 400px (gerência e participantes) a partir de `xl` |
| Nova mesa, login e cadastro | Tela dividida (`5fr / 7fr`): `PainelLateral` com degradê à esquerda (some abaixo de `lg`) e o formulário centralizado à direita |
| Termos, privacidade, créditos | `FaixaPagina` `ladoALado`: data, número de seções e título à esquerda e o resumo à direita; índice fixo à esquerda (em linha rolável no celular) e o texto corrido, sem cartões, em `columns: 44rem 2`: uma coluna até cerca de 1850px de tela e no máximo duas acima disso, separadas por uma linha fina |

**Ficha antiga (`/ficha`):**


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

- Estilo da ficha (por template): os temas, fontes, cantos e espaçamento são regras por `data-*` no `@layer base` do `globals.css`, que trocam os tokens de papel (`--color-fundo`, `--color-destaque`...), `--font-titulo`/`--font-texto` (por isso esse `@theme` não é `inline`), `--radius-*` e `--spacing` só dentro da ficha. A cor própria vem de `--cor-ficha` (inline, dado do modelo) e gera o destaque com `color-mix` contra a cor do texto, para funcionar no claro e no escuro. Borda e título das seções são classes Tailwind escolhidas pelo `SecaoFicha`.
- Identidade visual: `Projeto_RPG_Planejamento/03-identidade-visual.md`. As cores são tokens no `@theme static` de `app/globals.css`: a paleta (`pergaminho`, `nevoa`, `abismo`, `noite`, `arcano`, `essencia`, `mare`...), as barras (`vida`, `sanidade`, `esforco`) e os tokens de papel (`fundo`, `superficie`, `borda`, `texto`, `destaque`, `acento`, `trilho`). Componentes usam os tokens de papel (`bg-superficie`, `text-destaque`); a classe `.dark` no `<html>` troca o valor deles, então não é preciso `dark:` nas classes.
- Fontes: `font-titulo` (Almendra) em títulos e `font-texto` (Literata) no resto, carregadas por `next/font/google` em `layout.tsx`.
- As combinações de classes usadas em mais de um componente ficam em `app/components/estilos.ts`: `cartao`, `tituloSecao`, `rotulo`, `campoLinha`, `campoNumero` e `botaoContorno`.
- O reset de estilos é o *preflight* do próprio Tailwind.
