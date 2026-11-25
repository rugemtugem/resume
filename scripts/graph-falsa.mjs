// API falsa do Instagram e do LinkedIn para localhost. Uso: node scripts/graph-falsa.mjs
// Imita as chamadas que o site faz, baixa cada imagem como a Meta faria e registra tudo em .dados/graph-falsa.log.
// Token que contenha "recusar" faz a API responder com erro, para testar o caminho de falha.
import { createServer } from "node:http";
import { appendFileSync, mkdirSync } from "node:fs";

const PORTA = Number(process.env.PORTA_GRAPH_FALSA || 4010);
mkdirSync(".dados", { recursive: true });
const LOG = ".dados/graph-falsa.log";
const containers = new Map();
const imagensDoLinkedin = new Map();
let contador = 1000;

const registrar = (linha) => appendFileSync(LOG, `${new Date().toISOString()} ${linha}\n`);
const responder = (res, status, corpo) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(corpo));
};

async function lerParametros(req, url) {
  const params = new URLSearchParams(url.search);
  if (req.method === "POST") {
    let corpo = "";
    for await (const parte of req) corpo += parte;
    for (const [k, v] of new URLSearchParams(corpo)) params.set(k, v);
  }
  return params;
}

/** Baixa a imagem como a Meta faria e diz se ela serve. */
async function conferirImagem(endereco) {
  try {
    const r = await fetch(endereco);
    const tipo = r.headers.get("content-type") || "";
    const bytes = (await r.arrayBuffer()).byteLength;
    if (!r.ok) return `resposta ${r.status} ao baixar a imagem`;
    if (tipo !== "image/jpeg") return `tipo ${tipo}: o Instagram só aceita JPEG`;
    if (bytes < 1000) return "imagem vazia";
    return null;
  } catch (e) {
    return `não consegui baixar: ${e.message}`;
  }
}

/** LinkedIn: token no cabeçalho, corpo em JSON, imagem enviada por PUT. */
async function linkedin(req, res, url) {
  const caminho = url.pathname.replace(/^\/linkedin/, "");
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  const pedacos = [];
  for await (const parte of req) pedacos.push(parte);
  const corpo = Buffer.concat(pedacos);
  registrar(`LINKEDIN ${req.method} ${caminho} ${corpo.length} bytes`);

  if (!token) return responder(res, 401, { message: "Empty oauth2 access token" });
  if (token.includes("recusar")) return responder(res, 401, { message: "The token used in the request has been revoked by the user" });
  if (req.headers["linkedin-version"] && !/^\d{6}$/.test(req.headers["linkedin-version"])) return responder(res, 426, { message: "Requested version is not active" });

  if (caminho === "/v2/userinfo") return responder(res, 200, { sub: "FALSO12345", name: "Fábio Rugemtugem" });

  if (caminho === "/rest/images" && req.method === "POST") {
    const dono = JSON.parse(corpo.toString() || "{}").initializeUploadRequest?.owner;
    if (dono !== "urn:li:person:FALSO12345") return responder(res, 403, { message: "Not enough permissions to access: images.initializeUpload" });
    const id = `urn:li:image:FALSO${++contador}`;
    imagensDoLinkedin.set(id, { enviada: false });
    return responder(res, 200, { value: { uploadUrlExpiresAt: Date.now() + 3600e3, uploadUrl: `http://localhost:${PORTA}/linkedin/upload/${encodeURIComponent(id)}`, image: id } });
  }

  if (caminho.startsWith("/upload/") && req.method === "PUT") {
    const imagem = imagensDoLinkedin.get(decodeURIComponent(caminho.slice(8)));
    if (!imagem) return responder(res, 404, { message: "Upload desconhecido" });
    if (corpo.length < 1000 || corpo[0] !== 0xff || corpo[1] !== 0xd8) return responder(res, 400, { message: "O arquivo enviado não é um JPEG" });
    imagem.enviada = true;
    registrar(`  imagem recebida: ${corpo.length} bytes`);
    res.writeHead(201);
    return res.end();
  }

  if (caminho === "/rest/posts" && req.method === "POST") {
    if (req.headers["x-restli-protocol-version"] !== "2.0.0" || !req.headers["linkedin-version"]) return responder(res, 400, { message: "Faltam os cabeçalhos de versão" });
    const post = JSON.parse(corpo.toString() || "{}");
    if (post.author !== "urn:li:person:FALSO12345") return responder(res, 403, { message: "Not enough permissions to access: partnerApiPostsExternal.CREATE" });
    if (!post.commentary) return responder(res, 422, { message: "commentary is required" });
    // Caractere reservado sem barra antes: a API de verdade corta o texto ou recusa.
    if (/(^|[^\\])[()[\]<>*~_|@]/.test(post.commentary.replace(/\\\\/g, "").replace(/\{hashtag\|\\#\|[^}]+\}/g, ""))) return responder(res, 422, { message: "commentary com caractere reservado sem escape" });
    const ids = post.content?.multiImage ? post.content.multiImage.images.map((i) => i.id) : post.content?.media ? [post.content.media.id] : [];
    if (post.content?.multiImage && (ids.length < 2 || ids.length > 20)) return responder(res, 422, { message: "multiImage precisa de 2 a 20 imagens" });
    if (ids.some((id) => !imagensDoLinkedin.get(id)?.enviada)) return responder(res, 422, { message: "Imagem ainda não enviada" });
    const id = `urn:li:share:FALSO${++contador}`;
    registrar(`  LinkedIn publicado ${id} com ${ids.length} imagens: ${post.commentary.slice(0, 80)}`);
    res.writeHead(201, { "x-restli-id": id, "Content-Type": "application/json" });
    return res.end("{}");
  }
  responder(res, 404, { message: "Resource not found" });
}

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORTA}`);
  if (url.pathname.startsWith("/linkedin/")) return linkedin(req, res, url);
  const params = await lerParametros(req, url);
  const token = params.get("access_token") || "";
  const partes = url.pathname.split("/").filter(Boolean);
  if (partes[0] && /^v\d/.test(partes[0])) partes.shift();
  registrar(`${req.method} /${partes.join("/")} ${[...params.keys()].filter((k) => k !== "access_token").join(",")}`);

  if (!token) return responder(res, 400, { error: { message: "Invalid OAuth access token" } });
  if (token.includes("recusar")) return responder(res, 400, { error: { message: "Invalid OAuth access token - Cannot parse access token" } });

  if (partes[0] === "refresh_access_token") return responder(res, 200, { access_token: token, expires_in: 5184000 });
  if (partes[0] === "me") return responder(res, 200, { user_id: "17841400000000001", username: "rugemtugem", account_type: "BUSINESS" });
  if (partes[1] === "content_publishing_limit") {
    const usados = [...containers.values()].filter((c) => c.publicado).length;
    return responder(res, 200, { data: [{ quota_usage: usados, config: { quota_total: 100 } }] });
  }

  if (partes[1] === "media" && req.method === "POST") {
    const id = String(++contador);
    let erro = null;
    if (params.get("image_url")) erro = await conferirImagem(params.get("image_url"));
    if (params.get("media_type") === "CAROUSEL") {
      const filhos = (params.get("children") || "").split(",");
      if (filhos.length < 2 || filhos.some((f) => !containers.has(f))) erro = "carrossel com filho desconhecido";
    }
    containers.set(id, { erro, legenda: params.get("caption") || "", publicado: false });
    registrar(`  contêiner ${id}: ${erro || "ok"}`);
    return responder(res, 200, { id });
  }

  if (partes[1] === "media_publish" && req.method === "POST") {
    const c = containers.get(params.get("creation_id") || "");
    if (!c || c.erro) return responder(res, 400, { error: { message: "Media ID is not available" } });
    c.publicado = true;
    const id = String(++contador);
    containers.set(id, { permalink: `https://www.instagram.com/p/FALSO${id}/` });
    registrar(`  publicado ${id}: ${c.legenda.slice(0, 60)}`);
    return responder(res, 200, { id });
  }

  const alvo = containers.get(partes[0]);
  if (alvo && (params.get("fields") || "").includes("permalink")) return responder(res, 200, { permalink: alvo.permalink });
  if (alvo) return responder(res, 200, alvo.erro ? { status_code: "ERROR", status: alvo.erro } : { status_code: "FINISHED" });

  responder(res, 404, { error: { message: "Unsupported request" } });
}).listen(PORTA, () => console.log(`API falsa do Instagram e do LinkedIn em http://localhost:${PORTA} (registro em ${LOG})`));
