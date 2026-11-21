import { translations } from "@/data/translations";
import type { ProjectCase } from "@/data/translations";

/** Casos de cliente com página própria. O conteúdo vem do mesmo lugar que a seção de casos da home. */
export interface Caso {
    slug: string;
    client: string;
    /** O que passou a acontecer sozinho. Vai no título da página. */
    titulo: string;
    /** Descrição para o Google. */
    resumo: string;
    /** Serviço ligado ao caso. */
    servico: string;
}

export const CASOS: Caso[] = [
    {
        slug: "ss-comercio-whatsapp-bling",
        client: "S&S Comércio",
        titulo: "pedido do WhatsApp direto no Bling",
        resumo: "Os pedidos fechados no WhatsApp eram digitados de novo no sistema de vendas. A Rugemtugem ligou a Suri ao Bling e o pedido passou a entrar sozinho.",
        servico: "integracao-whatsapp-erp",
    },
    {
        slug: "sales-prime-site-crm-pagamento",
        client: "Sales Prime",
        titulo: "site ligado ao CRM e ao pagamento",
        resumo: "Site WordPress da Sales Prime com vagas, blog e páginas de captação, ligado a HubSpot, Pagar.me e Guru em um hub de integrações.",
        servico: "integracao-site-crm",
    },
    {
        slug: "campanha-21-dias-inscricoes-certificados",
        client: "Campanha 21 Dias",
        titulo: "inscrições e certificados automáticos",
        resumo: "Plugin WordPress para a Campanha 21 Dias: inscrição com validação, aprovação no painel e certificado em PDF gerado para cada participante.",
        servico: "wordpress-sob-medida",
    },
    {
        slug: "prosperus-club-diagnostico-mentoria",
        client: "Prosperus Club",
        titulo: "diagnóstico de mentoria com IA",
        resumo: "Sistema de diagnóstico em 4 módulos para mentores do Prosperus Club, com análise por IA, painel administrativo e plano de ação gerado por IA.",
        servico: "ia-na-operacao",
    },
];

export function detalhesDoCaso(client: string): ProjectCase {
    const itens = translations.pt.success_cases.items as unknown as ProjectCase[];
    const achado = itens.find((item) => item.client === client);
    if (!achado) throw new Error(`Caso sem dados: ${client}`);
    return achado;
}

export function casoPorSlug(slug: string): Caso | undefined {
    return CASOS.find((caso) => caso.slug === slug);
}

export function slugDoCliente(client: string): string | undefined {
    return CASOS.find((caso) => caso.client === client)?.slug;
}
