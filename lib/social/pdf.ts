/**
 * Monta um PDF em que cada página é uma imagem JPEG inteira. É o arquivo que o LinkedIn mostra como
 * carrossel (post de documento): uma página por vez, sem cortar. Sem biblioteca: o PDF só precisa do
 * catálogo, das páginas e das imagens, e o JPEG entra como está (filtro DCTDecode).
 */

export interface PaginaDoPdf {
    /** Bytes do JPEG, em RGB, não progressivo. */
    jpeg: Buffer;
    largura: number;
    altura: number;
}

/** Tira do título o que quebraria a cadeia de texto do PDF. */
function textoDoPdf(texto: string): string {
    return texto
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^\x20-\x7e]/g, "")
        .replace(/[\\()]/g, "")
        .slice(0, 120);
}

export function pdfDeImagens(paginas: PaginaDoPdf[], titulo: string): Buffer {
    if (paginas.length === 0) throw new Error("O PDF precisa de pelo menos uma página.");
    for (const [i, p] of paginas.entries()) {
        if (p.jpeg.length < 4 || p.jpeg[0] !== 0xff || p.jpeg[1] !== 0xd8) throw new Error(`A página ${i + 1} do PDF não é um JPEG.`);
        if (!(p.largura > 0 && p.altura > 0)) throw new Error(`A página ${i + 1} do PDF está sem medida.`);
    }

    const partes: Buffer[] = [];
    const posicoes: number[] = [];
    let tamanho = 0;
    const escrever = (dado: string | Buffer) => {
        const b = typeof dado === "string" ? Buffer.from(dado, "latin1") : dado;
        partes.push(b);
        tamanho += b.length;
    };
    const objeto = (numero: number, corpo: string, fluxo?: Buffer) => {
        posicoes[numero] = tamanho;
        escrever(`${numero} 0 obj\n${corpo}\n`);
        if (fluxo) {
            escrever("stream\n");
            escrever(fluxo);
            escrever("\nendstream\n");
        }
        escrever("endobj\n");
    };

    // 1 = catálogo, 2 = lista de páginas, 3 = dados do documento; depois, três objetos por página.
    const numeroDaPagina = (i: number) => 4 + i * 3;
    escrever("%PDF-1.4\n%\xe2\xe3\xcf\xd3\n");
    objeto(1, "<< /Type /Catalog /Pages 2 0 R >>");
    objeto(2, `<< /Type /Pages /Count ${paginas.length} /Kids [${paginas.map((_, i) => `${numeroDaPagina(i)} 0 R`).join(" ")}] >>`);
    objeto(3, `<< /Title (${textoDoPdf(titulo)}) /Author (Fabio Rugemtugem) /Creator (rugemtugem.dev) >>`);

    paginas.forEach((p, i) => {
        const pagina = numeroDaPagina(i);
        // 72 pontos por polegada: 1080 px viram 810 pontos, na mesma proporção.
        const w = Number((p.largura * 0.75).toFixed(2));
        const h = Number((p.altura * 0.75).toFixed(2));
        const desenho = Buffer.from(`q ${w} 0 0 ${h} 0 0 cm /Im0 Do Q`, "latin1");
        objeto(pagina, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${w} ${h}] /Resources << /XObject << /Im0 ${pagina + 1} 0 R >> >> /Contents ${pagina + 2} 0 R >>`);
        objeto(pagina + 1, `<< /Type /XObject /Subtype /Image /Width ${p.largura} /Height ${p.altura} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${p.jpeg.length} >>`, p.jpeg);
        objeto(pagina + 2, `<< /Length ${desenho.length} >>`, desenho);
    });

    const total = 3 + paginas.length * 3;
    const inicioDaTabela = tamanho;
    escrever(`xref\n0 ${total + 1}\n0000000000 65535 f \n`);
    for (let n = 1; n <= total; n++) escrever(`${String(posicoes[n]).padStart(10, "0")} 00000 n \n`);
    escrever(`trailer\n<< /Size ${total + 1} /Root 1 0 R /Info 3 0 R >>\nstartxref\n${inicioDaTabela}\n%%EOF\n`);
    return Buffer.concat(partes);
}
