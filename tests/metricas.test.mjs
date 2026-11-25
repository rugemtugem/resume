// Regras do painel de métricas: período de dias completos, comparação, meta automática e a trava das APIs do Google.
import { test } from "node:test";
import assert from "node:assert/strict";
import { diasEntre, enderecosDoGoogle, metaAutomatica, periodoDe, serieCompleta, ultimos7, variacao } from "../lib/metricas/regras.ts";

test("período: N dias completos até ontem, no horário de Brasília", () => {
  // 25/11 às 20h de Brasília (23h UTC): ontem é 24/11.
  assert.deepEqual(periodoDe(7, new Date("2026-11-25T23:00:00Z")), { dias: 7, inicio: "2026-11-18", fim: "2026-11-24", antInicio: "2026-11-11", antFim: "2026-11-17" });
  // 26/11 à 1h UTC ainda é 25/11 às 22h em Brasília: o período não muda.
  assert.equal(periodoDe(7, new Date("2026-11-26T01:00:00Z")).fim, "2026-11-24");
  // Às 3h UTC vira o dia em Brasília.
  assert.equal(periodoDe(7, new Date("2026-11-26T03:00:00Z")).fim, "2026-11-25");
  const trinta = periodoDe(30, new Date("2026-11-25T15:00:00Z"));
  assert.equal(diasEntre(trinta.inicio, trinta.fim).length, 30);
  assert.equal(diasEntre(trinta.antInicio, trinta.antFim).length, 30);
  assert.equal(diasEntre(trinta.antFim, trinta.inicio).length, 2, "os dois períodos são vizinhos, sem dia repetido nem pulado");
});

test("série: dia sem registro vale zero, na ordem", () => {
  assert.deepEqual(serieCompleta("2026-11-01", "2026-11-03", { "2026-11-02": 5 }), [
    { dia: "2026-11-01", valor: 0 },
    { dia: "2026-11-02", valor: 5 },
    { dia: "2026-11-03", valor: 0 },
  ]);
  assert.equal(ultimos7(Array.from({ length: 10 }, (_, i) => ({ valor: i }))), 3 + 4 + 5 + 6 + 7 + 8 + 9);
});

test("variação: em porcentagem inteira, e nula sem base de comparação", () => {
  assert.equal(variacao(120, 100), 20);
  assert.equal(variacao(75, 100), -25);
  assert.equal(variacao(100, 100), 0);
  assert.equal(variacao(10, 0), null);
});

test("meta automática: o maior entre 15% acima do anterior e o ritmo dos últimos 7 dias mais 10%", () => {
  assert.equal(metaAutomatica(100, null, 30), 115);
  assert.equal(metaAutomatica(100, 70, 30), 330, "ritmo de 10 por dia em 30 dias, mais 10%");
  assert.equal(metaAutomatica(400, 70, 30), 460, "o período anterior manda quando é maior");
  assert.equal(metaAutomatica(0, 0, 30), 1, "nunca menor que 1");
});

test("trava: fora de produção as APIs do Google só podem ser a falsa, em localhost", () => {
  const falsa = enderecosDoGoogle({ NODE_ENV: "development", GOOGLE_API_BASE: "http://localhost:4010/google" });
  assert.equal(falsa.falsa, true);
  assert.equal(falsa.token, "http://localhost:4010/google/token");
  assert.equal(falsa.ga4, "http://localhost:4010/google/analyticsdata/v1beta");
  assert.throws(() => enderecosDoGoogle({ NODE_ENV: "development" }), /API falsa/);
  assert.throws(() => enderecosDoGoogle({ NODE_ENV: "development", GOOGLE_API_BASE: "https://analyticsdata.googleapis.com" }), /API falsa/);
  const real = enderecosDoGoogle({ NODE_ENV: "production" });
  assert.equal(real.falsa, false);
  assert.equal(real.token, "https://oauth2.googleapis.com/token");
  assert.equal(real.ga4, "https://analyticsdata.googleapis.com/v1beta");
  assert.equal(real.gsc, "https://searchconsole.googleapis.com/webmasters/v3");
});
