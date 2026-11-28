// Roteiro do Instagram: leitura do arquivo, destaque do título e os problemas que barram a aprovação.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { lerRoteiro, palavrasDoTitulo, problemasDoRoteiro } from "../lib/social/roteiro.ts";
import { problemasDaLegenda } from "../lib/instagram/regras.ts";
import { destinoDoStory, diaDeBrasilia, ehRobo } from "../lib/social/story.ts";

const BOM = `tema: Pedido direto no sistema
categoria: Para empresas
agendar: 2026-12-02 12:00

## capa
titulo: O pedido chega e alguém [digita de novo]?
nota: Frase de apoio

## pontos
titulo: Onde o tempo some
- Primeira linha
- Segunda linha

## numero
valor: 7.170
titulo: testes automatizados
fonte: repositório, 25/11/2026

## duo
titulo: O que muda
antes: Copiado à mão
depois: Entra sozinho

## cta
titulo: Quer ver?
botao: Falar comigo

## legenda
Primeira linha da legenda.

#integracao #pme
`;

test("lê cabeçalho, slides e legenda", () => {
  const r = lerRoteiro(BOM);
  assert.equal(r.tema, "Pedido direto no sistema");
  assert.equal(r.categoria, "Para empresas");
  assert.equal(r.agendar, "2026-12-02 12:00");
  assert.deepEqual(r.slides.map((s) => s.tipo), ["capa", "pontos", "numero", "duo", "cta"]);
  assert.deepEqual(r.slides[1].linhas, ["Primeira linha", "Segunda linha"]);
  assert.equal(r.slides[2].valor, "7.170");
  assert.equal(r.slides[3].depois, "Entra sozinho");
  assert.equal(r.slides[4].botao, "Falar comigo");
  assert.equal(r.legenda, "Primeira linha da legenda.\n\n#integracao #pme");
  assert.deepEqual(problemasDoRoteiro(r), []);
});

test("colchetes marcam o trecho em destaque", () => {
  assert.deepEqual(palavrasDoTitulo("O pedido [digita de novo] aqui"), [
    { texto: "O", destaque: false },
    { texto: "pedido", destaque: false },
    { texto: "digita", destaque: true },
    { texto: "de", destaque: true },
    { texto: "novo", destaque: true },
    { texto: "aqui", destaque: false },
  ]);
  assert.deepEqual(palavrasDoTitulo("Onde [perde tempo]? Aqui").map((p) => p.texto), ["Onde", "perde", "tempo?", "Aqui"], "pontuação colada no destaque");
});

test("aponta cada problema que barra a aprovação", () => {
  const com = (de, para) => problemasDoRoteiro(lerRoteiro(BOM.replace(de, para)));
  assert.match(com("fonte: repositório, 25/11/2026\n", "").join(" "), /precisa de fonte/, "número sem fonte");
  assert.match(com("## capa", "## pontos").join(" "), /primeiro slide precisa ser a capa/);
  assert.match(com("## cta", "## pontos").join(" "), /último slide precisa ser o convite/);
  assert.match(com("## duo", "## grafico").join(" "), /tipo "grafico" não existe/);
  assert.match(com("depois: Entra sozinho\n", "").join(" "), /antes:" e "depois:"/);
  assert.match(com("valor: 7.170", "valor: 1.234.567.890").join(" "), /não cabe/);
  assert.match(com("Copiado à mão", "Copiado " + String.fromCharCode(0x2014) + " à mão").join(" "), /travessão/);
  assert.match(com("agendar: 2026-12-02 12:00", "agendar: 02/12/2026").join(" "), /AAAA-MM-DD HH:MM/);
  assert.match(com("tema: Pedido direto no sistema\n", "").join(" "), /tema:/);
  assert.match(problemasDoRoteiro(lerRoteiro(BOM.split("## legenda")[0])).join(" "), /legenda/);
  assert.match(problemasDoRoteiro(lerRoteiro("tema: x\n## capa\ntitulo: Só um\n## legenda\noi")).join(" "), /2 a 10 slides/);
  const longo = "- " + "palavra ".repeat(15);
  assert.match(com("- Primeira linha", longo).join(" "), /limite é 95/);
});

test("link do story: destino sempre dentro do site, com a campanha", () => {
  const utm = "?utm_source=instagram&utm_medium=story&utm_campaign=meu-post";
  assert.equal(destinoDoStory({ slug: "meu-post", link: "", postNoAr: true }), "/blog/meu-post" + utm);
  assert.equal(destinoDoStory({ slug: "meu-post", link: "", postNoAr: false }), "/" + utm);
  assert.equal(destinoDoStory({ slug: "meu-post", link: "/servicos/ia-na-operacao", postNoAr: true }), "/servicos/ia-na-operacao" + utm);
  for (const fora of ["https://exemplo.com", "//exemplo.com", "/\\exemplo.com", "/a?b=1", "javascript:alert(1)"]) {
    assert.equal(destinoDoStory({ slug: "meu-post", link: fora, postNoAr: false }), "/" + utm, fora);
  }
  assert.equal(destinoDoStory({ slug: "", link: "", postNoAr: false }), "/?utm_source=instagram&utm_medium=story");
  assert.match(problemasDoRoteiro(lerRoteiro(BOM.replace("agendar:", "link: https://exemplo.com\nagendar:"))).join(" "), /caminho do próprio site/);
  assert.equal(lerRoteiro(BOM.replace("agendar:", "link: /servicos\nagendar:")).link, "/servicos");
});

test("link do story: robô não conta e o dia é o de Brasília", () => {
  assert.equal(ehRobo("facebookexternalhit/1.1"), true);
  assert.equal(ehRobo(""), true);
  assert.equal(ehRobo(null), true);
  assert.equal(ehRobo("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Instagram 350.0"), false);
  assert.equal(diaDeBrasilia(new Date("2026-12-02T01:30:00Z")), "2026-12-01");
  assert.equal(diaDeBrasilia(new Date("2026-12-02T03:00:00Z")), "2026-12-02");
});

test("o roteiro de exemplo e os roteiros de content/social estão prontos para aprovar", () => {
  const exemplo = lerRoteiro(readFileSync(new URL("./exemplos/roteiro.md", import.meta.url), "utf8"));
  assert.equal(exemplo.slides.length, 5);
  assert.ok(exemplo.linkedin.includes("{link}"));
  assert.deepEqual([...problemasDoRoteiro(exemplo), ...problemasDaLegenda(exemplo.legenda)], []);

  // A pasta pode estar vazia (ou só com o LEIA-ME): nomes de arquivo com maiúscula não são roteiros.
  const pasta = new URL("../content/social/", import.meta.url).pathname;
  for (const nome of readdirSync(pasta).filter((n) => /^[a-z0-9-]+\.md$/.test(n))) {
    const r = lerRoteiro(readFileSync(join(pasta, nome), "utf8"));
    assert.deepEqual([...problemasDoRoteiro(r), ...problemasDaLegenda(r.legenda)], [], nome);
  }
});

test("link do story: duas barras no começo não viram endereço de outro site", () => {
  assert.equal(destinoDoStory({ slug: "meu-post", link: "//exemplo", postNoAr: false }).startsWith("/?"), true);
  assert.match(problemasDoRoteiro(lerRoteiro("tema: x\nlink: //exemplo\n## capa\ntitulo: A\n## cta\ntitulo: B\n## legenda\noi")).join(" "), /caminho do próprio site/);
});

test("Reels: lê o bloco do roteiro e aponta cada problema", async () => {
  const { problemasDoReels, duracaoDoReels } = await import("../lib/reels/regras.ts");
  const bom = "eyebrow: Teste\n### pergunta 4\nO pedido chega e alguém {digita de novo}?\n### lista 5\ntitulo: Onde erra\n- Um\n- Dois\n### encerramento 4\ntexto: Diagnóstico gratuito\nurl: rugemtugem.dev";
  assert.deepEqual(problemasDoReels(bom), []);
  assert.equal(duracaoDoReels(bom), 13);
  assert.equal(lerRoteiro(BOM + "\n## reels\n" + bom + "\n").reels, bom);
  assert.equal(lerRoteiro(BOM + "\n## reels\n" + bom + "\n").slides.length, 5, "as cenas do Reels não viram slides");
  const com = (de, para) => problemasDoReels(bom.replace(de, para)).join(" ");
  assert.match(com("### pergunta 4", "### pergunta 1"), /2,5 e 12 segundos/);
  assert.match(com("### pergunta 4", "### lista 4\ntitulo: x\n- a"), /abrir pelo assunto/);
  assert.match(com("### encerramento 4", "### titulo 4"), /última cena precisa ser o encerramento/);
  assert.match(com("url: rugemtugem.dev", ""), /url:/);
  assert.match(com("### lista 5", "### grafico 5"), /tipo "grafico" não existe/);
  assert.match(com("- Um\n- Dois", "- 1\n- 2\n- 3\n- 4\n- 5"), /1 a 4 itens/);
  assert.match(com("### lista 5\ntitulo: Onde erra\n- Um\n- Dois", "### numero 5\nrotulo: Testes\nvalor: 7.170"), /precisa de fonte/);
  assert.match(com("Onde erra", "Onde " + String.fromCharCode(0x2014) + " erra"), /travessão/);
  assert.match(problemasDoReels("### pergunta 4\nOi?\n### encerramento 3\ntexto: x\nurl: y").join(" "), /3 a 10 cenas/);
});

test("os roteiros de content/social têm Reels válido", async () => {
  const { problemasDoReels } = await import("../lib/reels/regras.ts");
  const pasta = new URL("../content/social/", import.meta.url).pathname;
  for (const nome of readdirSync(pasta).filter((n) => /^[a-z0-9-]+\.md$/.test(n))) {
    const r = lerRoteiro(readFileSync(join(pasta, nome), "utf8"));
    if (r.reels) assert.deepEqual(problemasDoReels(r.reels), [], nome);
  }
});
