/**
 * Real, technically accurate educational content — general solar-industry
 * knowledge (net metering mechanics, inverter selection criteria, seasonal
 * output physics), not claims about specific completed jobs. This is the one
 * kind of "written content" in this project that's safe to author directly:
 * unlike testimonials or case studies, an article doesn't impersonate a real
 * event or a real person's words.
 */

export interface ArticleSeed {
  slug: string;
  publishedAt: string;
  coverImage: string;
  uk: { title: string; excerpt: string; body: string[] };
  en: { title: string; excerpt: string; body: string[] };
}

export const articles: ArticleSeed[] = [
  {
    slug: 'green-tariff-vs-self-consumption',
    publishedAt: '2026-01-15',
    coverImage: '/placeholders/project-placeholder.svg',
    uk: {
      title: 'Зелений тариф чи самоспоживання: що вигідніше у 2026 році',
      excerpt:
        'Продавати надлишок електроенергії в мережу чи споживати її самому? Розбираємо механіку обох варіантів і коли який має сенс.',
      body: [
        'Коли власник сонячної станції вперше стикається з питанням «куди дівати зайву енергію», зазвичай спливають два варіанти: зелений тариф і самоспоживання. Це не взаємовиключні речі — правильніше сказати, що це два різні способи розпорядитись однією й тією самою кіловат-годиною, і вибір впливає на те, скільки років станція окуповуватиметься.',
        '## Як працює самоспоживання',
        'Самоспоживання — це найпростіший сценарій: сонячна станція генерує електроенергію вдень, і вона одразу йде на живлення побутових приладів у будинку. Лічильник просто менше рахує від мережі. Економічний ефект тут прямий і зрозумілий: кожна самоспожита кіловат-година рятує вас від оплати повного роздрібного тарифу — того, за яким ви купуєте електроенергію в обленерго.',
        'Головна умова, щоб самоспоживання давало хороший результат — щоб графік генерації станції збігався з графіком споживання будинку. Станція генерує вдень, тому будинки з денним навантаженням (робота з дому, електроплита, кондиціонер, зарядка електромобіля вдень) отримують максимум користі. Якщо основне споживання припадає на вечір і ніч, без накопичувача значна частина денної генерації просто піде в мережу — і тоді в гру вступає другий варіант.',
        '## Як працює зелений тариф',
        'Зелений тариф — це державна програма викупу електроенергії з відновлюваних джерел за фіксованою ставкою, яка історично була вищою за звичайний роздрібний тариф. Щоб потрапити на зелений тариф, станція має бути офіційно зареєстрована, підключена через двонаправлений облік (лічильник, який окремо рахує споживання з мережі й віддачу в мережу), а власник — укласти договір з обленерго та гарантованим покупцем.',
        'Це варіант, який має сенс, коли генерація станції суттєво перевищує власне споживання — наприклад, велика станція на невеликому будинку, або комерційний об’єкт із вихідними днями, коли виробництво продовжується, а споживання падає. У такому випадку продаж надлишку — це реальний дохід, а не просто спосіб «не втрачати» вироблену енергію.',
        '## Що вигідніше на практиці',
        'Для типового приватного будинку з денним споживанням самоспоживання сьогодні майже завжди вигідніше: воно економить повний роздрібний тариф за кожну кіловат-годину, тоді як тариф викупу історично нижчий за роздрібний і залежить від державної політики, яка може змінюватись. Зелений тариф стає цікавим, коли розмір станції розрахований із запасом — наприклад, під майбутнє розширення споживання (електромобіль, тепловий насос) — і поки цей запас не використовується повністю, надлишок є сенс продавати, а не втрачати.',
        'На практиці більшість наших проєктів для приватних будинків налаштовані на пріоритетне самоспоживання з можливістю продажу залишку — це дає найкращий баланс без потреби вибирати щось одне назавжди. Остаточне рішення завжди залежить від конкретного профілю споживання об’єкта, і саме тому ми рахуємо це індивідуально, а не за загальною формулою.',
      ],
    },
    en: {
      title: 'Green Tariff vs. Self-Consumption: What Pays Off in 2026',
      excerpt:
        'Sell surplus electricity back to the grid, or use it yourself? A look at how both options actually work and when each makes sense.',
      body: [
        'When a solar station owner first runs into the question of "what happens to the extra energy," two options usually come up: the green tariff and self-consumption. These aren\'t mutually exclusive — it\'s more accurate to say they\'re two different ways of using the same kilowatt-hour, and the choice affects how many years it takes the station to pay for itself.',
        '## How self-consumption works',
        "Self-consumption is the simplest scenario: the solar station generates electricity during the day, and it goes straight into powering the home's appliances. The meter simply counts less from the grid. The financial effect is direct and easy to understand: every self-consumed kilowatt-hour saves you the full retail tariff — the rate you'd otherwise pay the utility to buy that electricity.",
        "The key condition for self-consumption to pay off well is that the station's generation curve overlaps with the home's consumption curve. A station generates during the day, so homes with daytime load (working from home, an electric stove, air conditioning, daytime EV charging) get the most benefit. If most consumption happens in the evening and at night, a significant share of the daytime generation goes straight to the grid without a battery — and that's where the second option comes in.",
        '## How the green tariff works',
        "The green tariff is a government program that buys electricity from renewable sources at a fixed rate, historically higher than the standard retail tariff. To qualify, a station has to be officially registered, connected through bidirectional metering (a meter that separately counts consumption from the grid and export to the grid), and the owner has to sign a contract with the local grid operator and the guaranteed buyer.",
        'This option makes sense when a station\'s generation clearly exceeds its own consumption — a large station on a small house, for example, or a commercial site with weekends off where production continues but consumption drops. In that case, selling the surplus is real income, not just a way to avoid "wasting" generated energy.',
        '## Which one actually pays off',
        "For a typical private home with daytime consumption, self-consumption is almost always the better deal today: it saves the full retail tariff on every kilowatt-hour, while the green tariff's buyback rate is historically lower than retail and depends on government policy that can change. The green tariff gets interesting when a station is sized with headroom — for future consumption growth like an EV or a heat pump — and until that headroom is actually used, selling the surplus beats losing it.",
        "In practice, most of our residential projects are configured to prioritize self-consumption with the remainder sold — this gives the best balance without having to commit to one approach forever. The right answer always depends on the specific property's consumption profile, which is exactly why we calculate it individually rather than off a general formula.",
      ],
    },
  },
  {
    slug: 'choosing-a-solar-inverter',
    publishedAt: '2026-02-10',
    coverImage: '/placeholders/project-placeholder.svg',
    uk: {
      title: 'Як обрати інвертор для сонячної станції',
      excerpt:
        'Інвертор — це «мозок» станції. На що дивитись при виборі: потужність, тип, фазність і на що не варто економити.',
      body: [
        'Панелі виробляють постійний струм, а будинок і мережа працюють на змінному — інвертор перетворює одне на інше, і від нього залежить не менше половини надійності всієї станції. Панелі можуть служити 25+ років практично без обслуговування, а от інвертор — компонент, який найімовірніше доведеться замінити хоча б раз за цей час. Тому підхід «інвертор дешевший — значить економніший» часто працює навпаки.',
        '## Мережевий чи гібридний',
        'Мережевий (grid-tied) інвертор — найпростіший і найдешевший варіант: він синхронізується з мережею і за нормами автоматично вимикається під час відключення світла. Це цілком нормальний вибір, якщо головна мета станції — економія на рахунках, а не резерв. Гібридний інвертор додатково вміє працювати з батареєю і переключати живлення на резервну лінію при зникненні мережі — за це він коштує більше, але саме він розв’язує задачу «щоб світло не зникало під час відключень».',
        'Помилка, яку ми бачимо часто: людина ставить мережевий інвертор, а через рік-два вирішує додати накопичувач — і з’ясовує, що потрібно міняти весь інвертор, а не просто докупити батарею. Якщо резерв на випадок відключень — це питання «поки не зараз, але, можливо, пізніше», інвертор варто одразу брати гібридний.',
        '## Потужність і фазність',
        'Потужність інвертора підбирається під потужність масиву панелей, а не навпаки — типове співвідношення близько 1:1, з невеликим запасом (10–20%) для панелей, оскільки реальна генерація рідко досягає паспортної потужності одночасно на всіх ділянках даху. Занадто потужний інвертор під невеликий масив — це переплата без користі; занадто слабкий — це втрата частини виробітку в сонячні дні.',
        'Фазність підключення інвертора має відповідати фазності вводу в будинок. На одну фазу підключений однофазний інвертор до певної потужності (зазвичай орієнтир — до 10–15 кВт, залежно від обмежень обленерго на вашій ділянці мережі) працює без проблем; для більших станцій або трифазного вводу потрібен трифазний інвертор — інакше виникає дисбаланс фаз, який не завжди приймає мережевий оператор.',
        '## На що ще звернути увагу',
        'Кількість MPPT-трекерів (незалежних входів для стрічок панелей) визначає, наскільки гнучко можна розташувати масив — наприклад, частину панелей на південному схилі даху, а частину на східному, з різним кутом і освітленням, без втрати ефективності через «найслабшу ланку». Ступінь захисту IP65 і вище потрібен, якщо інвертор монтується зовні; якість застосунку моніторингу — це не дрібниця, а те, чим ви користуватиметесь щодня, щоб бачити реальний виробіток.',
        'І нарешті — гарантія та наявність сервісу в Україні. П’ятирічна базова гарантія виробника — це норма ринку; більший строк — плюс, але тільки якщо є з ким мати справу локально, якщо інвертор вийде з ладу. Бренд без представництва чи сервісного партнера в країні — це ризик, який не видно в момент покупки, але відчутний за кілька років.',
      ],
    },
    en: {
      title: 'How to Choose a Solar Inverter',
      excerpt:
        "The inverter is the station's brain. What actually matters when choosing one: power rating, type, phase, and where not to cut corners.",
      body: [
        "Panels produce direct current, while the home and the grid run on alternating current — the inverter converts one into the other, and it accounts for at least half of the whole station's reliability. Panels can last 25+ years with essentially no maintenance, but the inverter is the component most likely to need replacing at least once in that time. So \"cheaper inverter means more economical\" often works the other way around.",
        '## Grid-tied or hybrid',
        "A grid-tied inverter is the simplest and cheapest option: it synchronizes with the grid and, by code, shuts off automatically during an outage. That's a perfectly reasonable choice if the station's main goal is lowering bills rather than backup power. A hybrid inverter can additionally work with a battery and switch power to a backup circuit when the grid drops — it costs more, but it's the one that actually solves \"I don't want the lights to go out during an outage.\"",
        "A mistake we see often: someone installs a grid-tied inverter, then a year or two later decides to add storage — and finds out the whole inverter needs replacing, not just a battery bought on top. If backup power is a \"not right now, but maybe later\" question, it's worth getting a hybrid inverter from the start.",
        '## Power rating and phase',
        "An inverter's power rating is sized against the panel array's power, not the other way around — a typical ratio is roughly 1:1, with a small (10-20%) headroom for the panels, since real generation rarely hits nameplate power on every section of the roof at once. An inverter oversized for a small array is money spent for no benefit; one that's undersized loses part of the output on sunny days.",
        "The inverter's connection phase has to match the home's incoming phase. A single-phase inverter connected to one phase works fine up to a certain power (typically around 10-15 kW, depending on the local grid operator's limits on your section of the network); larger stations or a three-phase supply need a three-phase inverter — otherwise you get a phase imbalance that the grid operator doesn't always accept.",
        '## What else to look at',
        'The number of MPPT trackers (independent inputs for panel strings) determines how flexibly the array can be laid out — some panels on a south-facing roof section and some on an east-facing one, at different angles and light exposure, without losing efficiency to the "weakest link." An IP65+ rating matters if the inverter is mounted outdoors; the quality of the monitoring app isn\'t a minor detail either — it\'s what you\'ll actually use daily to see real output.',
        "And finally: warranty and local service availability. A 5-year base manufacturer warranty is the market norm; a longer one is a plus, but only if there's someone to deal with locally if the inverter fails. A brand with no local presence or service partner is a risk that's invisible at purchase time but very real a few years in.",
      ],
    },
  },
  {
    slug: 'solar-output-in-winter',
    publishedAt: '2026-03-05',
    coverImage: '/placeholders/project-placeholder.svg',
    uk: {
      title: 'Скільки сонячна станція виробляє взимку',
      excerpt:
        'Взимку станція виробляє менше — але не через холод чи хмарність. Пояснюємо, чому головний фактор — довжина світлового дня, і як це впливає на розрахунок системи.',
      body: [
        'Одне з найпоширеніших запитань перед встановленням станції: «а взимку вона взагалі працює?». Відповідь — так, і навіть ефективніше на одиницю сонячного світла, ніж влітку. Але сумарний виробіток все одно падає, і причина не та, яку зазвичай очікують.',
        '## Чому мороз — не проблема',
        'Сонячні панелі — це напівпровідникові пристрої, і, як більшість електроніки, вони працюють ефективніше при нижчій температурі. Панель при -5°C генерує більше електроенергії з тієї самої кількості сонячного світла, ніж та сама панель при +35°C влітку. Тому холод сам по собі — не ворог виробітку, а навпаки, невеликий бонус до ефективності.',
        'Хмарність теж не зупиняє генерацію повністю: панелі продовжують виробляти електроенергію в похмурий день, просто в рази менше, ніж під прямим сонцем. Сніг на панелях — тимчасова проблема: за правильного кута нахилу (від 30° і більше) сніг з’їжджає сам протягом одного-двох днів після снігопаду, і додаткове обслуговування зазвичай не потрібне.',
        '## Справжня причина — довжина дня',
        'Головний фактор зимового падіння виробітку — це тривалість світлового дня і низький кут сонця над горизонтом. У грудні-січні у Львівській області світловий день триває приблизно 8 годин проти 16 влітку, і сонце більшу частину дня стоїть низько, під гострим кутом до панелей. У сумі це дає орієнтовно 20–30% від літнього рівня виробітку — і ця цифра стабільна з року в рік, на відміну від погоди.',
        '## Що це означає для розрахунку системи',
        'Розмір станції не можна рахувати виключно по літньому піку — це найпоширеніша помилка в самостійних онлайн-розрахунках. Правильний підхід — рахувати річний баланс помісячно, зіставляючи виробіток кожного місяця з реальним споживанням у цей самий місяць. Для будинку з опаленням тепловим насосом взимку споживання зростає саме тоді, коли виробіток падає — і це прямий аргумент на користь гібридної системи з накопичувачем: влітку станція заряджає батарею надлишком, а взимку менший, але стабільний виробіток продовжує розвантажувати мережу вдень.',
        'Саме тому ми ніколи не показуємо один усереднений «річний виробіток у кВт·год» без розбивки по місяцях — цифра, яка виглядає переконливо влітку на екрані калькулятора, нічого не каже про те, як система поводитиметься в лютому, коли рахунки за опалення найвищі, а сонця найменше.',
      ],
    },
    en: {
      title: 'How Much a Solar Station Produces in Winter',
      excerpt:
        "Output drops in winter — but not because of cold or cloud cover. Here's why day length is the real factor, and what it means for sizing a system.",
      body: [
        'One of the most common questions before installing a station is "does it even work in winter?" The answer is yes — and actually more efficiently per unit of sunlight than in summer. But total output still drops, and not for the reason most people expect.',
        "## Why cold isn't the problem",
        "Solar panels are semiconductor devices, and like most electronics, they work more efficiently at lower temperatures. A panel at -5°C generates more electricity from the same amount of sunlight than the same panel at +35°C in summer. So cold by itself isn't the enemy of output — if anything, it's a small efficiency bonus.",
        "Cloud cover doesn't stop generation entirely either: panels keep producing electricity on an overcast day, just at a fraction of direct-sun output. Snow on the panels is a temporary issue: at a proper tilt angle (30° or more), snow slides off on its own within a day or two of a snowfall, and extra maintenance usually isn't needed.",
        '## The real reason — day length',
        "The main driver of the winter drop is the length of daylight and the low angle of the sun above the horizon. In December and January in the Lviv region, daylight lasts roughly 8 hours versus 16 in summer, and the sun sits low, at a shallow angle to the panels, for most of the day. Combined, that gives roughly 20-30% of summer-level output — and that figure is stable year to year, unlike weather.",
        '## What this means for sizing a system',
        'A station\'s size can\'t be calculated purely off the summer peak — that\'s the most common mistake in DIY online calculations. The right approach is a month-by-month annual balance, matching each month\'s output against actual consumption in that same month. For a home heated by a heat pump, winter consumption rises exactly when output drops — a direct argument for a hybrid system with storage: in summer the station charges the battery with the surplus, and in winter a smaller but steady output keeps offloading the grid during the day.',
        'That\'s exactly why we never show a single averaged "annual output in kWh" without a month-by-month breakdown — a number that looks convincing on a calculator screen in summer says nothing about how the system behaves in February, when heating bills are highest and sunlight is scarcest.',
      ],
    },
  },
];
