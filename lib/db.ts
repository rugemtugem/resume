import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Banco SQLite do site. No servidor fica no volume (DATA_DIR=/data); em localhost, em ./.dados.
 * As tabelas são criadas na primeira abertura e a criação pode rodar quantas vezes for.
 */
export const PASTA_DE_DADOS = process.env.DATA_DIR || join(process.cwd(), ".dados");

const TABELAS = `
CREATE TABLE IF NOT EXISTS blog_agenda (
  slug TEXT PRIMARY KEY, titulo TEXT NOT NULL, quando_utc TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente', aprovado_em TEXT, publicado_em TEXT, erro TEXT);
CREATE TABLE IF NOT EXISTS blog_leitura (slug TEXT PRIMARY KEY, total INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS login_tentativa (ip TEXT NOT NULL, em TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS ix_login_tentativa ON login_tentativa(ip, em);
CREATE TABLE IF NOT EXISTS batimento (id INTEGER PRIMARY KEY CHECK (id = 1), em TEXT NOT NULL, linha TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS trava (nome TEXT PRIMARY KEY, ate TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS ig_conta (
  apelido TEXT PRIMARY KEY, ig_user_id TEXT NOT NULL, username TEXT NOT NULL, account_type TEXT,
  token TEXT NOT NULL, expira_em TEXT NOT NULL, atualizado_em TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS ig_post (
  id INTEGER PRIMARY KEY, apelido TEXT NOT NULL, tipo TEXT NOT NULL, titulo TEXT, slug TEXT,
  midias TEXT NOT NULL, legenda TEXT NOT NULL, quando_utc TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'agendado', tentativas INTEGER NOT NULL DEFAULT 0, erro TEXT,
  media_id TEXT, permalink TEXT, reservado_em TEXT, publicado_em TEXT, criado_em TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS ix_ig_status_quando ON ig_post(status, quando_utc);
CREATE TABLE IF NOT EXISTS rotina_diaria (nome TEXT PRIMARY KEY, dia TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS li_conta (
  apelido TEXT PRIMARY KEY, pessoa_urn TEXT NOT NULL, nome TEXT NOT NULL,
  token TEXT NOT NULL, expira_em TEXT NOT NULL, atualizado_em TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS li_post (
  id INTEGER PRIMARY KEY, titulo TEXT NOT NULL, slug TEXT, texto TEXT NOT NULL, midias TEXT NOT NULL DEFAULT '[]',
  quando_utc TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'agendado', tentativas INTEGER NOT NULL DEFAULT 0, erro TEXT,
  post_urn TEXT, reservado_em TEXT, publicado_em TEXT, criado_em TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS ix_li_status_quando ON li_post(status, quando_utc);
CREATE TABLE IF NOT EXISTS lead_dia (dia TEXT NOT NULL, origem TEXT NOT NULL, total INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (dia, origem));
CREATE TABLE IF NOT EXISTS blog_leitura_dia (dia TEXT NOT NULL, slug TEXT NOT NULL, total INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (dia, slug));
CREATE TABLE IF NOT EXISTS cache_metricas (chave TEXT PRIMARY KEY, ate TEXT NOT NULL, json TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS admin_meta (chave TEXT PRIMARY KEY, valor INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS rede_dia (dia TEXT NOT NULL, rede TEXT NOT NULL, metrica TEXT NOT NULL, valor INTEGER NOT NULL, PRIMARY KEY (dia, rede, metrica));
CREATE TABLE IF NOT EXISTS story_clique (dia TEXT NOT NULL, slug TEXT NOT NULL, cliques INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (dia, slug));
`;

let conexao: Database.Database | null | undefined;

/** Devolve o banco, ou null se ele não puder ser aberto. O site segue no ar sem ele. */
export function banco(): Database.Database | null {
    if (conexao !== undefined) return conexao;
    try {
        if (!existsSync(PASTA_DE_DADOS)) mkdirSync(PASTA_DE_DADOS, { recursive: true });
        const db = new Database(join(PASTA_DE_DADOS, "rugemtugem.db"));
        db.pragma("journal_mode = WAL");
        db.exec(TABELAS);
        conexao = db;
    } catch (erro) {
        console.error("Banco indisponível:", erro instanceof Error ? erro.message : erro);
        conexao = null;
    }
    return conexao;
}
