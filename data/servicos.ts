/** Páginas de serviço. Cada uma aponta para o caso que mostra o serviço funcionando. */
export interface Servico {
    slug: string;
    nome: string;
    /** Frase curta para cartões e descrição no Google. */
    resumo: string;
    problema: string;
    entregas: string[];
    /** Slug do caso relacionado. */
    caso: string;
}

export const SERVICOS: Servico[] = [
    {
        slug: "integracao-whatsapp-erp",
        nome: "Integração de WhatsApp com sistema de gestão",
        resumo: "O pedido fechado no WhatsApp entra sozinho no seu sistema de gestão, sem ninguém digitar de novo.",
        problema: "O cliente fecha o pedido no WhatsApp e alguém da equipe digita tudo de novo no sistema. Cada redigitação é uma chance de errar o produto, a quantidade ou o endereço, e o pedido fica parado até alguém ter tempo.",
        entregas: [
            "Ligação entre a ferramenta de atendimento no WhatsApp e o sistema de gestão.",
            "Pedido criado no sistema assim que é fechado na conversa.",
            "Atualização nos dois sentidos: o que muda de um lado aparece no outro.",
            "Registro dos pedidos que falharam, para alguém conferir.",
        ],
        caso: "ss-comercio-whatsapp-bling",
    },
    {
        slug: "integracao-site-crm",
        nome: "Integração de site com CRM e pagamento",
        resumo: "O contato que chega pelo site cai direto no CRM, e o pagamento conversa com o resto.",
        problema: "O formulário do site manda um e-mail e alguém copia o contato para o CRM. O pagamento fica em outra ferramenta. No meio do caminho, contato se perde e ninguém sabe de onde ele veio.",
        entregas: [
            "Formulários do site ligados ao CRM.",
            "Meio de pagamento ligado ao mesmo caminho.",
            "Um hub de integrações no lugar de várias ligações soltas.",
            "Páginas de captação no próprio site.",
        ],
        caso: "sales-prime-site-crm-pagamento",
    },
    {
        slug: "wordpress-sob-medida",
        nome: "WordPress sob medida",
        resumo: "Plugins e automações feitos para o processo da sua empresa, dentro do WordPress que você já usa.",
        problema: "O plugin pronto resolve o caso comum e trava no primeiro detalhe do seu processo. O resto vira planilha, cópia e cola e conferência à mão.",
        entregas: [
            "Plugin feito para o seu processo.",
            "Formulários com validação, para o dado já entrar certo.",
            "Aprovação e acompanhamento no painel do site.",
            "Documentos em PDF gerados com os dados de cada pessoa.",
            "Cuidado com a LGPD nos dados coletados.",
        ],
        caso: "campanha-21-dias-inscricoes-certificados",
    },
    {
        slug: "ia-na-operacao",
        nome: "Soluções em IA para a operação",
        resumo: "IA dentro de um sistema da sua empresa, fazendo uma parte do trabalho que hoje é manual.",
        problema: "A empresa quer usar IA e não sabe por onde começar. Uma ferramenta de conversa solta não entra no processo: ninguém sabe o que ela recebeu, o que devolveu e o que fazer com a resposta.",
        entregas: [
            "IA encaixada em um passo definido do processo.",
            "Roteiro guiado, para a pessoa informar o que a análise precisa.",
            "Resultado em formato pronto para usar, como um plano de ação.",
            "Painel para acompanhar o que foi feito.",
        ],
        caso: "prosperus-club-diagnostico-mentoria",
    },
];

export function servicoPorSlug(slug: string): Servico | undefined {
    return SERVICOS.find((servico) => servico.slug === slug);
}

export const PROCESSO = [
    "Diagnóstico gratuito de 30 minutos.",
    "Proposta em 3 a 5 dias úteis.",
    "Entregas semanais com demonstração.",
    "Lançamento e treinamento.",
    "Suporte e evolução.",
];
