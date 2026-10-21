# Contexto do projeto

## O que é

Ficha interativa de jogador para RPG de mesa, com interface em português. O jogador preenche os dados pessoais, o status (Vida, Sanidade, Esforço), os atributos, as perícias e as armas. Os dados ficam salvos no próprio navegador.

Não há backend, login nem banco de dados: é uma página única (rota `/`).

## Repositórios relacionados

Ficam lado a lado em `D:\GitHub\`:
- `Projeto_RPG_Planejamento`: visão do site (hub, mesas, chat, fichas e tabuleiro), lista de tarefas e dúvidas em aberto.
- `Projeto_RPG_Backend`: backend em ASP.NET Core (.NET 10), PostgreSQL, Identity e SignalR.

Este repositório é o frontend. Hoje ele tem só a ficha, que vai virar a área de fichas de cada mesa.

## Histórico

1. Começou como HTML estático + jQuery + Bootstrap (`index.html`, `js/main.js`).
2. Foi portado para Next.js + React na branch `feat/nextjs-port`.
3. Foi convertido para TypeScript.

Os detalhes de cada passo estão em [06-decisoes.md](06-decisoes.md).

## Regras do jogo

Nenhuma regra de negócio do RPG documentada ainda (como a rolagem funciona, cálculos de atributo, efeitos das condições).

## Sobre esta pasta (`ai/`)

Notas de arquitetura e organização. Servem para pessoas e para agentes de IA (Claude Code) entenderem o projeto antes de mexer nele. O [`CLAUDE.md`](../CLAUDE.md) na raiz tem só as regras curtas (comandos e convenções). Os detalhes ficam aqui.

| Arquivo | Conteúdo |
| --- | --- |
| [00-regras.md](00-regras.md) | **Regras rígidas. Têm prioridade sobre todos os outros arquivos. Leia primeiro.** |
| [01-contexto-do-projeto.md](01-contexto-do-projeto.md) | Este arquivo: o que é o projeto, histórico, regras do jogo e índice |
| [02-arquitetura.md](02-arquitetura.md) | Como a página é montada, fluxo de dados e layout |
| [03-componentes.md](03-componentes.md) | O que cada componente faz, suas props e seus dados |
| [04-tecnologias.md](04-tecnologias.md) | Stack, dependências e arquivos de configuração |
| [05-estado-e-persistencia.md](05-estado-e-persistencia.md) | Estado, `localStorage`, hidratação e como persistir campos novos |
| [06-decisoes.md](06-decisoes.md) | Registro das decisões tomadas (o quê, quando e por quê) |
| [07-pendencias.md](07-pendencias.md) | O que falta fazer, bugs conhecidos e dúvidas em aberto |

## Como manter

- **Nome dos arquivos:** `NN-nome-em-kebab-case.md`, com `NN` de dois dígitos. O `00` é sempre o das regras. Um arquivo novo pega o próximo número livre.
- **O que atualizar e onde:** está na tabela "Onde escrever" da R2, em [00-regras.md](00-regras.md#r2--documentação-viva).
- Arquivo novo em `ai/` entra nesta tabela e no índice do `CLAUDE.md`.
