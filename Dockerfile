# ---- Estágio 1: dependências e build ----
# Node 22: o módulo do banco (better-sqlite3 13) exige Node 22 ou mais novo. Com Node 20 ele quebra ao abrir o banco.
FROM node:22-alpine AS builder
WORKDIR /app
# O better-sqlite3 é nativo: quando não há binário pronto para o Alpine, o npm compila,
# e para isso precisa de Python e de um compilador. Ficam só neste estágio; a imagem final não leva.
RUN apk add --no-cache python3 make g++
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Estágio 2: produção ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Pasta de dados (banco SQLite e mídias). No servidor é um volume, para sobreviver a cada deploy.
RUN mkdir -p /data && chown nextjs:nodejs /data
ENV DATA_DIR=/data
VOLUME /data

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
