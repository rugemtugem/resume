// Travas do blog: todo post tem descrição escrita à mão e todo link interno existe.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const RAIZ = new URL("..", import.meta.url).pathname;
const PASTA = join(RAIZ, "content", "blog");
const POSTS = readdirSync(PASTA)
  .filter((a) => /^[a-z0-9].*\.md$/.test(a))
  .map((arquivo) => ({ arquivo, texto: readFileSync(join(PASTA, arquivo), "utf8") }));

const slugs = (arquivo, exportado) =>
  [...readFileSync(join(RAIZ, arquivo), "utf8").matchAll(/slug: "([^"]+)"/g)].map((m) => `${exportado}/${m[1]}`);
const slugsDosPosts = POSTS.map(({ texto }) => `/blog/${(texto.match(/·\s*slug:\s*(\S+)/) || [])[1]}`);
const ROTAS = new Set(["/", "/casos", "/servicos", "/blog", "/privacidade", ...slugs("data/casos.ts", "/casos"), ...slugs("data/servicos.ts", "/servicos"), ...slugsDosPosts]);

test("há pelo menos um post para conferir", () => {
  assert.ok(POSTS.length > 0);
});

for (const { arquivo, texto } of POSTS) {
  test(`${arquivo}: metadados completos`, () => {
    assert.match(texto, /^#\s+\S/m, "falta o título");
    assert.match(texto, /^>\s*Categoria:\s*(Empresas|IA)\s*·\s*slug:\s*[a-z0-9-]+\s*$/m, "linha de categoria e slug inválida");
    const desc = (texto.match(/^>\s*DESC:\s*(.+)$/m) || [])[1] || "";
    assert.ok(desc.length >= 70 && desc.length <= 160, `DESC com ${desc.length} caracteres (precisa de 70 a 160)`);
    assert.match(texto, /^>\s*Agendar:\s*\d{4}-\d{2}-\d{2}( \d{2}:\d{2})?\s*$/m, "falta a linha Agendar");
    assert.match(texto, /^\*\*Resumo:\*\*/m, "falta o resumo");
  });

  test(`${arquivo}: links internos existem`, () => {
    const quebrados = [...texto.matchAll(/\]\((\/[^)#\s]*)/g)].map((m) => m[1].replace(/\/$/, "") || "/").filter((href) => !ROTAS.has(href));
    assert.deepEqual(quebrados, []);
  });
}

test("a pasta de posts existe", () => {
  assert.ok(existsSync(PASTA));
});
