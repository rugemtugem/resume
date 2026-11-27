// Regras do LinkedIn: trava da API, formato do texto, validação, link com a origem e token fora das mensagens.
import { test } from "node:test";
import assert from "node:assert/strict";
import { baseDoLinkedin, comLink, enderecoDoPost, problemasDoTexto, semTokenDoLinkedin, textoParaLinkedin } from "../lib/linkedin/regras.ts";
import { lerRoteiro } from "../lib/social/roteiro.ts";

test("trava: fora de produção a API só pode ser a falsa, em localhost", () => {
  assert.deepEqual(baseDoLinkedin({ NODE_ENV: "development", LINKEDIN_API_BASE: "http://localhost:4010/linkedin" }), { base: "http://localhost:4010/linkedin", falsa: true });
  assert.throws(() => baseDoLinkedin({ NODE_ENV: "development" }), /API falsa/);
  assert.throws(() => baseDoLinkedin({ NODE_ENV: "development", LINKEDIN_API_BASE: "https://api.linkedin.com" }), /API falsa/);
  assert.throws(() => baseDoLinkedin({ NODE_ENV: "test", LINKEDIN_API_BASE: "http://localhost.exemplo.com" }), /API falsa/);
  assert.deepEqual(baseDoLinkedin({ NODE_ENV: "production" }), { base: "https://api.linkedin.com", falsa: false });
});

test("texto: caractere reservado ganha barra e hashtag vira elemento", () => {
  assert.equal(textoParaLinkedin("Integração (WhatsApp + ERP) em 2 passos."), "Integração \\(WhatsApp + ERP\\) em 2 passos.");
  assert.equal(textoParaLinkedin("Veja #integracao e #pme"), "Veja {hashtag|\\#|integracao} e {hashtag|\\#|pme}");
  assert.equal(textoParaLinkedin("a_b * c [d] <e> {f} g|h ~i @j \\k"), "a\\_b \\* c \\[d\\] \\<e\\> \\{f\\} g\\|h \\~i \\@j \\\\k");
  assert.equal(textoParaLinkedin("C# é uma linguagem"), "C\\# é uma linguagem", "cerquilha solta não é hashtag");
  assert.equal(textoParaLinkedin("Linha 1\n\nLinha 2"), "Linha 1\n\nLinha 2");
});

test("texto: aponta cada problema", () => {
  assert.deepEqual(problemasDoTexto("Um texto bom. #integracao"), []);
  assert.equal(problemasDoTexto("  ").length, 1, "vazio");
  assert.equal(problemasDoTexto("a".repeat(3001)).length, 1, "longo demais");
  assert.equal(problemasDoTexto("Antes " + String.fromCharCode(0x2014) + " depois").length, 1, "travessão");
  assert.equal(problemasDoTexto("Novo site #Ferrugem").length, 1, "hashtag proibida");
});

test("{link} vira o endereço com a origem marcada", () => {
  assert.equal(
    comLink("Leia: {link}", "https://rugemtugem.dev/", "/blog/meu-post", "meu-post"),
    "Leia: https://rugemtugem.dev/blog/meu-post?utm_source=linkedin&utm_medium=social&utm_campaign=meu-post",
  );
  assert.equal(comLink("Sem marcador", "https://rugemtugem.dev", "/", "x"), "Sem marcador");
});

test("token nunca aparece em mensagem, e o endereço do post sai do identificador", () => {
  const token = "AQXabcdefghijklmnopqrstuvwxyz0123456789";
  assert.equal(semTokenDoLinkedin(`falhou com ${token}`, token).includes(token), false);
  assert.equal(semTokenDoLinkedin("Authorization: Bearer AQXzzzzzzzzzzzzzzzzzzzz").includes("AQXzzz"), false);
  assert.equal(enderecoDoPost("urn:li:share:123"), "https://www.linkedin.com/feed/update/urn:li:share:123/");
});

test("roteiro: a seção linkedin é lida à parte da legenda", () => {
  const r = lerRoteiro("tema: x\n## capa\ntitulo: A\n## cta\ntitulo: B\n## legenda\nLegenda aqui.\n## linkedin\nTexto do LinkedIn.\n\nLeia: {link}\n");
  assert.equal(r.legenda, "Legenda aqui.");
  assert.equal(r.linkedin, "Texto do LinkedIn.\n\nLeia: {link}");
  assert.equal(r.slides.length, 2);
  assert.equal(lerRoteiro("tema: x\n## capa\ntitulo: A\n## legenda\noi").linkedin, "");
});

test("produção: outro servidor é ignorado, e a imagem só é enviada para endereço do LinkedIn", async () => {
  const { enderecoDeEnvioAceito } = await import("../lib/linkedin/regras.ts");
  assert.deepEqual(baseDoLinkedin({ NODE_ENV: "production", LINKEDIN_API_BASE: "https://servidor-de-outra-pessoa.com" }), { base: "https://api.linkedin.com", falsa: false });
  assert.equal(enderecoDeEnvioAceito("https://www.linkedin.com/dms-uploads/abc", false), true);
  assert.equal(enderecoDeEnvioAceito("https://media.licdn.com/upload/abc", false), true);
  for (const ruim of ["http://www.linkedin.com/x", "https://linkedin.com.exemplo.com/x", "https://exemplo.com/linkedin.com", "https://falsolinkedin.com/x", "http://localhost:4010/x", "nada"]) assert.equal(enderecoDeEnvioAceito(ruim, false), false, ruim);
  assert.equal(enderecoDeEnvioAceito("http://localhost:4010/linkedin/upload/1", true), true);
  assert.equal(enderecoDeEnvioAceito("https://www.linkedin.com/x", true), false, "no modo de teste só vale a API falsa");
});
