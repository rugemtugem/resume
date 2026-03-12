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
            name: "Fábio Soares",
            nickname: "Ferrugem",
            title: "Especialista em Tecnologia & IA, Desenvolvedor Front-end",
            subtitle: "Especialista em Tecnologia & IA Aplicada",
            location: "São Paulo – SP",
            phone: "+55 11 9 8651-4401",
            email: "contato@rugemtugem.dev",
        },
        // --- Partnership Content ---
        hero: {
            badge: "Parceiro de 50+ empresas em crescimento",
            title: "Transformo Desafios Técnicos em Resultados de Negócio",
            role: "Parceiro estratégico em tecnologia que combina liderança técnica, design e IA para criar produtos digitais que geram impacto mensurável e escalam negócios.",
            metrics: {
                roi: "+40% ROI médio para clientes",
                value: "R$ 5M+ em valor gerado",
                satisfaction: "95% taxa de satisfação",
            },
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
                    desc: "Meus clientes não apenas recebem código bonito — eles veem crescimento real: +40% em conversões, redução de 60% no time-to-market.",
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
                { value: "+40%", label: "ROI Médio dos Clientes", desc: "Retorno mensurável em até 6 meses." },
                { value: "R$ 5M+", label: "Em Valor Gerado para Parceiros", desc: "Produtos que ajudaram empresas a crescer e escalar." },
                { value: "95%", label: "Taxa de Satisfação", desc: "Parcerias de longo prazo baseadas em confiança." },
                { value: "50+", label: "Empresas Cresceram Conosco", desc: "De startups a empresas consolidadas." },
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
                    logo: "/images/projects/sales-prime-logo.svg",
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
                    logo: "/images/projects/prosperus-logo.svg",
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
                    logo: null,
                    deliverables: [
                        { title: "Integração Suri+Bling", desc: "Sincronização via Webhooks", impact: "100% automação de pedidos" }
                    ],
                    metrics: [
                        { label: "5 segundos", value: "sincronização média" },
                        { label: "0.5% erro", value: "taxa de falha mínima" },
                    ],
                    tags: ["Node.js", "Bling API", "Webhooks", "REST"]
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
            name: "Fábio Soares",
            role: "Transformo ideias em produtos digitais que vendem — com código limpo, design estratégico e Inteligência Artificial.",
            cta1: "Vamos Conversar?",
            cta2: "Ver Projetos",
        },
        about_resume: {
            title: "Sobre Mim",
            subtitle: "Seu próximo parceiro de tecnologia.",
            summary: "Nos últimos 25 anos, ajudei empresas a transformar desafios de negócio em produtos digitais que geram resultado. Combino front-end de alta performance, design centrado no usuário e IA aplicada para criar soluções que não apenas funcionam — elas convertem.",
            description: "Minha abordagem é simples: entender o seu problema antes de escrever uma linha de código. Trabalho de ponta a ponta — do Figma ao deploy — e integro inteligência artificial onde ela realmente faz diferença.",
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
                    period: "Ago/2024 – Atual",
                    duration: "1 ano e 6 meses",
                    location: "São Paulo – SP",
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
                    period: "Mai/2023 – Jan/2024",
                    duration: "9 meses",
                    location: "São Paulo – SP",
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
                    period: "Set/2021 – Jul/2023",
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
                    period: "Mar/2020 – Abr/2023",
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
                    period: "Nov/2000 – Atual",
                    duration: "25+ anos",
                    location: "São Paulo – SP",
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
                    period: "2020 – 2023",
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
                    name: "Prosperus Club — Diagnóstico de Mentoria High-Ticket",
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
            ],
        },
    },
    en: {
        nav: {
            home: "Home",
            about: "About",
            experience: "Experience",
            skills: "Skills",
            education: "Education",
            projects: "Projects",
            contact: "Contact",
        },
        personal: {
            name: "Fábio Soares",
            nickname: "Ferrugem",
            title: "Technology & AI Specialist, Front-end Developer",
            subtitle: "Technology & Applied AI Specialist",
            location: "São Paulo – SP",
            phone: "+55 11 9 8651-4401",
            email: "contact@rugemtugem.dev",
        },
        // --- Partnership Content ---
        hero: {
            badge: "Partner to 50+ growing companies",
            title: "I turn technical challenges into business results",
            role: "Strategic technology partner combining technical leadership, design, and AI to create digital products that generate measurable impact and scale businesses.",
            metrics: {
                roi: "+40% average ROI for clients",
                value: "R$ 5M+ in value generated",
                satisfaction: "95% satisfaction rate",
            },
            cta1: "Let's Scale Your Business?",
            cta2: "View Success Cases",
        },
        about: {
            tag: "Why Companies Choose to Work With Me",
            title: "Partnership that Drives Results",
            summary: "It's not about technology for technology's sake. It's about using the right tools to solve real business problems and create products your customers love.",
            features: [
                {
                    title: "Measurable Results, Not Just Code",
                    desc: "My clients don't just get beautiful code — they see real growth: +40% in conversions, 60% reduction in time-to-market.",
                },
                {
                    title: "Strategic Partner, Not Just Executor",
                    desc: "I work alongside your team to understand business challenges and propose strategic solutions.",
                },
                {
                    title: "Speed without Sacrificing Quality",
                    desc: "I use agile methodologies and AI tools to deliver MVPs in weeks, not months.",
                },
                {
                    title: "360º Vision: Tech, Design, and Business",
                    desc: "I combine technical expertise, design, and business vision to create strategic products.",
                },
            ],
            stats: [
                { value: "+40%", label: "Average ROI for Clients", desc: "Measurable return within 6 months." },
                { value: "R$ 5M+", label: "In Value Generated for Partners", desc: "Products that helped companies grow and scale." },
                { value: "95%", label: "Satisfaction Rate", desc: "Long-term partnerships based on trust." },
                { value: "50+", label: "Companies Grown With Us", desc: "From startups to established companies." },
            ],
        },
        contact: {
            title: "Ready to Scale Your Business?",
            subtitle: "Let's build something together",
            description: "Let's talk about how a strategic partnership can transform your technical challenges into a competitive advantage.",
            options: {
                consultation: { title: "Strategic Consultation", desc: "Free analysis of your challenge and solution roadmap." },
                proposal: { title: "Custom Proposal", desc: "Detailed plan with investment and expected results." },
                chat: { title: "Informal Chat", desc: "Direct WhatsApp to answer questions or explore ideas." },
            },
            name: "Name",
            email: "Email",
            whatsapp: "WhatsApp",
            message: "Message",
            placeholder: "How can I help your business today?",
            send: "Send Message",
            sending: "Sending...",
            success: "Message sent successfully!",
            error: "Error sending message. Please try again.",
            followMe: "Follow me on:",
            instagram: "https://instagram.com/rugemtugem/",
            tip: { title: "Strategic Tip", desc: "Most of our projects start with a simple \"hello\". Don't wait for the perfect moment to plan your scale." },
        },
        success_cases: {
            title: "Success Cases",
            subtitle: "Real Results from Real Partnerships",
            description: "Companies that trusted in a strategic partnership and saw their businesses grow measurably",
            items: [
                {
                    client: "Sales Prime",
                    industry: "EdTech",
                    challenge: "Scale content operations and lead capture without increasing operational costs.",
                    solution: "Scalable WordPress architecture with 5 integrated systems: Vacancies, Blog, CRM Hub, and high-conversion LPs.",
                    logo: "/images/projects/sales-prime-logo.svg",
                    deliverables: [
                        { title: "Vacancy System", desc: "Automated management & publishing", impact: "70% reduction in operational time" },
                        { title: "Integration Hub", desc: "HubSpot + Pagarme + Guru", impact: "Unified sales pipeline" }
                    ],
                    metrics: [
                        { label: "+156% growth", value: "in qualified leads" },
                        { label: "R$ 2M+", value: "in generated revenue" },
                    ],
                    tags: ["WordPress", "PHP", "HubSpot", "Pagarme"]
                },
                {
                    client: "Prosperus Club",
                    industry: "FinTech",
                    challenge: "Create a financial mentorship app with AI and real-time metrics for partners.",
                    solution: "Mobile-first platform with AI analysis (Gemini) and strategic metrics dashboard.",
                    logo: "/images/projects/prosperus-logo.svg",
                    deliverables: [
                        { title: "AI Mentoring System", desc: "Financial analysis via Gemini API", impact: "Analysis in seconds vs days" },
                        { title: "Member Club App", desc: "Integrated management modules", impact: "89% immediate adoption rate" }
                    ],
                    metrics: [
                        { label: "95% reduction", value: "analysis time" },
                        { label: "NPS 85", value: "extremely high satisfaction" },
                    ],
                    tags: ["React", "TypeScript", "Google Gemini", "Tailwind"]
                },
                {
                    client: "21 Days Campaign",
                    industry: "Social Impact",
                    challenge: "Manage national event with hundreds of registrations and certificate automation under LGPD.",
                    solution: "Custom WordPress plugin with PDF automation and data security at scale.",
                    logo: "/images/projects/campanha-21-dias-logo.webp",
                    deliverables: [
                        { title: "Registration System", desc: "Smart forms with validation", impact: "Zero errors in 500+ records" },
                        { title: "Certificate Automation", desc: "Dynamic PDF generation", impact: "Saved 100+ manual hours" }
                    ],
                    metrics: [
                        { label: "500+", value: "managed registrations" },
                        { label: "100%", value: "LGPD compliant" },
                    ],
                    tags: ["PHP", "WordPress", "TCPDF", "MySQL"]
                },
                {
                    client: "S&S Comércio",
                    industry: "E-commerce",
                    challenge: "WhatsApp orders without CRM integration, causing manual rework.",
                    solution: "Automated bidirectional integration Suri (WhatsApp) + Bling (ERP).",
                    logo: null,
                    deliverables: [
                        { title: "Suri+Bling Integration", desc: "Sync via Webhooks", impact: "100% order automation" }
                    ],
                    metrics: [
                        { label: "5 seconds", value: "average synchronization" },
                        { label: "0.5% error", value: "minimal failure rate" },
                    ],
                    tags: ["Node.js", "Bling API", "Webhooks", "REST"]
                }
            ]
        },
        testimonials: {
            title: "What Our Partners Say",
            subtitle: "Google Reviews",
            items: [
                {
                    author: "Ericka Guimarães",
                    rating: 5,
                    text: "Fabio is a great professional, always helpful, responds immediately and manages to translate the client's needs in the best way. I always look for him when putting a new project live! Highly recommend!",
                    reviewLink: "https://share.google/cVYXtY7Lk",
                    avatar: "/images/testimonials/ericka.jpg"
                },
                {
                    author: "Henri Passos",
                    rating: 5,
                    text: "I've been Fabio's client for 12 years, since 2008 when I started in photography. Always helpful and doing more than what is asked. Great professional!",
                    reviewLink: "https://share.google/9qA08v8Yq",
                    avatar: "/images/testimonials/henri.jpg"
                },
                {
                    author: "uelerson santos",
                    rating: 5,
                    text: "Responsible and super attentive professional, he worked hard on every detail until my site was the way I wanted it. Super recommend!!!",
                    reviewLink: "https://share.google/XaPXeWlk",
                    avatar: null
                }
            ]
        },
        // --- Resume Content ---
        hero_resume: {
            greeting: "Hi, I'm",
            name: "Fábio Soares",
            role: "I transform ideas into digital products that sell — with clean code, strategic design, and Artificial Intelligence.",
            cta1: "Let's Talk?",
            cta2: "View Projects",
        },
        about_resume: {
            title: "ABOUT ME",
            subtitle: "Your next technology partner.",
            summary: "Over the last 25 years, I've helped companies transform business challenges into digital products that deliver results. I combine high-performance front-end, user-centered design, and applied AI to create solutions that don't just work — they convert.",
            description: "My approach is simple: understand your problem before writing a single line of code. I work end-to-end — from Figma to deploy — and integrate artificial intelligence where it truly makes a difference.",
        },
        contact_resume: {
            title: "Get in touch",
            subtitle: "Let's talk",
            description: "If you have any questions or concerns, please don't hesitate to contact me. I am open to any work opportunities that align with my skills and interests.",
            name: "Name",
            email: "Email",
            whatsapp: "WhatsApp",
            message: "Message",
            send: "Send Message",
            sending: "Sending...",
            success: "Message sent successfully!",
            error: "Error sending message. Please try again.",
            followMe: "Follow me on:",
        },
        experience: {
            subtitle: "Professional Journey",
            title: "Professional Experience",
            description: "My path building digital solutions that transform businesses",
            current: "Current",
            items: [
                {
                    id: "exp-1",
                    company: "Sales Prime",
                    role: "Technology & AI Specialist | Front-end & UX Developer",
                    period: "Aug/2024 – Current",
                    duration: "1 year and 6 months",
                    location: "São Paulo – SP",
                    description: [
                        "Technical leadership in web digital product development",
                        "Strategic action between design, technology, and business",
                        "Collaboration with agile squads (sprints, dailies, plannings, reviews)",
                        "Implementation of scalable, responsive, and performant interfaces",
                        "Multidisciplinary team management and technical alignment",
                    ],
                    technologies: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Figma"],
                    achievements: [
                        "Led complete redesign of the main dashboard",
                        "Implemented unified design system for all products",
                    ],
                    type: "current" as const,
                },
                {
                    id: "exp-2",
                    company: "Tecsa® Group",
                    role: "UX/UI Designer & Front-end Developer",
                    period: "May/2023 – Jan/2024",
                    duration: "9 months",
                    location: "São Paulo – SP",
                    description: [
                        "Leadership of digital projects from concept to delivery",
                        "Development of modern and consistent interfaces",
                        "Translation of business requirements into technical solutions",
                        "Usability testing and continuous experience improvement",
                        "Implementation of design systems and front-end best practices",
                    ],
                    technologies: ["Next.js", "React", "Bootstrap", "Figma", "Adobe XD"],
                    type: "past" as const,
                },
                {
                    id: "exp-3",
                    company: "METAVERSO-LIVEPLANET",
                    role: "UI/UX Designer & Front-end Developer",
                    period: "Sep/2021 – Jul/2023",
                    duration: "1 year and 10 months",
                    location: "Remote",
                    description: [
                        "Evolution of user experience in complex digital systems",
                        "Development of responsive and optimized interfaces",
                        "Integration between design and functional code",
                        "Performance optimization and cross-browser compatibility",
                    ],
                    technologies: ["React", "Three.js", "WebGL", "CSS3", "JavaScript"],
                    type: "past" as const,
                },
                {
                    id: "exp-4",
                    company: "Roupateca",
                    role: "Front-end Developer & UX Designer",
                    period: "Mar/2020 – Apr/2023",
                    duration: "3 years and 1 month",
                    location: "Remote",
                    description: [
                        "Creation of integrated e-commerce digital platform",
                        "Complete execution of UX/UI process",
                        "WordPress implementation with focus on scalability",
                        "Simplification of complex flows for end users",
                    ],
                    technologies: ["WordPress", "WooCommerce", "JavaScript", "CSS3", "PHP"],
                    type: "past" as const,
                },
                {
                    id: "exp-5",
                    company: "Rugemtugem Communication",
                    role: "Web Developer & UX Designer",
                    period: "Nov/2000 – Current",
                    duration: "25+ years",
                    location: "São Paulo – SP",
                    description: [
                        "Development of digital solutions for multiple segments",
                        "Creation of custom products focused on results",
                        "Full-stack work with modern web technologies",
                        "Continuous client relationship and business vision",
                    ],
                    technologies: ["HTML", "CSS", "JavaScript", "React", "PHP", "MySQL", "WordPress"],
                    type: "current" as const,
                },
            ],
        },
        skills: {
            title: "Skills",
            technology: "Technology",
            ux: "UX/UI Design",
            ai: "AI & Automation",
            tools: "Tools",
        },
        education: {
            subtitle: "Academic Background",
            title: "Education",
            description: "Continuous investment in formal education and professional certifications",
            items: [
                {
                    id: "edu-1",
                    degree: "Systems Analysis and Development",
                    institution: "Estácio",
                    location: "São Paulo, Brazil",
                    period: "2020 – 2023",
                    description: "Technology degree focused on software development, databases, networking, and systems engineering.",
                    type: "graduation" as const,
                    status: "completed" as const,
                },
                {
                    id: "edu-2",
                    degree: "User-Centered Design",
                    institution: "PUCRS",
                    location: "Online",
                    period: "2022",
                    description: "Extension course focused on Design Thinking methodologies, user research, and user-centered solution prototyping.",
                    highlights: [
                        "Design Thinking and user research",
                        "Prototyping and usability testing",
                    ],
                    type: "postgrad" as const,
                    status: "completed" as const,
                },
                {
                    id: "edu-3",
                    degree: "Professional JavaScript",
                    institution: "EBAC",
                    location: "Online",
                    period: "2021",
                    description: "Intensive training in modern JavaScript, ES6+, asynchronous programming, and development best practices.",
                    type: "certification" as const,
                    status: "completed" as const,
                },
                {
                    id: "edu-4",
                    degree: "UX/UI: Interface Fundamentals",
                    institution: "USP",
                    location: "São Paulo, Brazil",
                    period: "2021",
                    description: "Course focused on usability principles, Nielsen heuristics, wireframing, and interface design.",
                    highlights: [
                        "Nielsen heuristics and usability evaluation",
                        "Wireframing and high-fidelity prototyping",
                    ],
                    type: "certification" as const,
                    status: "completed" as const,
                },
            ],
        },
        projects: {
            title: "Success Cases",
            role: "Role",
            tools: "Technologies",
            items: [
                {
                    name: "Sales Prime - Dashboard",
                    tools: ["React", "TypeScript", "Tailwind CSS"],
                    description: "Technical leadership in web digital product development with strategic action between design, technology, and business. Collaboration with agile squads (sprints, dailies, plannings, reviews) and implementation of scalable, responsive, and performant interfaces.",
                    myRole: "Tech Lead",
                },
                {
                    name: "Prosperus Club — High-Ticket Mentorship Diagnosis",
                    tools: ["React 19", "TypeScript", "Tailwind CSS", "Framer Motion", "Express.js", "SQLite", "Google Gemini AI"],
                    description: "Interactive AI-powered diagnostic system (Google Gemini) that guides mentors through 4 structured modules to package their expertise into a high-ticket mentorship offer. Features HubSpot CRM authentication, real-time admin dashboard, and AI-generated strategic action plans.",
                    myRole: "Full-stack Developer & AI Integrator",
                },
                {
                    name: "Tecsa Group - Corporate Portal",
                    tools: ["Next.js", "React", "Bootstrap"],
                    description: "Leadership of digital projects from concept to delivery. Development of modern and consistent interfaces, translation of business requirements into technical solutions, and implementation of design systems with front-end best practices.",
                    myRole: "UX/UI Designer & Front-end",
                },
                {
                    name: "LivePlanet - Metaverse",
                    tools: ["React", "Three.js", "WebGL"],
                    description: "Evolution of user experience in complex digital systems. Development of responsive and optimized interfaces with integration between design and functional code, focusing on performance and cross-browser compatibility.",
                    myRole: "UI/UX Designer & Developer",
                },
                {
                    name: "Roupateca - E-commerce",
                    tools: ["WordPress", "WooCommerce", "JavaScript"],
                    description: "Creation of integrated e-commerce digital platform with complete execution of UX/UI process. WordPress implementation with focus on scalability and simplification of complex flows for end users.",
                    myRole: "Full Stack Developer",
                },
                {
                    name: "21 Days Campaign - WordPress Plugin",
                    tools: ["WordPress", "PHP", "Dompdf", "JavaScript", "MySQL"],
                    description: "WordPress plugin for managing activities of the 21 Days of Activism Against Racism Campaign. Complete system with registration form, administrative approval, XLS export, and custom PDF generation with Dompdf.",
                    myRole: "Full-stack Developer",
                },
                {
                    name: "Bling-Suri Integration (N8N Migration)",
                    tools: ["N8N", "Docker", "OAuth2", "REST API", "Webhooks"],
                    description: "Migration of PHP integration to N8N (no-code automation). Bidirectional synchronization system between Bling ERP and Suri Chatbot with OAuth2, webhooks, and visual workflows for product and order automation.",
                    myRole: "Integration Architect & DevOps",
                },
                {
                    name: "Disstantes Website - Official Band",
                    tools: ["HTML5", "CSS3", "JavaScript", "YouTube API", "Spotify Embed"],
                    description: "One-page website for rock band with modern design and glitch/corruption visual effects. Includes YouTube video carousel, Spotify integration, concert schedule section, and contact form.",
                    myRole: "Front-end Developer & UI Designer",
                },
            ],
        },
    },
} as const;

export type Language = "pt" | "en";
