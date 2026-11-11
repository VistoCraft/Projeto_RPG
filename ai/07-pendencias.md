# Pendências

Tire o item daqui quando ele for resolvido. Se a solução envolveu uma escolha, registre em [06-decisoes.md](06-decisoes.md).

A ficha atual era um teste e será refeita do zero, montada pelo modelo da mesa (ver [06-decisoes.md](06-decisoes.md)). Os itens sobre a ficha valem só até lá.

## Funcionalidades sem implementação

- A ficha de teste antiga (`/ficha`, `Ficha.tsx`, `Detalhes`, `Status`, `Barra`, `Atributos`, `Pericias`, `Combate`, `Cabecalho`, `usePersistido`, `useDetalhes`, `useBarras`) foi substituída pela ficha da mesa e pode ser apagada.
- A ficha mostra o resultado das fórmulas, mas ainda não rola os dados (entra com o chat).
- A cópia na biblioteca de uma ficha de mesa com modelo alterado é mostrada com o modelo do template, e a proposta só aceita fichas com o mesmo template ou modelo igual; falta guardar o modelo na cópia e usar a conversão ao aceitar.
- Backups de ficha só podem ser vistos; não há restaurar.

Os botões existem na tela, mas não fazem nada:

| Botão | Onde | Dúvidas antes de implementar |
| --- | --- | --- |
| Rolagem (d20) | `Atributos.tsx` | É 1d20 contra o valor do atributo? Onde o resultado aparece? Precisa de histórico? |
| "ver" / "editar" | `Cabecalho.tsx` | Alterna a seção entre modo só leitura e modo edição? |
| "favoritar" | `Pericias.tsx` | Marca a perícia para aparecer na seção de favoritas? Essa marcação deve ser salva? |

## Autenticação

- A ficha (`/ficha`) abre direto pela URL, sem login; ela será refeita dentro da mesa.
- Pedidos de acesso, correção e exclusão de dados (LGPD) são atendidos manualmente pelo e-mail de contato; falta uma tela de exclusão de conta.
- Termos e política foram escritos sem revisão jurídica; mudar o texto exige subir `VERSAO_TERMOS` (front) e `VersaoTermosAtual` (back) juntos.
- Falta a página de perfil para editar os dados, e o login com Google (com a etapa de completar o perfil).

## Hub

- O hub (`/mesas`) ainda não se atualiza em tempo real; só a página de cada mesa.
- O hub não pagina: mostra só as 20 mesas mais recentes que a API devolve.
- Se "Sair da mesa" falhar, o erro não aparece na tela.
- O e-mail não é confirmado (`isEmailConfirmed` fica `false`).

## Dados que não são salvos

Atributos, perícias, condições e tabela de combate. Veja [05-estado-e-persistencia.md](05-estado-e-persistencia.md#o-que-ainda-não-é-salvo).

## Problemas conhecidos

- O valor máximo das barras (Vida, Sanidade, Esforço) está fixo em 100 e não dá para editar na tela.

- As duas seções de perícias são independentes: mudar o valor numa não muda na outra.
- A tabela de combate mostra 4 linhas iguais de exemplo ("balestra").
- O layout da ficha antiga (`/ficha`) tem largura fixa de **940px** e não é responsivo (as outras páginas já ocupam a tela toda).
- `public/img/bg.jpg` e `public/img/d20.png` não são usados.
- Quem escolhe o tema claro vê o escuro por um instante ao recarregar, porque o tema salvo só é aplicado depois da hidratação.
- As cores das barras (`vida`, `sanidade`, `esforco`) têm pouco contraste com o trilho no tema escuro; o valor numérico ao lado do título compensa.
- Colunas "nun. Atual" e "nun. Maximo" da tabela de combate (`Combate.tsx`): falta confirmar o que significam (munição?) antes de corrigir o texto.
