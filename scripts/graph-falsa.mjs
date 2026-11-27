// API falsa do Instagram, do LinkedIn e do Google (GA4 e Search Console) para localhost. Uso: node scripts/graph-falsa.mjs
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

/** Google: números inventados, mas estáveis por dia, para o painel de métricas ter o que mostrar. */
const DIA = 86400e3;
const diasDe = (inicio, fim) => { const l = []; for (let t = Date.parse(inicio); t <= Date.parse(fim); t += DIA) l.push(new Date(t).toISOString().slice(0, 10)); return l; };
function sessoesDoDia(dia) {
  const n = Math.floor(Date.parse(dia) / DIA);
  const semana = new Date(dia).getUTCDay();
  return 20 + ((n * 7) % 13) + (semana === 0 || semana === 6 ? -9 : 3) + Math.floor((n % 200) / 10);
}
const somaDe = (dias, f) => dias.reduce((a, d) => a + f(d), 0);
const contatosDoDia = (dia) => Math.floor(sessoesDoDia(dia) / 9);
const cliquesDoDia = (dia) => Math.floor(sessoesDoDia(dia) * 0.4);

function relatorioDoGa4(pedido) {
  const periodos = pedido.dateRanges.map((r, i) => ({ nome: r.name || `date_range_${i}`, dias: diasDe(r.startDate, r.endDate) }));
  const dimensao = pedido.dimensions?.[0]?.name;
  const metricas = pedido.metrics.map((m) => m.name);
  const valores = (dias) => metricas.map((m) => ({ value: String(m === "sessions" ? somaDe(dias, sessoesDoDia) : m === "totalUsers" ? Math.round(somaDe(dias, sessoesDoDia) * 0.8) : m === "screenPageViews" ? somaDe(dias, sessoesDoDia) * 2 : somaDe(dias, contatosDoDia)) }));
  const comPeriodo = periodos.length > 1;
  let rows = [];
  if (!dimensao) rows = periodos.map((p) => ({ dimensionValues: comPeriodo ? [{ value: p.nome }] : [], metricValues: valores(p.dias) }));
  else if (dimensao === "date") rows = periodos[0].dias.map((d) => ({ dimensionValues: [{ value: d.replace(/-/g, "") }], metricValues: valores([d]) })).filter((r) => r.metricValues[0].value !== "0");
  else if (dimensao === "eventName") rows = periodos.flatMap((p) => [["cta_click", 0.6], ["whatsapp_click", 0.3], ["email_click", 0.1]].map(([nome, parte]) => ({ dimensionValues: [{ value: nome }, { value: p.nome }], metricValues: [{ value: String(Math.round(somaDe(p.dias, contatosDoDia) * parte)) }] })));
  else if (dimensao === "sessionDefaultChannelGroup") rows = [["Organic Search", 0.46], ["Direct", 0.24], ["Organic Social", 0.19], ["Referral", 0.11]].map(([nome, parte]) => ({ dimensionValues: [{ value: nome }], metricValues: [{ value: String(Math.round(somaDe(periodos[0].dias, sessoesDoDia) * parte)) }] }));
  else if (dimensao === "pagePath") rows = [["/", 0.7], ["/servicos", 0.4], ["/casos", 0.3], ["/blog", 0.25], ["/projetos", 0.2], ["/servicos/integracao-whatsapp-erp", 0.15]].map(([nome, parte]) => ({ dimensionValues: [{ value: nome }], metricValues: [{ value: String(Math.round(somaDe(periodos[0].dias, sessoesDoDia) * parte)) }] }));
  return { rows };
}

async function google(req, res, url) {
  const caminho = decodeURIComponent(url.pathname.replace(/^\/google/, ""));
  let corpo = "";
  for await (const parte of req) corpo += parte;
  registrar(`GOOGLE ${req.method} ${caminho}`);

  if (caminho === "/token") {
    const assercao = new URLSearchParams(corpo).get("assertion") || "";
    const partes = assercao.split(".");
    if (partes.length !== 3) return responder(res, 400, { error: "invalid_grant", error_description: "JWT malformado" });
    const dados = JSON.parse(Buffer.from(partes[1], "base64url").toString());
    if (!dados.iss || !String(dados.scope).includes("analytics.readonly") || dados.exp <= dados.iat) return responder(res, 400, { error: "invalid_grant", error_description: "JWT sem os campos esperados" });
    return responder(res, 200, { access_token: "ya29.falso", expires_in: 3600, token_type: "Bearer" });
  }
  if (req.headers.authorization !== "Bearer ya29.falso") return responder(res, 401, { error: { message: "Request had invalid authentication credentials." } });
  const pedido = JSON.parse(corpo || "{}");

  if (/^\/analyticsdata\/v1beta\/properties\/\d+:batchRunReports$/.test(caminho)) {
    if (!Array.isArray(pedido.requests) || pedido.requests.length > 5) return responder(res, 400, { error: { message: "Requests must have between 1 and 5 entries" } });
    return responder(res, 200, { reports: pedido.requests.map(relatorioDoGa4) });
  }
  if (/^\/analyticsdata\/v1beta\/properties\/\d+:runReport$/.test(caminho)) return responder(res, 200, relatorioDoGa4(pedido));

  if (/^\/searchconsole\/webmasters\/v3\/sites\/[^/]+\/searchAnalytics\/query$/.test(caminho)) {
    const dias = diasDe(pedido.startDate, pedido.endDate);
    const linha = (keys, ds) => { const cliques = somaDe(ds, cliquesDoDia); return { ...(keys ? { keys } : {}), clicks: cliques, impressions: cliques * 14 + 30 * ds.length, ctr: 0.06, position: 17.4 - (ds.length % 5) * 0.3 }; };
    const dimensao = pedido.dimensions?.[0];
    if (dimensao === "date") return responder(res, 200, { rows: dias.map((d) => linha([d], [d])) });
    if (dimensao === "query") return responder(res, 200, { rows: [["integrar whatsapp com bling", 0.3, 6.2], ["automação whatsapp para empresa", 0.2, 9.8], ["rugemtugem", 0.18, 1.1], ["integração site crm", 0.12, 12.4], ["ia para pequenas empresas", 0.08, 15.9]].map(([termo, parte, posicao]) => { const cliques = Math.round(somaDe(dias, cliquesDoDia) * parte); return { keys: [termo], clicks: cliques, impressions: cliques * 12 + 40, ctr: 0.07, position: posicao }; }) });
    return responder(res, 200, { rows: [linha(null, dias)] });
  }
  responder(res, 404, { error: { message: "Not found" } });
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

  // Métricas: só responde para o token que tem "comleitura", como um app com as permissões de análise liberadas.
  if (caminho === "/rest/memberFollowersCount" || caminho === "/rest/memberCreatorPostAnalytics") {
    if (!token.includes("comleitura")) return responder(res, 403, { status: 403, code: "ACCESS_DENIED", message: "Not enough permissions to access: " + caminho.slice(6) + ".FINDER-me" });
    if (caminho === "/rest/memberFollowersCount") return responder(res, 200, { elements: [{ memberFollowersCount: 1200 + Math.floor(Date.now() / DIA) % 300 }], paging: { count: 10, start: 0 } });
    const bruta = decodeURIComponent(url.search);
    const tipo = url.searchParams.get("queryType");
    const peso = { IMPRESSION: 40, REACTION: 2, COMMENT: 0.4, RESHARE: 0.15 }[tipo];
    if (!peso) return responder(res, 400, { message: "queryType inválido" });
    if (url.searchParams.get("q") === "entity") {
      if (!/entity=\((share|ugcPost):urn:li:(share|ugcPost):/.test(bruta)) return responder(res, 400, { message: "entity malformado" });
      return responder(res, 200, { elements: [{ count: Math.round(22 * peso), metricType: tipo }], paging: { count: 10, start: 0 } });
    }
    const datas = bruta.match(/start:\(day:(\d+),month:(\d+),year:(\d+)\),end:\(day:(\d+),month:(\d+),year:(\d+)\)/);
    if (!datas) return responder(res, 400, { message: "dateRange malformado" });
    const iso = (a, m, d) => `${a}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const dias = diasDe(iso(datas[3], datas[2], datas[1]), iso(datas[6], datas[5], datas[4])).slice(0, -1);
    return responder(res, 200, { elements: [{ count: Math.round(somaDe(dias, sessoesDoDia) * peso), metricType: tipo }], paging: { count: 10, start: 0 } });
  }

  if (caminho === "/rest/images" && req.method === "POST") {
    const dono = JSON.parse(corpo.toString() || "{}").initializeUploadRequest?.owner;
    if (dono !== "urn:li:person:FALSO12345") return responder(res, 403, { message: "Not enough permissions to access: images.initializeUpload" });
    const id = `urn:li:image:FALSO${++contador}`;
    imagensDoLinkedin.set(id, { enviada: false });
    return responder(res, 200, { value: { uploadUrlExpiresAt: Date.now() + 3600e3, uploadUrl: `http://${req.headers.host}/linkedin/upload/${encodeURIComponent(id)}`, image: id } });
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
  if (url.pathname.startsWith("/google/")) return google(req, res, url);
  const params = await lerParametros(req, url);
  const token = params.get("access_token") || "";
  const partes = url.pathname.split("/").filter(Boolean);
  if (partes[0] && /^v\d/.test(partes[0])) partes.shift();
  registrar(`${req.method} /${partes.join("/")} ${[...params.keys()].filter((k) => k !== "access_token").join(",")}`);

  if (!token) return responder(res, 400, { error: { message: "Invalid OAuth access token" } });
  if (token.includes("recusar")) return responder(res, 400, { error: { message: "Invalid OAuth access token - Cannot parse access token" } });

  if (partes[0] === "refresh_access_token") return responder(res, 200, { access_token: token, expires_in: 5184000 });
  // Login unificado (token EAA): a conta vem da lista de contas atribuídas, e o perfil é lido pelo id.
  if (partes[0] === "me" && partes[1] === "assigned_instagram_accounts") return responder(res, 200, { data: token.startsWith("IGAA") ? [] : [{ id: "17841400000000001", username: "rugemtugem" }] });
  if (partes[0] === "me" && !token.startsWith("IGAA")) return responder(res, 200, { client_business_id: "430000000000000" });
  if (partes[0] === "17841400000000001" && !partes[1]) return responder(res, 200, { id: partes[0], username: "rugemtugem", followers_count: 480 + Math.floor(Date.now() / DIA) % 400, media_count: 64 });
  if (partes[0] === "refresh_access_token" && !token.startsWith("IGAA")) return responder(res, 400, { error: { message: "Unsupported request - method type: get" } });
  if (partes[0] === "me") return responder(res, 200, { user_id: "17841400000000001", username: "rugemtugem", account_type: "BUSINESS", followers_count: 480 + Math.floor(Date.now() / DIA) % 400, media_count: 64 });
  // Métricas: token com "seminsights" imita o token gerado sem a permissão de insights.
  if (partes[1] === "insights") {
    if (token.includes("seminsights")) return responder(res, 400, { error: { message: "(#10) Application does not have permission for this action" } });
    const metricas = (params.get("metric") || "").split(",").filter(Boolean);
    if (partes[0] === "17841400000000001") {
      if (params.get("metric_type") !== "total_value" || params.get("period") !== "day") return responder(res, 400, { error: { message: "An unknown error has occurred." } });
      const s = sessoesDoDia(new Date(Number(params.get("since")) * 1000).toISOString().slice(0, 10));
      const valor = { reach: s * 6, views: s * 11, accounts_engaged: Math.floor(s / 2), total_interactions: s, profile_links_taps: Math.floor(s / 12) };
      return responder(res, 200, { data: metricas.map((m) => ({ name: m, period: "day", total_value: { value: valor[m] ?? 0 }, id: `17841400000000001/insights/${m}/day` })) });
    }
    const n = Number(String(partes[0]).replace(/\D/g, "").slice(-3)) || 7;
    const valor = { reach: 300 + n, views: 520 + n * 2, likes: 20 + (n % 30), comments: n % 6, saved: n % 9, shares: n % 4 };
    return responder(res, 200, { data: metricas.map((m) => ({ name: m, period: "lifetime", values: [{ value: valor[m] ?? 0 }], id: `${partes[0]}/insights/${m}/lifetime` })) });
  }
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
}).listen(PORTA, () => console.log(`API falsa do Instagram, do LinkedIn e do Google em http://localhost:${PORTA} (registro em ${LOG})`));
