"use server";

import { readFileSync } from "node:fs";
import { revalidatePath } from "next/cache";
import sharp from "sharp";
import { exigirAdmin } from "@/lib/admin/sessao";
import { brasiliaParaUtc } from "@/lib/admin/seguranca";
import { caminhoDaMidia, salvarDocumento } from "@/lib/instagram/midia";
import { pdfDeImagens } from "@/lib/social/pdf";
import { agendarNoLinkedin, cancelarNoLinkedin, conectarLinkedin, desconectarLinkedin, tentarDeNovoNoLinkedin } from "@/lib/linkedin/fila";
import { problemasDoTexto, semTokenDoLinkedin } from "@/lib/linkedin/regras";

export interface Retorno {
    erro: string | null;
    ok: string | null;
}

export async function acaoConectarLinkedin(_anterior: Retorno, dados: FormData): Promise<Retorno> {
    await exigirAdmin();
    const token = String(dados.get("token") || "");
    try {
        const conta = await conectarLinkedin(token);
        revalidatePath("/admin/linkedin");
        return { erro: null, ok: `Perfil de ${conta.nome} conectado.` };
    } catch (e) {
        return { erro: semTokenDoLinkedin(e instanceof Error ? e.message : "Não foi possível conectar.", token), ok: null };
    }
}

export async function acaoDesconectarLinkedin(): Promise<void> {
    await exigirAdmin();
    desconectarLinkedin();
    revalidatePath("/admin/linkedin");
}

export async function acaoAgendarNoLinkedin(_anterior: Retorno, dados: FormData): Promise<Retorno> {
    await exigirAdmin();
    const titulo = String(dados.get("titulo") || "").trim().slice(0, 120);
    const texto = String(dados.get("texto") || "");
    const quando = brasiliaParaUtc(String(dados.get("quando") || ""));
    // As imagens já foram enviadas para /admin/midia. Aqui chegam só os nomes, e cada um precisa existir na pasta.
    const nomes = dados.getAll("midias").map(String);

    const problemas = problemasDoTexto(texto);
    if (!titulo) problemas.push("Dê um título para achar a publicação na fila.");
    if (!quando) problemas.push("Escolha a data e a hora.");
    if (nomes.length > 20) problemas.push("O LinkedIn aceita no máximo 20 imagens por post.");
    if (nomes.some((nome) => !caminhoDaMidia(nome))) problemas.push("Uma das imagens não chegou ao servidor. Escolha as imagens de novo.");
    if (problemas.length > 0) return { erro: problemas.join(" "), ok: null };

    try {
        // Com duas ou mais imagens e a caixa marcada, elas viram um documento: o LinkedIn mostra como carrossel, sem cortar.
        if (nomes.length >= 2 && dados.get("documento") === "sim") {
            const paginas = [];
            for (const nome of nomes) {
                const bruto = readFileSync(caminhoDaMidia(nome) as string);
                const meta = await sharp(bruto).metadata();
                paginas.push({ jpeg: await sharp(bruto).flatten({ background: "#ffffff" }).jpeg({ quality: 90, progressive: false }).toBuffer(), largura: meta.width as number, altura: meta.height as number });
            }
            const documento = salvarDocumento(pdfDeImagens(paginas, titulo), `${titulo}-linkedin`.slice(0, 40));
            agendarNoLinkedin({ titulo, texto: texto.trim(), midias: [documento], quandoUtc: quando as string });
            revalidatePath("/admin/linkedin");
            return { erro: null, ok: `Carrossel de ${nomes.length} páginas agendado.` };
        }
        agendarNoLinkedin({ titulo, texto: texto.trim(), midias: nomes, quandoUtc: quando as string });
        revalidatePath("/admin/linkedin");
        return { erro: null, ok: nomes.length > 0 ? `Post com ${nomes.length} ${nomes.length === 1 ? "imagem" : "imagens"} agendado.` : "Post de texto agendado." };
    } catch (e) {
        return { erro: e instanceof Error ? e.message : "Não foi possível agendar.", ok: null };
    }
}

export async function acaoCancelarNoLinkedin(dados: FormData): Promise<void> {
    await exigirAdmin();
    cancelarNoLinkedin(Number(dados.get("id")));
    revalidatePath("/admin/linkedin");
}

export async function acaoTentarDeNovoNoLinkedin(dados: FormData): Promise<void> {
    await exigirAdmin();
    tentarDeNovoNoLinkedin(Number(dados.get("id")));
    revalidatePath("/admin/linkedin");
}
