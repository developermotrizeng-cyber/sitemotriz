export interface StatItem {
  id: string;
  value: string;
  label: string;
}

export interface MvvItem {
  id: string;
  title: string;
  text: string;
  icon: string;
}

export interface SpecialtyItem {
  id: string;
  title: string;
  description: string;
  icon: string; // 'Compass' | 'Wrench' | 'Building2' etc
  image?: string;
  images?: string[];
  details?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  image: string;
  images?: string[];
  details?: string;
}

export interface PartnerItem {
  id: string;
  name: string;
  logoUrl: string;
}

export interface UploadedFileItem {
  id: string;
  name: string;
  dataUrl: string;
  size?: string;
  type?: string;
}

export interface SiteContent {
  header: {
    logoName: string;
    logoSubtitle: string;
    ctaText: string;
    navHome: string;
    navAbout: string;
    navSpecialties: string;
    navPortfolio: string;
    navContact: string;
    navPartners?: string;
    navHistoryLabel?: string;
    navMvvLabel?: string;
  };
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    backgroundUrl: string; // Can be a custom CSS pattern or static image
    bottomTags: string[];
  };
  about: {
    tag: string;
    title: string;
    description: string;
    imageUrl: string;
    stats: StatItem[];
    mvv?: MvvItem[];
  };
  specialties: {
    tag: string;
    title: string;
    items: SpecialtyItem[];
  };
  portfolio: {
    tag: string;
    title: string;
    ctaText: string;
    items: ProjectItem[];
  };
  partners?: {
    tag: string;
    title: string;
    items: PartnerItem[];
  };
  uploadedFiles?: UploadedFileItem[];
  contact: {
    tag: string;
    title: string;
    address: string;
    phone: string;
    email: string;
    formNamePlaceholder: string;
    formEmailPlaceholder: string;
    formProjectTypeLabel: string;
    formMessagePlaceholder: string;
    formCtaText: string;
  };
  footer: {
    brandText: string;
    brandDesc: string;
    quickLinksTitle: string;
    newsletterTitle: string;
    newsletterDesc: string;
    newsletterPlaceholder: string;
    whatsappNumber: string; // Dynamic WhatsApp float link
    whatsappMessage: string;
    copyrightText: string;
    instagramUrl?: string;
    facebookUrl?: string;
    linkedinUrl?: string;
  };
  smtp?: {
    host: string;
    port: number;
    user: string;
    pass: string;
    secure: boolean;
    toEmail: string;
  };
   careersEmail?: string;
  candidacies?: {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    vaga: string;
    pretensao?: string;
    linkedin?: string;
    mensagem?: string;
    curriculoNome?: string;
    submittedAt: string;
  }[];
  careersPage?: {
    titlePrefix: string;
    mainTitle: string;
    description: string;
    formTitle: string;
    vacancies: { value: string; label: string }[];
  };
}

export const defaultSiteContent: SiteContent = {
  header: {
    logoName: "MOTRIZ",
    logoSubtitle: "ENGENHARIA",
    ctaText: "SOLICITAR ORÇAMENTO",
    navHome: "INÍCIO",
    navAbout: "QUEM SOMOS",
    navSpecialties: "ÁREAS DE ATUAÇÃO",
    navPortfolio: "PORTFÓLIO",
    navContact: "CONTATO",
    navPartners: "CLIENTES",
    navHistoryLabel: "NOSSA HISTÓRIA",
    navMvvLabel: "MISSÃO, VISÃO E VALORES"
  },
  hero: {
    title: "SOLUÇÕES EM ENGENHARIA E CONSTRUÇÃO",
    subtitle: "Compromisso com a integridade estrutural e inovação técnica em todos os projetos que definem o horizonte de Rondônia.",
    ctaText: "SAIBA MAIS",
    backgroundUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1920&q=80",
    bottomTags: ["ESTRUTURA", "CONSTRUÇÃO", "RESULTADO"]
  },
  about: {
    tag: "QUEM SOMOS",
    title: "Presente nas grandes obras do nosso Estado.",
    description: "A Motriz Engenharia e Construções Ltda consolidou-se como referência no mercado de Porto Velho através de um rigoroso padrão de qualidade técnica e cumprimento de prazos. Nossa atuação é pautada pela excelência em gestão de projetos complexos, desde a fundação ao acabamento.",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80",
    stats: [
      { id: "stat-1", value: "15+", label: "ANOS DE MERCADO" },
      { id: "stat-2", value: "200+", label: "OBRAS CONCLUÍDAS" }
    ],
    mvv: [
      {
        id: "mvv-1",
        title: "VISÃO",
        icon: "Lightbulb",
        text: "Ser referência em soluções inovadoras e sustentáveis no setor de engenharia e construções, agregando valor técnico a cada obra realizada."
      },
      {
        id: "mvv-2",
        title: "VALORES",
        icon: "Gem",
        text: "Compromisso, Qualidade, Inovação, Sustentabilidade e Ética inegociável em todos os nossos relacionamentos comerciais e técnicos."
      },
      {
        id: "mvv-3",
        title: "EXPERTISE",
        icon: "Target",
        text: "Anos de experiência prática em obras de alta complexidade e uma equipe multidisciplinar altamente qualificada dedicada à excelência."
      }
    ]
  },
  specialties: {
    tag: "NOSSAS ATIVIDADES",
    title: "Especialidades Técnicas",
    items: [
      {
        id: "spec-1",
        title: "PROJETO ELÉTRICO",
        description: "Projeto elétrico predial e industrial completo com diagramas unifilares, equilibragem de fases e subestações em conformidade.",
        icon: "Zap",
        image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80",
        details: "Nosso projeto elétrico abrange todo o dimensionamento de cargas, circuitos elétricos, diagramas unifilares detalhados, projeto de subestação transformadora e dimensionamento de condutores e proteções elétricas de acordo com a norma NBR 5410. Garantimos o uso inteligente de materiais corporativos e soluções de eficiência energética de alto nível."
      },
      {
        id: "spec-2",
        title: "PROJETO ESTRUTURAL",
        description: "Dimensionamento avançado de fundações, escavações de grande porte e estruturas em concreto armado e aço.",
        icon: "Layers",
        image: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80",
        details: "Cálculo técnico detalhado de estruturas de edifícios multifamiliares, comerciais e industriais. Desenvolvemos o detalhamento completo de armaduras de concreto armado, coberturas metálicas, pontes e bueiros usando tecnologia BIM. Focado em otimização de concreto e aço, reduzindo custos sem desrespeitar os coeficientes de estabilidade global."
      },
      {
        id: "spec-3",
        title: "PROJETO DE ASFALTO",
        description: "Projetos de engenharia rodoviária, pavimentação asfáltica de ponta, terraplenagem de solos e drenagem urbana.",
        icon: "Milestone",
        image: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=800&q=80",
        details: "Atuamos na engenharia da infraestrutura urbana e de transporte. Elaboramos o dimensionamento de pavimentos rígidos e flexíveis, análise granulométrica de solos e base de cascalho, terraplenagem com balanço de corte e aterro, e drenagem de águas pluviais de rodovias e loteamentos residenciais em Porto Velho e região."
      },
      {
        id: "spec-4",
        title: "ELÉTRICO E DADOS",
        description: "Infraestrutura de redes, cabeamento estruturado e redes corporativas de transmissão de dados de alta velocidade.",
        icon: "Network",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
        details: "Planejamento e coordenação de redes de dados, telefonia IP, rack de servidores, sistemas de CFTV IP, detecção digital de intrusão e automação predial integrada. Criamos eletrocalhas e caminhos planejados de cabos que impedem a indução eletromagnética e permitem manutenção rápida e escalabilidade corporativa estruturada."
      },
      {
        id: "spec-5",
        title: "PROJETO DE CLIMATIZAÇÃO",
        description: "Projetos de engenharia termo-condicionada, sistemas VRF, PMOC e climatização central de alta eficiência.",
        icon: "Snowflake",
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
        details: "Especialidade no cálculo de carga térmica de edificações complexas. Desenvolvemos projetos de ar condicionado central refrigerados a água ou ar (Chillers), redes de dutos de distribuição metálicos, sistemas VRF de alta economia energética e elaboração técnica de plano de manutenção e controle de ar condicionado (PMOC)."
      },
      {
        id: "spec-6",
        title: "PROJETO HIDROSSANITÁRIO",
        description: "Instalações hidráulicas prediais, tubulações de esgoto sanitário e captação técnica de águas pluviais na Amazônia.",
        icon: "Droplet",
        image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
        details: "Sistemas em tubulações prediais de água fria e água quente (gás/solar). Projetamos redes de esgoto sanitário ventiladas para prevenir o retorno de odores desagradáveis, coletores prediais de águas pluviais prontos para suportar altas cargas de chuvas tropicais características da região Norte do Brasil e reservatórios técnicos."
      },
      {
        id: "spec-7",
        title: "PPCI E PREVENTIVO DE INCÊNDIO",
        description: "Sistemas de proteção contra incêndio ativos e passivos aprovados integralmente pelos Bombeiros.",
        icon: "Flame",
        image: "https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&w=800&q=80",
        details: "Consultoria em segurança contra incêndio para fins de regularização edilícia e AVCB. Desenhamos redes de hidrantes, tubulações aéreas soldadas, sistemas de sprinklers (chuveiros automáticos), central de alarme endereçável, iluminação de emergência e rotas de escape dimensionadas matematicamente para o fluxo de pessoas."
      },
      {
        id: "spec-8",
        title: "PROJETO ARQUITETÔNICO",
        description: "Layouts funcionais, fachadas modernas integradas e soluções inteligentes aliadas à engenharia de custos.",
        icon: "Compass",
        image: "https://images.unsplash.com/photo-1503387762458-7e52d4efdec7?auto=format&fit=crop&w=800&q=80",
        details: "Elaboramos projetos de arquitetura integrando conforto térmico natural, ventilação cruzada e estética sofisticada. Nossos layouts garantem aproveitamento dinâmico do espaço físico e são compatibilizados em sua totalidade com os projetos complementares, mitigando riscos de retrabalho na fase de execução da obra."
      }
    ]
  },
  portfolio: {
    tag: "NOSSO LEGADO",
    title: "Portfólio de Obras",
    ctaText: "VER TODOS OS PROJETOS",
    items: [
      {
        id: "proj-1",
        title: "Complexo Viário Metropolitano",
        category: "INFRAESTRUTURA",
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "proj-2",
        title: "Centro Empresarial Porto Velho",
        category: "COMERCIAL",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "proj-3",
        title: "Condomínio Solar das Palmeiras",
        category: "RESIDENCIAL",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: "proj-4",
        title: "Parque Logístico Norte",
        category: "INDUSTRIAL",
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80"
      }
    ]
  },
  contact: {
    tag: "FALE CONOSCO",
    title: "Inicie seu projeto com quem entende.",
    address: "Av. Jorge Teixeira, 1234 - Ed. Corporate, Porto Velho - RO",
    phone: "+55 (69) 3211-0000",
    email: "contato@motrizengenharia.com.br",
    formNamePlaceholder: "Seu nome aqui",
    formEmailPlaceholder: "email@empresa.com",
    formProjectTypeLabel: "Tipo de Projeto",
    formMessagePlaceholder: "Descreva brevemente as necessidades do seu projeto",
    formCtaText: "ENVIAR SOLICITAÇÃO"
  },
  footer: {
    brandText: "MOTRIZ ENGENHARIA",
    brandDesc: "Especialistas em transformar visões complexas em estruturas sólidas. Desde 2009 construindo o futuro de Rondônia com precisão técnica.",
    quickLinksTitle: "NAVEGAÇÃO RÁPIDA",
    newsletterTitle: "NEWSLETTER TÉCNICA",
    newsletterDesc: "Receba atualizações sobre nossas obras e inovações do setor.",
    newsletterPlaceholder: "Seu email",
    whatsappNumber: "5569999990000",
    whatsappMessage: "Olá! Gostaria de solicitar um orçamento para o meu projeto.",
    copyrightText: "© 2026 Motriz Engenharia. Todos os direitos reservados.",
    instagramUrl: "https://www.instagram.com/motrizengenharia",
    facebookUrl: "https://www.facebook.com/motrizengenharia",
    linkedinUrl: "https://www.linkedin.com/company/motrizengenharia"
  },
  smtp: {
    host: "smtp.gmail.com",
    port: 587,
    user: "developermotrizeng@gmail.com",
    pass: "",
    secure: false,
    toEmail: "developermotrizeng@gmail.com"
  },
  partners: {
    tag: "NOSSOS PARCEIROS",
    title: "Empresas e órgãos que confiam na nossa engenharia",
    items: [
      { id: "partner-1", name: "Aliança Construções", logoUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=150&h=80&q=80" },
      { id: "partner-2", name: "Rondônia Metais", logoUrl: "https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&w=150&h=80&q=80" },
      { id: "partner-3", name: "Prefeitura de Porto Velho", logoUrl: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=150&h=80&q=80" },
      { id: "partner-4", name: "Norte Distribuidora de Aço", logoUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=150&h=80&q=80" }
    ]
  },
  uploadedFiles: [],
  careersEmail: "rh@motrizengenharia.com.br",
  candidacies: [],
  careersPage: {
    titlePrefix: "Processo de Seleção Contínuo",
    mainTitle: "Oportunidades em Tecnologia, Engenharia de Obras e Gestão",
    description: "Buscamos engenheiros civis, técnicos de edificações, mestres de obras e estagiários comprometidos com rigor metodológico, inovação e entrega pontual.",
    formTitle: "FORMULÁRIO DE CADASTRO DE CURRÍCULO",
    vacancies: [
      { value: "ENGENHEIRO_CIVIL", label: "Engenheiro Civil" },
      { value: "ESTAGIARIO_DE_ENGENHARIA", label: "Estagiário de Engenharia" },
      { value: "MESTRE_DE_OBRAS_ENCARREGADO", label: "Mestre de Obras / Encarregado" },
      { value: "TECNICO_DE_EDIFICACOES_SST", label: "Técnico em Edificações / SST" },
      { value: "ADMINISTRATIVO_COMPRAS", label: "Setor Administrativo / Compras" },
      { value: "OUTRO", label: "Outra oportunidade / Operacional" }
    ]
  }
};
