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
        title: "MINERAÇÃO",
        description: "Operações completas de lavra, transporte e processamento de minérios com alta conformidade técnica.",
        icon: "Database",
        image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
        details: "Atuação no segmento de mineração realizando lavra, beneficiamento e transporte de minérios de forma segura, sustentável e em conformidade rígida com os regulamentos ambientais e técnicos nacionais."
      },
      {
        id: "spec-2",
        title: "TERRAPLANAGEM",
        description: "Movimentação de terra, nivelamento, cortes e aterros estruturados para grandes empreendimentos.",
        icon: "HardHat",
        image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80",
        details: "Serviços avançados de movimentação de solo, cortes, aterros compactados, nivelamento e preparação de terrenos para obras residenciais, comerciais, industriais e de infraestrutura viária."
      },
      {
        id: "spec-3",
        title: "LOCAÇÃO DE MÁQUINAS",
        description: "Frota moderna de maquinários pesados e equipamentos de alta performance para construção.",
        icon: "Truck",
        image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&w=800&q=80",
        details: "Locação de escavadeiras, motoniveladoras, retroescavadeiras, tratores de esteira e rolos compactadores, garantindo equipamentos revisados e operadores qualificados para a máxima eficiência do seu canteiro de obras."
      },
      {
        id: "spec-4",
        title: "PAVIMENTAÇÃO",
        description: "Pavimentação asfáltica, rígida e intertravada de alta durabilidade e precisão viária.",
        icon: "Milestone",
        image: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=800&q=80",
        details: "Execução de projetos de pavimentação em asfalto (CBUQ), concreto rígido estruturado e blocos intertravados para loteamentos, pátios logísticos, vias urbanas e acessos industriais."
      },
      {
        id: "spec-5",
        title: "DRENAGEM",
        description: "Sistemas eficientes de captação e escoamento de águas pluviais para proteção estrutural.",
        icon: "Droplet",
        image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
        details: "Dimensionamento e execução de bueiros, galerias pluviais, canalizações, drenos subterrâneos e sistemas de contenção para controle e escoamento adequado de águas da chuva."
      },
      {
        id: "spec-6",
        title: "TRANSPORTE FLUVIAL",
        description: "Logística fluvial segura para transporte de cargas e insumos pelos rios da região.",
        icon: "Anchor",
        image: "https://images.unsplash.com/photo-1508243771214-6e95d137426b?auto=format&fit=crop&w=800&q=80",
        details: "Operação logística fluvial integrada para transporte de equipamentos pesados, brita, asfalto, minérios e insumos de construção através de balsas e empurradores na bacia hidrográfica regional."
      },
      {
        id: "spec-7",
        title: "PAVIMENTAÇÃO ASFÁLTICA",
        description: "Aplicação e recomposição de pavimento asfáltica a quente para tráfego pesado.",
        icon: "Milestone",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        details: "Serviço especializado de pavimentação em Concreto Betuminoso Usinado a Quente (CBUQ), recapeamento asfáltico, fresagem e tapa-buracos com elevado rigor técnico e estabilidade superficial."
      },
      {
        id: "spec-8",
        title: "INFRAESTRUTURA",
        description: "Obras integradas de infraestrutura urbana, saneamento e loteamentos planejados.",
        icon: "Building2",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
        details: "Execução integral de obras de infraestrutura básica: abertura de vias, redes de esgoto, abastecimento de água potável, iluminação pública e terraplenagem de grandes áreas urbanas e industriais."
      },
      {
        id: "spec-9",
        title: "CONSTRUÇÃO CIVIL",
        description: "Edificações comerciais, industriais e residenciais executadas com excelência construtiva.",
        icon: "Hammer",
        image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80",
        details: "Desenvolvimento e construção de galpões industriais, prédios comerciais, sedes administrativas e projetos habitacionais sob rigoroso cumprimento de prazos, custos e padrões executivos."
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
