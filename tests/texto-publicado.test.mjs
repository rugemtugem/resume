// Trava de texto publicado: sem travessão (U+2014 e U+2013), sem "Ferrugem" e sem os números sem fonte.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const RAIZ = new URL("..", import.meta.url).pathname;
const PASTAS = ["app", "components", "data", "lib", "content", "public/llms.txt", "public/scripts"];
const EXT = new Set([".ts", ".tsx", ".js", ".txt", ".md"]);

function arquivos(caminho) {
  const abs = join(RAIZ, caminho);
  if (statSync(abs).isFile()) return [caminho];
  return readdirSync(abs).flatMap((nome) => {
    const rel = join(caminho, nome);
    if (statSync(join(RAIZ, rel)).isDirectory()) return arquivos(rel);
    return EXT.has(extname(nome)) ? [rel] : [];
  });
}

/** Tira comentários de código, que não são texto publicado. */
function semComentarios(texto) {
  return texto
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
}

const TODOS = PASTAS.flatMap(arquivos).map((rel) => ({
  rel,
  texto: semComentarios(readFileSync(join(RAIZ, rel), "utf8")),
}));

function ocorrencias(regex) {
  const achados = [];
  for (const { rel, texto } of TODOS) {
    texto.split("\n").forEach((linha, i) => {
      if (regex.test(linha)) achados.push(`${rel}:${i + 1}: ${linha.trim().slice(0, 100)}`);
    });
  }
  return achados;
}

test("nenhum travessão em texto publicado", () => {
  assert.deepEqual(ocorrencias(/[—–]/), []);
});

test('"Ferrugem" não aparece no site', () => {
  assert.deepEqual(ocorrencias(/ferrugem/i), []);
});

test("os quatro números sem fonte não voltam", () => {
  assert.deepEqual(ocorrencias(/R\$ ?5M|\+40%|50\+ empresas|95% (taxa|de satisfa)|Taxa de Satisfação/i), []);
});

test("há arquivos para conferir", () => {
  assert.ok(TODOS.length > 20, `só ${TODOS.length} arquivos lidos`);
});
