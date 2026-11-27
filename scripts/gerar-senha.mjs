// Gera as variáveis do painel. Uso: node scripts/gerar-senha.mjs "minha senha"
// Com --local, grava o arquivo .env.local para uso em localhost (lê a senha de .dados/senha-local.txt).
import { generateKeyPairSync, randomBytes, scryptSync } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const local = process.argv.includes("--local");
const senha = local ? readFileSync(".dados/senha-local.txt", "utf8").trim() : process.argv[2];

if (!senha || senha.length < 10) {
  console.error("Passe a senha entre aspas, com pelo menos 10 caracteres.");
  process.exit(1);
}

const sal = randomBytes(16);
// Separador ":". Com cifrão, o arquivo de ambiente do Next trocaria os trechos por variáveis.
const hash = ["scrypt", sal.toString("base64url"), scryptSync(senha, sal, 64).toString("base64url")].join(":");
const linhas = [
  "ADMIN_SENHA_HASH=" + hash,
  "ADMIN_SESSAO_SEGREDO=" + randomBytes(48).toString("base64url"),
  "CRON_SECRET=" + (local ? "dev-local-segredo-do-agendador" : randomBytes(32).toString("base64url")),
];

if (local) {
  const cabecalho = [
    "# Só para localhost. Não vai para o git nem para o servidor.",
    "DATA_DIR=./.dados",
    "SITE_URL=http://localhost:3000",
    "# Instagram: em localhost só a API falsa (node scripts/graph-falsa.mjs).",
    "IG_GRAPH_BASE=http://localhost:4010",
    "# LinkedIn: a mesma API falsa atende em /linkedin.",
    "LINKEDIN_API_BASE=http://localhost:4010/linkedin",
    "# Métricas: API falsa do Google em /google, com uma conta de serviço de mentira.",
    "GOOGLE_API_BASE=http://localhost:4010/google",
    "GOOGLE_CHAVE=./.dados/google-falso.json",
    "GA4_PROPERTY_ID=000000000",
    "GSC_SITE=sc-domain:rugemtugem.dev",
  ];
  // Chave gerada na hora, só para assinar o pedido à API falsa. Não dá acesso a nada de verdade.
  const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  writeFileSync(".dados/google-falso.json", JSON.stringify({ client_email: "falso@localhost.iam.gserviceaccount.com", private_key: privateKey.export({ type: "pkcs8", format: "pem" }) }, null, 2));
  writeFileSync(".env.local", cabecalho.concat(linhas).join("\n") + "\n");
  console.log("Arquivo .env.local gravado com", linhas.length + 8, "variáveis.");
} else {
  console.log(linhas.join("\n"));
}
