// Regras do Instagram: legenda, quantidade de imagens, nome de mídia, token fora dos textos e a trava da API.
import { test } from "node:test";
import assert from "node:assert/strict";
import { NOME_DE_MIDIA, baseDaGraph, problemasDaLegenda, problemasDasMidias, semToken, tipoDoToken } from "../lib/instagram/regras.ts";

test("legenda: aceita a boa e aponta cada problema", () => {
  assert.deepEqual(problemasDaLegenda("O pedido entra sozinho no Bling. #integracao #pme"), []);
  assert.equal(problemasDaLegenda("   ").length, 1, "vazia");
  assert.equal(problemasDaLegenda("a".repeat(2201)).length, 1, "longa demais");
  assert.equal(problemasDaLegenda("texto " + Array.from({ length: 31 }, (_, i) => "#tag" + i).join(" ")).length, 1, "31 hashtags");
  assert.equal(problemasDaLegenda("Novo site no ar #Ferrugem").length, 1, "hashtag proibida");
  assert.equal(problemasDaLegenda("Ferrugem é meu apelido").length, 0, "a palavra fora de hashtag passa");
  assert.equal(problemasDaLegenda("Antes — depois").length, 1, "travessão");
});

test("mídias: imagem tem 1, carrossel tem de 2 a 10", () => {
  assert.deepEqual(problemasDasMidias("imagem", 1), []);
  assert.equal(problemasDasMidias("imagem", 2).length, 1);
  assert.deepEqual(problemasDasMidias("carrossel", 2), []);
  assert.deepEqual(problemasDasMidias("carrossel", 10), []);
  assert.equal(problemasDasMidias("carrossel", 1).length, 1);
  assert.equal(problemasDasMidias("carrossel", 11).length, 1);
});

test("nome de mídia: só arquivo simples da pasta, sem subir de diretório", () => {
  assert.ok(NOME_DE_MIDIA.test("case-ss-comercio-1a2b3c4d5e.jpg"));
  assert.ok(NOME_DE_MIDIA.test("reels-1.mp4"));
  for (const ruim of ["../segredo.jpg", "a/b.jpg", "foto.JPG", "foto.gif", ".env", "foto.jpg.php", "foto%2f.jpg", ""]) {
    assert.equal(NOME_DE_MIDIA.test(ruim), false, ruim);
  }
});

test("token nunca aparece em mensagem", () => {
  const token = "IGAAabcdefghijklmnopqrstuvwxyz0123456789";
  assert.equal(semToken(`falhou com ${token} na chamada`, token).includes(token), false);
  assert.equal(semToken("https://x/me?fields=a&access_token=segredo123&b=1").includes("segredo123"), false);
  assert.equal(semToken("erro IGAAzzzzzzzzzzzzzzzzzzzz fim").includes("IGAAzzzz"), false, "mesmo sem saber qual é o token");
});

test("trava: fora de produção a API só pode ser a falsa, em localhost", () => {
  assert.deepEqual(baseDaGraph({ NODE_ENV: "development", IG_GRAPH_BASE: "http://localhost:4010" }), { base: "http://localhost:4010", falsa: true });
  assert.throws(() => baseDaGraph({ NODE_ENV: "development" }), /API falsa/);
  assert.throws(() => baseDaGraph({ NODE_ENV: "development", IG_GRAPH_BASE: "https://graph.instagram.com" }), /API falsa/);
  assert.throws(() => baseDaGraph({ NODE_ENV: "test", IG_GRAPH_BASE: "http://exemplo.com" }), /API falsa/);
  assert.deepEqual(baseDaGraph({ NODE_ENV: "production" }), { base: "https://graph.instagram.com", falsa: false });
});

test("tipo de token: IGAA fala com o Instagram, EAA (login unificado) fala com o Facebook", () => {
  assert.equal(tipoDoToken("IGAAabc123"), "instagram");
  assert.equal(tipoDoToken("  EAAOabc123 "), "facebook");
  assert.deepEqual(baseDaGraph({ NODE_ENV: "production" }, "facebook"), { base: "https://graph.facebook.com", falsa: false });
  assert.deepEqual(baseDaGraph({ NODE_ENV: "production" }, "instagram"), { base: "https://graph.instagram.com", falsa: false });
  assert.deepEqual(baseDaGraph({ NODE_ENV: "development", IG_GRAPH_BASE: "http://localhost:4010" }, "facebook"), { base: "http://localhost:4010", falsa: true });
  assert.throws(() => baseDaGraph({ NODE_ENV: "development" }, "facebook"), /API falsa/, "fora de produção o tipo novo também só fala com a API falsa");
  assert.equal(semToken("erro com EAAOzzzzzzzzzzzzzzzzzzzzzz no meio").includes("EAAOzzz"), false);
});
