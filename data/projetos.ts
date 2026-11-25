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

/** Frase com links para a fonte: trechos de texto e trechos com endereço. */
export type Referencia = (string | { texto: string; url: string })[];

export interface GrupoDeFerramentas {
    titulo: string;
    texto: string;
    referencia?: Referencia;
    itens: Ferramenta[];
}

/**
 * O Prosperus Club e a liga de clubes de mentoria da qual ele faz parte.
 * Fonte da posição: Empreenda Revista, 06/10/2026 (28ª posição em agosto de 2025, primeiro lugar em agosto de 2026).
 */
export const MLS: Referencia = [
    "Em uso no Prosperus Club, que foi do 28º ao 1º lugar no ranking da ",
    { texto: "Mentoring League Society (MLS)", url: "https://mlsociety.co/" },
    ", a liga de clubes de mentoria, em um ano: de agosto de 2025 a agosto de 2026, segundo a ",
    { texto: "Empreenda Revista", url: "https://empreendarevista.com.br/artigos/prosperus-club-a-estrategia-que-levou-ao-topo-da-mls/" },
    ".",
];

/**
 * Tipos de sistema que a Rugemtugem constrói, por finalidade.
 * Só entra aqui o que foi construído pelo Fábio. Ferramentas feitas por outras pessoas ficam de fora.
 */
export const FERRAMENTAS: GrupoDeFerramentas[] = [
    {
        titulo: "Para mentores e para quem dá mentoria",
        texto: "Sistemas para clubes e programas de mentoria: do diagnóstico do mentor ao acompanhamento de cada mentorado.",
        referencia: MLS,
        itens: [
            { nome: "Diagnóstico com IA para o mentor", texto: "Roteiro em módulos que ajuda o mentor a transformar o que sabe em uma oferta, com plano de ação gerado por IA." },
            { nome: "Aplicativo do clube ou do programa", texto: "Cada mentorado tem o seu acesso: agenda dos encontros, conteúdos, benefícios e a comunidade do grupo." },
            { nome: "Trilha personalizada do mentorado", texto: "A sequência de aulas e tarefas indicada para cada pessoa aparece na tela dela, pronta para seguir." },
            { nome: "Jornada dos primeiros 30 dias", texto: "O plano de entrada do mentorado novo, com as etapas à vista para ele e para quem acompanha." },
            { nome: "Medição de crescimento", texto: "Coleta periódica dos números do negócio do mentorado, para mostrar o retorno da mentoria ao longo do tempo." },
            { nome: "Encontros e presença", texto: "Convite, confirmação e check-in dos encontros, com a presença registrada no CRM." },
        ],
    },
    {
        titulo: "Aplicativo para clientes e membros",
        texto: "Um aplicativo instalável no celular, sem passar pela loja, com a marca da empresa.",
        itens: [
            { nome: "Aplicativo instalável", texto: "Abre pelo navegador, instala por link ou QR code e se atualiza sozinho, com o consentimento de quem usa." },
            { nome: "Agenda, eventos e check-in", texto: "Confirmação de presença, ingresso, check-in na entrada e convite que cai direto na agenda de cada pessoa." },
            { nome: "Avisos no celular", texto: "Notificações que levam a pessoa para a tela certa do aplicativo: evento, novidade, aniversário, benefício parado." },
            { nome: "Diretório e comunidade", texto: "Perfil de cada membro, busca, conversa, indicações de negócio e ranking." },
            { nome: "Benefícios e conteúdos", texto: "Vitrine de benefícios, notícias, galeria e arquivos, com favoritos e busca." },
        ],
    },
    {
        titulo: "Área de ensino",
        texto: "Aulas e trilhas dentro do mesmo aplicativo, para o cliente e para o time dele.",
        itens: [
            { nome: "Catálogo de aulas", texto: "Módulos, busca, continuar de onde parou, favoritos e avaliações." },
            { nome: "Trilhas por pessoa e por time", texto: "Sequência de aulas montada para cada cliente ou para a equipe inteira, com acompanhamento do líder." },
            { nome: "Aulas ao vivo e certificados", texto: "Transmissão dentro do aplicativo e certificado emitido ao concluir." },
            { nome: "Acesso para funcionários", texto: "O dono libera a equipe, cada pessoa entra por link e o líder vê o progresso do time." },
        ],
    },
    {
        titulo: "Painel administrativo",
        texto: "A equipe da empresa cuida do aplicativo sem depender de programador.",
        itens: [
            { nome: "Gestão de conteúdo e pessoas", texto: "Notícias, eventos, banners, benefícios, membros e suporte em um painel só." },
            { nome: "Funções e permissões", texto: "Cada pessoa da equipe enxerga e altera só o que a função dela permite." },
            { nome: "Números de uso e relatórios", texto: "Quem acessa, o que usa e o que parou de usar, fechados todo dia." },
            { nome: "Registro de auditoria", texto: "Cada alteração feita no painel fica registrada, com quem fez e quando." },
            { nome: "Acompanhamento do atendimento", texto: "Carteira de clientes por responsável, plano dos primeiros 30 dias e tempo de resposta do atendimento." },
        ],
    },
    {
        titulo: "Integrações e rotinas automáticas",
        texto: "O aplicativo conversa com os outros sistemas da empresa e trabalha sozinho de madrugada.",
        itens: [
            { nome: "CRM nos dois sentidos", texto: "O que muda no CRM chega ao aplicativo, e o que acontece no aplicativo volta para o CRM. Presença em evento vira reunião registrada." },
            { nome: "Rotinas agendadas", texto: "Tarefas que rodam em horário marcado: decidir quem tem acesso, enviar avisos, reenviar o que falhou, limpar o que venceu." },
            { nome: "Entrada segura de outras ferramentas", texto: "Sistemas de fora entregam o resultado pronto ao aplicativo por um canal assinado, sem acesso ao banco." },
            { nome: "Login único", texto: "Uma entrada só para todas as áreas, com acesso decidido pela situação do cliente." },
        ],
    },
    {
        titulo: "Ferramentas de apoio",
        texto: "Sistemas pequenos que tiram um trabalho repetido da frente do time.",
        itens: [
            { nome: "Gerador de links rastreados", texto: "O time comercial monta o link de campanha no padrão certo, sem errar a origem." },
            { nome: "Plugin de vagas para WordPress", texto: "O RH publica e gerencia vagas dentro do site da empresa." },
            { nome: "Calculadora de preço", texto: "Precificação de produto ou serviço com as regras da casa." },
            { nome: "Cofre de senhas da equipe", texto: "Acessos da empresa guardados em um lugar só, com controle de quem vê." },
        ],
    },
];

/** Prova com data, sem citar o cliente. Fonte: medição do repositório em 25/11/2026. */
export const PROVA_DO_APLICATIVO = "O maior aplicativo que construí tem 95 módulos, 7.170 testes automatizados e 173 versões publicadas (medido em 25/11/2026).";
