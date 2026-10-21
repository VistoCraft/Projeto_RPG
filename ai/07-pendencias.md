# Pendências

Tire o item daqui quando ele for resolvido. Se a solução envolveu uma escolha, registre em [06-decisoes.md](06-decisoes.md).

## Funcionalidades sem implementação

Os botões existem na tela, mas não fazem nada:

| Botão | Onde | Dúvidas antes de implementar |
| --- | --- | --- |
| Rolagem (d20) | `Atributos.tsx` | É 1d20 contra o valor do atributo? Onde o resultado aparece? Precisa de histórico? |
| "ver" / "editar" | `Cabecalho.tsx` | Alterna a seção entre modo só leitura e modo edição? |
| "favoritar" | `Pericias.tsx` | Marca a perícia para aparecer na seção de favoritas? Essa marcação deve ser salva? |

## Dados que não são salvos

Atributos, perícias, condições e tabela de combate. Veja [05-estado-e-persistencia.md](05-estado-e-persistencia.md#o-que-ainda-não-é-salvo).

## Problemas conhecidos

- O valor máximo das barras (Vida, Sanidade, Esforço) está fixo em 100 e não dá para editar na tela.

- As duas seções de perícias são independentes: mudar o valor numa não muda na outra.
- A tabela de combate mostra 4 linhas iguais de exemplo ("balestra").
- O layout tem largura fixa de **940px** e não é responsivo.
- `public/img/bg.jpg` e `public/img/d20.png` não são usados.
- Colunas "nun. Atual" e "nun. Maximo" da tabela de combate (`Combate.tsx`): falta confirmar o que significam (munição?) antes de corrigir o texto.
