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
  "hero": {
    "title": "SOLUÇÕES EM ENGENHARIA E CONSTRUÇÃO",
    "ctaText": "SAIBA MAIS",
    "subtitle": "Compromisso com a excelência estrutural e inovação técnica em empreendimentos que redefinem horizontes e constroem progresso.",
    "bottomTags": [
      "ESTRUTURA",
      "CONSTRUÇÃO",
      "RESULTADO"
    ],
    "backgroundUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/hero-bg-1782762737293-916.jpg"
  },
  "about": {
    "mvv": [
      {
        "id": "mvv-1",
        "icon": "Target",
        "text": "Realizar empreendimentos com excelência, superando expectativas em qualidade, eficiência e compromisso com o desenvolvimento sustentável.",
        "title": "MISSÃO"
      },
      {
        "id": "mvv-2",
        "icon": "Lightbulb",
        "text": "Ser referência no mercado de engenharia e construção, reconhecida pela excelência, credibilidade, segurança e inovação em todos os serviços prestados.",
        "title": "VISÃO"
      },
      {
        "id": "mvv-3",
        "icon": "Gem",
        "text": "Nossos valores são guiados pela ética, comprometimento, transparência e respeito. Valorizamos as pessoas e atuamos com responsabilidade em relação à segurança, à saúde e ao meio ambiente.",
        "title": "VALORES"
      }
    ],
    "tag": "QUEM SOMOS",
    "stats": [
      {
        "id": "stat-1",
        "label": "ANOS DE MERCADO",
        "value": "15+"
      },
      {
        "id": "stat-2",
        "label": "OBRAS CONCLUÍDAS",
        "value": "50+"
      }
    ],
    "title": "Presente nas grandes obras do nosso Estado.",
    "imageUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/about-img-1782762738637-940.jpg",
    "description": "Fundada em 2009, a Motriz Engenharia e Construções atua nos segmentos de infraestrutura, pavimentação, terraplenagem, drenagem de águas pluviais, construção civil, saneamento, mineração e locação de máquinas. Com sede em Porto Velho/RO, a empresa integra a experiência do Grupo Guaporé, oferecendo soluções completas para obras de grande porte na Região Norte. Contamos com equipe qualificada, frota moderna de equipamentos e compromisso com a qualidade, segurança e sustentabilidade, sempre focados na satisfação de nossos clientes."
  },
  "footer": {
    "brandDesc": "Especialistas em transformar projetos desafiadores em soluções de engenharia sólidas e eficientes. Desde 2009, desenvolvendo obras com precisão técnica, inovação e compromisso com a excelência.",
    "brandText": "MOTRIZ ENGENHARIA",
    "facebookUrl": "https://www.facebook.com/motrizengenharia",
    "linkedinUrl": "https://www.linkedin.com/company/motrizengenharia",
    "instagramUrl": "https://www.instagram.com/motrizengenhariaeconstrucoes/",
    "copyrightText": "© 2026 Motriz Engenharia. Todos os direitos reservados.",
    "newsletterDesc": "Receba atualizações sobre nossas obras e inovações do setor.",
    "whatsappNumber": "5569999529823",
    "newsletterTitle": "NEWSLETTER TÉCNICA",
    "quickLinksTitle": "NAVEGAÇÃO RÁPIDA",
    "whatsappMessage": "Olá! Gostaria de solicitar um orçamento para o meu projeto.",
    "newsletterPlaceholder": "Seu email"
  },
  "header": {
    "ctaText": "SOLICITAR ORÇAMENTO",
    "navHome": "INÍCIO",
    "logoName": "MOTRIZ",
    "navAbout": "QUEM SOMOS",
    "navContact": "CONTATO",
    "navMvvLabel": "MISSÃO, VISÃO E VALORES",
    "navPartners": "CLIENTES",
    "logoSubtitle": "ENGENHARIA",
    "navPortfolio": "PORTFÓLIO",
    "navSpecialties": "ÁREAS DE ATUAÇÃO",
    "navHistoryLabel": "NOSSA HISTÓRIA"
  },
  "contact": {
    "tag": "FALE CONOSCO",
    "email": "engenharia@motrizengenharia.com.br",
    "phone": "+55 (69) 99952-9823",
    "title": "Inicie seu projeto com quem entende.",
    "address": "Rua da Beira 5490, Porto Velho, Rondônia, 76806-470",
    "formCtaText": "ENVIAR SOLICITAÇÃO",
    "formNamePlaceholder": "Seu nome aqui",
    "formEmailPlaceholder": "email@empresa.com",
    "formProjectTypeLabel": "Tipo de Projeto",
    "formMessagePlaceholder": "Descreva brevemente as necessidades do seu projeto"
  },
  "partners": {
    "tag": "NOSSOS PARCEIROS",
    "items": [
      {
        "id": "partner-1",
        "name": "Votarantim",
        "logoUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/partner-partner-1-1782762751542-290.jpg"
      },
      {
        "id": "partner-3",
        "name": "Santo Antonio",
        "logoUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782486964711-SANTO_ANTONIO.png"
      },
      {
        "id": "partner-1782160577410",
        "name": "Cargill",
        "logoUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/partner-partner-1782160577410-1782762751942-21.png"
      },
      {
        "id": "partner-1782160586306",
        "name": "TGSA",
        "logoUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/partner-partner-1782160586306-1782762752354-205.jpg"
      },
      {
        "id": "partner-1782160598194",
        "name": "Nova BR364",
        "logoUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/partner-partner-1782160598194-1782762752761-994.png"
      },
      {
        "id": "partner-1782160966690",
        "name": "AMAGGI",
        "logoUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/partner-partner-1782160966690-1782762753170-274.png"
      },
      {
        "id": "partner-1782161079731",
        "name": "ODEBRECHT",
        "logoUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/partner-partner-1782161079731-1782762753580-803.png"
      },
      {
        "id": "partner-1782161445411",
        "name": "Toshiba",
        "logoUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/partner-partner-1782161445411-1782762753888-714.png"
      },
      {
        "id": "partner-1782161451506",
        "name": "MEKA",
        "logoUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/partner-partner-1782161451506-1782762754190-277.jpg"
      },
      {
        "id": "partner-1782161671635",
        "name": "Guaporé",
        "logoUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/partner-partner-1782161671635-1782762754527-229.png"
      },
      {
        "id": "partner-1782162682155",
        "name": "Direcional",
        "logoUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/partner-partner-1782162682155-1782762754843-788.jpg"
      },
      {
        "id": "partner-1782162702219",
        "name": "HIDROVIAS",
        "logoUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/partner-partner-1782162702219-1782762755207-654.jpg"
      },
      {
        "id": "partner-1782162717163",
        "name": "TEIXEIRA DUARTE",
        "logoUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/partner-partner-1782162717163-1782762755560-667.png"
      },
      {
        "id": "partner-1782240868144",
        "name": "CSN",
        "logoUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/partner-partner-1782240868144-1782762755863-235.png"
      },
      {
        "id": "partner-1782240877752",
        "name": "CSAC",
        "logoUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/partner-partner-1782240877752-1782762756150-7.png"
      },
      {
        "id": "partner-1782240892928",
        "name": "Andrade",
        "logoUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/partner-partner-1782240892928-1782762756637-333.png"
      },
      {
        "id": "partner-1782241205593",
        "name": "CIPASA",
        "logoUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/partner-partner-1782241205593-1782762756971-747.png"
      },
      {
        "id": "partner-1782241228249",
        "name": "PASSARELLI",
        "logoUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/partner-partner-1782241228249-1782762757294-874.png"
      },
      {
        "id": "partner-1782486886110",
        "name": "Vinci Airports",
        "logoUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782487702944-Vinci_Airports.png"
      }
    ],
    "title": "Empresas e órgãos que confiam na nossa engenharia"
  },
  "portfolio": {
    "tag": "NOSSO LEGADO",
    "items": [
      {
        "id": "proj-1",
        "image": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782482885911-Cargill_-_Porto_Velho_-RO.png",
        "title": "Drenagem, Terraplanagem e Pavimentação - Cargill - Porto Velho - RO",
        "images": [
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782482885911-Cargill_-_Porto_Velho_-RO.png",
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782483507660-Cargill_-_Porto_Velho_-RO1.png",
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782483512272-Cargill_-_Porto_Velho_-RO2.png"
        ],
        "details": "Drenagem, Terraplanagem e Pavimentação - Cargill - Porto Velho - RO",
        "category": "INFRAESTRUTURA"
      },
      {
        "id": "proj-2",
        "image": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782483891383-TGSA_-_Sim_es.png",
        "title": "Serviços de Terraplanagem, Drenagem e Pavimentação - TGSA - Terminal de Granéis Sólidos Agrícolas - Porto Velho -RO",
        "images": [
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782483891383-TGSA_-_Sim_es.png"
        ],
        "details": "Serviços de Terraplanagem, Drenagem e Pavimentação - TGSA - Terminal de Granéis Sólidos Agrícolas - Porto Velho -RO",
        "category": "COMERCIAL"
      },
      {
        "id": "proj-3",
        "image": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782485699229-NOVA_BR_3641.png",
        "title": "Pavimentação Asfaltica e reparo com CBUQ - Nova BR364",
        "images": [
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782485699229-NOVA_BR_3641.png",
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782485706615-NOVA_BR_364.png"
        ],
        "details": "Pavimentação Asfaltica e reparo com CBUQ - Nova BR364",
        "category": "RESIDENCIAL"
      },
      {
        "id": "proj-4",
        "image": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782402852800-AMAGGI1.png",
        "title": "Serviços de Terraplanagem, Pavimentação em CBUQ e Drenagem no pátioda Misturadora de Fertilizantes da Amaggi - Unidade: Porto Velho/RO",
        "images": [
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782402852800-AMAGGI1.png",
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782402856923-AMAGGI2.png",
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782402862991-AMAGGI3.png",
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782402866863-AMAGGI4.png"
        ],
        "details": "Serviços de Terraplanagem, Pavimentação em CBUQ e Drenagem no pátioda Misturadora de Fertilizantes da Amaggi - Unidade: Porto Velho/RO\n",
        "category": "INDUSTRIAL"
      },
      {
        "id": "proj-1781834528912",
        "image": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782409421315-Aeroporto.png",
        "title": "Serviços de Fresagem e Pavimentação em CBUQ",
        "images": [
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782409421315-Aeroporto.png",
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782409426616-Aeroporto3.png",
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782409430212-Aeroporto1.png",
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782409433897-Aeroporto2.png"
        ],
        "details": "Serviços de Fresagem e Pavimentação em CBUQ no trilho de roda da Taxiway A e pátio do Aeroporto Internacional de Cruzeiro do Sul/AC.\n",
        "category": "TERRAPLANAGEM"
      },
      {
        "id": "proj-1782409577324",
        "image": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782410024027-Faixa_de_Pista_aeroporto.png",
        "title": "Serviços de Terraplanagem na adequação da Faixa de Pista do Aeroporto Internacional de Cruzeiro do Sul/AC.",
        "images": [
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782410024027-Faixa_de_Pista_aeroporto.png",
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782410029278-Faixa_de_Pista_aeroporto1.png",
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782410124343-Faixa_de_Pista_aeroporto2.png"
        ],
        "details": "Serviços de Terraplanagem na adequação da Faixa de Pista do Aeroporto Internacional de Cruzeiro do Sul/AC.\n",
        "category": "COMERCIAL"
      },
      {
        "id": "proj-1782410904341",
        "image": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782411223469-Vila_Nova_de_Teot_nio4.png",
        "title": "Implantação do novo acesso a Vila Nova de Teotônio",
        "images": [
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782411223469-Vila_Nova_de_Teot_nio4.png",
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782410877400-Vila_Nova_de_Teot_nio1.png",
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782410881075-Vila_Nova_de_Teot_nio2.png",
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782410885018-Vila_Nova_de_Teot_nio3.png"
        ],
        "details": "Implantação do novo acesso a Vila Nova de Teotônio, envolvendo serviços\nde terraplanagem, obras de arte corrente, drenagem e sinalização.\n",
        "category": "COMERCIAL"
      },
      {
        "id": "proj-1782411693894",
        "image": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782411621080-P_tio_da_Estrada_Madeira_Mamor_.png",
        "title": "Estabilização e Proteção de talude nas adjacências do Pátio da Estrada de Ferro Madeira Mamoré (E.F.M.M), Município de Porto Velho – RO",
        "images": [
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782411621080-P_tio_da_Estrada_Madeira_Mamor_.png",
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782411626000-P_tio_da_Estrada_Madeira_Mamor_1.png",
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782411629728-P_tio_da_Estrada_Madeira_Mamor_2.png"
        ],
        "details": "Estabilização e Proteção de talude nas adjacências do Pátio da Estrada de Ferro Madeira Mamoré (E.F.M.M), Município de Porto Velho – RO. Utilizando enrocamento de material rochoso na faixa de 600 metros, envolvendo transporte fluvial e terrestre de aproximadamente de 225.000 m³ de rocha.",
        "category": "COMERCIAL"
      },
      {
        "id": "proj-1782412214918",
        "image": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782412193465-Movimenta__o_interna_de_Insumos_Votarantim.png",
        "title": "Movimentação interna de insumos da Fábrica da Votorantim Cimentos Porto Velho/RO",
        "images": [
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782412193465-Movimenta__o_interna_de_Insumos_Votarantim.png"
        ],
        "details": "Movimentação interna de insumos da Fábricada Votorantim Cimentos Porto Velho/RO",
        "category": "COMERCIAL"
      },
      {
        "id": "proj-1782412899878",
        "image": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782412841936-Transporte_fluvial_de_insumos_da_Votorantim.png",
        "title": "Serviços de descarga, carregamento e transporte fluvial de insumos da Votorantim Cimentos - Porto Velho/RO",
        "images": [
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782412841936-Transporte_fluvial_de_insumos_da_Votorantim.png",
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782397391144-TRANSPORTE_FLUVIAL.png",
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782397395320-TRANSPORTE_FLUVIAL1.png"
        ],
        "details": "Serviços de descarga, carregamento e transporte fluvial de insumos da Votorantim Cimentos - Porto Velho/RO",
        "category": "COMERCIAL"
      },
      {
        "id": "proj-1782413646294",
        "image": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782413604430-Recupera__o_de_obras__-_CIPASA.png",
        "title": "Recuperação de obras  - CIPASA – Residencial Verana – Porto Velho/RO.",
        "images": [
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782413604430-Recupera__o_de_obras__-_CIPASA.png",
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782413608251-Recupera__o_de_obras__-_CIPASA1.png",
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782413611925-Recupera__o_de_obras__-_CIPASA2.png"
        ],
        "details": "Recuperação das Obras de Infraestrutura, compreendendo os sistemas de drenagem de águas pluviais, de abastecimento e distribuição de água potável, de coleta, afastamento e tratamento de esgotos sanitários, pavimentação - CIPASA – Residencial Verana – Porto Velho/RO.\n",
        "category": "COMERCIAL"
      },
      {
        "id": "proj-1782414028166",
        "image": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782413988191-Loteamento_urbano_Residencial_Green_Park.png",
        "title": "Implantação de loteamento urbano Residencial Green Park Candeias do Jamari/RO - Terraplanagem geral",
        "images": [
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782413988191-Loteamento_urbano_Residencial_Green_Park.png"
        ],
        "details": "Implantação de loteamento urbano Residencial Green Park Candeias do Jamari/RO - Terraplanagem geral",
        "category": "COMERCIAL"
      },
      {
        "id": "proj-1782414298935",
        "image": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782414285644-Movimenta__o_de_Material_Est_ril_na_unidade_CSNERSA.png",
        "title": "Movimentação de Material Estéril na unidade CSN/ERSA",
        "images": [
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782414285644-Movimenta__o_de_Material_Est_ril_na_unidade_CSNERSA.png"
        ],
        "details": "Movimentação de Material Estéril – 240.000 m³ - Escavação, carregamento, transporte e espalhamento no bota-fora – Na unidade CSN/ERSA localizada em Itapuã do Oeste/RO.\n",
        "category": "COMERCIAL"
      },
      {
        "id": "proj-1782414679727",
        "image": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782414665586-Movimenta__o_material_Votarantim_-_MT.png",
        "title": "Movimentação de Material Estéril - Votorantim Cimentos - Cuiabá/MT",
        "images": [
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782414665586-Movimenta__o_material_Votarantim_-_MT.png"
        ],
        "details": "Movimentação de Material Estéril – 3ª Categoria – Perfuração, Carregamento, Transporte e Espalhamento – 100.000 ton – Votorantim Cimentos - Cuiabá/MT.\n",
        "category": "COMERCIAL"
      },
      {
        "id": "proj-1782415020942",
        "image": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782414995688-Valle_Verde_Ji-Paran_.png",
        "title": "Implantação de loteamento urbano Residencial Valle Verde Jí-Paraná-RO",
        "images": [
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782414995688-Valle_Verde_Ji-Paran_.png",
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782415000553-Valle_Verde_Ji-Paran_1.png",
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782415004613-Valle_Verde_Ji-Paran_2.png"
        ],
        "details": "Implantação de loteamento urbano Residencial Valle Verde Jí-Paraná/RO - Execução completa das obras de infraestrutura de um loteamento de 510 lotes – Terraplanagem, drenagem e pavimentação TSD.\n",
        "category": "COMERCIAL"
      },
      {
        "id": "proj-1782485938935",
        "image": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782401729743-ALTEAMENTO_DO_TRECHO_DA_BR-364RO.png",
        "title": "Alteamento do Trecho da BR - 364/RO - Distrito de Jaci-Paraná",
        "images": [
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782401729743-ALTEAMENTO_DO_TRECHO_DA_BR-364RO.png",
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782401733445-ALTEAMENTO_DO_TRECHO_DA_BR-364RO1.png",
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782401736802-ALTEAMENTO_DO_TRECHO_DA_BR-364RO2.png",
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782402199359-ALTEAMENTO_DO_TRECHO_DA_BR-364RO4.png"
        ],
        "details": "Alteamento do Trecho da BR - 364/RO pelo Reservatório da UHE Santo Antônio, Distrito de Jaci-Paraná, Porto Velho - RO",
        "category": "COMERCIAL"
      }
    ],
    "title": "Portfólio de Obras",
    "ctaText": "VER TODOS OS PROJETOS"
  },
  "careersPage": {
    "formTitle": "FORMULÁRIO DE CADASTRO DE CURRÍCULO",
    "mainTitle": "Oportunidades em Engenharia de Obras e Gestão",
    "vacancies": [
      {
        "label": "Engenheiro Civil",
        "value": "ENGENHEIRO_CIVIL"
      },
      {
        "label": "Estagiário de Engenharia",
        "value": "ESTAGIARIO_DE_ENGENHARIA"
      },
      {
        "label": "Mestre de Obras / Encarregado",
        "value": "MESTRE_DE_OBRAS_ENCARREGADO"
      },
      {
        "label": "Técnico em Edificações / SST",
        "value": "TECNICO_DE_EDIFICACOES_SST"
      },
      {
        "label": "Setor Administrativo / Compras",
        "value": "ADMINISTRATIVO_COMPRAS"
      },
      {
        "label": "Outra oportunidade / Operacional",
        "value": "OUTRO"
      }
    ],
    "description": "Buscamos engenheiros civis, técnicos em edificações, mestres de obras, estagiários e profissionais operacionais, como pedreiros, motoristas, operadores de máquinas e auxiliares, comprometidos com a excelência, a segurança, a inovação e a entrega de resultados de qualidade.",
    "titlePrefix": "Processo de Seleção Contínuo"
  },
  "specialties": {
    "tag": "NOSSAS ATIVIDADES",
    "items": [
      {
        "id": "spec-1",
        "icon": "Layers",
        "image": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/spec-spec-1-1782762739863-793.jpg",
        "title": "MINERAÇÃO",
        "images": [
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/spec-gallery-spec-1-1782762740948-184.jpg",
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/spec-gallery-spec-1-1782762742221-104.jpg"
        ],
        "details": "Atuamos no segmento de mineração, realizando a lavra e o transporte de argila destinada à produção de cimento. Nossas operações são conduzidas com foco em segurança, eficiência e qualidade. Contamos com equipamentos adequados e uma equipe capacitada para garantir a continuidade das atividades. Nosso compromisso é fornecer matéria-prima de forma confiável, atendendo às demandas da indústria cimenteira.",
        "description": "Atuamos no segmento de mineração realizando a lavra e transporte de argila para produção de cimento."
      },
      {
        "id": "spec-3",
        "icon": "Compass",
        "image": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/spec-spec-3-1782762743489-360.png",
        "title": "TERRAPLANAGEM",
        "images": [
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/spec-gallery-spec-3-1782762745003-831.png",
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/spec-gallery-spec-3-1782762745699-111.jpg"
        ],
        "details": "Atuamos na execução de obras de terraplenagem, oferecendo soluções eficientes para preparação e conformação de terrenos. Contamos com uma equipe de profissionais capacitados e uma moderna frota de veículos e máquinas próprias, garantindo agilidade e qualidade na execução dos serviços. Nossos processos seguem rigorosos padrões de segurança e produtividade. Trabalhamos com compromisso, precisão e excelência em cada projeto realizado.",
        "description": "Obras de terraplenagem realizadas por profissionais capacitados com moderna frota de veículos e máquinas próprios específicos para esse segmento."
      },
      {
        "id": "spec-4",
        "icon": "Layers",
        "image": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/spec-spec-4-1782762746108-209.png",
        "title": "LOCAÇÃO DE MÁQUINAS",
        "images": [
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/spec-gallery-spec-4-1782762746620-404.png",
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/spec-gallery-spec-4-1782762747135-474.jpg",
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/spec-gallery-spec-4-1782762747540-530.png",
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/spec-gallery-spec-4-1782762748769-334.jpg"
        ],
        "details": "A Motriz Engenharia e Construções Ltda é parceira na sua obra através da locação de máquinas e equipamentos com ou sem operador.",
        "description": "A Motriz Engenharia e Construções Ltda é parceira na sua obra através da locação de máquinas e equipamentos com ou sem operador."
      },
      {
        "id": "spec-5",
        "icon": "Roller",
        "image": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/spec-spec-5-1782762749790-99.jpg",
        "title": "PAVIMENTAÇÃO",
        "images": [
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/spec-gallery-spec-5-1782762750680-379.jpg",
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782326663343-PAVIMENTA__O1.jpg",
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782398844753-PAVIMENTA__O3.png"
        ],
        "details": "Especialidade no cálculo de carga térmica de edificações complexas. Desenvolvemos projetos de ar condicionado central refrigerados a água ou ar (Chillers), redes de dutos de distribuição metálicos, sistemas VRF de alta economia energética e elaboração técnica de plano de manutenção e controle de ar condicionado (PMOC).",
        "description": "Projetos de engenharia termo-condicionada, sistemas VRF, PMOC e climatização central de alta eficiência."
      },
      {
        "id": "spec-6",
        "icon": "Droplet",
        "image": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782396789479-DRENAGEM.jpeg",
        "title": "DRENAGEM",
        "images": [
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782396789479-DRENAGEM.jpeg",
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782396798658-Drenagem1.png"
        ],
        "details": "Execução de obras de arte-corrente e especiais, destinadas à adequada travessia e condução de fluxos hídricos.Implantação de sistemas de drenagem superficial para captação e escoamento das águas pluviais.Realização de drenagem profunda, com estruturas voltadas ao controle e à estabilidade do solo.Execução de obras de micro e macrodrenagem, visando prevenir alagamentos e garantir a eficiência hidráulica.",
        "description": "Instalações hidráulicas prediais, tubulações de esgoto sanitário e captação técnica de águas pluviais na Amazônia."
      },
      {
        "id": "spec-1781896610787",
        "icon": "Compass",
        "image": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782397391144-TRANSPORTE_FLUVIAL.png",
        "title": "TRANSPORTE FLUVIAL",
        "images": [
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782397391144-TRANSPORTE_FLUVIAL.png",
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782397395320-TRANSPORTE_FLUVIAL1.png"
        ],
        "details": "Prestação de serviços de descarga e carregamento de insumos em embarcações e estruturas de apoio. Execução de operações logísticas voltadas à movimentação segura e eficiente de materiais. Realização de transporte fluvial de insumos, atendendo às necessidades operacionais e de abastecimento. Desenvolvimento de atividades com foco na agilidade, segurança e integridade das cargas transportadas.",
        "description": "Serviços de descarga, carregamento etransporte fluvial de insumos."
      },
      {
        "id": "spec-1781896636930",
        "icon": "Compass",
        "image": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782398020447-Constru__o_Civil.png",
        "title": "CONSTRUÇÃO CIVIL",
        "images": [
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782398020447-Constru__o_Civil.png",
          "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782398023914-CIVIL.jpeg"
        ],
        "details": "Contamos com sólida atuação no setor da construção civil e com equipe qualificada para realizar sua obra, garantindo excelência técnica e cumprimento dos prazos estabelecidos.",
        "description": "Possuímos ampla experiência e comprovada expertise no segmento da construção civil, estando plenamente capacitados para executar sua obra com qualidade, eficiência e segurança."
      }
    ],
    "title": "Especialidades Técnicas"
  },
  "careersEmail": "adson.maximo@motrizengenharia.com.br",
  "uploadedFiles": [
    {
      "id": "file-1781881498157",
      "name": "Code_Generated_Image.jfif (Nuvem)",
      "size": "390.3 KB",
      "type": "image/jpeg",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/lib-file-file-1781881498157-1782762757637-566.jpg"
    },
    {
      "id": "file-1781881503434",
      "name": "Code_Generated_Image1.jfif (Nuvem)",
      "size": "292.2 KB",
      "type": "image/jpeg",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/lib-file-file-1781881503434-1782762758980-22.jpg"
    },
    {
      "id": "file-1781884297377",
      "name": "CSN.png (Nuvem)",
      "size": "2.3 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/lib-file-file-1781884297377-1782762760135-391.png"
    },
    {
      "id": "file-1781893385693",
      "name": "Geral2.jpeg (Nuvem)",
      "size": "389.3 KB",
      "type": "image/jpeg",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/lib-file-file-1781893385693-1782762760752-302.jpg"
    },
    {
      "id": "file-1782160544650",
      "name": "CSAC.png (Nuvem)",
      "size": "60.2 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/lib-file-file-1782160544650-1782762762289-504.png"
    },
    {
      "id": "file-1782160556085",
      "name": "Andrade Gutierrez.png (Nuvem)",
      "size": "12.4 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/lib-file-file-1782160556085-1782762762694-622.png"
    },
    {
      "id": "file-1782160557835",
      "name": "Votarantim.jpg (Nuvem)",
      "size": "21.6 KB",
      "type": "image/jpeg",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/lib-file-file-1782160557835-1782762763210-85.jpg"
    },
    {
      "id": "file-1782160950771",
      "name": "direcional.jpeg (Nuvem)",
      "size": "16.2 KB",
      "type": "image/jpeg",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/lib-file-file-1782160950771-1782762763615-692.jpg"
    },
    {
      "id": "file-1782161053130",
      "name": "ODEBRECHT.png (Nuvem)",
      "size": "13.0 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/lib-file-file-1782161053130-1782762764025-48.png"
    },
    {
      "id": "file-1782161425952",
      "name": "Toshiba.png (Nuvem)",
      "size": "11.3 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/lib-file-file-1782161425952-1782762764435-181.png"
    },
    {
      "id": "file-1782161655613",
      "name": "guaporé.png (Nuvem)",
      "size": "17.4 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/lib-file-file-1782161655613-1782762764844-505.png"
    },
    {
      "id": "file-1782162637473",
      "name": "AMAGGI.png (Nuvem)",
      "size": "26.7 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/lib-file-file-1782162637473-1782762765253-961.png"
    },
    {
      "id": "file-1782240221075",
      "name": "NOVA 364.png (Nuvem)",
      "size": "20.9 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/lib-file-file-1782240221075-1782762765668-506.png"
    },
    {
      "id": "file-1782240230886",
      "name": "MEKA.jfif (Nuvem)",
      "size": "19.4 KB",
      "type": "image/jpeg",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/lib-file-file-1782240230886-1782762766201-906.jpg"
    },
    {
      "id": "file-1782240268132",
      "name": "TEIXEIRA DUARTE.png (Nuvem)",
      "size": "17.5 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/lib-file-file-1782240268132-1782762766570-512.png"
    },
    {
      "id": "file-1782240319901",
      "name": "HIDROVIAS DO BRASIL.jpg (Nuvem)",
      "size": "16.1 KB",
      "type": "image/jpeg",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/lib-file-file-1782240319901-1782762766885-652.jpg"
    },
    {
      "id": "file-1782240788963",
      "name": "Cargill.png (Nuvem)",
      "size": "14.2 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/lib-file-file-1782240788963-1782762767207-324.png"
    },
    {
      "id": "file-1782240795275",
      "name": "TGSA.jfif (Nuvem)",
      "size": "20.9 KB",
      "type": "image/jpeg",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/lib-file-file-1782240795275-1782762767711-595.jpg"
    },
    {
      "id": "file-1782241195024",
      "name": "CIPASA.png (Nuvem)",
      "size": "7.9 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/lib-file-file-1782241195024-1782762768124-537.png"
    },
    {
      "id": "file-1782241210246",
      "name": "PASSARELLI.png (Nuvem)",
      "size": "23.2 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/lib-file-file-1782241210246-1782762768532-116.png"
    },
    {
      "id": "file-1782242342965",
      "name": "TERRAPLANAGEM. 2png.jfif (Nuvem)",
      "size": "46.3 KB",
      "type": "image/jpeg",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/lib-file-file-1782242342965-1782762768939-299.jpg"
    },
    {
      "id": "file-1782242352514",
      "name": "TERRAPLANAGEM.png (Nuvem)",
      "size": "634.3 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/lib-file-file-1782242352514-1782762769353-589.png"
    },
    {
      "id": "file-1782243648560",
      "name": "PÁ CARREGAREIRA.jpg (Nuvem)",
      "size": "41.7 KB",
      "type": "image/jpeg",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/lib-file-file-1782243648560-1782762770864-957.jpg"
    },
    {
      "id": "file-1782243650983",
      "name": "PC200-10M0.png (Nuvem)",
      "size": "113.1 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/lib-file-file-1782243650983-1782762771259-511.png"
    },
    {
      "id": "file-1782243822907",
      "name": "TRATOR ESTEIRA.png (Nuvem)",
      "size": "199.4 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/lib-file-file-1782243822907-1782762772105-211.png"
    },
    {
      "id": "file-1782243994135",
      "name": "CAMINHÃO BASCULHANTE.jpg (Nuvem)",
      "size": "134.9 KB",
      "type": "image/jpeg",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/lib-file-file-1782243994135-1782762772938-857.jpg"
    },
    {
      "id": "file-1782244729032",
      "name": "PAVIMENTAÇÃO.jpg (Nuvem)",
      "size": "159.7 KB",
      "type": "image/jpeg",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/lib-file-file-1782244729032-1782762773958-355.jpg"
    },
    {
      "id": "file-1782326640176",
      "name": "PAVIMENTAÇÃO2.jpg (Nuvem)",
      "size": "115.6 KB",
      "type": "image/jpeg",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782326639199-PAVIMENTA__O2.jpg"
    },
    {
      "id": "file-1782326664275",
      "name": "PAVIMENTAÇÃO1.jpg (Nuvem)",
      "size": "231.4 KB",
      "type": "image/jpeg",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782326663343-PAVIMENTA__O1.jpg"
    },
    {
      "id": "file-1782396791087",
      "name": "DRENAGEM.jpeg (Nuvem)",
      "size": "221.7 KB",
      "type": "image/jpeg",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782396789479-DRENAGEM.jpeg"
    },
    {
      "id": "file-1782396799450",
      "name": "Drenagem1.png (Nuvem)",
      "size": "240.2 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782396798658-Drenagem1.png"
    },
    {
      "id": "file-1782397392335",
      "name": "TRANSPORTE FLUVIAL.png (Nuvem)",
      "size": "227.6 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782397391144-TRANSPORTE_FLUVIAL.png"
    },
    {
      "id": "file-1782397396525",
      "name": "TRANSPORTE FLUVIAL1.png (Nuvem)",
      "size": "232.5 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782397395320-TRANSPORTE_FLUVIAL1.png"
    },
    {
      "id": "file-1782398023677",
      "name": "Construção Civil.png (Nuvem)",
      "size": "1568.1 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782398020447-Constru__o_Civil.png"
    },
    {
      "id": "file-1782398024514",
      "name": "CIVIL.jpeg (Nuvem)",
      "size": "122.1 KB",
      "type": "image/jpeg",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782398023914-CIVIL.jpeg"
    },
    {
      "id": "file-1782398847297",
      "name": "PAVIMENTAÇÃO3.png (Nuvem)",
      "size": "1345.8 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782398844753-PAVIMENTA__O3.png"
    },
    {
      "id": "file-1782401731074",
      "name": "ALTEAMENTO DO TRECHO DA BR-364RO.png (Nuvem)",
      "size": "112.9 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782401729743-ALTEAMENTO_DO_TRECHO_DA_BR-364RO.png"
    },
    {
      "id": "file-1782401734235",
      "name": "ALTEAMENTO DO TRECHO DA BR-364RO1.png (Nuvem)",
      "size": "295.5 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782401733445-ALTEAMENTO_DO_TRECHO_DA_BR-364RO1.png"
    },
    {
      "id": "file-1782401737507",
      "name": "ALTEAMENTO DO TRECHO DA BR-364RO2.png (Nuvem)",
      "size": "149.4 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782401736802-ALTEAMENTO_DO_TRECHO_DA_BR-364RO2.png"
    },
    {
      "id": "file-1782402200528",
      "name": "ALTEAMENTO DO TRECHO DA BR-364RO4.png (Nuvem)",
      "size": "56.2 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782402199359-ALTEAMENTO_DO_TRECHO_DA_BR-364RO4.png"
    },
    {
      "id": "file-1782402853730",
      "name": "AMAGGI1.png (Nuvem)",
      "size": "157.3 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782402852800-AMAGGI1.png"
    },
    {
      "id": "file-1782402857958",
      "name": "AMAGGI2.png (Nuvem)",
      "size": "156.0 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782402856923-AMAGGI2.png"
    },
    {
      "id": "file-1782402863940",
      "name": "AMAGGI3.png (Nuvem)",
      "size": "286.4 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782402862991-AMAGGI3.png"
    },
    {
      "id": "file-1782402867548",
      "name": "AMAGGI4.png (Nuvem)",
      "size": "171.4 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782402866863-AMAGGI4.png"
    },
    {
      "id": "file-1782409422709",
      "name": "Aeroporto.png (Nuvem)",
      "size": "139.9 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782409421315-Aeroporto.png"
    },
    {
      "id": "file-1782409427996",
      "name": "Aeroporto3.png (Nuvem)",
      "size": "326.0 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782409426616-Aeroporto3.png"
    },
    {
      "id": "file-1782409430859",
      "name": "Aeroporto1.png (Nuvem)",
      "size": "189.2 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782409430212-Aeroporto1.png"
    },
    {
      "id": "file-1782409434937",
      "name": "Aeroporto2.png (Nuvem)",
      "size": "210.2 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782409433897-Aeroporto2.png"
    },
    {
      "id": "file-1782410025855",
      "name": "Faixa de Pista aeroporto.png (Nuvem)",
      "size": "218.1 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782410024027-Faixa_de_Pista_aeroporto.png"
    },
    {
      "id": "file-1782410030007",
      "name": "Faixa de Pista aeroporto1.png (Nuvem)",
      "size": "196.7 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782410029278-Faixa_de_Pista_aeroporto1.png"
    },
    {
      "id": "file-1782410125847",
      "name": "Faixa de Pista aeroporto2.png (Nuvem)",
      "size": "234.5 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782410124343-Faixa_de_Pista_aeroporto2.png"
    },
    {
      "id": "file-1782410875330",
      "name": "Vila Nova de Teotônio.png (Nuvem)",
      "size": "256.1 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782410873509-Vila_Nova_de_Teot_nio.png"
    },
    {
      "id": "file-1782410878040",
      "name": "Vila Nova de Teotônio1.png (Nuvem)",
      "size": "188.5 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782410877400-Vila_Nova_de_Teot_nio1.png"
    },
    {
      "id": "file-1782410882269",
      "name": "Vila Nova de Teotônio2.png (Nuvem)",
      "size": "310.1 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782410881075-Vila_Nova_de_Teot_nio2.png"
    },
    {
      "id": "file-1782410885723",
      "name": "Vila Nova de Teotônio3.png (Nuvem)",
      "size": "264.2 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782410885018-Vila_Nova_de_Teot_nio3.png"
    },
    {
      "id": "file-1782411225282",
      "name": "Vila Nova de Teotônio4.png (Nuvem)",
      "size": "206.7 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782411223469-Vila_Nova_de_Teot_nio4.png"
    },
    {
      "id": "file-1782411622871",
      "name": "Pátio da Estrada Madeira Mamoré.png (Nuvem)",
      "size": "180.4 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782411621080-P_tio_da_Estrada_Madeira_Mamor_.png"
    },
    {
      "id": "file-1782411626994",
      "name": "Pátio da Estrada Madeira Mamoré1.png (Nuvem)",
      "size": "236.1 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782411626000-P_tio_da_Estrada_Madeira_Mamor_1.png"
    },
    {
      "id": "file-1782411630814",
      "name": "Pátio da Estrada Madeira Mamoré2.png (Nuvem)",
      "size": "217.9 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782411629728-P_tio_da_Estrada_Madeira_Mamor_2.png"
    },
    {
      "id": "file-1782412195537",
      "name": "Movimentação interna de Insumos Votarantim.png (Nuvem)",
      "size": "211.9 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782412193465-Movimenta__o_interna_de_Insumos_Votarantim.png"
    },
    {
      "id": "file-1782412843798",
      "name": "Transporte fluvial de insumos da Votorantim.png (Nuvem)",
      "size": "153.6 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782412841936-Transporte_fluvial_de_insumos_da_Votorantim.png"
    },
    {
      "id": "file-1782413607724",
      "name": "Recuperação de obras  - CIPASA.png (Nuvem)",
      "size": "326.0 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782413604430-Recupera__o_de_obras__-_CIPASA.png"
    },
    {
      "id": "file-1782413609220",
      "name": "Recuperação de obras  - CIPASA1.png (Nuvem)",
      "size": "326.4 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782413608251-Recupera__o_de_obras__-_CIPASA1.png"
    },
    {
      "id": "file-1782413612850",
      "name": "Recuperação de obras  - CIPASA2.png (Nuvem)",
      "size": "332.5 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782413611925-Recupera__o_de_obras__-_CIPASA2.png"
    },
    {
      "id": "file-1782413990002",
      "name": "Loteamento urbano Residencial Green Park.png (Nuvem)",
      "size": "301.8 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782413988191-Loteamento_urbano_Residencial_Green_Park.png"
    },
    {
      "id": "file-1782414286975",
      "name": "Movimentação de Material Estéril na unidade CSNERSA.png (Nuvem)",
      "size": "316.5 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782414285644-Movimenta__o_de_Material_Est_ril_na_unidade_CSNERSA.png"
    },
    {
      "id": "file-1782414667385",
      "name": "Movimentação material Votarantim - MT.png (Nuvem)",
      "size": "347.0 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782414665586-Movimenta__o_material_Votarantim_-_MT.png"
    },
    {
      "id": "file-1782414997683",
      "name": "Valle Verde Ji-Paraná.png (Nuvem)",
      "size": "262.3 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782414995688-Valle_Verde_Ji-Paran_.png"
    },
    {
      "id": "file-1782415001885",
      "name": "Valle Verde Ji-Paraná1.png (Nuvem)",
      "size": "256.7 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782415000553-Valle_Verde_Ji-Paran_1.png"
    },
    {
      "id": "file-1782415005441",
      "name": "Valle Verde Ji-Paraná2.png (Nuvem)",
      "size": "302.5 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782415004613-Valle_Verde_Ji-Paran_2.png"
    },
    {
      "id": "file-1782482887669",
      "name": "Cargill - Porto Velho -RO.png (Nuvem)",
      "size": "283.8 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782482885911-Cargill_-_Porto_Velho_-RO.png"
    },
    {
      "id": "file-1782483509557",
      "name": "Cargill - Porto Velho -RO1.png (Nuvem)",
      "size": "228.6 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782483507660-Cargill_-_Porto_Velho_-RO1.png"
    },
    {
      "id": "file-1782483513088",
      "name": "Cargill - Porto Velho -RO2.png (Nuvem)",
      "size": "238.1 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782483512272-Cargill_-_Porto_Velho_-RO2.png"
    },
    {
      "id": "file-1782483893391",
      "name": "TGSA - Simões.png (Nuvem)",
      "size": "297.2 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782483891383-TGSA_-_Sim_es.png"
    },
    {
      "id": "file-1782485700285",
      "name": "NOVA BR 3641.png (Nuvem)",
      "size": "199.6 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782485699229-NOVA_BR_3641.png"
    },
    {
      "id": "file-1782485707605",
      "name": "NOVA BR 364.png (Nuvem)",
      "size": "227.5 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782485706615-NOVA_BR_364.png"
    },
    {
      "id": "file-1782486965218",
      "name": "SANTO ANTONIO.png (Nuvem)",
      "size": "22.4 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782486964711-SANTO_ANTONIO.png"
    },
    {
      "id": "file-1782487703720",
      "name": "Vinci_Airports.png (Nuvem)",
      "size": "15.3 KB",
      "type": "image/png",
      "dataUrl": "https://npnnnavejpwrddzukpmg.supabase.co/storage/v1/object/public/media/public/1782487702944-Vinci_Airports.png"
    }
  ]
};
