# Deploy (VPS + GitHub Actions)

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
