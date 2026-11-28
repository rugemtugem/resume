import { randomBytes, timingSafeEqual } from "node:crypto";
import { banco } from "@/lib/db";
import { lerPerfil } from "@/lib/linkedin/api";
import { guardarContaDoLinkedin, tokenDoLinkedin } from "@/lib/linkedin/fila";
import { baseDoLinkedin, enderecosDoOauth, semTokenDoLinkedin } from "@/lib/linkedin/regras";

/**
 * Autorização do LinkedIn feita pelo próprio painel, sem ferramenta de token nem terminal.
 * O painel manda para a tela de permissão do LinkedIn, o LinkedIn devolve um código para /admin/linkedin/retorno,
 * e o servidor troca o código pelo token. O Client Secret fica só em variável de ambiente.
 *
 * Renovação: o token vale 60 dias. Se o LinkedIn entregar também um token de renovação (ele decide isso por app),
 * o agendador renova sozinho. Se não entregar, renovar é um clique no painel, e o painel avisa antes de vencer.
 */

const ESCOPOS = "openid profile w_member_social";
const VALIDADE_DO_PEDIDO_MS = 10 * 60e3;

const idDoApp = () => (process.env.LINKEDIN_CLIENT_ID || "").trim();
const segredoDoApp = () => (process.env.LINKEDIN_CLIENT_SECRET || "").trim();

export function oauthConfigurado(): boolean {
    return /^[A-Za-z0-9]{8,30}$/.test(idDoApp()) && segredoDoApp().length >= 10;
}

/** Endereço para onde o LinkedIn devolve a autorização. Precisa estar cadastrado no app, letra por letra. */
export function enderecoDeRetorno(): string {
    return `${(process.env.SITE_URL || "https://rugemtugem.dev").replace(/\/+$/, "")}/admin/linkedin/retorno`;
}

const enderecos = () => enderecosDoOauth(process.env, baseDoLinkedin(process.env));

function ler(chave: string): string {
    return (banco()?.prepare("SELECT valor FROM config WHERE chave = ?").get(chave) as { valor: string } | undefined)?.valor ?? "";
}
function gravar(chave: string, valor: string): void {
    banco()?.prepare("INSERT INTO config (chave, valor) VALUES (?, ?) ON CONFLICT(chave) DO UPDATE SET valor = excluded.valor").run(chave, valor);
}

/** Começa o pedido: guarda um código de uso único (vale 10 minutos) e devolve o endereço da tela de permissão. */
export function iniciarAutorizacao(): string {
    if (!oauthConfigurado()) throw new Error("Faltam LINKEDIN_CLIENT_ID e LINKEDIN_CLIENT_SECRET no servidor.");
    if (!banco()) throw new Error("Banco indisponível");
    const estado = randomBytes(24).toString("hex");
    gravar("li_oauth_estado", `${estado}:${Date.now() + VALIDADE_DO_PEDIDO_MS}`);
    return `${enderecos().autorizacao}?${new URLSearchParams({ response_type: "code", client_id: idDoApp(), redirect_uri: enderecoDeRetorno(), state: estado, scope: ESCOPOS })}`;
}

/**
 * O código de uso único é a prova de que o pedido saiu do painel logado: só existe por 10 minutos depois do clique,
 * é impossível de adivinhar e é apagado ao ser usado.
 */
function consumirEstado(recebido: string): boolean {
    const [esperado, validade] = ler("li_oauth_estado").split(":");
    gravar("li_oauth_estado", "");
    if (!esperado || !recebido || Number(validade) < Date.now()) return false;
    const a = Buffer.from(recebido);
    const b = Buffer.from(esperado);
    return a.length === b.length && timingSafeEqual(a, b);
}

interface RespostaDoToken {
    access_token?: string;
    expires_in?: number;
    refresh_token?: string;
    refresh_token_expires_in?: number;
    error?: string;
    error_description?: string;
}

async function pedirToken(parametros: Record<string, string>): Promise<Required<Pick<RespostaDoToken, "access_token" | "expires_in">> & RespostaDoToken> {
    const resposta = await fetch(enderecos().token, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ ...parametros, client_id: idDoApp(), client_secret: segredoDoApp() }),
        signal: AbortSignal.timeout(30000),
    });
    const dados = (await resposta.json().catch(() => ({}))) as RespostaDoToken;
    if (!resposta.ok || !dados.access_token) {
        const motivo = (dados.error_description || dados.error || `resposta ${resposta.status}`).split(segredoDoApp()).join("[segredo]");
        throw new Error(`O LinkedIn não entregou o token: ${motivo}`);
    }
    return { ...dados, access_token: dados.access_token, expires_in: dados.expires_in ?? 60 * 86400 };
}

function guardarRenovacao(dados: RespostaDoToken): void {
    if (dados.refresh_token) {
        gravar("li_refresh_token", dados.refresh_token);
        gravar("li_refresh_expira_em", new Date(Date.now() + (dados.refresh_token_expires_in ?? 365 * 86400) * 1000).toISOString());
    }
}

/** Termina o pedido: confere o código de uso único, troca o código do LinkedIn pelo token e guarda a conta. */
export async function concluirAutorizacao(codigo: string, estado: string): Promise<{ nome: string; dias: number; renovaSozinho: boolean }> {
    if (!oauthConfigurado()) throw new Error("Faltam LINKEDIN_CLIENT_ID e LINKEDIN_CLIENT_SECRET no servidor.");
    if (!consumirEstado(estado)) throw new Error("Este pedido não saiu do painel ou passou de 10 minutos. Clique em conectar de novo.");
    const dados = await pedirToken({ grant_type: "authorization_code", code: codigo, redirect_uri: enderecoDeRetorno() });
    const perfil = await lerPerfil(dados.access_token);
    gravar("li_refresh_token", "");
    guardarRenovacao(dados);
    guardarContaDoLinkedin(perfil, dados.access_token, new Date(Date.now() + dados.expires_in * 1000));
    return { nome: perfil.nome, dias: Math.round(dados.expires_in / 86400), renovaSozinho: Boolean(dados.refresh_token) };
}

/** Diz se há um token de renovação guardado e ainda válido. */
export function renovaSozinho(): boolean {
    const validade = ler("li_refresh_expira_em");
    return Boolean(ler("li_refresh_token")) && (!validade || Date.parse(validade) > Date.now());
}

/**
 * Rotina diária: renova o token quando faltam 15 dias ou menos e existe token de renovação.
 * Devolve uma frase para o registro do agendador, ou vazio se não havia nada a fazer.
 */
export async function renovarLinkedinSePreciso(agora = new Date()): Promise<string> {
    const conta = tokenDoLinkedin();
    if (!conta || !oauthConfigurado()) return "";
    const dias = Math.floor((Date.parse(conta.expira_em) - agora.getTime()) / 86400e3);
    if (dias > 15) return "";
    if (!renovaSozinho()) return dias <= 10 ? `LinkedIn: o token vence em ${Math.max(0, dias)} dias. Renove pelo painel.` : "";
    try {
        const dados = await pedirToken({ grant_type: "refresh_token", refresh_token: ler("li_refresh_token") });
        guardarRenovacao(dados);
        guardarContaDoLinkedin({ urn: conta.pessoa_urn, nome: "" }, dados.access_token, new Date(agora.getTime() + dados.expires_in * 1000));
        return "LinkedIn: token renovado sozinho.";
    } catch (e) {
        return semTokenDoLinkedin(`LinkedIn: a renovação automática falhou (${e instanceof Error ? e.message : "erro"}). Renove pelo painel.`, conta.token);
    }
}
