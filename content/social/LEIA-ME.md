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

## reels
eyebrow: Assunto em duas palavras
nota: Frase curta do rodapé do vídeo.

### pergunta 4
A pergunta que abre o vídeo, com {trecho em laranja}?

### lista 5.5
titulo: Título da cena
- Até quatro itens curtos

### passos 6.5
titulo: Título da cena
- Passo com título | e uma linha de apoio (opcional)

### titulo 4.5
Uma frase forte com {destaque}
sub: Linha de apoio

### encerramento 4.5
texto: O convite final
url: rugemtugem.dev
aviso: O link está na bio.
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
- A seção `reels` é opcional. É um vídeo só com texto animado, sem câmera. O número depois do tipo da cena é a duração
  em segundos (de 2,5 a 12). De 3 a 10 cenas, de 8 a 60 segundos no total. A primeira cena abre pelo assunto
  (`pergunta`, `titulo`, `manchete` ou `numero`) e a última é o `encerramento`, com a linha `url:`.
  Cenas `numero` e `compara` exigem a linha `fonte:`. No Reels o destaque usa chaves, e não colchetes.

## Onde aprovar

Painel, menu **Instagram**, bloco **Carrosséis prontos**. A tela do roteiro mostra os slides, o Reels,
o story, o texto do LinkedIn e o botão de aprovar. O Reels é gerado ali mesmo, no Chrome ou no Edge.
