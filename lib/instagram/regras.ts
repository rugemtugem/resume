/**
 * Regras puras do Instagram: nome de arquivo de mídia, validação de legenda e leitura de status.
 * Sem acesso a banco nem a rede, para poder ser testado direto.
 */

/** Nome de mídia aceito na pasta pública: letras minúsculas, números e hífen, com extensão conhecida. */
export const NOME_DE_MIDIA = /^[a-z0-9-]{1,80}\.(jpg|png|mp4)$/;

export const TIPOS_DE_MIDIA: Record<string, string> = {
    jpg: "image/jpeg",
    png: "image/png",
    mp4: "video/mp4",
};

export type TipoDePost = "imagem" | "carrossel";

/** Travessão longo e médio, escritos pelo código para este arquivo não conter o próprio caractere. */
const TRAVESSOES = [String.fromCharCode(0x2014), String.fromCharCode(0x2013)];

/** Problemas da legenda que impedem o agendamento. Lista vazia quer dizer que está tudo certo. */
export function problemasDaLegenda(legenda: string): string[] {
    const problemas: string[] = [];
    const texto = legenda.trim();
    if (texto.length === 0) problemas.push("A legenda está vazia.");
    if (texto.length > 2200) problemas.push(`A legenda tem ${texto.length} caracteres. O limite do Instagram é 2.200.`);
    const hashtags = texto.match(/#[\p{L}\p{N}_]+/gu) ?? [];
    if (hashtags.length > 30) problemas.push(`A legenda tem ${hashtags.length} hashtags. O limite é 30.`);
    if (hashtags.some((h) => /ferrugem/i.test(h))) problemas.push("Tire a hashtag com \"ferrugem\": a busca é dominada pelo cantor e pela doença de planta.");
    if (TRAVESSOES.some((t) => texto.includes(t))) problemas.push("A legenda tem travessão. Troque por vírgula, ponto ou dois-pontos.");
    return problemas;
}

/** Quantidade de imagens aceita por tipo de post. */
export function problemasDasMidias(tipo: TipoDePost, quantidade: number): string[] {
    if (tipo === "imagem" && quantidade !== 1) return ["Post de imagem precisa de exatamente 1 imagem."];
    if (tipo === "carrossel" && (quantidade < 2 || quantidade > 10)) return [`Carrossel precisa de 2 a 10 imagens (vieram ${quantidade}).`];
    return [];
}

/** Tira o token de qualquer texto antes de ele virar erro, registro ou tela. */
export function semToken(texto: string, token = ""): string {
    let limpo = texto;
    if (token) limpo = limpo.split(token).join("[token]");
    return limpo.replace(/(IGAA|EAA)[A-Za-z0-9_-]{10,}/g, "[token]").replace(/access_token=[^&\s"]+/g, "access_token=[token]");
}

/**
 * Trava de segurança: fora de produção, a API só pode apontar para um endereço local.
 * Assim um arquivo de ambiente errado em localhost nunca publica de verdade.
 */
export type TipoDeToken = "instagram" | "facebook";

/**
 * A Meta tem dois jeitos de ligar um app ao Instagram, e cada um gera um token de um tipo:
 * o "login do Instagram" (token IGAA, servidor graph.instagram.com) e o "login unificado" dos apps
 * mais novos (token EAA, servidor graph.facebook.com). Os caminhos de publicar e de ler são os mesmos.
 */
export function tipoDoToken(token: string): TipoDeToken {
    return token.trim().startsWith("IGAA") ? "instagram" : "facebook";
}

/** Data usada quando a validade do token não pode ser lida: quem define é a configuração do app na Meta. */
export const VALIDADE_DESCONHECIDA = "9999-12-31T00:00:00.000Z";

export function baseDaGraph(env: { NODE_ENV?: string; IG_GRAPH_BASE?: string }, tipo: TipoDeToken = "instagram"): { base: string; falsa: boolean } {
    const configurada = (env.IG_GRAPH_BASE || "").replace(/\/+$/, "");
    const local = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(configurada);
    if (env.NODE_ENV !== "production") {
        if (!local) throw new Error("Fora de produção, IG_GRAPH_BASE precisa apontar para a API falsa em localhost.");
        return { base: configurada, falsa: true };
    }
    // Em produção, uma variável apontando para outro servidor é ignorada: o token nunca sai para um endereço que não seja o da Meta.
    return { base: local ? configurada : tipo === "facebook" ? "https://graph.facebook.com" : "https://graph.instagram.com", falsa: local };
}
