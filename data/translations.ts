export interface ProjectDeliverable {
    title: string;
    desc: string;
    impact: string;
}

export interface ProjectMetric {
    label: string;
    value: string;
}

export interface ProjectTestimonial {
    text: string;
    author: string;
    role: string;
    videoUrl?: string;
    videoThumbnail?: string;
}

export interface ProjectCase {
    client: string;
    industry: string;
    challenge: string;
    solution: string;
    logo: string | null;
    deliverables?: ProjectDeliverable[];
    metrics: ProjectMetric[];
    tags: string[];
    testimonial?: ProjectTestimonial;
}

export const translations = {
    pt: {
        nav: {
            home: "Início",
            about: "Sobre",
            experience: "Experiência",
            skills: "Habilidades",
            education: "Educação",
            projects: "Projetos",
            contact: "Contato",
        },
        personal: {
            name: "Fábio Rugemtugem",
            nickname: "Rugemtugem",
            title: "Especialista em Tecnologia & IA, Desenvolvedor Front-end",
            subtitle: "Especialista em Tecnologia & IA Aplicada",
            location: "São Paulo, SP",
            phone: "+55 11 9 8651-4401",
            email: "contato@rugemtugem.dev",
        },
        // --- Partnership Content ---
        hero: {
            badge: "Rugemtugem: sistemas para empresas desde novembro de 2000",
            title: "Transformo Desafios Técnicos em Resultados de Negócio",
            role: "Parceiro estratégico em tecnologia que combina liderança técnica, design e IA para criar produtos digitais que geram impacto mensurável e escalam negócios.",
            facts: [
                { strong: "399 testes", text: "automatizados passando no Calcula Trabalhador (21/11/2026)", href: "#cases" },
                { strong: "16 ferramentas", text: "no ar no Calcula Imóveis", href: "#cases" },
                { strong: "5 estrelas", text: "em 3 avaliações no Google", href: "#cases" },
            ],
            cta1: "Vamos Escalar Seu Negócio?",
            cta2: "Ver Casos de Sucesso",
        },
        about: {
            tag: "Por Que Empresas Escolhem Trabalhar Comigo",
            title: "Parceria que Gera Resultados",
            summary: "Não é sobre tecnologia pela tecnologia. É sobre usar as ferramentas certas para resolver problemas reais de negócio e criar produtos que seus clientes amam.",
            features: [
                {
                    title: "Resultados Mensuráveis, Não Apenas Código",
                    desc: "Cada projeto termina com um resultado que dá para conferir. Os casos mais abaixo mostram o que mudou em cada cliente.",
                },
                {
                    title: "Parceiro Estratégico, Não Apenas Executor",
                    desc: "Trabalho lado a lado com seu time para entender desafios de negócio e propor soluções estratégicas.",
                },
                {
                    title: "Velocidade sem Sacrificar Qualidade",
                    desc: "Uso metodologias ágeis e ferramentas de IA para entregar MVPs em semanas, não meses.",
                },
                {
                    title: "Visão 360º: Técnico, Design e Negócio",
                    desc: "Combino expertise técnica, design e visão de negócio para criar produtos estratégicos.",
                },
            ],
            stats: [
                { value: "399", label: "Testes automatizados passando", desc: "No Calcula Trabalhador, medido em 21/11/2026.", href: "#cases" },
                { value: "2000", label: "Ano em que a Rugemtugem começou", desc: "Atendendo empresas desde novembro de 2000.", href: "#experience" },
                { value: "5 estrelas", label: "Em 3 avaliações no Google", desc: "Com link para cada avaliação na seção de cases.", href: "#cases" },
                { value: "16", label: "Ferramentas no Calcula Imóveis", desc: "Rede de calculadoras imobiliárias no ar.", href: "#cases" },
            ],
        },
        contact: {
            title: "Pronto para Escalar Seu Negócio?",
            subtitle: "Vamos construir algo juntos",
            description: "Vamos conversar sobre como uma parceria estratégica pode transformar seus desafios técnicos em vantagem competitiva.",
            options: {
                consultation: { title: "Consulta Estratégica", desc: "Análise gratuita do seu desafio e roadmap de soluções." },
                proposal: { title: "Proposta Customizada", desc: "Plano detalhado com investimento e resultados esperados." },
                chat: { title: "Bate-papo Informal", desc: "WhatsApp direto para tirar dúvidas ou explorar ideias." },
            },
            name: "Nome",
            email: "E-mail",
            whatsapp: "WhatsApp",
            message: "Mensagem",
            placeholder: "Como posso ajudar seu negócio hoje?",
            send: "Enviar Mensagem",
            sending: "Enviando...",
            success: "Mensagem enviada com sucesso!",
            error: "Erro ao enviar mensagem. Tente novamente.",
            followMe: "Siga-me em:",
            instagram: "https://instagram.com/rugemtugem/",
            tip: { title: "Dica Estratégica", desc: "A maioria dos nossos projetos começa com um simples \"olá\". Não espere o momento perfeito para planejar sua escala." },
        },
        how_it_works: {
            tag: "Processo Transparente",
            title: "Como ",
            highlight: "Trabalhamos Juntos",
            description: "Processo simples, ágil e sem burocracias. Do primeiro contato ao sistema no ar, você sabe exatamente o que esperar.",
            cta: {
                title: "Pronto para Começar?",
                description: "Agende um diagnóstico gratuito de 30 minutos. Sem compromisso, sem pegadinhas.",
                primary: "Agendar Diagnóstico Gratuito",
                secondary: "Ver Casos de Sucesso"
            },
            steps: [
                {
                    number: "01",
                    title: "Diagnóstico Gratuito (30min)",
                    description: "Entendo sua dor, mapeio gargalos e apresento roadmap de soluções possíveis",
                    duration: "30 minutos",
                    deliverable: "Análise inicial + Proposta de valor",
                    iconName: "Calendar"
                },
                {
                    number: "02",
                    title: "Proposta Técnica + Comercial",
                    description: "Apresento solução detalhada com cronograma, investimento e ROI esperado",
                    duration: "3-5 dias úteis",
                    deliverable: "Documento técnico + Planilha de custos",
                    iconName: "CheckCircle"
                },
                {
                    number: "03",
                    title: "Desenvolvimento Ágil",
                    description: "Entregas semanais, validação contínua, ajustes em tempo real",
                    duration: "4-12 semanas",
                    deliverable: "Sprints semanais + Demos ao vivo",
                    iconName: "Code"
                },
                {
                    number: "04",
                    title: "Lançamento + Treinamento",
                    description: "Deploy profissional, treinamento do time e documentação completa",
                    duration: "1-2 semanas",
                    deliverable: "Sistema no ar + Time treinado",
                    iconName: "Rocket"
                },
                {
                    number: "05",
                    title: "Suporte + Evolução",
                    description: "Monitoramento contínuo, correções rápidas e novas features",
                    duration: "Contínuo",
                    deliverable: "SLA de resposta + Roadmap evolutivo",
                    iconName: "TrendingUp"
                }
            ]
        },
        faq: {
            tag: "Dúvidas Frequentes",
            title: "Perguntas ",
            highlight: "Frequentes",
            items: [
                {
                    question: "Quanto tempo leva para ter resultados?",
                    answer: "Primeiros resultados em 2-4 semanas. Sistema completo em 8-12 semanas. Trabalhamos com entregas semanais para você ver progresso constante."
                },
                {
                    question: "Quanto custa um projeto?",
                    answer: "Projetos variam dependendo do escopo. Após o diagnóstico gratuito, você recebe proposta detalhada com cronograma e ROI esperado. Sem surpresas."
                },
                {
                    question: "Preciso ter equipe técnica?",
                    answer: "Não. Eu cuido de tudo: desenvolvimento, testes, deploy e treinamento. Você só precisa validar as entregas semanais e dar feedback de negócio."
                },
                {
                    question: "E depois que o sistema estiver pronto?",
                    answer: "Você escolhe: (1) Suporte pontual quando precisar, (2) Retainer mensal para evoluções contínuas, ou (3) Treinamento para seu time assumir."
                },
                {
                    question: "Como garantir que vai funcionar?",
                    answer: "Trabalho com metodologia ágil: sprints semanais com demos ao vivo. Se algo não está funcionando, ajustamos imediatamente. Sem risco de 'surpresa' no final."
                }
            ]
        },
        success_cases: {
            title: "Casos de Sucesso",
            subtitle: "Resultados Reais de Parcerias Reais",
            description: "Empresas que confiaram em uma parceria estratégica e viram seus negócios crescerem de forma mensurável",
            items: [
                {
                    client: "Sales Prime",
                    industry: "EdTech",
                    challenge: "Escalar operações de conteúdo e captação de leads sem aumentar custos operacionais.",
                    solution: "Arquitetura WordPress escalável com 5 sistemas integrados: Vagas, Blog, Hub de Integrações e LPs de alta conversão.",
                    logo: "/images/projects/sales-prime-logo.png",
                    deliverables: [
                        { title: "Sistema de Vagas", desc: "Gestão e publicação automatizada", impact: "70% redução no tempo operacional" },
                        { title: "Hub de Integrações", desc: "HubSpot + Pagarme + Guru", impact: "Pipeline de vendas unificado" }
                    ],
                    metrics: [
                        { label: "+156% growth", value: "em leads qualificados" },
                        { label: "R$ 2M+", value: "em receita gerada" },
                    ],
                    tags: ["WordPress", "PHP", "HubSpot", "Pagarme"]
                },
                {
                    client: "Prosperus Club",
                    industry: "FinTech",
                    challenge: "Criar aplicativo de mentorias financeiras com IA e métricas em tempo real para sócios.",
                    solution: "Plataforma mobile-first com análise por IA (Gemini) e dashboard de métricas estratégicas.",
                    logo: "/images/projects/prosperus-logo.png",
                    deliverables: [
                        { title: "Sistema de Mentoria IA", desc: "Análise financeira via Gemini API", impact: "Análises em segundos vs dias" },
                        { title: "App Clube de Sócios", desc: "Módulos integrados de gestão", impact: "89% taxa de adoção imediata" }
                    ],
                    metrics: [
                        { label: "95% redução", value: "tempo de análise" },
                        { label: "NPS 85", value: "satisfação altíssima" },
                    ],
                    tags: ["React", "TypeScript", "Google Gemini", "Tailwind"]
                },
                {
                    client: "Campanha 21 Dias",
                    industry: "Social Impact",
                    challenge: "Gerenciar evento nacional com centras de inscrições e automação de certificados sob LGPD.",
                    solution: "Plugin WordPress customizado com automação de PDFs e segurança de dados em escala.",
                    logo: "/images/projects/campanha-21-dias-logo.webp",
                    deliverables: [
                        { title: "Sistema de Inscrições", desc: "Formulários inteligentes com validação", impact: "Erro zero em 500+ registros" },
                        { title: "Automação de Certificados", desc: "Geração dinâmica de PDF", impact: "Economia de 100+ horas manuais" }
                    ],
                    metrics: [
                        { label: "500+", value: "inscrições gerenciadas" },
                        { label: "100%", value: "conforme LGPD" },
                    ],
                    tags: ["PHP", "WordPress", "TCPDF", "MySQL"]
                },
                {
                    client: "S&S Comércio",
                    industry: "E-commerce",
                    challenge: "Pedidos do WhatsApp sem integração com o sistema de vendas, gerando retrabalho.",
                    solution: "Integração automatizada bidirecional Suri (WhatsApp) + Bling (ERP).",
                    logo: "/images/projects/ses.png",
                    deliverables: [
                        { title: "Integração Suri+Bling", desc: "Sincronização via Webhooks", impact: "100% automação de pedidos" }
                    ],
                    metrics: [
                        { label: "5 segundos", value: "sincronização média" },
                        { label: "0.5% erro", value: "taxa de falha mínima" },
                    ],
                    tags: ["Node.js", "Bling API", "Webhooks", "REST"]
                },
                {
                    client: "Calcula Trabalhador",
                    industry: "LegalTech",
                    challenge: "Trabalhadores precisam calcular direitos (rescisão, FGTS, CLT, MEI) sem formação jurídica ou contábil, numa rede rápida, acessível e leve em JS.",
                    solution: "Rede de calculadoras em PHP + JS ES Modules vanilla, com acessibilidade nativa do browser (ARIA, <details name>, CSS :has()) e JS reduzido ao essencial.",
                    logo: "/images/projects/calcula-trabalhador-logo.png",
                    deliverables: [
                        { title: "Suíte automatizada", desc: "Testes de regressão em toda a rede", impact: "222 testes passando" },
                        { title: "Piloto de UX (rescisão)", desc: "Protocolo de medição pré-registrado", impact: "Decisão de expansão baseada em dados" },
                    ],
                    metrics: [
                        { label: "222 testes", value: "Suíte automatizada" }, // TODO: atualizar métrica após pilot (rev. 12/08/2026)
                        { label: "Zero-JS UX", value: "Performance nativa" }, // TODO: atualizar após pilot
                    ],
                    tags: ["PHP", "JavaScript (ES Modules)", "CSS :has()", "Acessibilidade (ARIA)"]
                },
                {
                    client: "Calcula Imóveis",
                    industry: "PropTech",
                    challenge: "Cálculos imobiliários (ITBI, ganho de capital, financiamento, correção TR/IPCA) espalhados em ferramentas desatualizadas ou pagas.",
                    solution: "Rede com 16 ferramentas (15 calculadoras + simulador de ancoragem) em PHP + JS ES Modules vanilla, SEO completo (OG/JSON-LD/sitemap), AdSense lazy-loaded e LGPD básica.",
                    logo: "/images/projects/calcula-imoveis-logo.png",
                    deliverables: [
                        { title: "Cobertura técnica", desc: "Testes unitários + smoke tests", impact: "42 testes + 16/16 smoke" },
                        { title: "SEO desde o dia 1", desc: "OG, JSON-LD e sitemap estruturados", impact: "Indexação otimizada no lançamento" },
                    ],
                    metrics: [
                        { label: "16 ferramentas", value: "Rede de calculadoras" }, // TODO: atualizar métrica após lançamento
                        { label: "42 testes", value: "Cobertura técnica" }, // TODO: atualizar após lançamento
                    ],
                    tags: ["PHP", "JavaScript (ES Modules)", "SEO (JSON-LD)", "LGPD"]
                }
            ]
        },
        testimonials: {
            title: "O Que Dizem Nossos Parceiros",
            subtitle: "Avaliações no Google",
            items: [
                {
                    author: "Ericka Guimarães",
                    rating: 5,
                    text: "Fabio é um ótimo profissional, sempre solícito, responde na hora e consegue traduzir as necessidades do cliente da melhor forma. Sempre o procuro na hora de colocar um novo projeto no ar! Recomendo muito!",
                    reviewLink: "https://share.google/cVYXtY7Lk",
                    avatar: "/images/testimonials/ericka.jpg"
                },
                {
                    author: "Henri Passos",
                    rating: 5,
                    text: "Já sou cliente do Fábio há 12 anos, desde 2008 quando comecei na fotografia. Sempre solícito e fazendo mais do que é pedido. Ótimo profissional!",
                    reviewLink: "https://share.google/9qA08v8Yq",
                    avatar: "/images/testimonials/henri.jpg"
                },
                {
                    author: "uelerson santos",
                    rating: 5,
                    text: "Profissional responsável e super atencioso, se empenhou em cada detalhe até o meu site ficar do jeito que eu queria. Super indico!!!",
                    reviewLink: "https://share.google/XaPXeWlk",
                    avatar: null
                }
            ]
        },
        // --- Resume Content ---
        hero_resume: {
            greeting: "Olá, eu sou o",
            name: "Fábio Rugemtugem",
            role: "Transformo ideias em produtos digitais que vendem, com código limpo, design estratégico e Inteligência Artificial.",
            cta1: "Vamos Conversar?",
            cta2: "Ver Projetos",
        },
        about_resume: {
            title: "Sobre Mim",
            subtitle: "Seu próximo parceiro de tecnologia.",
            summary: "Nos últimos 25 anos, ajudei empresas a transformar desafios de negócio em produtos digitais que geram resultado. Combino front-end de alta performance, design centrado no usuário e IA aplicada para criar soluções que não apenas funcionam, elas convertem.",
            description: "Minha abordagem é simples: entender o seu problema antes de escrever uma linha de código. Trabalho de ponta a ponta, do Figma ao deploy, e integro inteligência artificial onde ela realmente faz diferença.",
        },
        why_hire_me: {
            title: "Por Que Me ",
            highlight: "Contratar",
            subtitle: "Diferenciais",
            reasons: [
                {
                    iconName: "Zap",
                    title: "Velocidade sem Sacrificar Qualidade",
                    description: "Metodologias ágeis + automações = MVPs em semanas, não meses"
                },
                {
                    iconName: "Users",
                    title: "Liderança Técnica Comprovada",
                    description: "Lideranças de times de 5-8 devs com entregas consistentes"
                },
                {
                    iconName: "TrendingUp",
                    title: "Visão de Negócio + Técnica",
                    description: "Não apenas executo, proponho soluções estratégicas alinhadas ao roadmap"
                },
                {
                    iconName: "Code",
                    title: "Stack Moderna e Escalável",
                    description: "Next.js 16, React 19, TypeScript, IA aplicada - tecnologias de ponta"
                }
            ]
        },
        contact_resume: {
            title: "Entre em contato comigo",
            subtitle: "Vamos conversar",
            description: "Se você tiver alguma dúvida ou preocupação, não hesite em me contatar. Estou aberto a oportunidades de trabalho que estejam alinhadas com minhas habilidades e interesses.",
            name: "Nome",
            email: "E-mail",
            whatsapp: "WhatsApp",
            message: "Mensagem",
            send: "Enviar Mensagem",
            sending: "Enviando...",
            success: "Mensagem enviada com sucesso!",
            error: "Erro ao enviar mensagem. Tente novamente.",
            followMe: "Siga-me em:",
        },
        experience: {
            subtitle: "Jornada Profissional",
            title: "Experiência Profissional",
            description: "Minha trajetória construindo soluções digitais que transformam negócios",
            current: "Atual",
            items: [
                {
                    id: "exp-1",
                    company: "Sales Prime",
                    role: "Especialista em Tecnologia & IA Desenvolvedor Front-end & UX",
                    period: "Ago/2024 a Atual",
                    duration: "1 ano e 6 meses",
                    location: "São Paulo, SP",
                    description: [
                        "Liderança técnica no desenvolvimento de produtos digitais web",
                        "Atuação estratégica entre design, tecnologia e negócio",
                        "Colaboração com squads ágeis (sprints, dailies, plannings, reviews)",
                        "Implementação de interfaces escaláveis, responsivas e performáticas",
                        "Gestão de equipe multidisciplinar e alinhamento técnico",
                    ],
                    technologies: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Figma"],
                    achievements: [
                        "Liderou redesign completo do dashboard principal",
                        "Implementou design system unificado para todos os produtos",
                    ],
                    type: "current" as const,
                },
                {
                    id: "exp-2",
                    company: "Tecsa® Group",
                    role: "UX/UI Designer & Desenvolvedor Front-end",
                    period: "Mai/2023 a Jan/2024",
                    duration: "9 meses",
                    location: "São Paulo, SP",
                    description: [
                        "Liderança de projetos digitais do conceito à entrega",
                        "Desenvolvimento de interfaces modernas e consistentes",
                        "Tradução de requisitos de negócio em soluções técnicas",
                        "Testes de usabilidade e melhoria contínua da experiência",
                        "Implementação de design systems e boas práticas de front-end",
                    ],
                    technologies: ["Next.js", "React", "Bootstrap", "Figma", "Adobe XD"],
                    type: "past" as const,
                },
                {
                    id: "exp-3",
                    company: "METAVERSO-LIVEPLANET",
                    role: "UI/UX Designer & Front-end Developer",
                    period: "Set/2021 a Jul/2023",
                    duration: "1 ano e 10 meses",
                    location: "Remoto",
                    description: [
                        "Evolução da experiência do usuário em sistemas digitais complexos",
                        "Desenvolvimento de interfaces responsivas e otimizadas",
                        "Integração entre design e código funcional",
                        "Otimização de performance e compatibilidade cross-browser",
                    ],
                    technologies: ["React", "Three.js", "WebGL", "CSS3", "JavaScript"],
                    type: "past" as const,
                },
                {
                    id: "exp-4",
                    company: "Roupateca",
                    role: "Desenvolvedor Front-end & UX Designer",
                    period: "Mar/2020 a Abr/2023",
                    duration: "3 anos e 1 mês",
                    location: "Remoto",
                    description: [
                        "Criação de plataforma digital integrada de e-commerce",
                        "Execução completa do processo de UX/UI",
                        "Implementação em WordPress com foco em escalabilidade",
                        "Simplificação de fluxos complexos para o usuário final",
                    ],
                    technologies: ["WordPress", "WooCommerce", "JavaScript", "CSS3", "PHP"],
                    type: "past" as const,
                },
                {
                    id: "exp-5",
                    company: "Rugemtugem Comunicação",
                    role: "Desenvolvedor Web & UX Designer",
                    period: "Nov/2000 a Atual",
                    duration: "25+ anos",
                    location: "São Paulo, SP",
                    description: [
                        "Desenvolvimento de soluções digitais para múltiplos segmentos",
                        "Criação de produtos sob medida com foco em resultado",
                        "Atuação full-stack com tecnologias web modernas",
                        "Relacionamento contínuo com clientes e visão de negócio",
                    ],
                    technologies: ["HTML", "CSS", "JavaScript", "React", "PHP", "MySQL", "WordPress"],
                    type: "current" as const,
                },
            ],
        },
        skills: {
            title: "Habilidades",
            technology: "Tecnologia",
            ux: "UX/UI Design",
            ai: "IA & Automação",
            tools: "Ferramentas",
        },
        education: {
            subtitle: "Formação Acadêmica",
            title: "Educação",
            description: "Investimento contínuo em conhecimento formal e certificações profissionais",
            items: [
                {
                    id: "edu-1",
                    degree: "Análise e Desenvolvimento de Sistemas",
                    institution: "Estácio",
                    location: "São Paulo, SP",
                    period: "2020 a 2023",
                    description: "Graduação tecnológica com foco em desenvolvimento de software, banco de dados, redes e engenharia de sistemas.",
                    type: "graduation" as const,
                    status: "completed" as const,
                },
                {
                    id: "edu-2",
                    degree: "Design Centrado no Usuário",
                    institution: "PUCRS",
                    location: "Online",
                    period: "2022",
                    description: "Curso de extensão focado em metodologias de Design Thinking, pesquisa com usuários e prototipagem de soluções centradas no usuário.",
                    highlights: [
                        "Design Thinking e pesquisa com usuários",
                        "Prototipagem e testes de usabilidade",
                    ],
                    type: "postgrad" as const,
                    status: "completed" as const,
                },
                {
                    id: "edu-3",
                    degree: "JavaScript Profissional",
                    institution: "EBAC",
                    location: "Online",
                    period: "2021",
                    description: "Formação intensiva em JavaScript moderno, ES6+, programação assíncrona e boas práticas de desenvolvimento.",
                    type: "certification" as const,
                    status: "completed" as const,
                },
                {
                    id: "edu-4",
                    degree: "UX/UI: Fundamentos de Interface",
                    institution: "USP",
                    location: "São Paulo, SP",
                    period: "2021",
                    description: "Curso focado em princípios de usabilidade, heurísticas de Nielsen, wireframing e design de interfaces.",
                    highlights: [
                        "Heurísticas de Nielsen e avaliação de usabilidade",
                        "Wireframing e prototipagem de alta fidelidade",
                    ],
                    type: "certification" as const,
                    status: "completed" as const,
                },
            ],
        },
        projects: {
            title: "Projetos",
            role: "Função",
            tools: "Tecnologias",
            items: [
                {
                    name: "Sales Prime - Tecnologia - IA - Front-end",
                    tools: ["React", "TypeScript", "Tailwind CSS"],
                    description: "Liderança técnica no desenvolvimento de produtos digitais web com atuação estratégica entre design, tecnologia e negócio. Colaboração com squads ágeis (sprints, dailies, plannings, reviews) e implementação de interfaces escaláveis, responsivas e performáticas.",
                    myRole: "Especialista em Tecnologia & IA, Desenvolvedor Front-end",
                },
                {
                    name: "Prosperus Club: Diagnóstico de Mentoria High-Ticket",
                    tools: ["React 19", "TypeScript", "Tailwind CSS", "Framer Motion", "Express.js", "SQLite", "Google Gemini AI"],
                    description: "Sistema de diagnóstico interativo com IA integrada (Google Gemini) que guia mentores através de 4 módulos estruturados para empacotar conhecimento em oferta high-ticket. Inclui autenticação via HubSpot CRM, painel administrativo em tempo real e plano de ação gerado por IA.",
                    myRole: "Full-stack Developer & AI Integrator",
                },
                {
                    name: "Tecsa Group - Portal Corporativo",
                    tools: ["Next.js", "React", "Bootstrap"],
                    description: "Liderança de projetos digitais do conceito à entrega. Desenvolvimento de interfaces modernas e consistentes, tradução de requisitos de negócio em soluções técnicas, e implementação de design systems com boas práticas de front-end.",
                    myRole: "UX/UI Designer & Front-end",
                },
                {
                    name: "LivePlanet - Metaverso",
                    tools: ["React", "Three.js", "WebGL"],
                    description: "Evolução da experiência do usuário em sistemas digitais complexos. Desenvolvimento de interfaces responsivas e otimizadas com integração entre design e código funcional, focando em performance e compatibilidade cross-browser.",
                    myRole: "UI/UX Designer & Developer",
                },
                {
                    name: "Roupateca - E-commerce",
                    tools: ["WordPress", "WooCommerce", "JavaScript"],
                    description: "Criação de plataforma digital integrada de e-commerce com execução completa do processo de UX/UI. Implementação em WordPress com foco em escalabilidade e simplificação de fluxos complexos para o usuário final.",
                    myRole: "Full Stack Developer",
                },
                {
                    name: "Campanha 21 Dias - WordPress Plugin",
                    tools: ["WordPress", "PHP", "Dompdf", "JavaScript", "MySQL"],
                    description: "Plugin WordPress para gerenciamento de atividades da Campanha 21 Dias de Ativismo Contra o Racismo. Sistema completo com formulário de inscrição, aprovação administrativa, exportação XLS e geração de PDF personalizado com Dompdf.",
                    myRole: "Full-stack Developer",
                },
                {
                    name: "Bling-Suri Integration (N8N Migration)",
                    tools: ["N8N", "Docker", "OAuth2", "REST API", "Webhooks"],
                    description: "Migração de integração PHP para N8N (no-code automation). Sistema de sincronização bidirecional entre Bling ERP e Suri Chatbot com OAuth2, webhooks, e workflows visuais para automação de produtos e pedidos.",
                    myRole: "Integration Architect & DevOps",
                },
                {
                    name: "Site Disstantes - Banda Oficial",
                    tools: ["HTML5", "CSS3", "JavaScript", "YouTube API", "Spotify Embed"],
                    description: "Website one-page para banda de rock com design moderno e efeitos visuais glitch/corrupção. Inclui carrossel de vídeos YouTube, integração Spotify, seção de agenda de shows e formulário de contato.",
                    myRole: "Front-end Developer & UI Designer",
                },
                {
                    name: "Calcula Trabalhador: Rede de Calculadoras Trabalhistas",
                    tools: ["PHP", "JavaScript (ES Modules)", "CSS :has()", "ARIA"],
                    description: "Rede de calculadoras trabalhistas (rescisão, FGTS, CLT, MEI) em PHP e JS vanilla, com foco em performance e acessibilidade nativa do browser. 222 testes automatizados e experimento de UX pré-registrado para decisões baseadas em dados.",
                    myRole: "Full-stack Developer & Product Engineer",
                },
                {
                    name: "Calcula Imóveis: Rede de Ferramentas Imobiliárias",
                    tools: ["PHP", "JavaScript (ES Modules)", "SEO/JSON-LD", "LGPD"],
                    description: "Rede com 16 ferramentas (15 calculadoras + simulador de ancoragem) para ITBI, ganho de capital, financiamento e correção TR/IPCA. SEO estruturado (OG/JSON-LD/sitemap), AdSense lazy-loaded e LGPD básica. 42 testes unitários + 16/16 smoke tests.",
                    myRole: "Full-stack Developer & Product Engineer",
                },
            ],
        },
    },
} as const;

export type Language = "pt";
