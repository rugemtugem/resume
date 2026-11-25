# Roteiros do Instagram e do LinkedIn

Cada arquivo desta pasta vira um carrossel (e um story, e um post do LinkedIn, se tiver a seção).
O nome do arquivo é o identificador: só letras minúsculas, números e hífen, como `pedido-whatsapp-erp.md`.
Se o nome for igual ao de um post em `content/blog`, os dois são aprovados juntos no painel.

Este arquivo (com letras maiúsculas no nome) não é lido como roteiro.
Um exemplo completo está em `tests/exemplos/roteiro.md`.

## Formato

```
tema: Pedido do WhatsApp direto no sistema
categoria: Para empresas
agendar: 2026-12-02 12:00
link: /servicos/integracao-whatsapp-erp

## capa
titulo: O pedido chega no WhatsApp e alguém [digita tudo de novo]?
nota: Frase curta de apoio

## pontos
titulo: Onde o tempo some
- Primeira linha
- Segunda linha

## duo
titulo: O que muda
antes: Como é hoje
depois: Como fica

## numero
valor: 7.170
titulo: O que o número mede
fonte: De onde o número saiu

## cta
titulo: Pergunta final com [destaque]?
nota: Frase de apoio
botao: Diagnóstico gratuito

## legenda
Texto da legenda do Instagram, com as hashtags no fim.

## linkedin
Texto do post do LinkedIn. {link} vira o endereço da página.
```

## Regras que o painel confere

- De 2 a 10 slides. O primeiro é a `capa` e o último é o `cta`.
- Tipos de slide: `capa`, `pontos` (de 1 a 4 linhas), `duo`, `numero` e `cta`.
- Colchetes no título marcam o trecho em laranja.
- Todo slide `numero` precisa da linha `fonte:`.
- Nenhum travessão, em nenhum texto.
- Legenda com até 2.200 caracteres e 30 hashtags; texto do LinkedIn com até 3.000 caracteres.
- `agendar:` é só a data sugerida (horário de Brasília); a data que vale é a escolhida ao aprovar.
- `link:` é opcional e precisa ser um caminho do próprio site. É para onde o story e o `{link}` levam.
  Sem ela, levam ao post do blog de mesmo nome, ou à página inicial.
- A seção `linkedin` é opcional. Sem ela, o roteiro não vai para o LinkedIn.

## Onde aprovar

Painel, menu **Instagram**, bloco **Carrosséis prontos**. A tela do roteiro mostra os slides, o story,
o texto do LinkedIn e o botão de aprovar.
