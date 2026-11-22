/** Projetos da Rugemtugem fora dos quatro casos completos: sites de clientes no ar e projetos próprios. */
export interface SiteNoAr {
    nome: string;
    segmento: string;
    tipo: string;
    url: string;
    imagem: string;
}

/** Sites de clientes feitos pela Rugemtugem e que estão no ar (conferidos em 22/11/2026). */
export const SITES_NO_AR: SiteNoAr[] = [
    { nome: "Acrópole Projetos", segmento: "Arquitetura e engenharia", tipo: "Site em WordPress", url: "https://www.acropoleprojetos.com.br/", imagem: "/images/projetos/acropole-projetos.jpg" },
    { nome: "Uono Sanchez Engenharia", segmento: "Avaliação e perícia de imóveis", tipo: "Site em WordPress", url: "https://uonosanchez.com.br/", imagem: "/images/projetos/uono-sanchez.jpg" },
    { nome: "Vetor Jóias", segmento: "Joalheria", tipo: "Loja virtual em WordPress", url: "https://loja.vetorjoias.com.br/", imagem: "/images/projetos/vetor-joias.jpg" },
    { nome: "Compra de Ouro São Gonçalo", segmento: "Avaliação e compra de ouro e prata", tipo: "Site em WordPress", url: "https://compraourosg.com.br/", imagem: "/images/projetos/compra-de-ouro-sg.jpg" },
    { nome: "Marjorie Dawe", segmento: "Regnum Mariae", tipo: "Site com loja em WordPress", url: "https://marjoriedaweoficial.com.br/", imagem: "/images/projetos/marjorie-dawe.jpg" },
    { nome: "Irmãos Ribeiro", segmento: "Comércio de resíduos e transporte", tipo: "Site em WordPress", url: "https://irmaoribeiro.com/", imagem: "/images/projetos/irmaos-ribeiro.jpg" },
    { nome: "Felipe Carvalho", segmento: "Artista visual", tipo: "Site em WordPress", url: "https://felipecarvalho.art.br/", imagem: "/images/projetos/felipe-carvalho.jpg" },
    { nome: "Renderizando", segmento: "Produção de conteúdo digital", tipo: "Site em WordPress", url: "https://renderizando.com.br/", imagem: "/images/projetos/renderizando.jpg" },
];

export interface ProjetoProprio {
    nome: string;
    area: string;
    texto: string;
    /** Fato com data, quando existe. */
    fato?: string;
    url: string;
    imagem: string;
}

export const PROJETOS_PROPRIOS: ProjetoProprio[] = [
    {
        nome: "Calcula Trabalhador",
        area: "Produto web e automação de conteúdo",
        texto: "Rede de calculadoras trabalhistas e fiscais para quem é CLT, MEI, empresário ou autônomo. O blog é gerado de arquivos de texto, e uma agenda de aprovação monta carrossel, Reels e stories e publica no Instagram pela API.",
        fato: "399 testes automatizados passando em 21/11/2026.",
        url: "https://calculatrabalhador.com.br/",
        imagem: "/images/projetos/calcula-trabalhador.jpg",
    },
    {
        nome: "Calcula Imóveis",
        area: "Produto web e SEO",
        texto: "Calculadoras de aluguel, venda e financiamento, com dado estruturado para o Google desde o lançamento.",
        fato: "42 testes automatizados passando em 21/11/2026.",
        url: "https://calculaimoveis.com/",
        imagem: "/images/projetos/calcula-imoveis.jpg",
    },
    {
        nome: "Parô",
        area: "Sistema por assinatura, aplicativo instalável",
        texto: "Gestão de pátio e estacionamento, para usar no celular de quem trabalha em movimento.",
        url: "https://paro.rugemtugem.dev/",
        imagem: "/images/projetos/paro.jpg",
    },
];

export interface Passagem {
    empresa: string;
    periodo: string;
    area: string;
    texto: string;
}

/** Trabalhos dentro de empresas, como estão no currículo. */
export const PASSAGENS: Passagem[] = [
    { empresa: "Tecsa Group", periodo: "Mai/2023 a jan/2024", area: "UX/UI e front-end", texto: "Wireframes, protótipos, testes de usabilidade e landing pages com design system." },
    { empresa: "Metaverso-LivePlanet", periodo: "Set/2021 a jul/2023", area: "UI/UX e front-end", texto: "Interfaces responsivas em HTML5, CSS3 e JavaScript, com testes de compatibilidade e desempenho." },
    { empresa: "Roupateca", periodo: "Mar/2020 a abr/2023", area: "WordPress e UX", texto: "Site de aluguel de roupas, com vitrine e venda, do mapeamento de jornada à entrega." },
];

export interface Ferramenta {
    nome: string;
    texto: string;
}

export interface GrupoDeFerramentas {
    titulo: string;
    texto: string;
    itens: Ferramenta[];
}

/** Tipos de ferramenta interna que a Rugemtugem constrói para o time de uma empresa, por finalidade. */
export const FERRAMENTAS: GrupoDeFerramentas[] = [
    {
        titulo: "IA ligada aos dados da empresa",
        texto: "O time trabalha conversando com um assistente que enxerga os sistemas da casa.",
        itens: [
            { nome: "Assistente de IA ligado aos sistemas", texto: "O time pergunta em linguagem natural, no ChatGPT ou no Claude, e o assistente consulta o CRM, as conversas e as reuniões para responder." },
            { nome: "Hub de dados da jornada do cliente", texto: "Vendas, atendimento e ciclo de vida do cliente em um lugar só, com a origem de cada número e as divergências à mostra." },
            { nome: "Dossiê do cliente em uma consulta", texto: "Identidade, estágio no CRM, conversas de WhatsApp e histórico de reuniões reunidos em uma resposta só." },
        ],
    },
    {
        titulo: "Conhecimento da empresa",
        texto: "Aulas, manuais e processos deixam de ficar espalhados e passam a responder perguntas.",
        itens: [
            { nome: "Base de conhecimento pesquisável", texto: "Todo o conteúdo da casa indexado, com busca pelo sentido da pergunta, e não só pela palavra." },
            { nome: "Mapa de necessidades", texto: "A pessoa descreve a situação do cliente e a ferramenta aponta o assunto e o conteúdo que resolve." },
            { nome: "Dossiê por assunto", texto: "Para cada necessidade, os conteúdos mais indicados já separados, com o melhor ponto de partida." },
            { nome: "Resumo com indicação de uso", texto: "Cada aula ou documento ganha um resumo e a indicação de quando recomendar." },
            { nome: "Resposta com fonte e trecho literal", texto: "O assistente só responde com o que está na base, cita o título de origem e abre a transcrição quando é preciso a fala exata." },
            { nome: "Processos internos pesquisáveis", texto: "Procedimentos e regras da operação em uma base à parte, com a data da última atualização." },
        ],
    },
    {
        titulo: "Atendimento e acompanhamento",
        texto: "O que o time de atendimento fazia à mão passa a sair pronto para revisão.",
        itens: [
            { nome: "Trilha personalizada por cliente", texto: "Plano de estudo ou de ação montado para cada cliente e publicado em uma página própria, pronta para enviar." },
            { nome: "Plano dos primeiros 30 dias", texto: "Roteiro de entrada de um cliente novo, gerado a partir do que ele contou nas reuniões e revisado antes de sair." },
            { nome: "Mensagens com prévia e confirmação", texto: "O assistente escreve a mensagem de WhatsApp, mostra como vai ficar e só envia depois que uma pessoa aprova." },
            { nome: "Tarefas e lembretes por conversa", texto: "Pendências criadas, listadas e concluídas pelo assistente, direto na agenda de tarefas de cada pessoa." },
        ],
    },
];
