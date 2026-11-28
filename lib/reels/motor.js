/* Motor de Reels (9:16), portado do Calcula Trabalhador (admin/js/reels.js) com a identidade da Rugemtugem.
   Gera o vídeo no navegador a partir do bloco "## reels" do roteiro.
   Desenha cada quadro em Canvas 2D com o mesmo visual e os mesmos tempos do social/template.html, codifica H.264
   com WebCodecs e monta o MP4 (moov antes do mdat) sem biblioteca. Tudo é função de t: nada depende do relógio.
   Exporta funções puras (parseReels, muxMp4) que também rodam no Node, para os testes. */

export const TIPOS = ["titulo", "numero", "compara", "passos", "lista", "alerta", "encerramento", "cta", "manchete", "pergunta"];
const FADE = 0.45, ENTRADA = 0.55, STAGGER = 0.12, STAGGER_CARTAO = 0.28, ATRASO_NUMERO = 0.3, DUR_NUMERO = 1.1;
// verde = cor de destaque (laranja da marca); azul = texto sobre o destaque; ambar = selo de alerta.
const COR = { verde: "#ff8a5b", ambar: "#ffc94d", azul: "#1a202c", escuro: "#1a202c" };
// Selo do canto: uma cor por linha de conteúdo.
const TRILHA = { "Para empresas": ["#992A2B", "#fff"], "Dicas de IA": ["#EE6936", "#fff"] };
const SELO_PADRAO = "Para empresas";
// O original usava Manrope nos títulos. Aqui tudo é Inter, a fonte do site e dos slides.
const MANROPE = "Inter, sans-serif", INTER = "Inter, sans-serif";
const easeOut = (x) => 1 - Math.pow(1 - x, 3);
const clamp = (x) => Math.max(0, Math.min(1, x));

/* ---------- parser do bloco "## reels" ---------- */
export function parseReels(txt) {
  const r = { trilha: SELO_PADRAO, eyebrow: "", nota: "", cenas: [] };
  let cena = null;
  for (const raw of String(txt || "").replace(/\r/g, "").split("\n")) {
    const l = raw.trim();
    if (!l) continue;
    const h = l.match(/^###\s+(\w+)(?:\s+([\d.,]+)\s*s?)?\s*$/i);
    if (h) { cena = { tipo: h[1].toLowerCase(), duracao: h[2] ? Number(h[2].replace(",", ".")) : 4 }; r.cenas.push(cena); continue; }
    const kv = l.match(/^(trilha|eyebrow|nota|capa|sub|rotulo|valor|titulo|a|b|tag|fonte|url|aviso|texto|destaque|contagem)\s*:\s*(.*)$/i);
    if (!cena) { if (kv) r[kv[1].toLowerCase()] = kv[2].trim(); continue; }
    if (kv) {
      const k = kv[1].toLowerCase(), v = kv[2].trim();
      if (k === "a" || k === "b") { const [rot, val] = v.split("|").map((s) => s.trim()); cena[k] = { rotulo: rot || "", valor: val || "" }; }
      else cena[k] = v;
      continue;
    }
    const item = l.match(/^(?:[-•*]|\d+[.)])\s+(.+)$/);
    if (item) {
      cena.itens = cena.itens || [];
      if (cena.tipo === "passos") { const [t, x] = item[1].split("|").map((s) => s.trim()); cena.itens.push(x ? { titulo: t, texto: x } : { titulo: t }); }
      else cena.itens.push(item[1]);
      continue;
    }
    cena.texto = cena.texto ? `${cena.texto} ${l}` : l; // linha livre: texto do título, do alerta ou do encerramento
  }
  for (const c of r.cenas) {
    if (c.texto && !c.destaque) { const m = c.texto.match(/\{([^}]+)\}/); if (m) { c.destaque = m[1]; c.texto = c.texto.replace(/\{([^}]+)\}/, "$1"); } }
    if (c.tipo === "cta") c.tipo = "encerramento";
  }
  if (r.capa != null) r.capa = Number(String(r.capa).replace(",", "."));
  // O número aparece pronto, sem subir do zero: em cena curta a contagem mostrava valor errado quase o tempo todo
  // (ex.: "R$ 1.390" no lugar de R$ 2.580). Desligada para todos em 09/11/2026; "contagem: sim" no .md religa.
  if (!/^sim$/i.test(String(r.contagem || ""))) for (const c of r.cenas) c.fixo = true;
  return r;
}

/* ---------- geometria (mesma do template DOM: 1080 de referência) ---------- */
export function layoutDe(W, H) {
  const k = W / 1080, vertical = H / W >= 1.7;
  const topo = Math.round((vertical ? 250 : 120) * k), base = Math.round((vertical ? 420 : 120) * k), lado = Math.round(72 * k);
  return { W, H, k, lado, topo, base, vertical, palcoTop: topo + 200 * k, palcoBottom: H - base - 210 * k, palcoW: W - 2 * lado, rodapeBottom: H - base - 12 * k };
}

/* ---------- texto ---------- */
function fonte(ctx, peso, px, fam, ls) { ctx.font = `${peso} ${px}px ${fam}`; if ("letterSpacing" in ctx) ctx.letterSpacing = ls || "0px"; }
function quebrar(ctx, texto, maxW) {
  const palavras = String(texto || "").replace(/R\$ (?=\d)/g, "R$\u00a0").split(/[ \t\r\n]+/).filter(Boolean), linhas = []; // o espaço sem quebra de "R$" não separa
  let atual = "";
  for (const p of palavras) {
    const tent = atual ? `${atual} ${p}` : p;
    if (ctx.measureText(tent).width <= maxW || !atual) atual = tent; else { linhas.push(atual); atual = p; }
  }
  if (atual) linhas.push(atual);
  return linhas.length ? linhas : [""];
}
// Texto com trecho em destaque: devolve linhas de [{t, cor}] já quebradas.
function quebrarRico(ctx, texto, destaque, corBase, corDest, maxW) {
  texto = String(texto || "").replace(/R\$ (?=\d)/g, "R$\u00a0"); // "R$" e o número na mesma linha
  if (destaque) destaque = String(destaque).replace(/R\$ (?=\d)/g, "R$\u00a0");
  let ini = -1, fim = -1;
  if (destaque && texto.indexOf(destaque) >= 0) { ini = texto.indexOf(destaque); fim = ini + destaque.length; }
  else if (destaque !== null && destaque !== undefined && destaque !== "") { /* destaque não encontrado: sem cor */ }
  else if (destaque === undefined) { const w = texto.split(" "), n = Math.min(3, Math.max(1, w.length - 2)); ini = texto.length - w.slice(-n).join(" ").length; fim = texto.length; }
  const tokens = []; let pos = 0;
  for (const p of texto.split(" ")) { const a = pos, b = pos + p.length; tokens.push({ t: p, cor: ini >= 0 && a >= ini && a < fim ? corDest : corBase }); pos = b + 1; } // a palavra entra no destaque se COMEÇA nele: assim "novo?" segue colorida quando o destaque acaba em "novo"
  const linhas = []; let linha = [], larg = 0; const esp = ctx.measureText(" ").width;
  for (const tk of tokens) {
    const w = ctx.measureText(tk.t).width;
    if (linha.length && larg + esp + w > maxW) { linhas.push(linha); linha = []; larg = 0; }
    linha.push(tk); larg += (linha.length > 1 ? esp : 0) + w;
  }
  if (linha.length) linhas.push(linha);
  return linhas;
}
function desenharLinhas(ctx, linhas, x, y, lh, cor, alpha) {
  ctx.save(); ctx.globalAlpha *= alpha == null ? 1 : alpha; ctx.fillStyle = cor; ctx.textBaseline = "alphabetic";
  linhas.forEach((l, i) => ctx.fillText(l, x, y + lh * 0.78 + i * lh));
  ctx.restore();
}
function desenharRico(ctx, linhas, x, y, lh) {
  ctx.textBaseline = "alphabetic"; const esp = ctx.measureText(" ").width;
  linhas.forEach((l, i) => { let cx = x; l.forEach((tk) => { ctx.fillStyle = tk.cor; ctx.fillText(tk.t, cx, y + lh * 0.78 + i * lh); cx += ctx.measureText(tk.t).width + esp; }); });
}
function pilula(ctx, x, y, w, h, r, cor) { ctx.fillStyle = cor; ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill(); }
const numero = (valor) => {
  const m = /^(R\$\s?)?(-?[\d.]+)(,\d+)?(\s?%|\/mês|\/ano| por mês| por hora)?$/.exec(String(valor).trim());
  if (!m) return null;
  const alvo = Number(m[2].replace(/\./g, ""));
  return { alvo: alvo + (m[3] ? Number("0" + m[3].replace(",", ".")) : 0), texto: (p) => (m[1] || "") + Math.round(alvo * easeOut(clamp(p))).toLocaleString("pt-BR") + (m[3] || "") + (m[4] || "") };
};
const rgba = (a) => `rgba(255,255,255,${a})`;

/* ---------- montagem das cenas: cada elemento sabe sua altura e se desenha em (y, u) ---------- */
// Elemento: { atraso, altura, cartao?, draw(ctx, y, u) } — u = tempo desde o início da cena.
function montarCena(c, ctx, L) {
  const k = L.k, W = L.palcoW, gap = 32 * k, els = [];
  const px = (n) => n * k;
  const addTexto = (texto, peso, tam, fam, lh, cor, alpha, ls) => {
    fonte(ctx, peso, px(tam), fam, ls); const linhas = quebrar(ctx, texto, W); const h = linhas.length * px(lh);
    els.push({ atraso: 0, altura: h, draw(ctx2, y) { fonte(ctx2, peso, px(tam), fam, ls); desenharLinhas(ctx2, linhas, L.lado, y, px(lh), cor, alpha); } });
  };
  const addRico = (texto, destaque, tam, lh, ls) => {
    fonte(ctx, 800, px(tam), MANROPE, ls); const linhas = quebrarRico(ctx, texto, destaque, "#fff", COR.verde, W); const h = linhas.length * px(lh);
    els.push({ atraso: 0, altura: h, draw(ctx2, y) { fonte(ctx2, 800, px(tam), MANROPE, ls); desenharRico(ctx2, linhas, L.lado, y, px(lh)); } });
  };
  const tituloSec = (t) => addTexto(t, 800, 66, MANROPE, 72.6, "#fff", 1, "-0.02em");
  const sub = (t) => t && addTexto(t, 500, 52, INTER, 65, "#fff", 0.78);

  if (c.tipo === "titulo") { addRico(c.texto, c.destaque, 92, 99.4, "-0.02em"); sub(c.sub); }
  else if (c.tipo === "numero") {
    addTexto(c.rotulo, 500, 52, INTER, 65, "#fff", 0.88);
    const n = numero(c.valor); let tam = 176;
    fonte(ctx, 800, px(tam), MANROPE, "-0.03em"); while (ctx.measureText(c.valor).width > W && tam > 52) { tam -= 4; fonte(ctx, 800, px(tam), MANROPE, "-0.03em"); }
    els.push({ atraso: 0, altura: px(tam), draw(ctx2, y, u) { fonte(ctx2, 800, px(tam), MANROPE, "-0.03em"); ctx2.fillStyle = COR.verde; ctx2.textBaseline = "alphabetic"; ctx2.fillText(n && !c.fixo ? n.texto((u - ATRASO_NUMERO) / DUR_NUMERO) : c.valor, L.lado, y + px(tam) * 0.8); } });
    sub(c.sub || (c.fonte ? "Fonte: " + c.fonte : ""));
  }
  else if (c.tipo === "compara") {
    tituloSec(c.titulo);
    const va = numero(c.a.valor), vb = numero(c.b.valor), max = Math.max(va ? va.alvo : 0, vb ? vb.alvo : 0, 1e-9);
    const linhaH = px(62.4) + px(6) + px(84) + px(16) + px(30);
    [[c.a, va, false], [c.b, vb, true]].forEach(([x, v, b], i) => {
      const pct = v ? v.alvo / max : 0;
      els.push({ atraso: 0, altura: linhaH, draw(ctx2, y, u) {
        fonte(ctx2, 500, px(52), INTER); desenharLinhas(ctx2, [x.rotulo], L.lado, y, px(62.4), "#fff", 0.88);
        const yb = y + px(62.4) + px(6); fonte(ctx2, 800, px(84), MANROPE, "-0.02em"); ctx2.fillStyle = b ? COR.verde : "#fff"; ctx2.textBaseline = "alphabetic";
        ctx2.fillText(v && !c.fixo ? v.texto((u - ATRASO_NUMERO - i * 0.25) / DUR_NUMERO) : x.valor, L.lado, yb + px(84) * 0.8);
        const yBar = yb + px(84) + px(16); pilula(ctx2, L.lado, yBar, W, px(30), px(15), rgba(0.14));
        const w = W * pct * easeOut(clamp((u - ATRASO_NUMERO - i * 0.25) / DUR_NUMERO)); if (w > 0) pilula(ctx2, L.lado, yBar, Math.max(w, px(30)), px(30), px(15), b ? COR.verde : rgba(0.9));
      } });
    });
    sub(c.sub || (c.fonte ? "Fonte: " + c.fonte : ""));
  }
  else if (c.tipo === "passos") {
    if (c.titulo) tituloSec(c.titulo);
    const temTitulo = !!c.titulo, pad = px(16), padX = px(28), circ = px(72), gapC = px(26), interno = W - padX * 2 - circ - gapC;
    (c.itens || []).forEach((it, i) => {
      const o = typeof it === "string" ? { titulo: it } : it;
      fonte(ctx, 800, px(54), MANROPE, "-0.015em"); const lt = quebrar(ctx, o.titulo, interno);
      fonte(ctx, 500, px(52), INTER); const lp = o.texto ? quebrar(ctx, o.texto, interno) : [];
      const hTxt = px(6) + lt.length * px(59.4) + (lp.length ? px(4) + lp.length * px(62.4) : 0);
      const h = pad * 2 + Math.max(circ, hTxt);
      els.push({ atraso: (temTitulo ? ENTRADA * 0.5 : 0) + i * STAGGER_CARTAO, cartao: true, altura: h, draw(ctx2, y) {
        ctx2.fillStyle = rgba(0.09); ctx2.beginPath(); ctx2.roundRect(L.lado, y, W, h, px(28)); ctx2.fill();
        ctx2.strokeStyle = rgba(0.18); ctx2.lineWidth = px(2); ctx2.beginPath(); ctx2.roundRect(L.lado + 1, y + 1, W - 2, h - 2, px(27)); ctx2.stroke();
        ctx2.fillStyle = COR.verde; ctx2.beginPath(); ctx2.arc(L.lado + padX + circ / 2, y + pad + circ / 2, circ / 2, 0, Math.PI * 2); ctx2.fill();
        fonte(ctx2, 800, px(52), MANROPE); ctx2.fillStyle = COR.azul; ctx2.textAlign = "center"; ctx2.textBaseline = "middle"; ctx2.fillText(String(i + 1), L.lado + padX + circ / 2, y + pad + circ / 2 + px(3)); ctx2.textAlign = "left";
        const x = L.lado + padX + circ + gapC; fonte(ctx2, 800, px(54), MANROPE, "-0.015em"); desenharLinhas(ctx2, lt, x, y + pad + px(6), px(59.4), "#fff");
        if (lp.length) { fonte(ctx2, 500, px(52), INTER); desenharLinhas(ctx2, lp, x, y + pad + px(6) + lt.length * px(59.4) + px(4), px(62.4), "#fff", 0.78); }
      } });
    });
    els.gapInterno = px(12);
  }
  else if (c.tipo === "lista") {
    tituloSec(c.titulo);
    (c.itens || []).forEach((it) => {
      fonte(ctx, 600, px(52), INTER); const ls = quebrar(ctx, it, W - px(42)); const h = ls.length * px(65);
      els.push({ atraso: 0, altura: h, draw(ctx2, y) { ctx2.fillStyle = COR.verde; ctx2.beginPath(); ctx2.arc(L.lado + px(10), y + px(32), px(10), 0, Math.PI * 2); ctx2.fill(); fonte(ctx2, 600, px(52), INTER); desenharLinhas(ctx2, ls, L.lado + px(42), y, px(65), "#fff"); } });
    });
    els.gapInterno = px(18);
  }
  else if (c.tipo === "alerta") {
    const tag = (c.tag || "Atenção").toUpperCase();
    fonte(ctx, 700, px(52), MANROPE, "0.04em"); const wTag = ctx.measureText(tag).width + px(60);
    els.push({ atraso: 0, altura: px(80), draw(ctx2, y) { pilula(ctx2, L.lado, y, wTag, px(80), px(40), COR.ambar); fonte(ctx2, 700, px(52), MANROPE, "0.04em"); ctx2.fillStyle = COR.escuro; ctx2.textBaseline = "alphabetic"; ctx2.fillText(tag, L.lado + px(30), y + px(80) * 0.72); } });
    fonte(ctx, 800, px(64), MANROPE, "-0.02em"); const linhas = quebrarRico(ctx, c.texto, c.destaque === undefined ? null : c.destaque, "#fff", COR.ambar, W);
    els.push({ atraso: 0, altura: linhas.length * px(73), draw(ctx2, y) { fonte(ctx2, 800, px(64), MANROPE, "-0.02em"); desenharRico(ctx2, linhas, L.lado, y, px(73)); } });
    if (c.fonte) addTexto(c.fonte, 500, 52, INTER, 65, "#fff", 0.7);
  }
  else if (c.tipo === "manchete") {
    // Semana 3 (benchmark): o Reels que mais circula abre com a notícia. Cartão claro com cara de recorte de jornal,
    // com a FONTE REAL (lei, decreto, órgão) em cima: nunca print falso de veículo ou rede social.
    const tag = String(c.tag || "Notícia").toUpperCase();
    const padX = px(44), padY = px(40), interno = W - padX * 2;
    fonte(ctx, 800, px(76), MANROPE, "-0.02em"); const lm = quebrarRico(ctx, c.texto, c.destaque === undefined ? null : c.destaque, "#1a202c", "#992A2B", interno);
    fonte(ctx, 500, px(44), INTER); const lf = c.fonte ? quebrar(ctx, c.fonte, interno) : [];
    const h = padY + px(44) + px(26) + lm.length * px(86) + (lf.length ? px(22) + lf.length * px(56) : 0) + padY;
    els.push({ atraso: 0, cartao: true, altura: h, draw(ctx2, y) {
      ctx2.fillStyle = "#f7fafc"; ctx2.beginPath(); ctx2.roundRect(L.lado, y, W, h, px(26)); ctx2.fill();
      ctx2.fillStyle = COR.verde; ctx2.beginPath(); ctx2.roundRect(L.lado, y, px(14), h, [px(26), 0, 0, px(26)]); ctx2.fill();
      fonte(ctx2, 800, px(36), MANROPE, "0.1em"); ctx2.fillStyle = "#992A2B"; ctx2.textBaseline = "alphabetic"; ctx2.fillText(tag, L.lado + padX, y + padY + px(36));
      fonte(ctx2, 800, px(76), MANROPE, "-0.02em"); desenharRico(ctx2, lm, L.lado + padX, y + padY + px(44) + px(26), px(86));
      if (lf.length) { fonte(ctx2, 500, px(44), INTER); desenharLinhas(ctx2, lf, L.lado + padX, y + padY + px(44) + px(26) + lm.length * px(86) + px(22), px(56), "#4a5568"); }
    } });
    sub(c.sub);
  }
  else if (c.tipo === "pergunta") {
    // A dúvida em primeira pessoa (como os Reels que mais circulam): aspas verdes e letra grande.
    els.push({ atraso: 0, altura: px(110), draw(ctx2, y) { fonte(ctx2, 800, px(220), MANROPE); ctx2.fillStyle = COR.verde; ctx2.textBaseline = "alphabetic"; ctx2.fillText("\u201C", L.lado - px(8), y + px(170)); } });
    addRico(c.texto, c.destaque, 88, 96, "-0.02em");
    sub(c.sub);
  }
  else if (c.tipo === "encerramento" || c.tipo === "cta") {
    addTexto(c.texto, 800, 76, MANROPE, 83.6, "#fff", 1, "-0.02em");
    fonte(ctx, 700, px(52), MANROPE); const url = String(c.url || "");
    let linhasUrl = [url]; if (ctx.measureText(url).width > W - px(76)) { const i = url.indexOf("/", url.indexOf(".") >= 0 ? url.indexOf(".") : 0); linhasUrl = i > 0 ? [url.slice(0, i), url.slice(i)] : quebrar(ctx, url, W - px(76)); }
    const wUrl = Math.min(W, Math.max(...linhasUrl.map((l) => ctx.measureText(l).width)) + px(76)), hUrl = px(44) + linhasUrl.length * px(62.4);
    els.push({ atraso: 0, altura: hUrl, draw(ctx2, y) { pilula(ctx2, L.lado, y, wUrl, hUrl, px(40), COR.verde); fonte(ctx2, 700, px(52), MANROPE); desenharLinhas(ctx2, linhasUrl, L.lado + px(38), y + px(22), px(62.4), COR.azul); } });
    if (c.aviso) addTexto(c.aviso, 500, 52, INTER, 65, "#fff", 0.7);
  }
  else addTexto(`tipo de cena desconhecido: ${c.tipo}`, 500, 52, INTER, 65, "#fff", 0.8);

  // atrasos de entrada (escalonamento) e altura total
  let n = 0; els.forEach((e) => { if (!e.cartao) e.atraso = n++ * STAGGER; });
  const gInt = els.gapInterno || gap;
  let total = 0; els.forEach((e, i) => { total += e.altura + (i ? (e.cartao || (i > 1 && els[i - 1].cartao) || (els.gapInterno && i > 1) ? gInt : gap) : 0); });
  const assentado = c.ini + els.reduce((m, e) => Math.max(m, e.atraso), 0) + ENTRADA;
  return { c, els, total, gInt, gap, assentado };
}

/* ---------- renderizador: carregar(roteiro) → desenhar(ctx, t) ---------- */
export function criarRenderizador(roteiro, W, H, ctx, logo) {
  const L = layoutDe(W, H), k = L.k;
  let t0 = 0; const cenas = (roteiro.cenas || []).map((c) => { c.ini = t0; t0 += Number(c.duracao || 3); c.fim = t0; return montarCena(c, ctx, L); });
  const duracao = t0;
  const cor = TRILHA[roteiro.trilha] || TRILHA[SELO_PADRAO];
  fonte(ctx, 700, 52 * k, MANROPE); const wSelo = ctx.measureText(roteiro.trilha || SELO_PADRAO).width + 68 * k;
  const capaEm = () => roteiro.capa != null ? Number(roteiro.capa) : cenas[0] ? Math.min(cenas[0].c.fim - 0.3, cenas[0].assentado + 0.4) : 0;
  function fundo(ctx2) {
    // Mesmo fundo dos slides e da miniatura do blog: escuro, com um brilho vinho em cima e um laranja embaixo.
    ctx2.fillStyle = "#1a202c"; ctx2.fillRect(0, 0, W, H);
    const brilho = (cx, cy, r, rgb, a) => { const g = ctx2.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`); ctx2.fillStyle = g; ctx2.fillRect(0, 0, W, H); };
    brilho(W * 0.95, H * 0.06, W * 0.85, "153,42,43", 0.5);
    brilho(W * 0.02, H * 0.97, W * 0.8, "238,105,54", 0.26);
  }
  function moldura(ctx2, t, nota) {
    pilula(ctx2, 0, 0, Math.max(0, W * clamp(t / duracao)), 10 * k, 0, COR.verde);
    if (logo && logo.width) { const h = 64 * k, w = h * logo.width / logo.height; ctx2.drawImage(logo, L.lado, L.topo + (84 * k - h) / 2, w, h); }
    pilula(ctx2, W - L.lado - wSelo, L.topo + 2 * k, wSelo, 80 * k, 40 * k, cor[0]); fonte(ctx2, 700, 52 * k, MANROPE); ctx2.fillStyle = cor[1]; ctx2.textBaseline = "alphabetic"; ctx2.fillText(roteiro.trilha || SELO_PADRAO, W - L.lado - wSelo + 34 * k, L.topo + 2 * k + 80 * k * 0.72);
    fonte(ctx2, 700, 52 * k, MANROPE, "0.04em"); ctx2.fillStyle = COR.verde; ctx2.fillText((roteiro.eyebrow || "").toUpperCase(), L.lado, L.topo + 116 * k + 52 * k * 0.9);
    // rodapé: nota (até 2 linhas) + domínio, ancorados embaixo
    fonte(ctx2, 500, 52 * k, INTER); const ln = quebrar(ctx2, nota || "", L.palcoW).slice(0, 3); const hNota = ln.length * 62.4 * k;
    const yDom = L.rodapeBottom - 62.4 * k; fonte(ctx2, 700, 52 * k, MANROPE); desenharLinhas(ctx2, ["rugemtugem.dev"], L.lado, yDom, 62.4 * k, COR.verde);
    fonte(ctx2, 500, 52 * k, INTER); desenharLinhas(ctx2, ln, L.lado, yDom - 8 * k - hNota, 62.4 * k, "#fff", 0.72);
  }
  function desenhar(ctx2, t, badge) {
    fundo(ctx2);
    let nota = "";
    for (const s of cenas) {
      const u = t - s.c.ini; if (!(u >= -FADE && t < s.c.fim + FADE)) continue;
      const alphaCena = Math.min(clamp(u / FADE + 1), clamp((s.c.fim - t) / FADE));
      if (u >= 0 && t < s.c.fim && s.c.nota) nota = s.c.nota;
      let y = L.palcoTop + (L.palcoBottom - L.palcoTop - s.total) / 2;
      s.els.forEach((e, i) => {
        if (i) y += (e.cartao || (s.els.gapInterno && i > 1)) ? s.gInt : s.gap;
        const p = easeOut(clamp((u - e.atraso) / ENTRADA));
        ctx2.save(); ctx2.globalAlpha = alphaCena * p; ctx2.translate(e.cartao ? 64 * k * (1 - p) : 0, e.cartao ? 0 : 32 * k * (1 - p));
        e.draw(ctx2, y, u); ctx2.restore();
        y += e.altura;
      });
    }
    moldura(ctx2, t, nota || roteiro.nota || "");
    if (badge) { fonte(ctx2, 700, 30 * k, MANROPE); const s = `t = ${t.toFixed(1).replace(".", ",")} s`; const w = ctx2.measureText(s).width + 36 * k; pilula(ctx2, W - 28 * k - w, 28 * k, w, 50 * k, 12 * k, "rgba(0,0,0,.55)"); ctx2.fillStyle = "#fff"; ctx2.fillText(s, W - 28 * k - w + 18 * k, 28 * k + 36 * k); }
  }
  const diagnostico = () => ({ formato: L.vertical ? "9x16" : "4x5", duracao, cenas: cenas.map((s) => ({ tipo: s.c.tipo, ini: s.c.ini, fim: s.c.fim, assentado: s.assentado, altura: s.total, palco: L.palcoBottom - L.palcoTop })) });
  return { duracao, desenhar, capaEm, diagnostico, layout: L };
}

/* ---------- MP4 (ISO BMFF) mínimo: 1 trilha de vídeo H.264, moov antes do mdat ---------- */
const u32 = (n) => { const b = new Uint8Array(4); new DataView(b.buffer).setUint32(0, n >>> 0); return b; };
const u16 = (n) => { const b = new Uint8Array(2); new DataView(b.buffer).setUint16(0, n & 0xffff); return b; };
const str = (s) => new TextEncoder().encode(s);
const concat = (...partes) => { const n = partes.reduce((s, p) => s + p.length, 0), out = new Uint8Array(n); let o = 0; for (const p of partes) { out.set(p, o); o += p.length; } return out; };
const box = (tipo, ...partes) => { const corpo = concat(...partes); return concat(u32(corpo.length + 8), str(tipo), corpo); };
/* Descritor MPEG-4 (tag + tamanho em 1 byte; todos os nossos são menores que 128 bytes). */
const desc = (tag, ...partes) => { const c = concat(...partes); return concat(new Uint8Array([tag, c.length]), c); };
/**
 * @param audio opcional { chunks: [{data}], asc: Uint8Array (AudioSpecificConfig), sampleRate, channels, bitrate }
 *   Cada chunk AAC tem 1024 amostras. O mdat leva o vídeo inteiro e depois o áudio inteiro (um "chunk" por trilha).
 */
export function muxMp4({ W, H, fps, chunks, avcC, audio = null }) {
  if (!avcC || !avcC.length) throw new Error("sem avcC (decoderConfig.description) do codificador");
  const N = chunks.length, TS = fps * 1000, durTs = N * 1000, durMs = Math.round((N * 1000) / fps);
  const temAudio = !!(audio && audio.chunks && audio.chunks.length && audio.asc);
  const ftyp = box("ftyp", str("isom"), u32(0x200), str("isom"), str("iso2"), str("avc1"), str("mp41"));
  const sizes = chunks.map((c) => c.data.length), keys = chunks.map((c, i) => (c.key ? i + 1 : 0)).filter(Boolean);
  const avc1 = box("avc1", new Uint8Array(6), u16(1), new Uint8Array(16), u16(W), u16(H), u32(0x00480000), u32(0x00480000), u32(0), u16(1), new Uint8Array(32), u16(0x18), u16(0xffff), box("avcC", avcC), box("pasp", u32(1), u32(1)));
  const stsd = box("stsd", u32(0), u32(1), avc1);
  const stts = box("stts", u32(0), u32(1), u32(N), u32(1000));
  const stss = box("stss", u32(0), u32(keys.length), ...keys.map(u32));
  const stsc = box("stsc", u32(0), u32(1), u32(1), u32(N), u32(1));
  const stsz = box("stsz", u32(0), u32(0), u32(N), ...sizes.map(u32));
  const matrix = [0x10000, 0, 0, 0, 0x10000, 0, 0, 0, 0x40000000].map(u32);
  const mvhd = box("mvhd", u32(0), u32(0), u32(0), u32(1000), u32(durMs), u32(0x00010000), u16(0x0100), u16(0), u32(0), u32(0), ...matrix, new Uint8Array(24), u32(temAudio ? 3 : 2));
  const tkhd = box("tkhd", u32(3), u32(0), u32(0), u32(1), u32(0), u32(durMs), u32(0), u32(0), u16(0), u16(0), u16(0), u16(0), ...matrix, u32(W << 16), u32(H << 16));
  const mdhd = box("mdhd", u32(0), u32(0), u32(0), u32(TS), u32(durTs), u16(0x55c4), u16(0));
  const hdlr = box("hdlr", u32(0), u32(0), str("vide"), new Uint8Array(12), str("VideoHandler"), new Uint8Array(1));
  const dinf = box("dinf", box("dref", u32(0), u32(1), box("url ", u32(1))));
  const vmhd = box("vmhd", u32(1), new Uint8Array(8));
  const trakVideo = (off) => box("trak", tkhd, box("mdia", mdhd, hdlr, box("minf", vmhd, dinf, box("stbl", stsd, stts, stss, stsc, stsz, box("stco", u32(0), u32(1), u32(off))))));
  let trakAudio = () => new Uint8Array(0);
  if (temAudio) {
    const { sampleRate: sr, channels: ch, asc } = audio, A = audio.chunks.length;
    const aSizes = audio.chunks.map((c) => c.data.length);
    const br = audio.bitrate || 160000;
    const esds = box("esds", u32(0), desc(0x03, u16(2), new Uint8Array([0]),
      desc(0x04, new Uint8Array([0x40, 0x15, 0, 0x18, 0]), u32(br), u32(br), desc(0x05, asc)),
      desc(0x06, new Uint8Array([0x02]))));
    const mp4a = box("mp4a", new Uint8Array(6), u16(1), new Uint8Array(8), u16(ch), u16(16), u16(0), u16(0), u32(sr * 65536 >>> 0), esds);
    const aDurMs = Math.round((A * 1024 * 1000) / sr);
    const aTkhd = box("tkhd", u32(3), u32(0), u32(0), u32(2), u32(0), u32(Math.min(aDurMs, durMs)), u32(0), u32(0), u16(0), u16(1), u16(0x0100), u16(0), ...matrix, u32(0), u32(0));
    const aMdhd = box("mdhd", u32(0), u32(0), u32(0), u32(sr), u32(A * 1024), u16(0x55c4), u16(0));
    const aHdlr = box("hdlr", u32(0), u32(0), str("soun"), new Uint8Array(12), str("SoundHandler"), new Uint8Array(1));
    const smhd = box("smhd", u32(0), u16(0), u16(0));
    trakAudio = (off) => box("trak", aTkhd, box("mdia", aMdhd, aHdlr, box("minf", smhd, dinf, box("stbl",
      box("stsd", u32(0), u32(1), mp4a), box("stts", u32(0), u32(1), u32(A), u32(1024)),
      box("stsc", u32(0), u32(1), u32(1), u32(A), u32(1)), box("stsz", u32(0), u32(0), u32(A), ...aSizes.map(u32)),
      box("stco", u32(0), u32(1), u32(off))))));
  }
  const totalVideo = sizes.reduce((a, b) => a + b, 0);
  const moov = (off) => box("moov", mvhd, trakVideo(off), trakAudio(off + totalVideo));
  const off = ftyp.length + moov(0).length + 8;
  return concat(ftyp, moov(off), box("mdat", ...chunks.map((c) => c.data), ...(temAudio ? audio.chunks.map((c) => c.data) : [])));
}

/* ---------- trilha sonora: decodifica, recorta na duração do vídeo, fade-out e codifica em AAC-LC ---------- */
export const TRILHAS = [
  { id: "", nome: "Sem música" },
  { id: "digital-clouds", nome: "Digital Clouds · eletrônica calma (dicas de IA)" },
  { id: "curiosity", nome: "Curiosity · leve e curiosa (perguntas, passo a passo)" },
  { id: "close-up", nome: "Close Up · sóbria (para empresas)" },
  { id: "infinity", nome: "Infinity · calma e espaçosa (alertas, cuidado com dados)" },
  { id: "lo-fi-04", nome: "Lo-Fi 04 · batida lo-fi (bastidor, dica rápida)" },
];
export async function codificarTrilha(url, duracao, { volume = 0.85, fadeOut = 1.2, sr = 48000, ch = 2, bitrate = 160000 } = {}) {
  if (typeof AudioEncoder === "undefined") throw new Error("Este navegador não codifica áudio (WebCodecs). Use o Chrome ou o Edge.");
  const buf = await (await fetch(url)).arrayBuffer();
  const tmp = new OfflineAudioContext(ch, sr, sr);
  const fonte = await tmp.decodeAudioData(buf);
  const n = Math.ceil(duracao * sr);
  const off = new OfflineAudioContext(ch, n, sr);
  const src = off.createBufferSource(); src.buffer = fonte;
  const g = off.createGain();
  g.gain.setValueAtTime(volume, 0);
  g.gain.setValueAtTime(volume, Math.max(0, duracao - fadeOut));
  g.gain.linearRampToValueAtTime(0, duracao);
  src.connect(g).connect(off.destination); src.start(0);
  const pcm = await off.startRendering();
  const chunks = []; let asc = null, erro = null;
  const enc = new AudioEncoder({
    output: (c, meta) => {
      const d = meta && meta.decoderConfig && meta.decoderConfig.description;
      if (d && !asc) asc = d instanceof ArrayBuffer ? new Uint8Array(d.slice(0)) : new Uint8Array(d.buffer.slice(d.byteOffset, d.byteOffset + d.byteLength));
      const data = new Uint8Array(c.byteLength); c.copyTo(data); chunks.push({ data, ts: c.timestamp });
    },
    error: (e) => { erro = e; },
  });
  enc.configure({ codec: "mp4a.40.2", sampleRate: sr, numberOfChannels: ch, bitrate });
  const BLOCO = 1024 * 16;
  for (let i = 0; i < n; i += BLOCO) {
    const m = Math.min(BLOCO, n - i), plano = new Float32Array(m * ch);
    for (let c = 0; c < ch; c++) plano.set(pcm.getChannelData(Math.min(c, pcm.numberOfChannels - 1)).subarray(i, i + m), c * m);
    const ad = new AudioData({ format: "f32-planar", sampleRate: sr, numberOfFrames: m, numberOfChannels: ch, timestamp: Math.round((i / sr) * 1e6), data: plano });
    enc.encode(ad); ad.close();
  }
  await enc.flush(); enc.close();
  if (erro) throw erro;
  asc = ascValido(asc, sr, ch); // sem descrição, ou no formato "esds" da Apple (Safari/macOS): usa o ASC deduzido
  chunks.sort((a, b) => a.ts - b.ts);
  return { chunks, asc, sampleRate: sr, channels: ch, bitrate };
}
/**
 * Garante um AudioSpecificConfig de AAC-LC coerente com a taxa e os canais codificados. O AudioEncoder do
 * Safari/macOS devolve em decoderConfig.description um ES_Descriptor inteiro (formato "esds", 39 bytes) em
 * vez do ASC puro de 2 bytes; gravado assim, o MP4 fica com "objeto 0 / 0 canais" e o Instagram recusa a
 * mídia com status ERROR (Reels do 13º, 25/10/2026). Como o codificador é sempre mp4a.40.2 com sr/ch
 * conhecidos, qualquer descrição que não seja exatamente esse ASC é trocada pelo deduzido.
 */
export function ascValido(desc, sr, ch) {
  const esperado = ascAacLc(sr, ch);
  if (!desc || desc.length < 2) return esperado;
  const obj = desc[0] >> 3, idx = ((desc[0] & 7) << 1) | (desc[1] >> 7), can = (desc[1] >> 3) & 15;
  return obj === 2 && idx === (((esperado[0] & 7) << 1) | (esperado[1] >> 7)) && can === ch ? desc.slice(0, 2) : esperado;
}
/** AudioSpecificConfig de AAC-LC (objeto 2) para a taxa e os canais dados. */
export function ascAacLc(sr, ch) {
  const idx = [96000, 88200, 64000, 48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000].indexOf(sr);
  if (idx < 0) throw new Error("taxa de amostragem não suportada: " + sr);
  return new Uint8Array([(2 << 3) | (idx >> 1), ((idx & 1) << 7) | (ch << 3)]);
}

/* ---------- RGBA → I420 (BT.709, faixa limitada 16–235) ---------- */
export const COR_709 = { primaries: "bt709", transfer: "bt709", matrix: "bt709", fullRange: false };
export function rgbaParaI420(rgba, W, H, out) {
  const Y = out.subarray(0, W * H), U = out.subarray(W * H, W * H * 5 / 4), V = out.subarray(W * H * 5 / 4);
  for (let p = 0, q = 0; p < W * H; p++, q += 4) Y[p] = (16.5 + 0.1826 * rgba[q] + 0.6142 * rgba[q + 1] + 0.0620 * rgba[q + 2]) | 0;
  const w2 = W >> 1;
  for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) {
    const a = (y * W + x) * 4, b = a + 4, c = a + W * 4, d = c + 4;
    const r = (rgba[a] + rgba[b] + rgba[c] + rgba[d]) / 4, g = (rgba[a + 1] + rgba[b + 1] + rgba[c + 1] + rgba[d + 1]) / 4, bl = (rgba[a + 2] + rgba[b + 2] + rgba[c + 2] + rgba[d + 2]) / 4;
    const k = (y >> 1) * w2 + (x >> 1);
    U[k] = (128.5 - 0.1006 * r - 0.3386 * g + 0.4392 * bl) | 0;
    V[k] = (128.5 + 0.4392 * r - 0.3989 * g - 0.0403 * bl) | 0;
  }
  return out;
}

/* ---------- codificação no navegador ---------- */
export async function escolherCodec(W, H, fps) {
  if (typeof VideoEncoder === "undefined") throw new Error("Este navegador não tem WebCodecs. Use o Chrome (ou Edge) no computador.");
  for (const codec of ["avc1.640028", "avc1.4D4028", "avc1.42E028", "avc1.42002A", "avc1.640029"]) {
    try { const r = await VideoEncoder.isConfigSupported({ codec, width: W, height: H, bitrate: 5_000_000, framerate: fps, avc: { format: "avc" } }); if (r.supported) return codec; } catch (_) { /* próximo */ }
  }
  throw new Error("Nenhum perfil H.264 disponível para codificar neste navegador.");
}
async function carregarLogo(src) {
  if (!src) return null; // sem logo: o domínio no rodapé já assina o vídeo
  return new Promise((res) => { const img = new Image(); img.crossOrigin = "anonymous"; img.onload = () => res(img); img.onerror = () => res(null); img.src = src; });
}
let fontesRegistradas = null;
async function prepararFontes(k) {
  // Os pesos 500 e 700 que o desenho pede caem no peso vizinho disponível (400 ou 600, e 800).
  if (!fontesRegistradas) fontesRegistradas = Promise.all([400, 600, 800].map(async (peso) => { const f = new FontFace("Inter", `url(/fontes/inter-latin-${peso}-normal.woff)`, { weight: String(peso) }); document.fonts.add(await f.load()); })).catch(() => {});
  await fontesRegistradas;
  const pedidos = [`800 ${92 * k}px Inter`, `600 ${52 * k}px Inter`, `400 ${52 * k}px Inter`];
  try { await Promise.all(pedidos.map((f) => document.fonts.load(f))); } catch (_) { /* segue com fallback */ }
  await document.fonts.ready;
}
/* Gera o MP4 (e a capa em PNG) de um roteiro. onProgresso(i, N). Devolve { mp4: Blob, capa: Blob, duracao, codec }. */
export async function gerarMp4(roteiro, W, H, { fps = 30, logoSrc = "", onProgresso, trilhaUrl = null, volume = 0.85 } = {}) {
  if (W % 2 || H % 2) throw new Error("largura e altura precisam ser pares");
  const codec = await escolherCodec(W, H, fps);
  const canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d", { alpha: false, willReadFrequently: true });
  await prepararFontes(W / 1080);
  const logo = await carregarLogo(logoSrc);
  const R = criarRenderizador(roteiro, W, H, ctx, logo);
  const N = Math.round(R.duracao * fps);
  if (!(N > 0)) throw new Error("roteiro sem cenas");
  // capa
  R.desenhar(ctx, Math.min(R.capaEm(), R.duracao - 1 / fps));
  const capa = await new Promise((res) => canvas.toBlob(res, "image/png"));
  // vídeo
  const chunks = []; let avcC = null, erro = null;
  const enc = new VideoEncoder({
    output: (chunk, meta) => {
      const d = meta && meta.decoderConfig && meta.decoderConfig.description;
      if (d && !avcC) avcC = d instanceof ArrayBuffer ? new Uint8Array(d.slice(0)) : new Uint8Array(d.buffer.slice(d.byteOffset, d.byteOffset + d.byteLength));
      const data = new Uint8Array(chunk.byteLength); chunk.copyTo(data); chunks.push({ data, key: chunk.type === "key", ts: chunk.timestamp });
    },
    error: (e) => { erro = e; },
  });
  enc.configure({ codec, width: W, height: H, bitrate: 5_000_000, framerate: fps, avc: { format: "avc" }, latencyMode: "quality" });
  const i420 = new Uint8Array(W * H * 3 / 2);
  for (let i = 0; i < N; i++) {
    if (erro) throw erro;
    R.desenhar(ctx, i / fps);
    // Quadro em I420 de faixa limitada BT.709 (yuv420p), não o "yuvj420p" que o Canvas gera direto:
    // é o formato que a Meta recomenda para Reels e que todo player mostra com as cores certas.
    rgbaParaI420(ctx.getImageData(0, 0, W, H).data, W, H, i420);
    const frame = new VideoFrame(i420, { format: "I420", codedWidth: W, codedHeight: H, timestamp: Math.round((i * 1e6) / fps), duration: Math.round(1e6 / fps), colorSpace: COR_709 });
    enc.encode(frame, { keyFrame: i % (fps * 2) === 0 }); frame.close();
    while (enc.encodeQueueSize > 6) await new Promise((r) => setTimeout(r, 4));
    if (onProgresso && (i % 5 === 0 || i === N - 1)) { onProgresso(i + 1, N); await new Promise((r) => setTimeout(r, 0)); }
  }
  await enc.flush(); enc.close();
  if (erro) throw erro;
  chunks.sort((a, b) => a.ts - b.ts);
  const audio = trilhaUrl ? await codificarTrilha(trilhaUrl, N / fps, { volume }) : null;
  const mp4 = new Blob([muxMp4({ W, H, fps, chunks, avcC, audio })], { type: "video/mp4" });
  return { mp4, capa, duracao: R.duracao, codec, quadros: N };
}
/* Quadro avulso (PNG) para prévia/contact sheet. */
export async function quadroPng(roteiro, W, H, t, { logoSrc = "", badge = false } = {}) {
  const canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d", { alpha: false });
  await prepararFontes(W / 1080);
  const R = criarRenderizador(roteiro, W, H, ctx, await carregarLogo(logoSrc));
  R.desenhar(ctx, t, badge);
  return { url: canvas.toDataURL("image/png"), diagnostico: R.diagnostico() };
}
