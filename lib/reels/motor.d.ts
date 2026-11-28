/** Tipos do motor de Reels (lib/reels/motor.js), que é JavaScript puro portado do Calcula Trabalhador. */

export interface CenaDoReels {
    tipo: string;
    duracao: number;
    texto?: string;
    destaque?: string;
    titulo?: string;
    sub?: string;
    rotulo?: string;
    valor?: string;
    fonte?: string;
    url?: string;
    aviso?: string;
    tag?: string;
    nota?: string;
    itens?: (string | { titulo: string; texto?: string })[];
    a?: { rotulo: string; valor: string };
    b?: { rotulo: string; valor: string };
}

export interface RoteiroDoReels {
    /** Texto do selo no canto. Aqui é a linha de conteúdo: "Para empresas" ou "Dicas de IA". */
    trilha: string;
    eyebrow: string;
    nota: string;
    capa?: number;
    cenas: CenaDoReels[];
}

export interface DiagnosticoDoReels {
    formato: string;
    duracao: number;
    cenas: { tipo: string; ini: number; fim: number; assentado: number; altura: number; palco: number }[];
}

export const TIPOS: string[];
export const TRILHAS: { id: string; nome: string }[];
export function parseReels(texto: string): RoteiroDoReels;
export function gerarMp4(
    roteiro: RoteiroDoReels,
    largura: number,
    altura: number,
    opcoes?: { fps?: number; logoSrc?: string; onProgresso?: (feitos: number, total: number) => void; trilhaUrl?: string | null; volume?: number },
): Promise<{ mp4: Blob; capa: Blob; duracao: number; codec: string; quadros: number }>;
export function quadroPng(roteiro: RoteiroDoReels, largura: number, altura: number, t: number, opcoes?: { logoSrc?: string; badge?: boolean }): Promise<{ url: string; diagnostico: DiagnosticoDoReels }>;
