# Como o site sobe

## O que vale hoje: Dokploy (conferido no servidor em 25/11/2026)

O site roda no VPS como o aplicativo `react-app-principal-wuvgzf` do **Dokploy**:

- fonte: GitHub `rugemtugem/resume`, ramo `main`, com **deploy automático ligado**;
- build: o `Dockerfile` deste repositório;
- o Traefik do Dokploy entrega `rugemtugem.dev` para a porta 3000 do container.

Ou seja: **todo push no `main` já é um deploy.** O Dokploy constrói a imagem e troca o container.
Se o build falhar, o container antigo continua no ar.

O fluxo do GitHub Actions (`.github/workflows/deploy.yml`) e o `scripts/deploy.sh` descritos mais abaixo
são um caminho alternativo, hoje desligado (a variável `DEPLOY_ENABLED` não existe). O `deploy.sh` serve
também para conferir uma imagem à mão: `bash scripts/deploy.sh --so-conferir <imagem>`.

## O que o painel precisa no Dokploy (uma vez, antes do primeiro push com o painel)

Em 25/11/2026 o aplicativo não tinha **nenhuma variável de ambiente** nem **volume**. Sem isso o site
abre normalmente, mas o painel responde "não está configurado" e o banco é apagado a cada deploy.

1. **Volume** (Advanced > Volumes): tipo *Volume Mount*, nome `rugemtugem-data`, caminho `/data`.
   É onde ficam o banco, as imagens das publicações e, depois, a chave do Google.
2. **Variáveis** (Environment). Gere as três primeiras na sua máquina com
   `node scripts/gerar-senha.mjs "uma senha longa"` e cole a saída:

   | Variável | Para quê |
   |---|---|
   | `ADMIN_SENHA_HASH` | senha do painel (só o resumo dela, nunca a senha) |
   | `ADMIN_SESSAO_SEGREDO` | assina o cookie de login |
   | `CRON_SECRET` | autoriza o agendador |
   | `SITE_URL=https://rugemtugem.dev` | endereço público das imagens e dos links |
   | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | envio do formulário de contato |

   Depois, quando existirem: `GOOGLE_CHAVE=/data/google-conta-de-servico.json`, `GA4_PROPERTY_ID` e
   `GSC_SITE` (ver `marketing/apoio/09-metricas-conta-de-servico-google.md`).

   **Não** configure `IG_GRAPH_BASE`, `LINKEDIN_API_BASE` nem `GOOGLE_API_BASE`: elas só existem em
   localhost, para apontar para a API falsa. Sem elas, o servidor fala com as APIs de verdade.
3. **Agendador**, a cada 5 minutos. No crontab do servidor (troque o segredo):

   ```
   */5 * * * * curl -fsS -m 280 -X POST -H "Authorization: Bearer <CRON_SECRET>" https://rugemtugem.dev/api/cron/tique >/dev/null
   ```

   Ele publica o que venceu (blog, Instagram, LinkedIn) e, uma vez por dia, renova o token do Instagram,
   limpa imagens sem uso e guarda as métricas das redes.

## Requisitos da imagem

- **Node 22 ou mais novo.** O módulo do banco (`better-sqlite3` 13) quebra ao abrir o banco com Node 20.
- O estágio de build instala Python e compilador, porque esse módulo pode precisar compilar no Alpine.

## Conferência depois de subir

- `https://rugemtugem.dev/` e `/blog` abrem; `/admin` leva para o login e a senha entra.
- No painel, a faixa do agendador mostra "última verificação há poucos minutos".
- Em Instagram e LinkedIn **não** aparece o aviso "Modo de teste".

---

# Caminho alternativo (desligado): GitHub Actions + scripts/deploy.sh


The site is **self-hosted** on a VPS as a Docker container (Next.js standalone
output, `node server.js`). A push to GitHub does **not** update production by
itself — the image must be rebuilt and the container restarted on the server.

`.github/workflows/deploy.yml` automates that: on every push to `main` (or a
manual **Run workflow**) it SSHes into the VPS, pulls `main`, and runs
`scripts/deploy.sh` (rebuild image + restart container).

## One-time setup

### 1. Server prep (on the VPS, once)
- Clone the repo somewhere, e.g. `/opt/rugemtugem/resume`, with the `origin`
  remote pointing at `github.com/rugemtugem/resume.git`.
- Put the production `.env` in that folder (it is gitignored and stays on the
  server; `scripts/deploy.sh` passes it via `--env-file`).
- Make sure `docker` runs as the deploy user (that user is in the `docker`
  group) and the container's port matches your reverse proxy (default 3000).

### 2. SSH deploy key
- Generate a dedicated key: `ssh-keygen -t ed25519 -f deploy_key -N ""`.
- Append `deploy_key.pub` to `~/.ssh/authorized_keys` of the deploy user on the VPS.
- Keep `deploy_key` (the private half) for the secret below.

### 3. GitHub repo secrets
`Settings → Secrets and variables → Actions → New repository secret`:

| Secret        | Value                                          |
|---------------|------------------------------------------------|
| `SSH_HOST`    | `rugemtugem.dev` (or the VPS IP)               |
| `SSH_USER`    | the deploy user on the VPS                      |
| `SSH_KEY`     | full contents of the **private** `deploy_key`   |
| `DEPLOY_PATH` | repo path on the VPS, e.g. `/opt/rugemtugem/resume` |
| `SSH_PORT`    | *(optional)* SSH port if not 22                 |

### 4. Enable it
Add a repo **variable** (not secret): `DEPLOY_ENABLED = true`
(`Settings → Secrets and variables → Actions → Variables`). Until then the job
is **skipped**, so pushing the workflow won't produce failed runs.

## Deploy the current pending change
After setup, run the workflow once (**Actions → Deploy to VPS → Run workflow**,
or push any commit). It pulls the latest `main` and deploys it — including the
already-pushed "Calcula" projects change.

## Manual fallback
SSH into the VPS and run, from the repo folder:

```bash
git fetch origin main && git reset --hard origin/main
bash scripts/deploy.sh
```
