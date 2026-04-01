import { BlogPostStatus } from "@prisma/client";

export type PageRecord = {
  key: string;
  title: string;
  subtitle: string;
  bannerImage: string;
  seoTitle: string;
  seoDescription: string;
  isPublished: boolean;
  content: {
    body: string;
    heroCards?: Array<{
      title: string;
      description: string;
    }>;
  };
};

const media = {
  hero: "/piscina-hotel-iguassu.jpg",
  superior:
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  standard:
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  restaurant:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
  breakfast:
    "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1200&q=80",
  gallery:
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
  location:
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
  careers:
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
  blog:
    "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?auto=format&fit=crop&w=1200&q=80",
};

export const defaultSiteSettings = {
  id: 1,
  hotelName: "Iguassu Express Hotel",
  whatsapp: "+55 45 99999-0000",
  phone: "+55 45 3025-1900",
  email: "reservas@iguassuexpresshotel.com.br",
  address: "Rua Jorge Sanwais, 448, Foz do Iguaçu - PR",
  mapEmbed:
    '<iframe src="https://www.google.com/maps?q=Foz%20do%20Igua%C3%A7u&output=embed" width="100%" height="100%" style="border:0;" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  omnibeesHotelId: "2458",
  omnibeesBaseUrl: "https://book.omnibees.com/hotelresults",
  logo: "/logo-hotel-principal.png",
  favicon: "/favicon-hotel.png",
  socialLinks: {
    instagram: "https://instagram.com/iguassuexpresshotel",
    facebook: "https://facebook.com/iguassuexpresshotel",
  },
  seoTitle: "Iguassu Express Hotel | Hotel em Foz do Iguaçu",
  seoDescription:
    "Hotel em Foz do Iguaçu com localização estratégica, restaurante, conforto e reserva direta integrada com Omnibees.",
  institutionalBio:
    "O Iguassu Express Hotel recebe viajantes de lazer e negócios com uma proposta contemporânea, funcional e acolhedora em Foz do Iguaçu.",
};

export const defaultPages: PageRecord[] = [
  {
    key: "home",
    title: "Ponto de Partida <p> para a melhor experiência",
    subtitle:
      "Conforto, localização estratégica e reservas diretas para quem quer aproveitar o melhor da fronteira com praticidade e elegância.",
    bannerImage: media.hero,
    seoTitle: "Iguassu Express Hotel | Hotel em Foz do Iguaçu",
    seoDescription:
      "Hotel em Foz do Iguaçu com localização estratégica, restaurante, quartos confortáveis e reserva direta integrada com Omnibees.",
    isPublished: true,
    content: {
      body: "Bem-vindo ao Iguassu Express Hotel, um ponto de partida elegante para experiências memoráveis em Foz do Iguaçu.",
      heroCards: [
        {
          title: "Localização estratégica",
          description: "Acesso rápido ao aeroporto, atrativos e centros comerciais.",
        },
        {
          title: "Reserva direta",
          description: "Fluxo simples, rápido e conectado ao motor Omnibees.",
        },
        {
          title: "Experiência premium",
          description: "Design contemporaneo, atendimento acolhedor e excelente custo-beneficio.",
        },
      ],
    },
  },
  {
    key: "apartments",
    title: "Apartamentos para cada perfil de viagem",
    subtitle:
      "Categorias Standard e Superior com opcoes pensadas para hospedagens individuais, em casal, familia ou pequenas equipes.",
    bannerImage: media.superior,
    seoTitle: "Apartamentos | Iguassu Express Hotel",
    seoDescription:
      "Conheça os apartamentos Standard e Superior do Iguassu Express Hotel em Foz do Iguaçu.",
    isPublished: true,
    content: {
      body: "Escolha a acomodação ideal e descubra detalhes completos em um fluxo simples e inspirador.",
    },
  },
    {
      key: "restaurant",
      title: "Sabores para começar bem e aproveitar o dia",
      subtitle:
        "Café da manhã caprichado e serviço à la carte em um ambiente acolhedor dentro do hotel.",
      bannerImage: media.restaurant,
      seoTitle: "Restaurante | Iguassu Express Hotel",
      seoDescription:
        "Café da manhã e opção à la carte no restaurante do Iguassu Express Hotel.",
      isPublished: true,
      content: {
        body: "A gastronomia do hotel foi pensada para unir praticidade, sabor e um clima convidativo.",
      },
    },
  {
    key: "gallery",
    title: "Galeria de fotos",
    subtitle:
      "Um olhar sobre os ambientes, acomodações e experiência visual do Iguassu Express Hotel.",
    bannerImage: media.gallery,
    seoTitle: "Galeria de Fotos | Iguassu Express Hotel",
    seoDescription:
      "Veja fotos dos ambientes, apartamentos e estrutura do Iguassu Express Hotel.",
    isPublished: true,
    content: {
      body: "Use esta galeria para destacar estrutura, quartos e áreas de convivência com material profissional.",
    },
  },
  {
    key: "tour-360",
    title: "Explore cada detalhe antes da chegada",
    subtitle:
      "Ofereça uma visita imersiva para elevar a confiança na reserva direta e reduzir objeções.",
    bannerImage: media.hero,
    seoTitle: "Tour 360 | Iguassu Express Hotel",
    seoDescription: "Visite virtualmente o Iguassu Express Hotel com o tour 360.",
    isPublished: true,
    content: {
      body: "Quando o material estiver disponível, o embed ficará em destaque com mensagem clara e elegante.",
    },
  },
  {
    key: "location",
    title: "Localização estratégica em Foz do Iguaçu",
    subtitle:
      "Perto dos principais acessos da cidade, com deslocamento facilitado para turismo e viagens corporativas.",
    bannerImage: media.location,
    seoTitle: "Localização | Iguassu Express Hotel",
    seoDescription:
      "Descubra a localização estratégica do Iguassu Express Hotel em Foz do Iguaçu.",
    isPublished: true,
    content: {
      body: "A localização foi pensada para otimizar tempo e ampliar a conveniência do viajante moderno.",
    },
  },
  {
    key: "about",
    title: "Sobre o hotel",
    subtitle:
      "Hospitalidade contemporânea com foco em conforto, praticidade e atendimento próximo.",
    bannerImage: media.hero,
    seoTitle: "Sobre o Hotel | Iguassu Express Hotel",
    seoDescription:
      "Conheca a proposta, estrutura e diferenciais do Iguassu Express Hotel.",
    isPublished: true,
    content: {
      body: "O Iguassu Express Hotel une design limpo, atendimento acolhedor e uma estrutura funcional para viagens de lazer ou trabalho.",
    },
  },
  {
    key: "contact",
    title: "Fale com nossa equipe",
    subtitle:
      "Estamos prontos para atender dúvidas, grupos, parcerias e necessidades especiais de hospedagem.",
    bannerImage: media.location,
    seoTitle: "Contato | Iguassu Express Hotel",
    seoDescription:
      "Entre em contato com o Iguassu Express Hotel por WhatsApp, telefone, e-mail ou formulário.",
    isPublished: true,
    content: {
      body: "Escolha o canal mais conveniente e fale com o time do hotel em poucos minutos.",
    },
  },
  {
    key: "blog",
    title: "Blog e guia de Foz do Iguaçu",
    subtitle:
      "Conteúdo editorial para inspirar a viagem, responder dúvidas e ampliar o alcance orgânico do hotel.",
    bannerImage: media.blog,
    seoTitle: "Blog | Iguassu Express Hotel",
    seoDescription:
      "Dicas de viagem, gastronomia e experiências em Foz do Iguaçu no blog do Iguassu Express Hotel.",
    isPublished: true,
    content: {
      body: "Publique guias locais, roteiros e novidades do hotel com foco em SEO regional.",
    },
  },
  {
    key: "careers",
    title: "Carreiras no Iguassu Express Hotel",
    subtitle:
      "Junte-se a uma equipe que valoriza hospitalidade, atenção aos detalhes e crescimento profissional.",
    bannerImage: media.careers,
    seoTitle: "Carreiras | Iguassu Express Hotel",
    seoDescription:
      "Veja vagas abertas e envie seu currículo para o Iguassu Express Hotel.",
    isPublished: true,
    content: {
      body: "Buscamos pessoas comprometidas com uma experiência de hospedagem acolhedora, organizada e memorável.",
    },
  },
];

export const defaultRoomCategories = [
  {
    id: "standard",
    name: "Apartamentos Standard",
    slug: "standard",
    badge: "Mais reservado",
    description:
      "Acomodações reformadas para quem busca praticidade, conforto e excelente custo-benefício.",
    heroImage: media.standard,
    order: 1,
    isActive: true,
    rooms: [
      {
        id: "individual-standard",
        title: "Individual Standard",
        slug: "individual-standard",
        occupancy: 1,
        shortDescription: "Ideal para viagens solo com conforto na medida certa.",
        fullDescription:
          "Uma acomodação funcional e aconchegante, pensada para quem valoriza descanso, boa conectividade e serviços essenciais durante a estada.",
        features: [
          "Reformado",
          "Cama box",
          "Internet wi-fi",
          "Ar condicionado de janela",
          "Telefone",
          "TV LCD 32 polegadas a cabo",
          "Frigobar",
          "Aquecimento de água",
          "Servico de quarto",
        ],
        coverImage: media.standard,
        gallery: [media.standard, media.gallery],
        isActive: true,
        order: 1,
      },
      {
        id: "duplo-standard",
        title: "Duplo Standard",
        slug: "duplo-standard",
        occupancy: 2,
        shortDescription: "Hospedagem equilibrada para casal ou dupla de viagem.",
        fullDescription:
          "Entrega uma experiência acolhedora com visual limpo, boa circulação e todos os itens essenciais para uma estada sem complicações.",
        features: [
          "Reformado",
          "Cama box",
          "Internet wi-fi",
          "Ar condicionado de janela",
          "Telefone",
          "TV LCD 32 polegadas a cabo",
          "Frigobar",
          "Aquecimento de água",
          "Servico de quarto",
        ],
        coverImage: media.standard,
        gallery: [media.standard, media.hero],
        isActive: true,
        order: 2,
      },
      {
        id: "triplo-standard",
        title: "Triplo Standard",
        slug: "triplo-standard",
        occupancy: 3,
        shortDescription: "Boa opção para pequenas famílias ou grupos compactos.",
        fullDescription:
          "Mantém o conforto da categoria Standard com configuração inteligente para três hóspedes.",
        features: [
          "Reformado",
          "Cama box",
          "Internet wi-fi",
          "Ar condicionado de janela",
          "Telefone",
          "TV LCD 32 polegadas a cabo",
          "Frigobar",
          "Aquecimento de água",
          "Servico de quarto",
        ],
        coverImage: media.standard,
        gallery: [media.standard, media.location],
        isActive: true,
        order: 3,
      },
      {
        id: "standard-quadruplo",
        title: "Standard Quadruplo",
        slug: "standard-quadruplo",
        occupancy: 4,
        shortDescription: "Praticidade para grupos e famílias com excelente aproveitamento.",
        fullDescription:
          "Uma configuração versátil para quatro pessoas, com atmosfera acolhedora e serviços essenciais do hotel.",
        features: [
          "Reformado",
          "Cama box",
          "Internet wi-fi",
          "Ar condicionado de janela",
          "Telefone",
          "TV LCD 32 polegadas a cabo",
          "Frigobar",
          "Aquecimento de água",
          "Servico de quarto",
        ],
        coverImage: media.standard,
        gallery: [media.standard, media.gallery],
        isActive: true,
        order: 4,
      },
    ],
  },
  {
    id: "superior",
    name: "Apartamentos Superior",
    slug: "superior",
    badge: "Premium",
    description:
      "Unidades novas e sofisticadas para quem deseja um nivel extra de conforto e acabamento.",
    heroImage: media.superior,
    order: 2,
    isActive: true,
    rooms: [
      {
        id: "individual-superior",
        title: "Individual Superior",
        slug: "individual-superior",
        occupancy: 1,
        shortDescription: "Design renovado para uma experiência solo ainda mais agradável.",
        fullDescription:
          "Uma hospedagem com atmosfera contemporânea, acabamento atual e itens que elevam a sensação de conforto.",
        features: [
          "Novo",
          "Cama box nova",
          "Internet wi-fi",
          "Ar condicionado split",
          "Telefone",
          "TV LCD 32 polegadas a cabo",
          "Frigobar",
          "Aquecimento de água",
          "Servico de quarto",
        ],
        coverImage: media.superior,
        gallery: [media.superior, media.gallery],
        isActive: true,
        order: 1,
      },
      {
        id: "duplo-superior",
        title: "Duplo Superior",
        slug: "duplo-superior",
        occupancy: 2,
        shortDescription: "Conforto elevado para casal ou dupla que busca mais refinamento.",
        fullDescription:
          "Entrega uma experiência mais premium com renovação visual, climatização split e excelente funcionalidade.",
        features: [
          "Novo",
          "Cama box nova",
          "Internet wi-fi",
          "Ar condicionado split",
          "Telefone",
          "TV LCD 32 polegadas a cabo",
          "Frigobar",
          "Aquecimento de água",
          "Servico de quarto",
        ],
        coverImage: media.superior,
        gallery: [media.superior, media.hero],
        isActive: true,
        order: 2,
      },
      {
        id: "triplo-superior",
        title: "Triplo Superior",
        slug: "triplo-superior",
        occupancy: 3,
        shortDescription: "Espaço inteligente com acabamento moderno para três hóspedes.",
        fullDescription:
          "A categoria Superior em configuração tripla une praticidade, visual renovado e maior sensação de exclusividade.",
        features: [
          "Novo",
          "Cama box nova",
          "Internet wi-fi",
          "Ar condicionado split",
          "Telefone",
          "TV LCD 32 polegadas a cabo",
          "Frigobar",
          "Aquecimento de água",
          "Servico de quarto",
        ],
        coverImage: media.superior,
        gallery: [media.superior, media.location],
        isActive: true,
        order: 3,
      },
    ],
  },
];

export const defaultRestaurantContent = {
  id: 1,
  heroImage: media.restaurant,
  teaserTitle: "Sabores para a sua estada",
  teaserDescription:
    "Do café da manhã à opção à la carte, o restaurante foi desenhado para complementar uma experiência de hospedagem mais completa.",
  breakfastTitle: "Café da manhã incluso",
  breakfastDescription:
    "Comece o dia com uma mesa variada, ambiente acolhedor e uma seleção equilibrada para lazer ou viagens de negócios.",
  aLaCarteTitle: "Serviço à la carte",
  aLaCarteDescription:
    "Opções selecionadas para refeições práticas e saborosas sem sair do hotel.",
  images: [media.restaurant, media.breakfast, media.gallery],
  isBreakfastActive: true,
  isALaCarteActive: true,
};

export const defaultGalleryImages = [
  { id: "hotel-1", category: "Hotel", imageUrl: media.hero, altText: "Fachada do hotel", order: 1, isActive: true },
  { id: "restaurante-4", category: "Restaurante", imageUrl: media.restaurant, altText: "Ambiente do restaurante", order: 2, isActive: true },
  { id: "cafe-5", category: "Café da manhã", imageUrl: media.breakfast, altText: "Buffet de café da manhã", order: 3, isActive: true },
];

export const defaultTour360Content = {
  id: 1,
  title: "Tour 360 do Iguassu Express Hotel",
  description:
    "Gire as fotos panorâmicas do hotel para olhar os ambientes em 360 e antecipar a atmosfera da hospedagem.",
  embedUrl: "",
  heroImage: media.hero,
  gallery: [media.hero, media.gallery, media.location],
  scenes: [
    {
      id: "tour-scene-1",
      title: "Piscina panorâmica",
      description:
        "Gire a imagem para observar a area externa do hotel em um panorama mais imersivo.",
      image: media.hero,
    },
    {
      id: "tour-scene-2",
      title: "Ambiente interno 360",
      description:
        "Cena panorâmica complementar para apresentar os interiores do hotel com mais profundidade.",
      image: media.gallery,
    },
    {
      id: "tour-scene-3",
      title: "Chegada e acesso",
      description:
        "Uma terceira cena pensada para reforcar o contexto do hotel e a leitura espacial da hospedagem.",
      image: media.location,
    },
  ],
  isActive: true,
};

export const defaultLocationContent = {
  id: 1,
  title: "Acesso rápido aos principais pontos de Foz do Iguaçu",
  description:
    "Uma base estratégica para turismo, compras e compromissos corporativos na cidade e região de fronteira.",
  mapEmbed:
    '<iframe src="https://www.google.com/maps?q=Foz%20do%20Igua%C3%A7u&output=embed" width="100%" height="100%" style="border:0;" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
  nearbyPoints: [
    "Aeroporto Internacional de Foz do Iguaçu",
    "Cataratas do Iguaçu",
    "Centro comercial de Foz do Iguaçu",
    "Ponte da Amizade",
  ],
  heroImage: media.location,
  accessDetails:
    "A localização facilita deslocamentos por carro, táxi ou aplicativos, com saídas práticas para os principais atrativos e corredores da cidade.",
};

export const defaultBlogCategories = [
  { id: "foz-do-iguacu", name: "Foz do Iguaçu", slug: "foz-do-iguacu" },
];

export const defaultBlogPosts = [
  {
    id: "o-que-fazer-em-foz",
    title: "O que fazer em Foz do Iguaçu em um fim de semana",
    slug: "o-que-fazer-em-foz-do-iguacu-em-um-fim-de-semana",
    excerpt:
      "Um roteiro enxuto para quem quer aproveitar os principais destaques da cidade com conforto e praticidade.",
    content: `## Um roteiro eficiente\n\nFoz do Iguaçu permite combinar natureza, gastronomia e compras em poucos dias.\n\n### Dia 1\n\n- Chegada e check-in no hotel\n- Jantar leve no restaurante\n- Passeio noturno pela cidade\n\n### Dia 2\n\n- Visita as Cataratas do Iguaçu\n- Almoço regional\n- Retorno para descanso no hotel\n\n### Dia 3\n\n- Compras e retorno`,
    featuredImage: media.blog,
    categoryId: "foz-do-iguacu",
    seoTitle: "O que fazer em Foz do Iguaçu em um fim de semana",
    seoDescription:
      "Roteiro de fim de semana em Foz do Iguaçu com dicas para aproveitar melhor a viagem.",
    publishedAt: new Date(),
    status: BlogPostStatus.PUBLISHED,
  },
  {
    id: "como-escolher-hotel",
    title: "Como escolher o melhor hotel em Foz do Iguaçu",
    slug: "como-escolher-o-melhor-hotel-em-foz-do-iguacu",
    excerpt:
      "Veja quais critérios fazem diferença na hora de reservar sua hospedagem na cidade.",
    content: `## O que analisar antes de reservar\n\nProcure por localização, conforto, motor de reserva direto e uma experiência visual que transmita confiança.\n\n### Pontos importantes\n\n- Proximidade dos acessos\n- Tipos de apartamentos\n- Café da manhã\n- Atendimento e canais de contato`,
    featuredImage: media.hero,
    categoryId: "foz-do-iguacu",
    seoTitle: "Como escolher hotel em Foz do Iguaçu",
    seoDescription:
      "Descubra os critérios mais importantes para escolher onde se hospedar em Foz do Iguaçu.",
    publishedAt: new Date(),
    status: BlogPostStatus.PUBLISHED,
  },
];

export const defaultFaqItems = [
  {
    id: "faq-1",
    question: "O hotel possui café da manhã incluso?",
    answer:
      "Sim. O hotel oferece café da manhã em ambiente acolhedor, com apresentação elegante e foco em praticidade para começar bem o dia.",
    order: 1,
    isActive: true,
  },
  {
    id: "faq-2",
    question: "Como funciona a reserva online?",
    answer:
      "A busca valida as datas e ocupação, monta automaticamente a URL da Omnibees e leva você ao fluxo oficial de reserva direta.",
    order: 2,
    isActive: true,
  },
  {
    id: "faq-3",
    question: "Quais tipos de apartamentos estão disponíveis?",
    answer:
      "As categorias iniciais são Standard e Superior, com opções para uma, duas, três ou quatro pessoas conforme a configuração.",
    order: 3,
    isActive: true,
  },
  {
    id: "faq-4",
    question: "O hotel possui restaurante?",
    answer:
      "Sim. A estrutura conta com café da manhã e opção de serviço à la carte, ambos administráveis pelo painel.",
    order: 4,
    isActive: true,
  },
];

export const defaultCareerJobs = [
  {
    id: "recepcionista",
    title: "Recepcionista",
    slug: "recepcionista",
    description:
      "Atendimento ao hospede, check-in, check-out e suporte aos canais de contato do hotel.",
    isActive: true,
    order: 1,
  },
  {
    id: "governanca",
    title: "Auxiliar de governanca",
    slug: "auxiliar-de-governanca",
    description:
      "Apoio a operacao de limpeza, organizacao dos apartamentos e manutencao do padrao visual do hotel.",
    isActive: true,
    order: 2,
  },
];
