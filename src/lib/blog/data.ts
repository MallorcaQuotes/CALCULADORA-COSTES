export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  content: string[];
  author: string;
  authorRole: string;
  publicationDate: string;
  updatedDate: string;
  seoTitle: string;
  seoDescription: string;
  language: 'en' | 'es' | 'de';
  readingTime: string;
  relatedSlugs: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'cost-of-building-a-house-in-mallorca-guide',
    title: 'The Real Cost of Building a House in Mallorca (2026 Guide)',
    excerpt: 'An independent analysis of current construction costs per square meter across Balearic municipalities, from excavation to high-end finishes.',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    author: 'MallorcaQuotes Technical Desk',
    authorRole: 'Quantity Surveying & Estimation',
    publicationDate: '2026-09-15',
    updatedDate: '2026-09-20',
    seoTitle: 'Cost of Building a House in Mallorca in 2026 — Complete Guide',
    seoDescription: 'Discover realistic construction costs per square meter in Mallorca. Understand excavation, structural work, aerothermal systems and finish standards.',
    language: 'en',
    readingTime: '6 min read',
    relatedSlugs: ['understanding-mallorca-building-permits-licencia-de-obras', 'choosing-construction-qualities-mallorca'],
    content: [
      'Building a private villa or finca in Mallorca is one of the most rewarding real estate projects in the Mediterranean. However, self-promoters and foreign buyers frequently encounter unexpected financial discrepancies when comparing initial rough figures with actual regional market conditions.',
      'Unlike mainland Spain, the Balearic Islands operate under distinct logistical and supply dynamics. Raw materials such as structural steel, concrete aggregates, and premium tiles must be shipped to Palma port, which introduces an insular cost premium of between 12% and 20% compared to mainland benchmarks.',
      'In 2026, realistic construction costs in Mallorca typically break down across three quality tiers: Basic standards range from €1,600 to €2,000 per m²; Contemporary Medium quality with aerothermal HVAC ranges between €2,100 and €2,700 per m²; while High-End architectural villas featuring natural marés stone, minimalist panoramic glazing and integrated domotics exceed €2,800 to €3,800+ per m².',
      'Key cost drivers that must be budgeted early include excavation in rocky terrain (which is common in mountainous municipalities like Andratx or Sóller), structural concrete complying with regional seismic building codes, and advanced heating and cooling systems such as aerothermal heat pumps coupled with underfloor heating.',
      'Before entering into negotiations for a building plot or engaging contractors, establishing a reliable, independent budget framework is essential. Calculating your estimated construction cost range enables you to evaluate the financial feasibility of the land and maintain control throughout the design and tendering process.'
    ],
  },
  {
    slug: 'understanding-mallorca-building-permits-licencia-de-obras',
    title: 'Understanding Building Permits and Licences in Mallorca (Licencia de Obras)',
    excerpt: 'Everything you need to know about the municipal building permit process, technical architects, and municipal construction taxes (ICIO).',
    coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    author: 'MallorcaQuotes Technical Desk',
    authorRole: 'Planning & Regulatory Compliance',
    publicationDate: '2026-09-10',
    updatedDate: '2026-09-12',
    seoTitle: 'Building Permits in Mallorca: Licencia de Obras, ICIO & Timelines',
    seoDescription: 'Guide to Mallorca building licences, architectural projects, municipal fees and the role of the aparejador for foreign self-builders.',
    language: 'en',
    readingTime: '5 min read',
    relatedSlugs: ['cost-of-building-a-house-in-mallorca-guide'],
    content: [
      'Obtaining a major building licence (Licencia de Obra Mayor) is a critical milestone when planning a new home in Mallorca. Depending on whether your parcel is situated on urban land (suelo urbano) or rustic land (suelo rústico), the timeline and administrative requirements vary considerably.',
      'The regulatory workflow requires a collegiate architectural project (Proyecto Básico y de Ejecución) signed by a registered architect (Colegio Oficial de Arquitectos de las Islas Baleares - COAIB), as well as the appointment of a technical architect (Aparejador / Arquitecto Técnico) who serves as site health, safety and quality supervisor.',
      'Municipal construction costs include the Tax on Constructions, Installations and Works (ICIO), which is generally 3% to 4% of the material execution budget (PEM), alongside municipal administrative processing fees. Factoring an indicative 10% allowance for complete architectural design, engineering and licensing provides a prudent safety buffer.',
      'In high-demand municipalities such as Calvià, Santanyí or Pollença, municipal review times can range from 9 to 18 months. Having an organized project specification prepared in advance substantially accelerates urbanistic review.'
    ],
  },
  {
    slug: 'choosing-construction-qualities-mallorca',
    title: 'Choosing Construction Qualities: Basic vs High-End Mediterranean Finishes',
    excerpt: 'How material selections—from local marés limestone and double-glazed thermal breaks to aerothermal HVAC—impact your overall building budget.',
    coverImage: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
    author: 'MallorcaQuotes Technical Desk',
    authorRole: 'Architectural Specifications',
    publicationDate: '2026-09-01',
    updatedDate: '2026-09-05',
    seoTitle: 'Construction Qualities in Mallorca: Basic, Medium and Luxury Finishes',
    seoDescription: 'Compare building specifications in Mallorca. Learn how natural stone, high-performance glazing and climate systems affect your project budget.',
    language: 'en',
    readingTime: '4 min read',
    relatedSlugs: ['cost-of-building-a-house-in-mallorca-guide'],
    content: [
      'The choice of finish specifications is one of the most significant levers in controlling your villa construction budget. Understanding where quality upgrades deliver maximum longevity and energy efficiency is key.',
      'In the Mediterranean climate of Mallorca, investing in superior thermal envelope elements pays dividends. High-performance aluminum or minimalist timber-clad windows with acoustic and solar control glass minimize summer heat gain while retaining winter warmth.',
      'Similarly, pairing an aerothermal heat pump with underfloor heating and integrated ceiling fan coils provides consistent year-round climate control with exceptional seasonal energy efficiency (COP > 4.0).',
      'For facades and landscape design, dry-stone masonry (pared seca) and indigenous marés stone anchor the property to traditional Mallorcan vernacular while resisting weathering and sea-breeze salinity.'
    ],
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
