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
| `rotulo` | `<label>` dos campos da ficha antiga |
| `rotuloCampo`, `dicaCampo`, `grupoCampo` | Rótulo, texto de ajuda e espaçamento dos campos de formulário (`formulario/`) |
| `campoCaixa` | Caixa dos campos de formulário: borda arredondada, 44px de altura, anel de foco arcano e borda vermelha quando inválido. O padding lateral vem de `classeCampo` (`CaixaCampo.tsx`) |
| `campoSemMargem` | Campo com linha embaixo, sem margem (para combinar com outro layout, como a lista do combobox) |
| `campoLinha` | Input/select de texto com linha embaixo (`Detalhes`) |
| `campoNumero` | Input numérico grande e centralizado (atributos, perícias, status) |
| `botaoContorno` | Botões "ver" / "editar" e `BotaoTema` |
| `campoFicha` / `rotuloFicha` | Campo compacto da ficha (sem largura; quem usa define) que vira texto simples quando desabilitado / rótulo pequeno dos campos da ficha |
| `botaoPerigo` / `botaoCompacto` | Botão de contorno vermelho (excluir) / botão preenchido pequeno ("Nova ficha", "Criar ficha"), para não somar classes que brigam com `botaoContorno` e `botaoPrincipal` |
| `botaoPrincipal` | Botão de ação principal (largura toda, fundo `arcano-texto-claro`, texto branco) |
| `link` | Link em `acento`, sublinhado no hover |
| `listaMarcadores` | Lista com marcadores das páginas legais |
| `conteudoPagina` | Largura total com margens laterais responsivas (`px-4` até `2xl:px-16`); base de todas as páginas |
| `faixaTela` / `brilhoFaixa` | Faixa de largura total com degradê `noite` → `arcano-texto-claro` → `mare` e texto `pergaminho`, e a camada de brilho radial por cima |
| `cartaoBase` | Cartão sem padding, para quem define o próprio (`CartaoMesa`, `CartaoFormulario`); `cartao` = `cartaoBase` + `p-5` |
| `tituloPainel` | Título alinhado à esquerda com ícone, dos painéis laterais |
| `rotuloSecao` | Sobretítulo em caixa alta e cor `acento` das seções da home |
| `chamadaPrincipal` / `chamadaSecundaria` | Links com cara de botão sobre a faixa (preenchido em `arcano` / contorno claro) |

## `formulario/`

Peças genéricas de formulário, usadas no login, no cadastro e na criação de mesa.

| Arquivo | Papel |
| --- | --- |
| `CartaoFormulario.tsx` | Props `titulo`, `textoBotao`, `envio: EnvioFormulario`, `rodape`, `children`, `estreito?` (limita a 440px, usado no login). Mostra os erros com `role="alert"` e desativa o botão enquanto envia |
| `CaixaCampo.tsx` | Props `icone?` (nome do bootstrap-icons sem `bi-`), `seta?`, `acao?`, `children`. Envolve o campo e posiciona o ícone à esquerda (fica arcano no foco), a seta de seleção ou um botão à direita. Exporta `classeCampo(icone?, temDireita?)` com o padding certo para cada caso |
| `CampoFormulario.tsx` | Props `id`, `nome`, `tipo` (`email` / `password` / `text` / `date`), `valor`, `aoAlterar`, `autoComplete`, `dica?`, `icone?`. Input `required` com rótulo e dica ligada por `aria-describedby`; em senha, botão de olho para mostrar/ocultar |
| `CampoSelecao.tsx` | Props `id`, `nome`, `valor`, `aoAlterar`, `opcoes: Opcao[]`, `textoVazio`, `obrigatorio`, `autoComplete?`, `icone?`. `<select>` com uma opção vazia no topo e seta própria |
| `CampoBuscaSelecao.tsx` | Props `id`, `nome`, `valor`, `aoAlterar`, `opcoes`, `textoAjuda`, `autoComplete?`, `icone?`. Combobox acessível: digitar filtra sem diferenciar acentos, setas/Enter/Esc pelo teclado, clique escolhe; ao sair, escolhe se o texto for igual a uma opção |
| `CampoDataSelecao.tsx` | Props `id`, `nome`, `aoAlterar` (ISO `AAAA-MM-DD` ou vazio), `anosAtras` (`{ minimo, maximo }`), `dica?`. Três selects (dia, mês por nome, ano) num `fieldset`; os dias seguem o mês e o ano bissexto; os anos são montados em `useEffect` |
| `CampoAreaTexto.tsx` | Props `id`, `nome`, `valor`, `aoAlterar`, `tamanhoMaximo`. `<textarea>` com contador de caracteres |
| `ListaErros.tsx` | Prop `erros`. Lista com `role="alert"`; não renderiza nada se estiver vazia |
| `useEnvioFormulario.ts` | `(acao, aoConcluir) => { enviando, erros, enviar }`. Genérico sobre o resultado: sucesso chama `aoConcluir(resultado)` (ex.: com a mesa criada), falha guarda os erros |

## `autenticacao/`

| Arquivo | Papel |
| --- | --- |
| `TelaAutenticacao.tsx` | `"use client"`. Tela dividida: `PainelLateral` (logo e vantagens) à esquerda a partir de `lg`; à direita, "Voltar ao início", `BotaoTema` e o formulário centralizado (máx. 760px; o login usa o cartão estreito) |
| `CampoAceiteTermos.tsx` | Props `aceito`, `aoAlterar`. Checkbox obrigatório com links (nova aba) para `/termos` e `/privacidade` |
| `usePaises.ts` | `() => Opcao[]`. Monta `listarPaises("pt-BR")` em `useEffect`, para os nomes do `Intl` não causarem erro de hidratação |
| `FormularioLogin.tsx` | `"use client"`. E-mail e senha, chama `entrar` e leva a `/mesas` |
| `FormularioCadastro.tsx` | `"use client"`. Em duas colunas a partir de `md`: nickname, e-mail, senha e confirmação, país (`CampoBuscaSelecao`), data de nascimento (`CampoDataSelecao`, anos de 18 a 110 atrás) e como conheceu (opcional); o aceite dos termos ocupa a largura toda. Confere se as senhas batem, chama `cadastrar` (que já faz o login) e leva a `/mesas` |

## `Rodape.tsx`

Rodapé de todas as páginas (em `app/layout.tsx`), de largura total e em linha a partir de `md`: aviso de projeto de estudo sem fins comerciais, links para Termos de uso, Privacidade e Créditos e "Desenvolvido por Victor Prezia · ano".

## `legal/`

| Arquivo | Papel |
| --- | --- |
| `PaginaLegal.tsx` | `"use client"`. Props `titulo`, `resumo`, `secoes: SecaoLegal[]` (`{ titulo, conteudo }`). `FaixaPagina` com a data (`DATA_ATUALIZACAO_TERMOS`), o número de seções e o resumo; índice fixo com âncoras `#secao-N`; seções como texto corrido (título numerado 01, 02... e conteúdo, sem cartão) num `<article>` com `[columns:44rem_2]` (no máximo 2 colunas, cada uma com no mínimo 704px) e `break-inside-avoid` por seção |
| `TermosDeUso.tsx` | Array `secoes` dos Termos de uso, com o aviso de projeto de estudo no resumo |
| `Creditos.tsx` | Array `secoes` com a atribuição do SRD 5.1 (CC-BY-4.0), o aviso de marca e as licenças de fontes e ícones |
| `PoliticaPrivacidade.tsx` | Array `secoes` da Política de privacidade (LGPD): dados coletados, finalidades e bases legais, compartilhamento, cookies, retenção e direitos |

## `hub/`

| Arquivo | Papel |
| --- | --- |
| `Hub.tsx` | `"use client"`. Raiz da rota `/mesas`: chama `useTema`, `useSessao` e `useMesas(filtro)`, guarda o filtro e monta `CabecalhoSite`, `FaixaPagina` (com "Criar mesa" se logado) e a grade lateral + lista; a lateral tem o aviso de visitante ou `EntrarComCodigo` e os `FiltrosMesas` |
| `AvisoVisitante.tsx` | Sem props. Aviso de que a pessoa está vendo como visitante, com links para criar conta e entrar |
| `EntrarComCodigo.tsx` | Sem props (só logado). Cartão com o campo do código de convite (`CaixaCampo`) e o botão que leva à mesa |
| `FiltrosMesas.tsx` | Props `filtro`, `aoAlterar`, `logado`. Cartão com busca pelo nome, situação em botões segmentados (todas, ativas, encerradas; `aria-pressed`) e "só as minhas" (logado) |
| `useMesas.ts` | `(filtro, sessaoPronta) => { mesas, carregando, erros }`. Chama `listarMesas(filtro)` com espera de 300 ms entre digitações, depois que a sessão carrega |
| `ListaMesas.tsx` | Prop `estado: EstadoMesas`. Avisos de carregando / erro / vazio e contagem; grade de `CartaoMesa` em `auto-fill` (mínimo 320px por cartão) |
| `CartaoMesa.tsx` | Prop `mesa: Mesa`. Link para `/mesas/[id]` com nome (cadeado se privada), `SeloMesa`, descrição, mestre, template, jogadores e espectadores e o meu papel |

## `mesa/`

| Arquivo | Papel |
| --- | --- |
| `NovaMesa.tsx` | `"use client"`. Raiz de `/mesas/nova`: `CabecalhoSite` e tela dividida com `PainelLateral` (dicas) e `FormularioNovaMesa` (logado) ou `AvisoLogin` |
| `FormularioNovaMesa.tsx` | Nome, descrição, template (`useTemplates`) e visibilidade; chama `criarMesa` e leva à mesa criada |
| `useTemplates.ts` | `() => Template[]`. Carrega `listarTemplates()` |
| `PaginaMesa.tsx` | `"use client"`. Raiz de `/mesas/[id]` (`useParams`): `CabecalhoMesa`, aviso de encerrada e a grade `AreasMesa` + lateral (`PainelGerencia` para dono/co-mestre e `ListaParticipantes`); visitante vê `AvisoLogin` |
| `useTempoRealMesa.ts` | `(mesaId, ativo, { aoAtualizar, aoExcluir, aoAtualizarFichas })`. Assina os eventos da mesa enquanto a página está aberta; guarda os callbacks num `ref` para não reassinar a cada render |
| `useMesa.ts` | `(id, logado) => { mesa, carregando, executando, erros, executar, substituir, recarregar }`. `recarregar()` busca a mesa de novo sem mostrar "carregando" (usado pelo tempo real). `executar(acao)` roda uma ação do repositório e troca a mesa pela resposta; `substituir(mesa)` troca direto (usado pelo formulário de edição, que mostra os próprios erros) |
| `CabecalhoMesa.tsx` | Props `mesa`, `estado`. `FaixaPagina` com voltar, selo (`rotuloDoSelo`), mestre, template, visibilidade, nome, descrição e meu papel; botões "Entrar como espectador" e "Sair da mesa" |
| `PainelGerencia.tsx` | Props `mesa`, `estado`. Botão de editar (abre `FormularioEdicaoMesa`), código de convite (copiar, gerar novo), bloquear entrada, encerrar/reabrir; só o dono vê o excluir |
| `FormularioEdicaoMesa.tsx` | Props `mesa`, `estado`, `aoFechar`. Nome, descrição e visibilidade (mantém o bloqueio de entrada); só salva se algo mudou, mostra os erros dentro do formulário e fecha ao salvar |
| `ModalExclusao.tsx` | Props `mesa`, `aoFechar`. `<dialog>` que explica o que é apagado e o que é guardado e só libera o botão quando o nome da mesa é digitado |
| `ListaParticipantes.tsx` | Props `mesa`, `estado`. Apelido e papel; quem gerencia troca o papel (`papeisAtribuiveis`) e remove (`podeRemover`) |
| `AreasMesa.tsx` | Prop `fichas: ReactNode` (largura total no topo da grade). Abaixo, espaços reservados "Em breve" de tabuleiro e chat, com grade de fundo |
| `useFichas.ts` / `usePropostas.ts` | `(mesaId, ativo)` → `useColecaoRemota` com `listarFichas` / `listarPropostas`. Só buscam se a pessoa participa da mesa |
| `PainelPropostas.tsx` | Props `mesa`, `estado`. Equipe: propostas pendentes com Aceitar e Recusar (some se não houver). Jogador: "Escolher da biblioteca" (lista a biblioteca e propõe) e as próprias propostas com Cancelar |
| `PainelFichas.tsx` | Props `mesa`, `estado: EstadoFichas`. Cartão "Fichas" com contador, botão "Nova ficha" (equipe, mesa ativa), formulário de criação, lista separada em Personagens e Pets e NPCs e edição no lugar do item |
| `ItemFicha.tsx` | Props `mesaId`, `ficha`, `podeCuidar`, `executando`, `aoEditar`, `aoExcluir`, `aoSalvarNaBiblioteca`. Na ficha da pessoa, botão de marcador que guarda uma cópia (aviso "Cópia salva" por 4 s). Nome (link para a ficha) e botão "Abrir", jogador ("Você", apelido ou "NPC do mestre"), visibilidade (para a equipe) ou "Só leitura"; editar e excluir com confirmação no próprio item. A ficha da pessoa fica destacada |
| `FormularioFicha.tsx` | Props `ficha` (`null` = nova), `jogadores`, `executando`, `aoSalvar`, `aoFechar`. Nome, tipo (só na criação), jogador (só papel Jogador; vazio = NPC do mestre) e "os outros jogadores podem ver" |

## `AvisoLogin.tsx` e `SeloMesa.tsx`

- `AvisoLogin`: prop `mensagem`. Cartão com a mensagem e os links Entrar / criar conta, para páginas que pedem login.
- `SeloMesa`: prop `mesa` (`status`, `entradaBloqueada`). Selo "Aberta", "Entrada bloqueada" ou "Encerrada", usado no cartão e na página da mesa.

## `useSessao.ts`

- `useSessao()` retorna `{ sessao, sair }`. `type Sessao` = `{ estado: "carregando" }` \| `{ estado: "visitante" }` \| `{ estado: "logado"; perfil: Perfil }`.
- Chama `obterPerfil()` em `useEffect`; `sair()` chama o `POST /auth/sair` e volta para visitante.

## `ficha/`

| Arquivo | Papel |
| --- | --- |
| `PaginaFicha.tsx` | `"use client"`. Raiz de `/mesas/[id]/fichas/[fichaId]`: `FaixaPagina` com volta para a mesa, tipo, jogador, "Só leitura" ou a situação da gravação (`role="status"`) e o botão Modo leitura / Editar ficha; abaixo, `FichaModelo`. Só edita quem `podeEditar` com a mesa ativa |
| `useFicha.ts` | `(mesaId, fichaId, ativo)` → `{ ficha, carregando, erros, situacao, alterar }`. `situacao`: `salvo`, `pendente`, `salvando` ou `erro` (recarrega a ficha). Envia os campos pendentes ao sair da página |
| `FichaModelo.tsx` | Props `modelo`, `conteudo`, `editavel`, `aoAlterar`. Monta o contexto das fórmulas (atributo, detalhe numérico, perícia, barra; `treinada(id)`) e distribui as seções pelo `layout` do modelo (`layoutParaExibir`: padrão se não houver, seções de fora no fim; seções vazias somem e uma linha com só uma coluna preenchida ocupa a largura toda) |
| | Estilo: a raiz recebe `atributosDaFicha(modelo.estilo)` (`data-tema-ficha`, `data-fonte-*`, `data-cantos-ficha`, `data-densidade-ficha`, `--cor-ficha`) e ganha moldura com fundo próprio quando o tema não é o padrão; cada seção fica num invólucro com `atributosDaSecao(cor)` e um `AparenciaSecaoContexto.Provider` |
| `SecaoFicha.tsx` | Props `id`, `titulo`, `icone`, `acoes?`, `classes?`, `children`. Cartão de cada seção; borda e título vêm de `AparenciaSecaoContexto` (fornecido pelo `FichaModelo` para cada seção; fora dele, fina e simples). Exporta `IdentidadeSecao` (`{ id, titulo, icone, caminho }`), que as seções recebem para servir tanto às padrão quanto às novas (`caminho` = onde gravar, como `extras.inventario`) |
| `AnotacoesFicha.tsx` | Texto livre (até 5.000 caracteres) das seções de anotações; em leitura, mostra o texto com as quebras de linha |
| `DetalhesFicha.tsx` | Campos de texto, número e lista em grade `auto-fill` |
| `BarrasFicha.tsx` | Barra com cor do modelo (`CORES`), atual e máximo editáveis e botões −/+ |
| `AtributosFicha.tsx` | Cartões com modificador grande, valor e a rolagem calculada (`1d20 + 3`); a grade usa `@container` (2, 3 ou 6 colunas conforme a largura da própria seção) |
| `PericiasFicha.tsx` | Busca, favoritas no topo, estrela (favorita), caixa (treinada), sigla do atributo e rolagem calculada |
| `CondicoesFicha.tsx` | Botões que marcam e desmarcam (`aria-pressed`); grava a lista inteira |
| `CombateFicha.tsx` | Tabela de ataques: adicionar e remover linhas, células por coluna do modelo; coluna de rolagem mostra o resultado da fórmula. Grava a tabela inteira |
| `CampoNumeroFicha.tsx` | Input numérico com rascunho local: só grava quando o número é inteiro e está dentro dos limites; fica vermelho (`aria-invalid`) se não estiver |

## `biblioteca/` e `Logo.tsx`

| Arquivo | Papel |
| --- | --- |
| `PaginaBiblioteca.tsx` | `"use client"`. Raiz de `/biblioteca`: `FaixaPagina`, estado vazio explicando como guardar e grade de `CartaoBiblioteca` |
| `CartaoBiblioteca.tsx` | Props `ficha`, `executando`, `aoExcluir`. Nome, tipo, modelo, data (formatada em `useEffect`), Ver ficha e excluir com confirmação |
| `PaginaFichaBiblioteca.tsx` | `"use client"`. Raiz de `/biblioteca/fichas/[fichaId]`: a cópia guardada em `FichaModelo` com `editavel={false}` |
| `Logo.tsx` | Props `tamanho?` (`pequeno`, `medio`, `grande`), `comTexto?`. `EmblemaLogo` desenha o dado com gradientes do tema (`useId` para os ids) |
| `useColecaoRemota.ts` | `(buscar, ativo)` → `{ itens, carregando, executando, erros, executar, recarregar }`; base de `useFichas`, `usePropostas` e da biblioteca |

## `templates/`

| Arquivo | Papel |
| --- | --- |
| `PaginaTemplates.tsx` | `"use client"`. Raiz de `/templates`: "Padrão do site" e "Seus templates" (logado), botão Novo template |
| `CartaoTemplate.tsx` | Props `template`, `logado`, `executando?`, `aoExcluir?`. Ver (padrão) ou Editar (seu), Criar cópia e excluir com confirmação |
| `PaginaEditorTemplate.tsx` | `"use client"`. Props `{ modo: "novo", baseId }` ou `{ modo: "existente", templateId }`. Novo em branco ou cópia de `?base=`; template padrão abre só para leitura com "Criar cópia para editar"; ao criar, vai para `/templates/[id]` |
| `EditorTemplate.tsx` | Props `inicial`, `editavel`, `textoSalvar`, `aoSalvar` (devolve os erros). Nome e descrição, abas Ficha completa / Ficha simplificada, editor à esquerda e prévia (`FichaModelo`) à direita a partir de `2xl`; limpa o modelo (`limparModelo`) antes de salvar |
| `EditorModelo.tsx` | Props `modelo`, `editavel`, `aoAlterar`. Uma `ListaEditavel` por seção; dica com o resultado da fórmula usando os valores padrão; trocar um id troca as referências nas fórmulas e no atributo das perícias (`renomearId`) |
| `EditorEstilo.tsx` | Props `modelo`, `editavel`, `aoAlterar(estilo)`. Estilos prontos (`ESTILOS_PRONTOS`, cada botão mostra uma amostra com o próprio estilo), selects de tema, fontes, espaçamento, cantos, bordas e títulos, cor de destaque (`input type=color` + sugestões) e, em "Estilo por seção", cor, borda e título de cada seção (vazio = igual à ficha) |
| `EditorSecoesExtras.tsx` | Props `modelo`, `editavel`, `aoAlterar`. "Nova seção" abre os 6 formatos (`FORMATOS_SECAO`) e os modelos prontos (`MODELOS_PRONTOS`: Inventário, Magias, Moedas, Idiomas, Energia, História); cada seção é um cartão arrastável com nome, id (acompanha o nome), formato e a `ListaEditavel` embutida do formato; a seção nova entra numa linha nova do grid e, ao remover, sai do grid |
| `RenderizadoresModelo.tsx` | `LinhaCampo`, `LinhaValor`, `LinhaBarra`, `LinhaColuna`, `DicaFormula` e `contextoDeExemplo` (inclui os valores das seções novas), usados nas seções padrão e nas novas |
| `EditorLayout.tsx` | Props `layout`, `modelo`, `editavel`, `aoAlterar`. Linhas com divisão (1 coluna, 2 iguais, larga + estreita, estreita + larga, 3), arrastáveis pela alça; cada coluna recebe seções arrastadas (soltar sobre uma seção coloca antes dela); bandeja "Fora da ficha"; em cada seção, um seletor "Mover para" faz o mesmo pelo teclado |
| `ListaEditavel.tsx` | Genérica: nome e id de cada item, arrastar pela alça (`useReordenacao`) ou subir e descer pelas setas, remover e Adicionar; o id acompanha o nome enquanto não for editado à mão |
| `useReordenacao.ts` | `(aoMover, ativo)` → `{ arrastando, alvo, propsItem, propsAlca }`. O item só fica arrastável enquanto a alça é pressionada, para não atrapalhar a seleção de texto nos campos |
| `CamposEditor.tsx` | `EntradaTexto`, `EntradaNumero`, `EntradaSelecao` (rótulo ligado por `useId`, estilo `campoFicha`) |

## `FaixaPagina.tsx` e `PainelLateral.tsx`

| Arquivo | Papel |
| --- | --- |
| `FaixaPagina.tsx` | Props `rotulo?`, `titulo`, `descricao?`, `children?`, `ladoALado?`. Faixa de título de largura total (`faixaTela`), usada no hub, na mesa e nas páginas legais. Por padrão, `children` são ações alinhadas à direita; com `ladoALado`, a faixa vira duas colunas (`1fr / 1.4fr`) e `children` ocupa a coluna da direita inteira (o resumo das páginas legais) |
| `PainelLateral.tsx` | Props `rotulo`, `titulo`, `itens: ItemPainel[]` (`{ icone, texto }`), `topo?`. Coluna com degradê das telas divididas (login, cadastro, nova mesa); some abaixo de `lg` |

## `CabecalhoSite.tsx`

- Props: `tema`, `alternarTema`, `sessao: EstadoSessao`. Barra fixa no topo, de largura total, com fundo translúcido. À esquerda, logo e o menu `itensMenu` (Início, Mesas), com o item atual destacado (`usePathname`, `aria-current`); à direita, os links Entrar / Criar conta (visitante) ou o nickname e o botão Sair (logado), e o `BotaoTema`. Enquanto a sessão carrega, não mostra os links de conta.

## `home/`

| Arquivo | Papel |
| --- | --- |
| `Home.tsx` | `"use client"`. Raiz da rota `/`: chama `useTema` e `useSessao`, monta `CabecalhoSite`, `HeroHome`, `RecursosHome`, `PassosHome` e `ChamadaFinalHome` |
| `HeroHome.tsx` | Prop `logado`. Faixa de tela cheia: título, frase, chamadas (Criar conta / Ver mesas ou Ir para as mesas) e `PreviaMesa` à direita |
| `PreviaMesa.tsx` | Sem props, decorativa (`aria-hidden`, só a partir de `lg`). Ilustração feita em JSX de uma mesa: ficha com atributos, tabuleiro com tokens e chat com rolagem |
| `ChamadaFinalHome.tsx` | Prop `logado`. `DivisorRunico`, chamada e link para criar conta ou criar mesa |
| `RecursosHome.tsx` | Sem props. Array `recursos` (ícone, título, texto) em cartões, 2 colunas a partir de `sm` e 4 a partir de `xl` |
| `PassosHome.tsx` | Sem props. Array `passos` (ícone, título, texto) numerados de 01 a 03 em faixa, 3 colunas a partir de `md` |

## Ao criar um componente novo

1. Arquivo `.tsx` em `app/components/`, com nome em português e PascalCase.
2. Tipe as props com `type <Nome>Props`.
3. Estilize só com classes Tailwind. Reaproveite as constantes de `estilos.ts`; se uma combinação nova se repetir, adicione lá.
4. Só use `"use client"` se ele tiver hooks **e** for importado fora de `Ficha`.
5. Adicione uma seção neste arquivo e atualize a árvore em [02-arquitetura.md](02-arquitetura.md).
