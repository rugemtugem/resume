// API falsa do Instagram para localhost. Uso: node scripts/graph-falsa.mjs
// Imita as chamadas que o site faz, baixa cada imagem como a Meta faria e registra tudo em .dados/graph-falsa.log.
// Token que contenha "recusar" faz a API responder com erro, para testar o caminho de falha.
import { createServer } from "node:http";
import { appendFileSync, mkdirSync } from "node:fs";

const PORTA = Number(process.env.PORTA_GRAPH_FALSA || 4010);
mkdirSync(".dados", { recursive: true });
const LOG = ".dados/graph-falsa.log";
const containers = new Map();
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

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORTA}`);
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
}).listen(PORTA, () => console.log(`API falsa do Instagram em http://localhost:${PORTA} (registro em ${LOG})`));
