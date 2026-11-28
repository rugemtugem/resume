import { parseReels } from "./motor.js";
import type { CenaDoReels } from "./motor.js";

/**
 * Regras do bloco "## reels" do roteiro. O vídeo é só animação de texto, sem câmera.
 *
 *   ## reels
 *   eyebrow: Para empresas
 *   nota: Frase curta do rodapé
 *
 *   ### pergunta 4
 *   O pedido chega no WhatsApp e alguém {digita tudo de novo}?
 *
 *   ### lista 5
 *   titulo: Onde o erro aparece
 *   - Produto trocado
 *   - Quantidade errada
 *
 *   ### passos 6
 *   titulo: Antes de contratar
 *   - Onde o pedido nasce? | E onde precisa chegar
 *
 *   ### encerramento 4
 *   texto: Diagnóstico gratuito de 30 minutos
 *   url: rugemtugem.dev
 *   aviso: O link está na bio
 *
 * O número depois do tipo é a duração da cena em segundos. Chaves marcam o trecho em laranja.
 */

const TRAVESSOES = [String.fromCharCode(0x2014), String.fromCharCode(0x2013)];
const ABERTURAS = ["pergunta", "titulo", "manchete", "numero"];
const CONHECIDOS = ["titulo", "numero", "compara", "passos", "lista", "alerta", "encerramento", "manchete", "pergunta"];

function textosDaCena(c: CenaDoReels): string[] {
    const itens = (c.itens ?? []).flatMap((i) => (typeof i === "string" ? [i] : [i.titulo, i.texto ?? ""]));
    return [c.texto, c.titulo, c.sub, c.rotulo, c.valor, c.fonte, c.url, c.aviso, c.tag, c.nota, c.a?.rotulo, c.a?.valor, c.b?.rotulo, c.b?.valor, ...itens].filter((t): t is string => Boolean(t));
}

/** Duração total do vídeo, em segundos. */
export function duracaoDoReels(texto: string): number {
    return parseReels(texto).cenas.reduce((soma, c) => soma + Number(c.duracao || 0), 0);
}

/** Problemas que impedem gerar o Reels. Lista vazia quer dizer que está tudo certo. */
export function problemasDoReels(texto: string): string[] {
    const roteiro = parseReels(texto);
    const cenas = roteiro.cenas;
    const problemas: string[] = [];
    if (cenas.length < 3 || cenas.length > 10) problemas.push(`Reels: use de 3 a 10 cenas (o roteiro tem ${cenas.length}).`);
    if (cenas.length === 0) return problemas;

    const total = cenas.reduce((soma, c) => soma + Number(c.duracao || 0), 0);
    if (total < 8 || total > 60) problemas.push(`Reels: o vídeo tem ${total.toLocaleString("pt-BR")} s. Mantenha entre 8 e 60 segundos.`);
    if (!ABERTURAS.includes(cenas[0].tipo)) problemas.push("Reels: a primeira cena precisa abrir pelo assunto (pergunta, titulo, manchete ou numero).");
    const ultima = cenas[cenas.length - 1];
    if (ultima.tipo !== "encerramento") problemas.push("Reels: a última cena precisa ser o encerramento.");

    cenas.forEach((c, i) => {
        const n = `Reels, cena ${i + 1}`;
        if (!CONHECIDOS.includes(c.tipo)) {
            problemas.push(`${n}: tipo "${c.tipo}" não existe. Use ${CONHECIDOS.join(", ")}.`);
            return;
        }
        if (!(c.duracao >= 2.5 && c.duracao <= 12)) problemas.push(`${n}: duração de ${c.duracao} s. Cada cena fica entre 2,5 e 12 segundos, para dar tempo de ler.`);
        if (["pergunta", "titulo", "alerta", "manchete", "encerramento"].includes(c.tipo) && !c.texto) problemas.push(`${n}: falta o texto.`);
        if (["lista", "passos"].includes(c.tipo)) {
            const quantos = c.itens?.length ?? 0;
            const maximo = c.tipo === "lista" ? 5 : 4;
            if (quantos < 1 || quantos > maximo) problemas.push(`${n}: use de 1 a ${maximo} itens (tem ${quantos}). Com mais que isso o texto não cabe na tela.`);
        }
        if (c.tipo === "lista" && !c.titulo) problemas.push(`${n}: falta o título.`);
        if (c.tipo === "numero" && (!c.rotulo || !c.valor)) problemas.push(`${n}: preencha "rotulo:" e "valor:".`);
        if (c.tipo === "compara" && (!c.titulo || !c.a?.valor || !c.b?.valor)) problemas.push(`${n}: preencha "titulo:", "a:" e "b:".`);
        if ((c.tipo === "numero" || c.tipo === "compara") && !c.fonte) problemas.push(`${n}: todo número publicado precisa de fonte. Preencha a linha "fonte:".`);
        if (c.tipo === "encerramento" && !c.url) problemas.push(`${n}: falta a linha "url:" com o endereço do site.`);
        const tudo = textosDaCena(c).join(" ");
        if (TRAVESSOES.some((t) => tudo.includes(t))) problemas.push(`${n}: tem travessão. Troque por vírgula, ponto ou dois-pontos.`);
        if (/ferrugem/i.test(tudo)) problemas.push(`${n}: o apelido não entra em peça publicada.`);
    });
    return problemas;
}
