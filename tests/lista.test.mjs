import test from "node:test";
import assert from "node:assert/strict";
import { enderecoDaLista, filtrarEPaginar, lerPedido, semAcento } from "../lib/admin/lista.ts";

const posts = Array.from({ length: 23 }, (_, i) => ({ titulo: i % 2 ? `Automação número ${i}` : `Projeto ${i}`, estado: i < 5 ? "pendente" : "publicado" }));
const regras = { texto: (p) => p.titulo, grupo: (p) => p.estado, porPagina: 10 };

test("lista: busca sem acento, com todas as palavras, e contagem por filtro", () => {
  assert.equal(semAcento("Automação"), "automacao");
  const r = filtrarEPaginar(posts, { busca: "automacao", filtro: "", pagina: 1 }, regras);
  assert.equal(r.total, 23);
  assert.equal(r.encontrados, 11);
  assert.equal(r.itens.length, 10);
  assert.equal(r.paginas, 2);
  assert.deepEqual(r.contagens, { "": 11, pendente: 2, publicado: 9 });
  assert.equal(filtrarEPaginar(posts, { busca: "numero 21", filtro: "", pagina: 1 }, regras).encontrados, 1);
  assert.equal(filtrarEPaginar(posts, { busca: "nada disso", filtro: "", pagina: 1 }, regras).encontrados, 0);
});

test("lista: filtro, paginação e página além do fim", () => {
  const r = filtrarEPaginar(posts, { busca: "", filtro: "pendente", pagina: 1 }, regras);
  assert.equal(r.encontrados, 5);
  assert.equal(r.paginas, 1);
  const fim = filtrarEPaginar(posts, { busca: "", filtro: "", pagina: 99 }, regras);
  assert.equal(fim.pagina, 3);
  assert.equal(fim.itens.length, 3);
});

test("lista: lê o pedido do endereço e monta o endereço sem perder as outras listas", () => {
  assert.deepEqual(lerPedido({ fq: "  reels ", ff: "erro", fp: "2", rq: "outra" }, "f"), { busca: "reels", filtro: "erro", pagina: 2 });
  assert.deepEqual(lerPedido({ fp: "-3" }, "f"), { busca: "", filtro: "", pagina: 1 });
  assert.deepEqual(lerPedido({ fp: "abc", fq: ["a", "b"] }, "f"), { busca: "a", filtro: "", pagina: 1 });
  const atuais = { rq: "ia", fp: "3", ff: "erro" };
  assert.equal(enderecoDaLista("/admin/instagram", atuais, "f", { pagina: 2 }, "fila"), "/admin/instagram?rq=ia&fp=2&ff=erro#fila");
  // Trocar o filtro volta para a página 1; limpar tira os parâmetros da lista e mantém os da outra.
  assert.equal(enderecoDaLista("/admin/instagram", atuais, "f", { filtro: "publicado" }, "fila"), "/admin/instagram?rq=ia&ff=publicado#fila");
  assert.equal(enderecoDaLista("/admin/instagram", atuais, "f", { busca: "", filtro: "" }, "fila"), "/admin/instagram?rq=ia#fila");
  assert.equal(enderecoDaLista("/admin", {}, "a", { pagina: 1 }), "/admin");
});
