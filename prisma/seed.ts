/**
 * Seeds Station, StationTranslation, Project, ProjectTranslation, ProjectImage,
 * Article, ArticleTranslation.
 *
 * Station copy is sourced from the same place the Phase-4-equivalent content
 * lives — kept here directly (not imported from src/shared/lib/content) because
 * station/project data is DATABASE-owned and filterable, unlike the typed
 * `content.ts` system, which is reserved for fixed, non-filterable editorial
 * content. Duplicating a *little* prose here is the correct tradeoff: importing
 * from `src/shared/lib/content` would blur the line the project brief draws
 * between the two content systems.
 *
 * Everything below that documents a specific completed project is flagged
 * `isPlaceholder: true` — see `entities/project/parse.ts` and the brief's launch
 * blocker list. None of it should ever be presented to a visitor as real work.
 */
import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { articles } from './seed-data/articles';

const connectionString = process.env['DATABASE_URL'];
if (!connectionString) {
  throw new Error('DATABASE_URL is not set. Copy .env.example to .env and fill it in.');
}
const adapter = new PrismaPg(connectionString);
const prisma = new PrismaClient({ adapter });

interface StationSeed {
  slug: '5kw' | '10kw' | '15kw' | '30kw' | 'custom';
  powerKw: number | null;
  systemType: 'grid-tied' | 'hybrid' | 'custom';
  accent: 'default' | 'gold';
  sortOrder: number;
  imagePath: string;
  /**
   * DEMO COMMERCIAL DATA — every figure below is invented so the product page
   * layout can be judged. Each station carries commercialIsPlaceholder: true,
   * which renders a visible badge beside the price and rating, so none of this
   * can reach a visitor presented as fact. Replace with real numbers and flip
   * the flag per station before launch.
   */
  priceEquipmentUah: number | null;
  priceInstallMinUah: number | null;
  priceInstallMaxUah: number | null;
  inStock: boolean | null;
  ratingValue: number | null;
  ratingCount: number | null;
  uk: {
    badge: string;
    title: string;
    intro: string;
    suitableFor: string[];
    outcomes: string[];
    kitMain: string[];
    kitExtra: string[];
    benefits: string[];
    specPurpose: string;
    specScalability: string;
  };
  en: StationSeed['uk'];
}

const stations: StationSeed[] = [
  {
    slug: '5kw',
    powerKw: 5,
    systemType: 'grid-tied',
    accent: 'default',
    sortOrder: 1,
    imagePath: '/stations/5kw.jpg',
    priceEquipmentUah: 118000,
    priceInstallMinUah: 22000,
    priceInstallMaxUah: 34000,
    inStock: true,
    ratingValue: 4.8,
    ratingCount: 12,
    uk: {
      badge: 'Стартова',
      title: 'Станція 5 кВт',
      intro:
        'Мережева станція для невеликого приватного будинку з денним споживанням до 400 кВт·год на місяць.',
      suitableFor: ['Будинок 80–120 м²', 'Родина з 2–4 осіб', 'Денне споживання'],
      outcomes: ['Скорочення рахунку за електрику на 50–70%'],
      kitMain: ['10 панелей Longi 500 Вт', 'Мережевий інвертор Huawei 5 кВт'],
      kitExtra: ['Кріплення під дах', 'Захист від дугового пробою'],
      benefits: ['Швидка окупність', 'Мінімум обслуговування', 'Просте розширення'],
      specPurpose: 'Самоспоживання вдень',
      specScalability: 'До 8 кВт без заміни інвертора',
    },
    en: {
      badge: 'Starter',
      title: '5 kW Station',
      intro:
        'A grid-tied station for a small private home with daytime consumption up to 400 kWh/month.',
      suitableFor: ['80–120 m² home', 'Family of 2–4', 'Daytime consumption'],
      outcomes: ['50–70% lower electricity bill'],
      kitMain: ['10x Longi 500W panels', 'Huawei 5kW grid-tied inverter'],
      kitExtra: ['Roof mounting kit', 'Arc-fault protection'],
      benefits: ['Fast payback', 'Minimal maintenance', 'Easy to expand'],
      specPurpose: 'Daytime self-consumption',
      specScalability: 'Up to 8 kW without an inverter swap',
    },
  },
  {
    slug: '10kw',
    powerKw: 10,
    systemType: 'hybrid',
    accent: 'default',
    sortOrder: 2,
    imagePath: '/stations/10kw.jpg',
    priceEquipmentUah: 196000,
    priceInstallMinUah: 28000,
    priceInstallMaxUah: 45000,
    inStock: true,
    ratingValue: 4.9,
    ratingCount: 21,
    uk: {
      badge: 'Популярна',
      title: 'Станція 10 кВт',
      intro: 'Гібридна станція з накопичувачем для будинку середнього розміру з резервом на випадок відключень.',
      suitableFor: ['Будинок 150–220 м²', 'Часті відключення в районі', 'Бажання резерву'],
      outcomes: ['Резерв критичних споживачів на 6–10 годин'],
      kitMain: ['18 панелей Jinko 555 Вт', 'Гібридний інвертор Deye 10 кВт', 'Батарея Pylontech 10 кВт·год'],
      kitExtra: ['Виділена група резерву', 'Моніторинг через застосунок'],
      benefits: ['Працює під час блекауту', 'Гнучке керування пріоритетами', 'Розширюваний накопичувач'],
      specPurpose: 'Самоспоживання + резерв',
      specScalability: 'До 15 кВт та додаткової батареї',
    },
    en: {
      badge: 'Most popular',
      title: '10 kW Station',
      intro: 'A hybrid station with storage for a mid-size home that wants backup during outages.',
      suitableFor: ['150–220 m² home', 'Frequent local outages', 'Wants backup power'],
      outcomes: ['6–10 hours of critical-load backup'],
      kitMain: ['18x Jinko 555W panels', 'Deye 10kW hybrid inverter', 'Pylontech 10kWh battery'],
      kitExtra: ['Dedicated backup circuit', 'App-based monitoring'],
      benefits: ['Works through blackouts', 'Flexible load priorities', 'Expandable storage'],
      specPurpose: 'Self-consumption + backup',
      specScalability: 'Up to 15 kW plus an additional battery',
    },
  },
  {
    slug: '15kw',
    powerKw: 15,
    systemType: 'hybrid',
    accent: 'default',
    sortOrder: 3,
    imagePath: '/stations/15kw.jpg',
    priceEquipmentUah: 271000,
    priceInstallMinUah: 34000,
    priceInstallMaxUah: 56000,
    inStock: false,
    ratingValue: 4.7,
    ratingCount: 8,
    uk: {
      badge: 'Розширена',
      title: 'Станція 15 кВт',
      intro: 'Гібридна станція для великого будинку або невеликого комерційного об’єкта з високим споживанням.',
      suitableFor: ['Будинок 220–350 м²', 'Опалення тепловим насосом', 'Високе споживання'],
      outcomes: ['Покриття до 90% річного споживання'],
      kitMain: ['27 панелей Jinko 555 Вт', 'Гібридний інвертор Deye 15 кВт', 'Батарея Pylontech 15 кВт·год'],
      kitExtra: ['Триетапна схема резерву', 'Інтеграція з тепловим насосом'],
      benefits: ['Покриває опалення та резерв', 'Модульна батарея', 'Трифазне підключення'],
      specPurpose: 'Самоспоживання + резерв',
      specScalability: 'До 30 кВт при переході на комерційну лінійку',
    },
    en: {
      badge: 'Extended',
      title: '15 kW Station',
      intro: 'A hybrid station for a large home or small commercial property with high consumption.',
      suitableFor: ['220–350 m² home', 'Heat-pump heating', 'High consumption'],
      outcomes: ['Covers up to 90% of annual consumption'],
      kitMain: ['27x Jinko 555W panels', 'Deye 15kW hybrid inverter', 'Pylontech 15kWh battery'],
      kitExtra: ['Three-stage backup circuit', 'Heat-pump integration'],
      benefits: ['Covers heating plus backup', 'Modular battery', '3-phase connection'],
      specPurpose: 'Self-consumption + backup',
      specScalability: 'Up to 30 kW when moving to the commercial line',
    },
  },
  {
    slug: '30kw',
    powerKw: 30,
    systemType: 'grid-tied',
    accent: 'default',
    sortOrder: 4,
    imagePath: '/stations/30kw.jpg',
    priceEquipmentUah: 468000,
    priceInstallMinUah: 52000,
    priceInstallMaxUah: 88000,
    inStock: false,
    ratingValue: 5,
    ratingCount: 5,
    uk: {
      badge: 'Комерційна',
      title: 'Станція 30 кВт',
      intro: 'Мережева або гібридна станція для комерційного об’єкта: виробництва, складу чи готелю.',
      suitableFor: ['Виробництво чи склад', 'Готель або заклад харчування', 'Стабільне денне навантаження'],
      outcomes: ['Скорочення операційних витрат на електрику'],
      kitMain: ['54 панелі Longi 555 Вт', 'Три інвертори Huawei 10 кВт', 'Трифазна схема підключення'],
      kitExtra: ['Дистанційний моніторинг для кількох об’єктів', 'Опційно — накопичувач 30 кВт·год'],
      benefits: ['Розрахунок під профіль навантаження', 'Пакет документів під зелений тариф', 'Гарантійний супровід сервісом'],
      specPurpose: 'Комерційне самоспоживання',
      specScalability: 'Масштабується до 100+ кВт кількома чергами',
    },
    en: {
      badge: 'Commercial',
      title: '30 kW Station',
      intro: 'A grid-tied or hybrid station for a commercial property: a factory, warehouse, or hotel.',
      suitableFor: ['Factory or warehouse', 'Hotel or food-service venue', 'Steady daytime load'],
      outcomes: ['Lower operating electricity costs'],
      kitMain: ['54x Longi 555W panels', '3x Huawei 10kW inverters', '3-phase connection'],
      kitExtra: ['Remote monitoring across multiple sites', 'Optional 30kWh battery'],
      benefits: ['Sized against your load profile', 'Green-tariff documentation package', 'Service-backed warranty'],
      specPurpose: 'Commercial self-consumption',
      specScalability: 'Scales past 100 kW across multiple phases',
    },
  },
  {
    slug: 'custom',
    powerKw: null,
    systemType: 'custom',
    accent: 'gold',
    sortOrder: 5,
    imagePath: '/stations/custom.jpg',
    priceEquipmentUah: null,
    priceInstallMinUah: null,
    priceInstallMaxUah: null,
    inStock: null,
    ratingValue: null,
    ratingCount: null,
    uk: {
      badge: 'Індивідуально',
      title: 'Індивідуальна конфігурація',
      intro: 'Ваш об’єкт не вписується у стандартну лінійку? Розрахуємо станцію під ваше споживання, дах і бюджет.',
      suitableFor: ['Нестандартний дах чи ділянка', 'Складний профіль споживання', 'Комбінація кількох цілей'],
      outcomes: ['Рішення, підібране саме під ваш об’єкт'],
      kitMain: ['Обладнання підбирається під проєкт'],
      kitExtra: ['Виїзд інженера включено'],
      benefits: ['Повна гнучкість конфігурації', 'Прозорий розрахунок після виїзду'],
      specPurpose: 'Визначається за результатами виїзду',
      specScalability: 'Без обмежень стандартної лінійки',
    },
    en: {
      badge: 'Custom',
      title: 'Custom Configuration',
      intro: 'Your property doesn’t fit the standard lineup? We’ll size a station for your consumption, roof, and budget.',
      suitableFor: ['Non-standard roof or plot', 'Complex consumption profile', 'Combining several goals'],
      outcomes: ['A solution sized specifically for your property'],
      kitMain: ['Equipment selected per project'],
      kitExtra: ['Engineer site visit included'],
      benefits: ['Full configuration flexibility', 'Transparent quote after the visit'],
      specPurpose: 'Determined after the site visit',
      specScalability: 'Not bound by the standard lineup',
    },
  },
];

interface ProjectSeed {
  slug: string;
  capacityKw: number;
  objectType: 'house' | 'business';
  usage: 'self' | 'green-tariff' | 'hybrid-backup';
  mountType: 'roof' | 'ground';
  locationKey: string;
  completedAt: string;
  coverImage: string;
  images: string[];
  uk: { title: string; summary: string; challenge: string; solution: string; result: string; locationName: string };
  en: ProjectSeed['uk'];
}

const projects: ProjectSeed[] = [
  {
    slug: 'bryukhovychi-house-8kw',
    capacityKw: 8,
    objectType: 'house',
    usage: 'self',
    mountType: 'roof',
    locationKey: 'bryukhovychi',
    completedAt: '2025-04-14',
    coverImage: '/projects/bryukhovychi-house-8kw.jpg',
    images: ['/projects/bryukhovychi-house-8kw.jpg'],
    uk: {
      title: 'Приватний будинок, Брюховичі — 8 кВт',
      summary: 'Мережева станція на металочерепиці для родини з високим денним споживанням.',
      challenge: 'Складна двоскатна покрівля з мансардними вікнами обмежувала корисну площу.',
      solution: 'Розмістили масив у два ряди з оптимізацією під частково затінені ділянки.',
      result: 'Скорочення рахунку за електрику приблизно на 65%.',
      locationName: 'Брюховичі',
    },
    en: {
      title: 'Private home, Bryukhovychi — 8 kW',
      summary: 'A grid-tied station on standing-seam metal roofing for a family with high daytime use.',
      challenge: 'A complex gabled roof with dormer windows limited usable area.',
      solution: 'Laid the array in two rows, optimized around partially shaded sections.',
      result: 'Roughly a 65% reduction in the electricity bill.',
      locationName: 'Bryukhovychi',
    },
  },
  {
    slug: 'lviv-hotel-25kw',
    capacityKw: 25,
    objectType: 'business',
    usage: 'self',
    mountType: 'roof',
    locationKey: 'lviv',
    completedAt: '2025-07-02',
    coverImage: '/projects/lviv-hotel-25kw.jpg',
    images: ['/projects/lviv-hotel-25kw.jpg'],
    uk: {
      title: 'Готель, Львів — 25 кВт',
      summary: 'Комерційна станція на плоскій покрівлі з баластним кріпленням.',
      challenge: 'Плоский дах без можливості пробивання гідроізоляції під кріплення.',
      solution: 'Баластна система кріплення з розрахунком вітрового навантаження.',
      result: 'Покриття близько 40% денного споживання готелю.',
      locationName: 'Львів',
    },
    en: {
      title: 'Hotel, Lviv — 25 kW',
      summary: 'A commercial station on a flat roof using ballasted mounting.',
      challenge: 'A flat roof where penetrating the waterproofing for mounts wasn’t an option.',
      solution: 'A ballasted mounting system engineered against wind-load calculations.',
      result: 'Covers roughly 40% of the hotel’s daytime consumption.',
      locationName: 'Lviv',
    },
  },
  {
    slug: 'horodok-farm-40kw',
    capacityKw: 40,
    objectType: 'business',
    usage: 'green-tariff',
    mountType: 'ground',
    locationKey: 'horodok',
    completedAt: '2024-11-20',
    coverImage: '/projects/horodok-farm-40kw.jpg',
    images: ['/projects/horodok-farm-40kw.jpg'],
    uk: {
      title: 'Фермерське господарство, Городоцький р-н — 40 кВт',
      summary: 'Наземна станція під зелений тариф на вільній ділянці поряд із господарськими будівлями.',
      challenge: 'Нерівна ділянка та віддалене підключення до вводу.',
      solution: 'Наземна конструкція на гвинтових палях і окрема трифазна лінія до щита.',
      result: 'Стабільний дохід від продажу надлишку електроенергії в мережу.',
      locationName: 'Городоцький р-н',
    },
    en: {
      title: 'Farm, Horodok district — 40 kW',
      summary: 'A ground-mounted green-tariff station on open land next to the farm buildings.',
      challenge: 'Uneven terrain and a long run back to the connection point.',
      solution: 'A ground mount on screw piles with a dedicated 3-phase run to the panel.',
      result: 'Steady income from selling surplus generation to the grid.',
      locationName: 'Horodok district',
    },
  },
  {
    slug: 'sokilnyky-house-12kw',
    capacityKw: 12,
    objectType: 'house',
    usage: 'hybrid-backup',
    mountType: 'roof',
    locationKey: 'sokilnyky',
    completedAt: '2025-01-30',
    coverImage: '/projects/sokilnyky-house-12kw.jpg',
    images: ['/projects/sokilnyky-house-12kw.jpg'],
    uk: {
      title: 'Приватний будинок, Сокільники — 12 кВт',
      summary: 'Гібридна станція з накопичувачем для будинку з частими відключеннями.',
      challenge: 'Регулярні відключення впливали на роботу теплового насоса та свердловинного насоса.',
      solution: 'Виділена група резерву для насосів і опалення, батарея 15 кВт·год.',
      result: 'Будинок продовжує опалюватись і мати воду під час відключень.',
      locationName: 'Сокільники',
    },
    en: {
      title: 'Private home, Sokilnyky — 12 kW',
      summary: 'A hybrid station with storage for a home hit by frequent outages.',
      challenge: 'Regular outages were disrupting the heat pump and well pump.',
      solution: 'A dedicated backup circuit for the pumps and heating, plus a 15kWh battery.',
      result: 'The home keeps heat and water running through outages.',
      locationName: 'Sokilnyky',
    },
  },
];

async function main() {
  for (const station of stations) {
    // Prices ARE admin-editable, so re-seeding must never overwrite a real one.
    // Structural fields (power, image, ordering) stay seed-owned and always
    // sync; the commercial block is refreshed only while the row is still
    // flagged as demo. Once someone enters a genuine price in the admin panel
    // and clears that flag, the seed stops touching it.
    const existing = await prisma.station.findUnique({
      where: { slug: station.slug },
      select: { commercialIsPlaceholder: true },
    });
    const commercials = {
      priceEquipmentUah: station.priceEquipmentUah,
      priceInstallMinUah: station.priceInstallMinUah,
      priceInstallMaxUah: station.priceInstallMaxUah,
      inStock: station.inStock,
      ratingValue: station.ratingValue,
      ratingCount: station.ratingCount,
      commercialIsPlaceholder: true,
    };
    const mayRefreshCommercials = !existing || existing.commercialIsPlaceholder;

    const record = await prisma.station.upsert({
      where: { slug: station.slug },
      update: {
        powerKw: station.powerKw,
        systemType: station.systemType,
        accent: station.accent,
        sortOrder: station.sortOrder,
        imagePath: station.imagePath,
        ...(mayRefreshCommercials ? commercials : {}),
      },
      create: {
        slug: station.slug,
        powerKw: station.powerKw,
        systemType: station.systemType,
        accent: station.accent,
        sortOrder: station.sortOrder,
        imagePath: station.imagePath,
        isPlaceholder: false,
        ...commercials,
      },
    });

    for (const locale of ['uk', 'en'] as const) {
      const t = station[locale];
      await prisma.stationTranslation.upsert({
        where: { stationId_locale: { stationId: record.id, locale } },
        update: {},
        create: {
          stationId: record.id,
          locale,
          badge: t.badge,
          title: t.title,
          intro: t.intro,
          suitableFor: t.suitableFor,
          outcomes: t.outcomes,
          kitMain: t.kitMain,
          kitExtra: t.kitExtra,
          benefits: t.benefits,
          specPurpose: t.specPurpose,
          specScalability: t.specScalability,
        },
      });
    }
  }

  for (const project of projects) {
    const record = await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: {
        slug: project.slug,
        capacityKw: project.capacityKw,
        objectType: project.objectType,
        usage: project.usage,
        mountType: project.mountType,
        locationKey: project.locationKey,
        completedAt: new Date(project.completedAt),
        coverImage: project.coverImage,
        isPlaceholder: true,
      },
    });

    for (const locale of ['uk', 'en'] as const) {
      const t = project[locale];
      await prisma.projectTranslation.upsert({
        where: { projectId_locale: { projectId: record.id, locale } },
        update: {},
        create: {
          projectId: record.id,
          locale,
          title: t.title,
          locationName: t.locationName,
          summary: t.summary,
          challenge: t.challenge,
          solution: t.solution,
          result: t.result,
        },
      });
    }

    await prisma.projectImage.deleteMany({ where: { projectId: record.id } });
    for (const [index, path] of project.images.entries()) {
      await prisma.projectImage.create({
        data: { projectId: record.id, path, sortOrder: index },
      });
    }
  }

  for (const article of articles) {
    const record = await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: {
        slug: article.slug,
        publishedAt: new Date(article.publishedAt),
        coverImage: article.coverImage,
      },
    });

    for (const locale of ['uk', 'en'] as const) {
      const t = article[locale];
      await prisma.articleTranslation.upsert({
        where: { articleId_locale: { articleId: record.id, locale } },
        update: {},
        create: {
          articleId: record.id,
          locale,
          title: t.title,
          excerpt: t.excerpt,
          body: t.body,
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
