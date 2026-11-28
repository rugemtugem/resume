// Gera o token de acesso do LinkedIn sem depender da ferramenta do portal de desenvolvedores.
// Uso (na pasta do site):  node scripts/linkedin-token.mjs <CLIENT_ID>
//
// Antes de rodar:
//   1. No app do LinkedIn, aba Auth, cadastre o endereço de retorno  http://localhost:8765/retorno
//   2. Salve o Client Secret em .dados/linkedin-client-secret.txt (a pasta .dados fica fora do git)
//
// O script abre a tela de autorização no navegador, recebe a resposta nesta máquina, troca pelo token e
// grava em .dados/li-token.txt. O token e o segredo nunca aparecem na tela.
import { createServer } from "node:http";
import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync, chmodSync } from "node:fs";
import { spawn } from "node:child_process";

const PORTA = 8765;
const RETORNO = `http://localhost:${PORTA}/retorno`;
const ESCOPOS = "openid profile w_member_social";
const ARQUIVO_DO_SEGREDO = ".dados/linkedin-client-secret.txt";
const ARQUIVO_DO_TOKEN = ".dados/li-token.txt";

const clientId = (process.argv[2] || "").trim();
if (!/^[A-Za-z0-9]{8,30}$/.test(clientId)) {
  console.error("Passe o Client ID do app: node scripts/linkedin-token.mjs <CLIENT_ID>");
  process.exit(1);
}
if (!existsSync(ARQUIVO_DO_SEGREDO)) {
  console.error(`Salve o Client Secret em ${ARQUIVO_DO_SEGREDO} antes de rodar.`);
  process.exit(1);
}
const segredo = readFileSync(ARQUIVO_DO_SEGREDO, "utf8").trim();
if (segredo.length < 10 || /\s/.test(segredo)) {
  console.error(`O conteúdo de ${ARQUIVO_DO_SEGREDO} não parece um Client Secret (tem ${segredo.length} caracteres ou tem espaço).`);
  process.exit(1);
}

const estado = randomBytes(16).toString("hex");
const pagina = (titulo, texto) => `<!doctype html><meta charset="utf-8"><title>${titulo}</title><body style="font-family:system-ui;max-width:32rem;margin:15vh auto;padding:0 1rem"><h1>${titulo}</h1><p>${texto}</p></body>`;

const servidor = createServer(async (req, res) => {
  const url = new URL(req.url, RETORNO);
  if (url.pathname !== "/retorno") {
    res.writeHead(404).end();
    return;
  }
  const responder = (titulo, texto) => res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }).end(pagina(titulo, texto));
  const terminar = (codigo) => setTimeout(() => { servidor.close(); process.exit(codigo); }, 300);

  if (url.searchParams.get("error")) {
    const motivo = `${url.searchParams.get("error")}: ${url.searchParams.get("error_description") || "sem detalhe"}`;
    console.error("O LinkedIn não autorizou:", motivo);
    responder("Não autorizado", "O LinkedIn recusou o pedido. Volte ao terminal para ver o motivo.");
    return terminar(1);
  }
  if (url.searchParams.get("state") !== estado) {
    console.error("A resposta não veio deste pedido (estado diferente). Rode o script de novo.");
    responder("Resposta inesperada", "Esta resposta não corresponde ao pedido feito pelo script. Rode de novo.");
    return terminar(1);
  }
  try {
    const troca = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ grant_type: "authorization_code", code: url.searchParams.get("code") || "", client_id: clientId, client_secret: segredo, redirect_uri: RETORNO }),
    });
    const dados = await troca.json().catch(() => ({}));
    if (!troca.ok || !dados.access_token) throw new Error(dados.error_description || dados.error || `resposta ${troca.status}`);

    writeFileSync(ARQUIVO_DO_TOKEN, dados.access_token);
    chmodSync(ARQUIVO_DO_TOKEN, 0o600);
    const dias = Math.round((dados.expires_in || 0) / 86400);
    const perfil = await (await fetch("https://api.linkedin.com/v2/userinfo", { headers: { Authorization: `Bearer ${dados.access_token}` } })).json().catch(() => ({}));

    console.log(`Token gravado em ${ARQUIVO_DO_TOKEN} (${dados.access_token.length} caracteres, vale ${dias} dias).`);
    console.log("Permissões:", dados.scope || "(não informadas)");
    console.log("Perfil:", perfil.name ? `${perfil.name}` : `o LinkedIn não devolveu o nome (${perfil.message || "sem detalhe"})`);
    console.log("Para copiar e colar no painel:  pbcopy < " + ARQUIVO_DO_TOKEN);
    responder("Pronto", "O token foi gravado no seu computador. Pode fechar esta aba e voltar ao terminal.");
    terminar(0);
  } catch (e) {
    console.error("A troca pelo token falhou:", e instanceof Error ? e.message.split(segredo).join("[segredo]") : "erro");
    responder("Não deu certo", "A troca pelo token falhou. Volte ao terminal para ver o motivo.");
    terminar(1);
  }
});

servidor.listen(PORTA, "127.0.0.1", () => {
  const endereco = `https://www.linkedin.com/oauth/v2/authorization?${new URLSearchParams({ response_type: "code", client_id: clientId, redirect_uri: RETORNO, state: estado, scope: ESCOPOS })}`;
  console.log("Abrindo o LinkedIn no navegador. Entre com a sua conta e clique em Permitir.");
  console.log("Se o navegador não abrir, copie este endereço:\n" + endereco);
  spawn("open", [endereco], { stdio: "ignore", detached: true }).unref();
});
setTimeout(() => { console.error("Ninguém autorizou em 5 minutos. Rode de novo quando quiser."); process.exit(1); }, 5 * 60e3);
