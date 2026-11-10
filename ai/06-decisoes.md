# Registro de decisões

Uma entrada por decisão, a mais recente no topo. Formato: **data — título**, depois *contexto*, *decisão* e *consequências*.

---

## 2026-11-09 — Estilo da ficha configurável no template

- **Contexto:** o usuário queria fichas com visual próprio, um CSS mais dinâmico para cada uma.
- **Decisão:** o modelo ganhou `estilo` (tema de cores, cor de destaque, fonte dos títulos e do texto, cantos, bordas, títulos, espaçamento e `secoes` com cor/borda/título por seção), só com valores de listas fechadas e cores `#rrggbb`, validados no backend. Nada de CSS livre (risco de injeção e de quebrar o layout). Na tela, tudo vira troca de variáveis CSS dentro da ficha (`data-*` + `--cor-ficha`), então os componentes da ficha não mudaram, só passaram a usar `destaque` onde usavam `arcano`.
- **Consequências:** o estilo é do template (vale para todas as fichas dele), não de cada ficha. Mesas já criadas guardam a cópia antiga do modelo até a 4.7. O editor só grava o que difere do padrão.

## 2026-11-09 — Template 5e com todos os campos da ficha de papel

- **Contexto:** o usuário pediu todos os campos da primeira página da ficha oficial do 5e, organizados para a tela.
- **Decisão:** os campos que faltavam viraram seções novas do template (combate, testes contra a morte, personalidade, proficiências e idiomas, moedas, equipamento, características) e o template ganhou um layout em 3 colunas no topo. Só os nomes dos campos (termos do SRD) foram usados; o visual da ficha oficial não foi copiado. O bônus de proficiência virou um campo que o jogador preenche (como no papel), usado por todas as perícias. A grade de atributos passou a se ajustar ao espaço da coluna (`@container`), e o menu do site mostra só ícones no celular.
- **Consequências:** o seed do 5e mudou (migração `Template5eFichaCompleta`); mesas já criadas continuam com a cópia antiga do modelo até a 4.7.

## 2026-11-09 — Seções novas no template, com formatos padrão

- **Contexto:** o mestre queria áreas próprias na ficha (inventário, magias, história...).
- **Decisão:** `secoesExtras` no modelo, cada uma com um de 6 formatos que reaproveitam os componentes da ficha (campos, valores, barras, marcadores, tabela) mais anotações; os valores ficam em `extras.<id>` nos dados da ficha. O editor oferece os formatos e modelos prontos, e a seção nova entra no grid.
- **Consequências:** ids continuam únicos no modelo inteiro (seções e itens), para as fórmulas. Mudar o formato de uma seção não existe: remove-se e cria-se outra.

## 2026-11-09 — Layout da ficha no template e arrastar no editor

- **Contexto:** o mestre queria decidir onde ficam atributos, perícias e as outras seções, e reordenar os itens sem clicar várias vezes nas setas.
- **Decisão:** o modelo ganhou `layout` opcional (linhas com divisões prontas e seções por coluna), validado no backend. O editor monta esse grid arrastando as seções (HTML5 drag and drop, sem biblioteca nova) e também por um seletor acessível pelo teclado. Itens de cada seção se arrastam pela alça; as setas continuam.
- **Consequências:** modelos antigos, sem `layout`, usam o layout padrão. As divisões são fixas (5 opções) para a ficha continuar bonita e responsiva; colunas de largura livre ficaram de fora.

## 2026-11-09 — Templates do usuário e editor de modelo (fase 4.6)

- **Contexto:** o mestre precisava montar fichas para outros sistemas além do 5e.
- **Decisão:** área `/templates` com editor por seções (sem JSON à mão), prévia ao vivo da ficha e as duas fichas (completa e simplificada) no mesmo template. Ids saem do nome automaticamente; renomear um id atualiza as fórmulas. A validação de verdade é a do backend; o frontend só mostra a dica do cálculo e traduz o caminho dos erros.
- **Consequências:** mudar um template não altera mesas existentes; levar as mudanças para uma mesa é a 4.7 (alterar o modelo da mesa com backup e conversão).

## 2026-11-09 — Logo próprio e biblioteca com propostas (fase 4.5)

- **Contexto:** o logo era de D&D (marca de terceiros) e o jogador precisava guardar personagens e levá-los a outras mesas.
- **Decisão:** logo próprio em SVG (`Logo.tsx`, dado de 20 faces com as cores do tema) e o mesmo emblema como ícone da aba (`app/icon.svg`); o texto é "RPG de mesa" até o nome do site ser escolhido. Biblioteca em `/biblioteca` (cópias só leitura). O jogador propõe pela área de fichas da mesa e a equipe aceita ou recusa ali mesmo; tudo atualiza pelo evento `PropostasAtualizadas`.
- **Consequências:** editar uma ficha da biblioteca não existe: a cópia só muda quando volta para uma mesa. Ficha de outro modelo só entra depois da conversão da 4.7.

## 2026-11-09 — Ficha montada pelo modelo, em página própria (fase 4.4)

- **Contexto:** a ficha antiga tinha campos fixos e salvava no `localStorage`.
- **Decisão:** página própria `/mesas/[id]/fichas/[fichaId]` (pedido do usuário; quando existir o tabuleiro, a ficha também abre dentro dele). O componente `FichaModelo` não depende da página. As alterações vão por `PATCH` com só os campos mudados, agrupados a cada 400 ms; o backend valida contra o modelo, grava com `jsonb_set` e avisa só quem pode ver a ficha. As fórmulas são avaliadas no frontend só para exibir o total.
- **Consequências:** a ficha antiga (`/ficha`) ficou sem uso e pode ser apagada. Modo leitura é só da tela (não é salvo).

## 2026-11-09 — Fichas na mesa (fase 4.3)

- **Contexto:** a mesa precisava das fichas antes da ficha montada pelo modelo (4.4).
- **Decisão:** a área de fichas da página da mesa lista o que a pessoa pode ver (filtrado no backend) e deixa a equipe (dono, co-mestre, assistente) criar, renomear, entregar a um jogador, mudar a visibilidade e excluir. A resposta traz `ehMinha` e `podeEditar` em vez do id do usuário. O tempo real usa o evento `FichasAtualizadas`, só com o id da mesa; o cliente busca a lista de novo.
- **Consequências:** abrir e editar o conteúdo da ficha fica para a 4.4 (o `GET /mesas/{id}/fichas/{fichaId}` já devolve dados e modelo). A exclusão usa confirmação no próprio item, sem `window.confirm`.

## 2026-11-09 — Páginas em largura total

- **Contexto:** todas as páginas ficavam numa coluna central de 940px, sobrando espaço vazio em telas grandes.
- **Decisão:** cabeçalho fixo e conteúdo de largura total com margens responsivas (`conteudoPagina`), faixas de título de ponta a ponta (`FaixaPagina`), coluna lateral no hub e na mesa, e tela dividida (`PainelLateral`) no login, no cadastro e na nova mesa. Nos termos, na privacidade e nos créditos, o texto é corrido, sem cartões, e ocupa a largura toda: uma coluna em telas comuns e no máximo duas em telas muito grandes. A ilustração da home (`PreviaMesa`) é feita em JSX, sem imagem de terceiros.
- **Consequências:** toda página nova renderiza `<CabecalhoSite />` + `<main className="flex flex-1 flex-col">` e usa `conteudoPagina`; não use `max-w-[940px]`. A ficha antiga (`/ficha`) continua como estava.

## 2026-11-09 — Campos de formulário em caixa, com ícone e foco visível

- **Contexto:** os campos de cadastro, login e mesa eram só uma linha embaixo, pouco legíveis e com foco discreto.
- **Decisão:** usar caixas próprias (`campoCaixa` + `CaixaCampo`), seguindo boas práticas públicas de sistemas de design abertos, sem copiar código nem visual de ninguém: rótulo sempre visível acima do campo (o placeholder não substitui o rótulo), área de toque de 44px, anel de foco arcano bem distinto do hover, borda vermelha só quando inválido, ícones do bootstrap-icons (MIT), botão para mostrar a senha e data em três seletores (dia, mês, ano) em vez de calendário.
- **Consequências:** a ficha antiga (`Detalhes`, `Atributos`) e os filtros do hub continuam com `campoLinha`/`campoNumero`; a ficha nova (4.4) deve usar o novo padrão.

## 2026-11-09 — Equipe do mestre em dois níveis e tempo real (fase 4.1)

- **Contexto:** o dono do projeto pediu dois níveis de ajudante (um com quase tudo do mestre, outro só para fichas e tabuleiro) e sincronização da ficha em tempo real, o que adiantou o SignalR da fase 5.
- **Decisão:** papéis `coMestre` e `assistente` no lugar de `ajudante` (os ajudantes antigos viraram co-mestres). A página da mesa assina o hub `/hubs/mesa` por `useTempoRealMesa`; o servidor só avisa (`MesaAtualizada`, `MesaExcluida`) e cada cliente busca a mesa de novo, porque o que cada um vê depende do papel. A conexão fica em `src/providers/ConexaoTempoReal.ts` (uma para o site, com contador por mesa para não sair do grupo cedo demais no modo estrito do React) e é usada só pelo `tempoRealMesaRepositorio`.
- **Consequências:** `podeGerenciar` virou `podeGerenciarMesa` e `podeCuidarDeFichasETabuleiro`. Toda tela nova que mostre dados da mesa pode reaproveitar `useTempoRealMesa`.

## 2026-11-09 — Mesas, papéis e página da mesa (fase 3)

- **Contexto:** a fase 3 tirava o hub dos dados de exemplo e criava a página de cada mesa. Decisões do dono do projeto: sem limite de jogadores (o mestre bloqueia a entrada), quem entra vira espectador, o mestre promove e pode ter ajudantes mas não passa a posse, a exclusão pede confirmação e a mesa encerrada fica só para leitura.
- **Decisão:** papéis `dono`, `ajudante`, `jogador` e `espectador`. O hub lê `GET /mesas` com busca, situação e "só as minhas". `/mesas/nova` cria a mesa e `/mesas/[id]` mostra o cabeçalho, o painel de gerência, os participantes e as áreas futuras. A exclusão usa um `<dialog>` próprio que pede o nome da mesa. Os componentes genéricos de formulário foram para `formulario/`, e os repositórios passaram a devolver `Resultado<T>` com a tradução de erros centralizada em `errosApi.ts`.
- **Consequências:** `MESAS_DE_EXEMPLO` saiu. A página da mesa ainda não se atualiza em tempo real; isso entra com o SignalR na fase 5.

## 2026-11-09 — Termos de uso e política de privacidade

- **Contexto:** o cadastro coleta país e data de nascimento, e o site vai ser publicado. O projeto é de estudo e sem fins comerciais.
- **Decisão:** páginas `/termos` e `/privacidade` (conteúdo em `legal/`), linkadas no rodapé, com o aviso de projeto de estudo em destaque. O cadastro exige marcar o aceite; o backend recusa sem aceite (`TermosNaoAceitos`) ou com versão diferente da atual (`TermosDesatualizados`) e grava `VersaoTermosAceita` e `TermosAceitosEm` no usuário. Contato de privacidade: `EMAIL_CONTATO` em `src/dominio/termos.ts`.
- **Consequências:** a versão dos termos existe nos dois projetos e precisa mudar junto. Uma versão nova vai exigir um fluxo de novo aceite para quem já tem conta.

## 2026-11-09 — Home, hub para visitantes e cadastro com perfil (fase 2)

- **Contexto:** a fase 2 pedia uma home para apresentar o produto, o hub aberto a visitantes, o cadastro com perfil, o logout e o usuário logado no cabeçalho.
- **Decisão:** `/` virou a `Home` e o hub foi para `/mesas`. Os dois usam `CabecalhoSite` e o hook `useSessao`, que chama `GET /perfil` no navegador (401 = visitante). O cadastro chama o `POST /auth/cadastro` do backend, que valida o perfil, cria a conta e já faz o login; o `/auth/register` do Identity foi bloqueado. Login e cadastro levam a `/mesas`, revertendo a decisão de 24/10. A lista de países vem de códigos ISO com nomes do `Intl.DisplayNames`, montada depois da hidratação (`usePaises`) porque os nomes podem mudar entre o Node e o navegador.
- **Consequências:** `CabecalhoHub` e a mensagem de sucesso do `CartaoFormulario` saíram. Toda página nova com cabeçalho usa `CabecalhoSite` e `useSessao`.

## 2026-11-09 — Sistema por mesa, mesas públicas e privadas, contrato da API

- **Contexto:** a fase 1 do planejamento (fundação) pedia o modelo de dados e o padrão de API antes de criar as mesas no backend.
- **Decisão:** cada mesa parte de um template de ficha, padrão (5e, com o conteúdo de licença aberta do SRD 5.1) ou custom da área de templates do usuário, com a fórmula de rolagem de cada atributo, e guarda uma cópia que o mestre pode alterar sem mudar o template; a mesa é pública (aparece no hub) ou privada (só por código de convite). O modelo de dados e o contrato da API ficam em `../Projeto_RPG_Planejamento/04-modelo-de-dados.md` e `05-padrao-de-api.md`. Todo erro do backend vem como Problem Details, com códigos `PascalCase` em `errors`, que os repositórios traduzem para mensagens.
- **Consequências:** a ficha atual era um teste e será refeita do zero, montada pelo modelo da mesa. A ficha vive na mesa: só o mestre cria e atribui fichas (completas ou simplificadas, para pets e NPCs) a jogadores, que as editam e podem salvar uma cópia na biblioteca. Alterar o modelo da mesa gera backup e converte as fichas. A rota `/` vai virar a home do produto, e o hub vai para `/mesas`, aberto a visitantes como mostruário (só mesas públicas e templates padrão). O cadastro passa a pedir o perfil: nickname único, país e data de nascimento (18+) obrigatórios, "como conheceu" opcional. O tipo `Mesa` do frontend ganha `visibilidade` quando a API de mesas existir.

## 2026-10-24 — Hub de mesas na rota `/`

- **Contexto:** o planejamento prevê um hub com a lista de mesas como página inicial, e a ficha sai do `/`.
- **Decisão:** `/` renderiza `Hub` (cabeçalho, banner, lista de mesas); a ficha foi para `/ficha`, sem link. O rodapé com os créditos fica no layout raiz, com `body` em coluna para empurrá-lo para baixo. Sem API de mesas, `mesasRepositorio.listarMesas()` devolve dados de exemplo; quando a API existir, só o repositório muda.
- **Consequências:** o título padrão do site virou "Hub de mesas"; `/ficha` tem o próprio título. `TelaAutenticacao` usa `flex-1` em vez de `min-h-screen` por causa do rodapé.

## 2026-10-24 — Login não redireciona para a ficha

- **Contexto:** a ficha ainda não verifica a sessão nem tem logout, e os dados dela continuam só no `localStorage`.
- **Decisão:** login e cadastro deixam de fazer `router.push("/")` (saiu `rotas.ts`); o `CartaoFormulario` mostra uma mensagem de sucesso no lugar.
- **Consequências:** voltar a levar à ficha depende de protegê-la e criar o logout (ver [07-pendencias.md](07-pendencias.md)).

## 2026-10-21 — Telas de login e cadastro

- **Contexto:** o backend já tinha `/auth/register` e `/auth/login` (Identity). Faltavam as telas.
- **Decisão:** rotas `/login` e `/cadastro` no route group `(autenticacao)`, com layout próprio. HTTP segue a R6: `FetchRestProvider` em `src/providers/`, instância `api`, e `autenticacaoRepositorio` em `src/repositories/` com DTO (`password`) → domínio (`senha`) e tradução dos códigos de erro. A sessão é o cookie do Identity (`useCookies=true`, `credentials: "include"`). O cadastro já faz o login em seguida. A URL da API tem padrão local, porque a documentação do Next pede para não commitar `.env`.
- **Consequências:** o cadastro ainda não pede o nome (o `/auth/register` do Identity só aceita e-mail e senha); o nome fica para a página de perfil. Toda nova chamada ao backend é um método num repositório, sobre o mesmo `api`.

## 2026-10-21 — Identidade visual com tema claro e escuro

- **Contexto:** a ficha tinha fundo preto, bordas brancas e cores soltas. O planejamento definiu uma identidade visual (`Projeto_RPG_Planejamento/03-identidade-visual.md`).
- **Decisão:** a paleta virou tokens no `@theme static`. Os componentes usam tokens de papel (`fundo`, `superficie`, `borda`, `texto`, `destaque`, `acento`, `trilho`), cujo valor muda na classe `.dark` do `<html>`, em vez de `dark:` em cada classe. O tema fica salvo na chave `"tema"` (padrão escuro, para manter o visual atual sem piscar). Fontes Almendra (títulos) e Literata (texto) via `next/font/google`. As barras ganharam cores da paleta e o valor `atual/maximo` saiu de dentro da barra para a linha do título. A tabela de combate deixou de ter fundo branco.
- **Consequências:** os tokens `linha-tabela` e `texto-tabela` foram removidos. Componente novo usa os tokens de papel e funciona nos dois temas sem nada extra.

## 2026-10-21 — Stack do backend

- **Contexto:** o backend precisava de stack, banco, tempo real e login para começar.
- **Decisão:** ASP.NET Core (.NET 10) com PostgreSQL via Entity Framework Core, ASP.NET Core Identity (e-mail e senha agora, Google e Discord depois como login externo) e SignalR para o chat e o tabuleiro.
- **Consequências:** o frontend vai falar com a API em `http://localhost:5228` usando cookie (CORS com credenciais para `http://localhost:3000`) e com o SignalR via `@microsoft/signalr`.

## 2026-10-21 — Repositórios de backend e de planejamento

- **Contexto:** o projeto vai virar um site com hub, lista de mesas e, em cada mesa, chat, fichas e tabuleiro.
- **Decisão:** criar `Projeto_RPG_Backend` e `Projeto_RPG_Planejamento` (visão, lista de tarefas e dúvidas), ao lado deste repositório em `D:\GitHub\`.
- **Consequências:** o roadmap do produto fica no repositório de planejamento. Este `ai/` continua documentando só o frontend.

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
