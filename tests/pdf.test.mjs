import test from "node:test";
import assert from "node:assert/strict";
import { pdfDeImagens } from "../lib/social/pdf.ts";

// JPEG mínimo de mentira: só o começo e o fim que o gerador confere.
const jpeg = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(64, 7), Buffer.from([0xff, 0xd9])]);

test("PDF do carrossel: uma página por imagem, com tabela de posições certa", () => {
  const pdf = pdfDeImagens([1, 2, 3].map(() => ({ jpeg, largura: 1080, altura: 1350 })), "O que automatizar (primeiro) \\ na empresa");
  const texto = pdf.toString("latin1");
  assert.equal(texto.slice(0, 8), "%PDF-1.4");
  assert.ok(texto.trimEnd().endsWith("%%EOF"));
  assert.equal((texto.match(/\/Type \/Page\b/g) || []).length, 3);
  assert.match(texto, /\/Count 3/);
  assert.match(texto, /\/MediaBox \[0 0 810 1012\.5\]/);
  assert.match(texto, /\/Title \(O que automatizar primeiro  na empresa\)/);
  // Cada posição da tabela aponta para o começo do objeto de mesmo número.
  const inicio = Number(texto.match(/startxref\n(\d+)/)[1]);
  assert.equal(texto.slice(inicio, inicio + 4), "xref");
  const linhas = texto.slice(inicio).split("\n").slice(3, 3 + 12);
  linhas.forEach((linha, i) => assert.equal(texto.slice(Number(linha.slice(0, 10)), Number(linha.slice(0, 10)) + String(i + 1).length + 6), `${i + 1} 0 obj`));
});

test("PDF do carrossel: recusa o que não é JPEG e lista vazia", () => {
  assert.throws(() => pdfDeImagens([], "x"), /pelo menos uma página/);
  assert.throws(() => pdfDeImagens([{ jpeg: Buffer.from("PNG nao serve"), largura: 10, altura: 10 }], "x"), /não é um JPEG/);
});
