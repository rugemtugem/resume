#!/usr/bin/env bash
# Deploy no servidor: constrói a imagem, confere que ela funciona e só então troca o container.
# Rode na raiz do repositório no VPS (o fluxo do GitHub faz: git reset --hard origin/main && bash scripts/deploy.sh).
# Também pode ser rodado à mão.
#
# Só conferir uma imagem, sem trocar nada:  bash scripts/deploy.sh --so-conferir <imagem>
#
# Ajuste PORT abaixo (ou exporte antes de chamar) se o container não for publicado na 3000.
set -euo pipefail

IMAGE="rugemtugem-dev:latest"
CONTAINER="rugemtugem-dev"
PORT="${PORT:-3000}"
PORTA_DE_TESTE="${PORTA_DE_TESTE:-3999}"

# Confere a imagem antes da troca. Se algo falhar, o script para e o container antigo continua no ar.
conferir_imagem() {
  local imagem="$1" teste="rugemtugem-conferencia"

  echo "==> Conferindo os módulos nativos (banco e imagens)"
  docker run --rm --entrypoint node "$imagem" -e '
    const Banco = require("better-sqlite3");
    const db = new Banco("/data/conferencia.db");
    db.exec("CREATE TABLE t (a)");
    require("sharp")({ create: { width: 8, height: 8, channels: 3, background: "#992A2B" } }).jpeg().toBuffer()
      .then((b) => { if (b.length < 100) throw new Error("imagem vazia"); console.log("    banco e imagens funcionam, Node " + process.version); })
      .catch((e) => { console.error(e.message); process.exit(1); });
  '

  echo "==> Subindo a imagem em uma porta de teste ($PORTA_DE_TESTE), com banco vazio"
  docker rm -f -v "$teste" >/dev/null 2>&1 || true
  # Sem o volume de dados: usa um banco vazio e descartável, e não toca nos dados de verdade.
  docker run -d --name "$teste" -p "127.0.0.1:${PORTA_DE_TESTE}:3000" \
    $( [ -f .env ] && echo "--env-file .env" ) \
    "$imagem" >/dev/null

  local ok=0
  for _ in $(seq 1 30); do
    if [ "$(curl -s -o /dev/null -m 5 -w '%{http_code}' "http://127.0.0.1:${PORTA_DE_TESTE}/" || true)" = "200" ]; then ok=1; break; fi
    sleep 1
  done
  local login
  login="$(curl -s -o /dev/null -m 10 -w '%{http_code}' "http://127.0.0.1:${PORTA_DE_TESTE}/admin/login" || true)"
  if [ "$ok" != "1" ] || [ "$login" != "200" ]; then
    echo "ERRO: a imagem nova não respondeu (página inicial: $ok, login do painel: $login). Nada foi trocado." >&2
    docker logs --tail 30 "$teste" >&2 || true
    docker rm -f -v "$teste" >/dev/null 2>&1 || true
    return 1
  fi
  docker rm -f -v "$teste" >/dev/null 2>&1 || true
  echo "    página inicial e login do painel responderam"
}

if [ "${1:-}" = "--so-conferir" ]; then
  conferir_imagem "${2:?Passe o nome da imagem}"
  exit 0
fi

if [ ! -f .env ]; then
  echo "AVISO: .env não encontrado em $(pwd): o container sobe sem as variáveis (e-mail, painel, agendador)." >&2
fi

echo "==> Construindo a imagem $IMAGE"
docker build -t "$IMAGE" .

conferir_imagem "$IMAGE"

echo "==> Trocando o container $CONTAINER na porta $PORT"
docker rm -f "$CONTAINER" 2>/dev/null || true
docker run -d --name "$CONTAINER" --restart unless-stopped \
  -p "${PORT}:3000" \
  -v rugemtugem-data:/data \
  $( [ -f .env ] && echo "--env-file .env" ) \
  "$IMAGE"

echo "==> Limpando imagens sem uso"
docker image prune -f >/dev/null || true

echo "==> Pronto:"
docker ps --filter "name=$CONTAINER" --format '{{.Status}} | {{.Ports}}'
