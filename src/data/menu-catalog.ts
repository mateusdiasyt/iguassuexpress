import slugify from "slugify";

export type MenuCatalogSeedItem = {
  name: string;
  description: string;
  price?: number | null;
  imageUrl?: string | null;
};

export type MenuCatalogSeedCategory = {
  name: string;
  slug: string;
  description: string;
  heroImage?: string | null;
  items?: MenuCatalogSeedItem[];
  children?: MenuCatalogSeedCategory[];
};

export type MenuItemNode = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string | null;
  price: number | null;
  imageUrl: string | null;
  order: number;
  isActive: boolean;
};

export type MenuCategoryNode = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  heroImage: string | null;
  order: number;
  isActive: boolean;
  parentId: string | null;
  items: MenuItemNode[];
  children: MenuCategoryNode[];
};

const menuMedia = {
  vinhos:
    "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80",
  cervejas:
    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80",
  uisques:
    "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=1200&q=80",
  caipirinhas:
    "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=80",
  frigobar:
    "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=1200&q=80",
  pratos:
    "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
  especiais:
    "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1200&q=80",
  saladas:
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
  sopas:
    "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80",
  tapioca:
    "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
  extras:
    "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80",
  lanches:
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80",
  pizzas:
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
  porcoes:
    "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?auto=format&fit=crop&w=1200&q=80",
  massas:
    "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=80",
  infantis:
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
  executivos:
    "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=80",
  sobremesas:
    "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1200&q=80",
  agua:
    "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=1200&q=80",
  refrigerantes:
    "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=1200&q=80",
  sucos:
    "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=1200&q=80",
};

function normalizeSlug(value: string) {
  return slugify(value, {
    lower: true,
    strict: true,
    trim: true,
  });
}

export const menuCatalogSeed: MenuCatalogSeedCategory[] = [
  {
    name: "Vinhos",
    slug: "vinhos",
    description: "Rotulos selecionados para acompanhar pratos com mais profundidade e equilibrio.",
    heroImage: menuMedia.vinhos,
    items: [
      {
        name: "Vinho Tinto Malbec",
        description: "Vinho tinto encorpado, ideal para acompanhar carnes vermelhas.",
        price: 100,
      },
      {
        name: "Vinho Tinto Cabernet Sauvignon",
        description: "Vinho tinto classico, equilibrado e intenso.",
        price: 100,
      },
      {
        name: "Taxa Rolha",
        description: "Taxa cobrada para consumo de vinho trazido pelo cliente.",
        price: 50,
      },
    ],
  },
  {
    name: "Cervejas",
    slug: "cervejas",
    description: "Opcoes leves, puro malte e rotulos premium para pedidos descontraidos.",
    heroImage: menuMedia.cervejas,
    items: [
      { name: "Skol Lata", description: "Cerveja leve e refrescante.", price: 9 },
      { name: "Brahma Lata", description: "Cerveja leve, sabor suave.", price: 9 },
      { name: "Heineken Lata", description: "Cerveja premium lager.", price: 12 },
      {
        name: "Original 600ml",
        description: "Cerveja puro malte, sabor encorpado.",
        price: 18,
      },
      {
        name: "Spaten 600ml",
        description: "Cerveja estilo alemao, sabor marcante.",
        price: 18,
      },
      {
        name: "Amstel 600ml",
        description: "Cerveja equilibrada e refrescante.",
        price: 18,
      },
      {
        name: "Heineken 600ml",
        description: "Cerveja premium importada.",
        price: 22,
      },
    ],
  },
  {
    name: "Uisques",
    slug: "uisques",
    description: "Doses classicas para um momento mais intenso e elegante.",
    heroImage: menuMedia.uisques,
    items: [
      { name: "Red Label", description: "Whisky escoces blended, sabor intenso.", price: 18 },
      {
        name: "Black Label",
        description: "Whisky escoces premium, envelhecido.",
        price: 24,
      },
    ],
  },
  {
    name: "Caipirinhas",
    slug: "caipirinhas",
    description: "Misturas refrescantes para acompanhar o clima leve do restaurante.",
    heroImage: menuMedia.caipirinhas,
    items: [
      { name: "Caipirinha", description: "Limao, acucar e cachaca.", price: 14 },
      {
        name: "Caipiroska Nacional",
        description: "Limao, acucar e vodka nacional.",
        price: 16,
      },
      {
        name: "Caipiroska Importada",
        description: "Limao, acucar e vodka importada.",
        price: 18,
      },
    ],
  },
  {
    name: "Frigobar",
    slug: "frigobar",
    description: "Pequenos snacks e conveniencias para pedidos rapidos no quarto.",
    heroImage: menuMedia.frigobar,
    items: [
      { name: "Batata Chips", description: "Batata crocante.", price: 8.75 },
      { name: "Amendoim", description: "Amendoim salgado.", price: 5 },
      { name: "Barra de Cereal", description: "Snack leve e nutritivo.", price: 3.75 },
      { name: "Trident", description: "Chiclete.", price: 3.75 },
      { name: "Chocolate", description: "Chocolate ao leite.", price: 5 },
    ],
  },
  {
    name: "Pratos Principais",
    slug: "pratos-principais",
    description: "Refeicoes completas com foco em conforto, sabor e boa apresentacao.",
    heroImage: menuMedia.pratos,
    items: [
      {
        name: "File Mignon ao Molho de Pimenta Verde",
        description:
          "File grelhado ao molho cremoso de pimenta verde, servido com arroz branco, batatas fritas, risoto de tomate seco e legumes.",
        price: 75,
      },
      {
        name: "File Mignon ao Molho Madeira",
        description:
          "File grelhado com molho madeira, servido com arroz, risoto de parmesao e batatas.",
        price: 75,
      },
      {
        name: "File a Parmegiana (Carne)",
        description:
          "File empanado coberto com molho de tomate e queijo, acompanhado de arroz e fritas.",
        price: 70,
      },
      {
        name: "File a Parmegiana (Frango)",
        description:
          "Peito de frango empanado com molho e queijo, servido com arroz e fritas.",
        price: 50,
      },
      {
        name: "Strogonoff de Carne",
        description:
          "Cubos de carne ao molho cremoso com champignon, acompanhado de arroz e batata palha.",
        price: 60,
      },
      {
        name: "Strogonoff de Frango",
        description: "Frango ao molho cremoso com champignon, arroz e batata palha.",
        price: 50,
      },
      {
        name: "Peito de Frango",
        description: "File de peito grelhado com acompanhamentos do dia.",
        price: 50,
      },
      {
        name: "Tilapia da Casa",
        description: "File de tilapia grelhado, servido com arroz, pure e legumes.",
        price: 60,
      },
      {
        name: "File de Peixe com Alcaparras",
        description: "File de peixe grelhado ao molho de alcaparras, com arroz e legumes.",
        price: 60,
      },
    ],
  },
  {
    name: "Especiais",
    slug: "especiais",
    description: "Receitas de assinatura para quem quer um pedido mais marcante.",
    heroImage: menuMedia.especiais,
    items: [
      {
        name: "Picanha Express",
        description: "Picanha grelhada acompanhada de arroz, fritas e salada.",
        price: 70,
      },
      {
        name: "Picadinho Especial (1 pessoa)",
        description: "Picadinho de carne com arroz, feijao, fritas e farofa.",
        price: 75,
      },
      {
        name: "Picadinho Especial (2 pessoas)",
        description: "Picadinho de carne completo para duas pessoas.",
        price: 125,
      },
    ],
  },
  {
    name: "Saladas",
    slug: "saladas",
    description: "Combinacoes leves e frescas para entradas ou refeicoes mais suaves.",
    heroImage: menuMedia.saladas,
    items: [
      {
        name: "Salada Mista",
        description: "Mix de folhas, tomate, cenoura, pepino e molho da casa.",
        price: 30,
      },
      {
        name: "Salada com Bruschetta",
        description: "Salada com pao tostado, tomate e temperos.",
        price: 35,
      },
      {
        name: "Salada Iguassu",
        description: "Mix especial com frutas, folhas e molho especial da casa.",
        price: 30,
      },
    ],
  },
  {
    name: "Sopas",
    slug: "sopas",
    description: "Opcoes quentes e aconchegantes para pedidos mais reconfortantes.",
    heroImage: menuMedia.sopas,
    items: [
      { name: "Canja", description: "Caldo de frango com legumes e arroz.", price: 30 },
      {
        name: "Creme de Ervilha com Bacon",
        description: "Creme de ervilha com pedacos de bacon.",
        price: 30,
      },
    ],
  },
  {
    name: "Tapioca",
    slug: "tapioca",
    description: "Versao versatil com recheios doces e salgados para pedidos leves.",
    heroImage: menuMedia.tapioca,
    items: [
      {
        name: "Tapioca (sabores variados)",
        description:
          "Tapioca recheada com opcoes como calabresa, frango, queijo, banana com canela, entre outros.",
        price: 30,
      },
    ],
  },
  {
    name: "Extras",
    slug: "extras",
    description: "Complementos prontos para uma refeicao rapida ou reforco fora de hora.",
    heroImage: menuMedia.extras,
    items: [
      {
        name: "Omelete Express",
        description: "Omelete com queijo, presunto, tomate e ervas.",
        price: 30,
      },
    ],
  },
  {
    name: "Lanches",
    slug: "lanches",
    description: "Sanduiches e combinacoes praticas para matar a fome com rapidez.",
    heroImage: menuMedia.lanches,
    items: [
      {
        name: "X-SALADA",
        description:
          "Pao de hamburguer, hamburguer, queijo, presunto, alface, tomate, milho e maionese.",
        price: 20,
      },
      {
        name: "X-BACON",
        description:
          "Pao de hamburguer, hamburguer, bacon, queijo, presunto, alface, tomate, milho e maionese.",
        price: 20,
      },
      {
        name: "X-IGUASSU",
        description:
          "Pao baguete, file grelhado, maionese, queijo mussarela, bacon, cheddar, alface e tomate.",
        price: 45,
      },
      {
        name: "X-EGG",
        description:
          "Pao de hamburguer, hamburguer, ovo, queijo, presunto, alface, tomate, milho e maionese.",
        price: 20,
      },
      {
        name: "CLUBE EXPRESS",
        description:
          "Pao preto, requeijao, frango desfiado, bacon, alface, tomate e milho.",
        price: 20,
      },
      {
        name: "MISTO QUENTE",
        description: "Pao de forma tostado, queijo, presunto e maionese.",
        price: 10,
      },
    ],
  },
  {
    name: "Pizzas",
    slug: "pizzas",
    description: "Sabores classicos para compartilhar ou resolver a refeicao com praticidade.",
    heroImage: menuMedia.pizzas,
    items: [
      {
        name: "CALABRESA",
        description: "Molho, mussarela, calabresa, cebola, azeitonas e oregano.",
        price: 35,
      },
      {
        name: "MUSSARELA",
        description: "Molho, mussarela, tomate e oregano.",
        price: 30,
      },
      {
        name: "FRANGO COM CATUPIRY",
        description: "Molho, mussarela, frango desfiado e catupiry.",
        price: 45,
      },
      {
        name: "PORTUGUESA",
        description:
          "Molho, mussarela, presunto, ovos, cebola, tomate, azeitona e oregano.",
        price: 45,
      },
      {
        name: "QUATRO QUEIJOS",
        description: "Molho, mussarela, provolone, catupiry e parmesao.",
        price: 45,
      },
    ],
  },
  {
    name: "Porcoes",
    slug: "porcoes",
    description: "Petiscos ideais para dividir, acompanhar bebidas ou completar o pedido.",
    heroImage: menuMedia.porcoes,
    items: [
      {
        name: "BATATA FRITA",
        description: "Porcao de batata frita crocante.",
        price: 25,
      },
      {
        name: "FILEZINHO FRANGO",
        description: "Tiras de frango empanado.",
        price: 40,
      },
      {
        name: "FRANGO A PASSARINHO",
        description: "Frango frito em pedacos.",
        price: 40,
      },
      {
        name: "CALABRESA ACEBOLADA",
        description: "Calabresa com cebola refogada.",
        price: 35,
      },
      {
        name: "SALADA DE FRIOS",
        description: "Mix de frios com queijos e embutidos.",
        price: 45,
      },
      {
        name: "ISCAS DE TILAPIA",
        description: "Tilapia empanada.",
        price: 50,
      },
    ],
  },
  {
    name: "Massas",
    slug: "massas",
    description: "Escolha a massa base e combine com o molho que preferir.",
    heroImage: menuMedia.massas,
    items: [
      {
        name: "MASSAS (BASE)",
        description: "Espaguete, Talharim, Nhoque ou Ravioli.",
        price: 25,
      },
    ],
    children: [
      {
        name: "Molhos Massas",
        slug: "molhos-massas",
        description: "Subcategoria de molhos para acompanhar a massa base.",
        heroImage: menuMedia.massas,
        items: [
          { name: "Bolonhesa", description: "Molho de carne tradicional." },
          { name: "Quatro Queijos", description: "Mistura de queijos." },
          { name: "Molho ao Sugo", description: "Molho de tomate." },
          { name: "Alho e Oleo com Bacon", description: "Alho, oleo e bacon." },
          { name: "Pesto", description: "Manjericao, azeite e parmesao." },
        ],
      },
    ],
  },
  {
    name: "Pratos Infantis",
    slug: "pratos-infantis",
    description: "Porcoes pensadas para os pequenos com combinacoes classicas e praticas.",
    heroImage: menuMedia.infantis,
    items: [
      {
        name: "JUNIOR FILE",
        description: "File com arroz, feijao e batata frita.",
        price: 45,
      },
      {
        name: "JUNIOR FRANGO",
        description: "Frango com arroz, feijao e batata frita.",
        price: 38,
      },
    ],
  },
  {
    name: "Pratos Executivos",
    slug: "pratos-executivos",
    description: "Pratos diretos e completos para o almoco ou jantar do dia a dia.",
    heroImage: menuMedia.executivos,
    items: [
      {
        name: "SERENO",
        description: "File de tilapia empanado com arroz e fritas.",
        price: 45,
      },
      {
        name: "BOB'S",
        description: "Peito de frango grelhado com arroz e fritas.",
        price: 38,
      },
    ],
  },
  {
    name: "Sobremesas",
    slug: "sobremesas",
    description: "Encerramentos doces para completar a experiencia a mesa.",
    heroImage: menuMedia.sobremesas,
    items: [
      {
        name: "PETIT GATEAU",
        description: "Bolinho de chocolate com sorvete e calda.",
        price: 35,
      },
      {
        name: "SALADA DE FRUTAS COM SORVETE",
        description: "Frutas frescas com sorvete.",
        price: 20,
      },
      {
        name: "SORVETE BOLA",
        description: "Bola de sorvete.",
        price: 7,
      },
      {
        name: "PRATO DE FRUTAS",
        description: "Frutas da estacao.",
        price: 15,
      },
      {
        name: "PALETAS",
        description: "Picole premium.",
        price: 12,
      },
    ],
  },
  {
    name: "Agua",
    slug: "agua",
    description: "Hidratacao simples e essencial para acompanhar qualquer pedido.",
    heroImage: menuMedia.agua,
    items: [
      { name: "AGUA SEM GAS", description: "Agua mineral sem gas.", price: 5 },
      { name: "AGUA COM GAS", description: "Agua mineral com gas.", price: 5 },
      { name: "AGUA TONICA", description: "Agua tonica.", price: 7 },
    ],
  },
  {
    name: "Refrigerantes",
    slug: "refrigerantes",
    description: "Latas classicas e refrescantes para pedidos rapidos e familiares.",
    heroImage: menuMedia.refrigerantes,
    items: [
      { name: "COCA-COLA", description: "Refrigerante Coca-Cola.", price: 7 },
      { name: "COCA ZERO", description: "Refrigerante Coca-Cola zero.", price: 7 },
      { name: "FANTA LARANJA", description: "Refrigerante sabor laranja.", price: 7 },
      { name: "GUARANA", description: "Refrigerante guarana.", price: 7 },
      { name: "SPRITE", description: "Refrigerante Sprite.", price: 7 },
    ],
  },
  {
    name: "Sucos",
    slug: "sucos",
    description: "Versoes naturais em copo ou jarra para pedidos individuais e compartilhados.",
    heroImage: menuMedia.sucos,
    items: [
      {
        name: "SUCO NATURAL COPO",
        description: "Suco natural (copo).",
        price: 12,
      },
      {
        name: "SUCO NATURAL JARRA PEQUENA",
        description: "Suco natural (jarra pequena).",
        price: 20,
      },
      {
        name: "SUCO NATURAL JARRA GRANDE",
        description: "Suco natural (jarra grande).",
        price: 38,
      },
    ],
  },
];

function buildItemNode(categoryId: string, categorySlug: string, item: MenuCatalogSeedItem, order: number): MenuItemNode {
  const slug = normalizeSlug(`${categorySlug}-${item.name}`);

  return {
    id: `menu-item-${slug}`,
    categoryId,
    name: item.name,
    slug,
    description: item.description || null,
    price: item.price ?? null,
    imageUrl: item.imageUrl ?? null,
    order,
    isActive: true,
  };
}

function buildCategoryNode(
  category: MenuCatalogSeedCategory,
  order: number,
  parentId: string | null = null,
): MenuCategoryNode {
  const id = `menu-category-${category.slug}`;

  return {
    id,
    name: category.name,
    slug: category.slug,
    description: category.description || null,
    heroImage: category.heroImage ?? null,
    order,
    isActive: true,
    parentId,
    items: (category.items ?? []).map((item, itemIndex) =>
      buildItemNode(id, category.slug, item, itemIndex),
    ),
    children: (category.children ?? []).map((child, childIndex) =>
      buildCategoryNode(child, childIndex, id),
    ),
  };
}

export function buildDefaultMenuCategories(): MenuCategoryNode[] {
  return menuCatalogSeed.map((category, index) => buildCategoryNode(category, index));
}
