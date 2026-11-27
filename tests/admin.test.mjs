// Senha, sessão e regra da Agenda. Importa o TypeScript direto (o Node tira os tipos).
import { test } from "node:test";
import assert from "node:assert/strict";
import { hashSenha, conferirSenha, assinarSessao, sessaoValida, DURACAO_DA_SESSAO_MS, brasiliaParaUtc, utcParaBrasilia, visivelNaAgenda } from "../lib/admin/seguranca.ts";

test("senha: confere a certa e recusa a errada", () => {
  const hash = hashSenha("uma senha de teste");
  assert.ok(hash.startsWith("scrypt:"));
  assert.equal(hash.includes(String.fromCharCode(36)), false, "sem cifrão, que o arquivo de ambiente trocaria por variável");
  assert.equal(conferirSenha("uma senha de teste", hash), true);
  assert.equal(conferirSenha("outra senha", hash), false);
  assert.equal(conferirSenha("uma senha de teste", "texto qualquer"), false);
});

test("sessão: vale por 8 horas e não aceita adulteração", () => {
  const segredo = "s".repeat(40);
  const agora = Date.UTC(2026, 10, 25, 12);
  const cookie = assinarSessao(segredo, agora);
  assert.equal(sessaoValida(cookie, segredo, agora + 1000), true);
  assert.equal(sessaoValida(cookie, segredo, agora + DURACAO_DA_SESSAO_MS + 1), false, "venceu");
  assert.equal(sessaoValida(cookie, "x".repeat(40), agora + 1000), false, "outro segredo");
  const [corpo, assinatura] = cookie.split(".");
  const forjado = Buffer.from(JSON.stringify({ exp: agora * 10 })).toString("base64url");
  assert.equal(sessaoValida(`${forjado}.${assinatura}`, segredo, agora + 1000), false, "validade trocada");
  assert.equal(sessaoValida(corpo, segredo, agora), false, "sem assinatura");
  assert.equal(sessaoValida(undefined, segredo, agora), false);
});

test("datas: Brasília para UTC e de volta", () => {
  assert.equal(brasiliaParaUtc("2026-12-02T09:00"), "2026-12-02T12:00:00.000Z");
  assert.equal(brasiliaParaUtc("2026-12-31T22:30"), "2027-01-01T01:30:00.000Z");
  assert.equal(utcParaBrasilia("2026-12-02T12:00:00.000Z"), "2026-12-02T09:00");
  assert.equal(brasiliaParaUtc("amanhã"), null);
});

test("Agenda: só aparece o que foi aprovado e já venceu", () => {
  const agora = Date.UTC(2026, 11, 2, 12);
  const antes = "2026-12-02T11:00:00.000Z";
  const depois = "2026-12-02T13:00:00.000Z";
  assert.equal(visivelNaAgenda({ status: "aprovado", quando_utc: antes }, agora), true);
  assert.equal(visivelNaAgenda({ status: "publicado", quando_utc: antes }, agora), true);
  assert.equal(visivelNaAgenda({ status: "aprovado", quando_utc: depois }, agora), false, "ainda não venceu");
  assert.equal(visivelNaAgenda({ status: "pendente", quando_utc: antes }, agora), false, "não aprovado");
  assert.equal(visivelNaAgenda(undefined, agora), false, "sem linha na Agenda");
});

test("sessão: sair muda a época e todo cookie anterior deixa de valer", () => {
  const segredo = "s".repeat(40);
  const agora = Date.now();
  const cookie = assinarSessao(segredo, agora, 3);
  assert.equal(sessaoValida(cookie, segredo, agora, 3), true);
  assert.equal(sessaoValida(cookie, segredo, agora, 4), false, "depois de sair");
  assert.equal(sessaoValida(assinarSessao(segredo, agora), segredo, agora, 0), true, "sem banco a época é zero");
  assert.equal(sessaoValida(assinarSessao(segredo, agora), segredo, agora, 1), false);
});

test("senha: hash cortado ou malformado nunca confere, nem com senha vazia", () => {
  const bom = hashSenha("uma-senha-bem-longa");
  const [tipo, sal] = bom.split(":");
  for (const ruim of [`${tipo}:${sal}:A`, `${tipo}:${sal}:`, `${tipo}:${sal}:!!!`, `${tipo}:A:${bom.split(":")[2]}`, "scrypt::", ""]) {
    assert.equal(conferirSenha("qualquer", ruim), false, ruim.slice(0, 20));
    assert.equal(conferirSenha("", ruim), false, "senha vazia com " + ruim.slice(0, 20));
  }
  assert.equal(conferirSenha("uma-senha-bem-longa", bom), true);
});
