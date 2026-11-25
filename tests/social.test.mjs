// Roteiro do Instagram: leitura do arquivo, destaque do título e os problemas que barram a aprovação.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { lerRoteiro, palavrasDoTitulo, problemasDoRoteiro } from "../lib/social/roteiro.ts";
import { problemasDaLegenda } from "../lib/instagram/regras.ts";

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

test("os roteiros da pasta content/social estão prontos para aprovar", () => {
  const pasta = new URL("../content/social/", import.meta.url).pathname;
  const arquivos = readdirSync(pasta).filter((n) => n.endsWith(".md"));
  assert.ok(arquivos.length > 0);
  for (const nome of arquivos) {
    const r = lerRoteiro(readFileSync(join(pasta, nome), "utf8"));
    assert.deepEqual([...problemasDoRoteiro(r), ...problemasDaLegenda(r.legenda)], [], nome);
  }
});
