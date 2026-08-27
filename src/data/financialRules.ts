export type LocalizedText = {
  en: string
  ru: string
  uz: string
}

export type FinancialRule = {
  id: number
  title: LocalizedText
  category: string
  isPro: boolean
  shortDescription: LocalizedText
  fullExplanation: LocalizedText
  example: LocalizedText
  whyItMatters: LocalizedText
  source: LocalizedText
  author?: LocalizedText
  formula: LocalizedText
  interactiveAction?: string
  teaser?: LocalizedText
}

export const financialRules: FinancialRule[] = [
  {
    id: 1,
    title: { en: 'Pay Yourself First', ru: 'Платите себе сначала', uz: 'Avval o’zingizga pul to’lang' },
    category: 'Savings',
    isPro: false,
    shortDescription: { en: 'Save around 10% of net income before other spending starts.', ru: 'Откладывайте около 10% чистого дохода до остальных расходов.', uz: 'Boshqa xarajatlar boshlanishidan oldin sof daromadning taxminan 10% ni jamg’arang.' },
    fullExplanation: { en: 'A practical guideline is to move about 10% of net income into savings or investments before paying for other expenses. It is a useful starting point, not a universal requirement for every household.', ru: 'Практичное правило — переводить около 10% чистого дохода в сбережения или инвестиции до оплаты остальных расходов. Это полезная отправная точка, а не универсное требование для каждой семьи.', uz: 'Amaliy ko’rsatma — boshqa xarajatlarni to’lashdan oldin sof daromadning taxminan 10% ni jamg’arma yoki investitsiyalarga yo’naltirish. Bu har bir uy xo’jaligi uchun universal talab emas, balki foydali boshlang’ich nuqtadir.' },
    example: { en: 'Income: 10,000,000 UZS. 10% target: 1,000,000 UZS.', ru: 'Доход: 10 000 000 UZS. 10%: 1 000 000 UZS.', uz: 'Daromad: 10,000,000 UZS. 10%: 1,000,000 UZS.' },
    whyItMatters: { en: 'This helps build saving habits automatically and makes future goals more realistic.', ru: 'Так формируется привычка откладывать автоматически и повышается вероятность достижения будущих целей.', uz: 'Bu avtomatik tejash odatini shakllantiradi va kelajak maqsadlariga erishishni osonlashtiradi.' },
    source: { en: 'Consumer Financial Protection Bureau / pay-yourself-first principle', ru: 'Consumer Financial Protection Bureau / принцип pay-yourself-first', uz: 'Consumer Financial Protection Bureau / pay-yourself-first tamoyili' },
    formula: { en: 'Savings target = 10% × net income', ru: 'Цель сбережений = 10% × чистый доход', uz: 'Jamg’arma maqsadi = sof daromad × 10%' },
    interactiveAction: 'pay-yourself-first',
    teaser: { en: 'Build a habit of saving before you spend.', ru: 'Формируйте привычку откладывать до трат.', uz: 'Xarajat qilishdan oldin tejash odatini shakllantiring.' }
  },
  {
    id: 2,
    title: { en: 'Emergency Fund', ru: 'Фонд на ЧП', uz: 'Favqulodda fond' },
    category: 'Safety',
    isPro: false,
    shortDescription: { en: 'Keep enough cash to cover 3–6 months of essential expenses.', ru: 'Накопите сумму, покрывающую 3–6 месяцев обязательных расходов.', uz: 'Muhim xarajatlaringizni 3–6 oy davomida qoplashga yetarli naqd pul oling.' },
    fullExplanation: { en: 'An emergency fund helps absorb unexpected expenses such as medical bills, job loss, or urgent repairs. A common benchmark is 3–6 months of essential living costs, though the right target depends on personal circumstances.', ru: 'Фонд на ЧП помогает справиться с непредвиденными расходами: лечение, потеря работы, срочный ремонт. Типичный ориентир — 3–6 месяцев базовых расходов, однако итоговая сумма зависит от обстоятельств.', uz: 'Favqulodda fond tibbiy xarajatlar, ishni yo’qotish yoki favqulodda ta’mirlash kabi kutilmagan xarajatlarni qoplaydi. Odatda 3–6 oylik muhim xarajatlar miqdoriga mos keladigan fond tavsiya etiladi, lekin aniq summa shaxsingizga bog’liq.' },
    example: { en: 'Essential monthly expenses: 4,000,000 UZS. 3 months: 12,000,000 UZS. 6 months: 24,000,000 UZS.', ru: 'Базовые ежемесячные расходы: 4 000 000 UZS. 3 месяца: 12 000 000 UZS. 6 месяцев: 24 000 000 UZS.', uz: 'Muhim oylik xarajatlar: 4,000,000 UZS. 3 oy: 12,000,000 UZS. 6 oy: 24,000,000 UZS.' },
    whyItMatters: { en: 'It reduces the need to borrow or sell investments during a shock.', ru: 'Это сокращает необходимость занимать деньги или продавать инвестиции в кризисной ситуации.', uz: 'Bu muammoli paytda qarz olish yoki investitsiyalarni sotish ehtiyojini kamaytiradi.' },
    source: { en: 'FDIC / Vanguard emergency savings guidance', ru: 'FDIC / руководство Vanguard по аварийному фонду', uz: 'FDIC / Vanguard favqulodda jamg’arma bo’yicha qo’llanma' },
    formula: { en: 'Emergency fund = essential monthly expenses × 3 to 6', ru: 'Фонд на ЧП = базовые ежемесячные расходы × 3 до 6', uz: 'Favqulodda fond = muhim oylik xarajatlar × 3 dan 6 gacha' },
    interactiveAction: 'emergency-fund',
    teaser: { en: 'Build a cushion for life’s surprises.', ru: 'Создайте подушку безопасности на случай неожиданных расходов.', uz: 'Kutilmagan holatlar uchun xavfsizlik pufakchasini yarating.' }
  },
  {
    id: 3,
    title: { en: '50/30/20 Rule', ru: 'Правило 50/30/20', uz: '50/30/20 qoidasi' },
    category: 'Budgeting',
    isPro: false,
    shortDescription: { en: 'A common budgeting split: 50% needs, 30% wants, 20% savings or debt repayment.', ru: 'Популярное правило бюджета: 50% на потребности, 30% на желания, 20% на сбережения или долг.', uz: 'Keng tarqalgan byudjet qoidasi: 50% ehtiyojlar, 30% xohishlar, 20% jamg’arma yoki qarzlarni to’lash.' },
    fullExplanation: { en: 'The 50/30/20 framework is a simple budgeting guideline, not a legal requirement. Many households use it to allocate income between essential needs, flexible spending, and long-term financial goals.', ru: 'Фреймворк 50/30/20 — это простой ориентир по бюджетированию, а не обязательное правило. Многие семьи используют его для распределения дохода между базовыми потребностями, желаемыми тратами и долгосрочными целями.', uz: '50/30/20 ramkasi byudjetlashtirishning oddiy ko’rsatmasi bo’lib, qonuniy talab emas. Ko’plab oilalar daromadni muhim ehtiyojlar, ixtiyoriy xarajatlar va uzoq muddatli maqsadlar o’rtasida taqsimlash uchun ishlatadi.' },
    example: { en: 'Income: 10,000,000 UZS. Needs: 5,000,000. Wants: 3,000,000. Savings/debt: 2,000,000.', ru: 'Доход: 10 000 000 UZS. Потребности: 5 000 000. Желания: 3 000 000. Сбережения/долг: 2 000 000.', uz: 'Daromad: 10,000,000 UZS. Ehtiyojlar: 5,000,000. Xohishlar: 3,000,000. Jamg’arma/qarz: 2,000,000.' },
    whyItMatters: { en: 'It gives a quick baseline for decision-making when a budget feels out of balance.', ru: 'Это даёт простой ориентир, когда бюджет кажется несбалансированным.', uz: 'Bu byudjet muvozanatsiz tuyulganida tezkor tayanch beradi.' },
    source: { en: 'Vanguard budgeting guidance', ru: 'Руководство Vanguard по бюджетированию', uz: 'Vanguard byudjetlashtirish bo’yicha ko’rsatmalar' },
    formula: { en: 'Needs = 50%, Wants = 30%, Savings/debt = 20%', ru: 'Потребности = 50%, Желания = 30%, Сбережения/долг = 20%', uz: 'Ehtiyojlar = 50%, Xohishlar = 30%, Jamg’arma/qarz = 20%' },
    interactiveAction: 'budget-503020',
    teaser: { en: 'Use a simple spending split as a budgeting baseline.', ru: 'Используйте простой баланс трат как основу бюджета.', uz: 'Byudjet uchun oddiy xarajat taqsimotidan foydalaning.' }
  },
  {
    id: 4,
    title: { en: '15% Long-Term Savings', ru: '15% долгосрочных накоплений', uz: '15% uzoq muddatli jamg’arma' },
    category: 'Retirement',
    isPro: false,
    shortDescription: { en: 'Some advisors suggest saving about 15% of income for the long term.', ru: 'Некоторые эксперты рекомендуют откладывать около 15% дохода на долгий срок.', uz: 'Ba’zi maslahatchilar uzoq muddatga yillik daromadning taxminan 15% ni jamg’arishni tavsiya etadi.' },
    fullExplanation: { en: 'Fidelity has used a 15% guideline for many workers, but personal targets vary with age, debts, income, and goals. Treat it as a flexible benchmark rather than a universal requirement.', ru: 'Fidelity использует ориентир 15% для многих работников, но индивидуальные цели зависят от возраста, долгов, дохода и целей. Это ориентир, а не универсальное правило.', uz: 'Fidelity ko’pgina ishchilar uchun 15% ko’rsatmasidan foydalanadi, ammo shaxsiy maqsadlar yosh, qarz, daromad va maqsadlarga qarab farqlanadi. Bu universal qoidadan ko’ra moslashuvchan ko’rsatmadir.' },
    example: { en: 'Income: 10,000,000 UZS. 15% target: 1,500,000 UZS.', ru: 'Доход: 10 000 000 UZS. 15%: 1 500 000 UZS.', uz: 'Daromad: 10,000,000 UZS. 15%: 1,500,000 UZS.' },
    whyItMatters: { en: 'Long-term investing becomes much more achievable when saving is steady and consistent over time.', ru: 'Долгосрочные инвестиции становятся более достижимыми при стабильных и регулярных накоплениях.', uz: 'Uzoq muddatli investitsiyalar muntazam va doimiy jamg’arma bilan ancha qulay bo’ladi.' },
    source: { en: 'Fidelity', ru: 'Fidelity', uz: 'Fidelity' },
    formula: { en: 'Retirement savings target = 15% × income', ru: 'Цель накоплений на пенсию = 15% × доход', uz: 'Pensiya jamg’armasi maqsadi = daromad × 15%' },
    teaser: { en: 'Use 15% as a benchmark, not a fixed rule.', ru: 'Используйте 15% как ориентир, а не строгую норму.', uz: '15% ni qat’iy qoidadan emas, ko’rsatma sifatida ishlating.' }
  },
  {
    id: 5,
    title: { en: 'Automate Your Savings', ru: 'Автоматизируйте сбережения', uz: 'Jamg’armalaringizni avtomatlashtiring' },
    category: 'Habits',
    isPro: false,
    shortDescription: { en: 'Move money to savings automatically soon after income arrives.', ru: 'Переводите деньги в накопления автоматически сразу после получения дохода.', uz: 'Daromad kelishi bilan pulni avto-satxayishda jamg’armaga uzatib qo’ying.' },
    fullExplanation: { en: 'Automation reduces friction and supports consistency. A practical version is an automatic transfer equal to 10% of income every month.', ru: 'Автоматизация убирает барьеры и поддерживает регулярность. Практический вариант — автоматический перевод 10% дохода ежемесячно.', uz: 'Avtomatlashtirish muammolarni kamaytiradi va muntazamlikni ta’minlaydi. Amaliy variant — har oy daromadning 10% ni avtomatik tarjima qilish.' },
    example: { en: 'Salary arrives. Automatic transfer. Savings account.', ru: 'Зарплата поступает. Автоматический перевод. Счёт накоплений.', uz: 'Maosh tushadi. Avtomatik pul o’tkazmasi. Jamg’arma hisobvaraqlari.' },
    whyItMatters: { en: 'Automation helps reduce temptation to spend before saving.', ru: 'Автоматизация снижает соблазн потратить деньги до того, как они попадут в накопления.', uz: 'Avtomatlashtirish pulni tejashdan oldin sarflashga undovchi xatarlardan qochishga yordam beradi.' },
    source: { en: 'Consumer Financial Protection Bureau', ru: 'Consumer Financial Protection Bureau', uz: 'Consumer Financial Protection Bureau' },
    formula: { en: 'Automatic transfer = monthly income × 10%', ru: 'Автоматический перевод = ежемесячный доход × 10%', uz: 'Avtomatik o’tkazma = oylik daromad × 10%' },
    interactiveAction: 'automate-savings',
    teaser: { en: 'Turn good intentions into a weekly or monthly habit.', ru: 'Превратите хорошие намерения в регулярную привычку.', uz: 'Yaxshi niyatlarni muntazam harakatga aylantiring.' }
  },
  {
    id: 6,
    title: { en: 'Pay High-Interest Debt First', ru: 'Сначала закрывайте долг с высокой ставкой', uz: 'Avval yuqori foizli qarzni to’lang' },
    category: 'Debt',
    isPro: false,
    shortDescription: { en: 'When you have multiple debts, prioritize the one with the highest interest rate after minimum payments.', ru: 'Если есть несколько долгов, после минимальных платежей приоритет отдаётся самому дорогому долгу.', uz: 'Bir nechta qarz bo’lsa, minimal to’lovlarni amalga oshirgandan keyin eng yuqori foizli qarzga ustuvorlik bering.' },
    fullExplanation: { en: 'If your debt balances differ, paying extra toward the debt with the highest interest rate can reduce total interest costs. This is a general strategy, not individualized financial advice.', ru: 'Если долги отличаются по ставке, дополнительный платёж по самому дорогому долгу может уменьшить общую сумму процентов. Это общая стратегия, а не персональная финансовая рекомендация.', uz: 'Agar qarzlar stavkasi farq qilsa, eng yuqori foizli qarzga qo’shimcha to’lov qilish umumiy foizlar miqdorini kamaytirishi mumkin. Bu shaxsiy moliyaviy maslahat emas, balki umumiy strategiyadir.' },
    example: { en: 'Debt A: 8%. Debt B: 29%. Add the extra repayment to the 29% debt first.', ru: 'Долг A: 8%. Долг B: 29%. Доп. платёж направляйте в долг под 29% сначала.', uz: 'Qarz A: 8%. Qarz B: 29%. Qo’shimcha to’lovni avval 29% qarzga yo’naltiring.' },
    whyItMatters: { en: 'This can reduce total interest paid and speed up debt reduction.', ru: 'Это сокращает общую сумму процентов и ускоряет снижение долга.', uz: 'Bu umumiy to’lov miqdorini kamaytiradi va qarzni tezroq tugatishga yordam beradi.' },
    source: { en: 'FDIC / consumer debt guidance', ru: 'FDIC / рекомендации по потребительским долгам', uz: 'FDIC / iste’molchi qarzlari bo’yicha ko’rsatmalar' },
    formula: { en: 'Minimum payments first, then highest rate gets extra repayment', ru: 'Сначала минимальные платежи, затем самый дорогой долг получает дополнительную сумму', uz: 'Avval minimum to’lovlar, keyin eng yuqori foizli qarzga qo’shimcha pul' },
    interactiveAction: 'compare-debts',
    teaser: { en: 'Prioritize the most expensive debt after minimums are covered.', ru: 'После минимальных платежей приоритизируйте самый дорогой долг.', uz: 'Minimal to’lovlar qoplanib bo’lgach eng qimmat qarzga ustuvorlik bering.' }
  },
  {
    id: 7,
    title: { en: '28% Housing Rule', ru: 'Правило жилья 28%', uz: '28% uy-joy qoidasi' },
    category: 'Housing',
    isPro: false,
    shortDescription: { en: 'A common affordability guideline is to keep housing costs around 28% or less of gross monthly income.', ru: 'Популярное правило affordability — расходы на жильё не более 28% от валового ежемесячного дохода.', uz: 'Keng tarqalgan moliyaviy ko’rsatma bo’yicha uy-joy xarajatlari yalpi oylik daromadning 28% dan ko’p bo’lmasligi kerak.' },
    fullExplanation: { en: 'The 28/36 guideline is often used as a rough affordability check for housing expenses. It is a benchmark and not an exact rule for everyone.', ru: 'Показатель 28/36 часто используется как грубая проверка affordability для расходов на жильё. Это ориентир, а не точное правило для всех.', uz: '28/36 ko’rsatmasi uy-joy xarajatlari uchun taxminiy moliyaviy tekshiruv sifatida ishlatiladi. Bu aniq qoidadan ko’ra ko’rsatma hisoblanadi.' },
    example: { en: 'Gross monthly income: 10,000,000 UZS. 28% target: 2,800,000 UZS.', ru: 'Валовой месячный доход: 10 000 000 UZS. 28%: 2 800 000 UZS.', uz: 'Yalpi oylik daromad: 10,000,000 UZS. 28%: 2,800,000 UZS.' },
    whyItMatters: { en: 'It helps keep housing costs manageable and reduces financial strain.', ru: 'Это помогает держать расходы на жильё под контролем и снижает финансовую нагрузку.', uz: 'Bu uy-joy xarajatlarini boshqarishni osonlashtiradi va moliyaviy zaryadni kamaytiradi.' },
    source: { en: '28/36 affordability guideline', ru: 'Руководство 28/36 по affordability', uz: '28/36 moliyaviy qulaylik ko’rsatmasi' },
    formula: { en: 'Housing target = 28% × gross monthly income', ru: 'Цель по жилью = 28% × валовый месячный доход', uz: 'Uy-joy maqsadi = yalpi oylik daromad × 28%' },
    interactiveAction: 'housing-affordability',
    teaser: { en: 'Check whether your housing costs fit a common affordability benchmark.', ru: 'Проверьте, укладываются ли ваши расходы на жильё в типичный ориентир.', uz: 'Uy-joy xarajatlaringiz keng tarqalgan ko’rsatmaga mos keladimi, tekshiring.' }
  },
  {
    id: 8,
    title: { en: 'Debt-to-Income Ratio', ru: 'Соотношение долга к доходу', uz: 'Qarz daromad nisbati' },
    category: 'Debt',
    isPro: false,
    shortDescription: { en: 'Measure monthly debt payments as a share of gross monthly income.', ru: 'Измеряйте ежемесячные платежи по долгу как долю от валового дохода.', uz: 'Oylik qarz to’lovlarini yalpi oylik daromadga nisbati bilan o’lchang.' },
    fullExplanation: { en: 'Debt-to-income ratio (DTI) is calculated as monthly debt payments divided by gross monthly income times 100. It is widely used as a broad affordability measure.', ru: 'Соотношение долга к доходу (DTI) рассчитывается как ежемесячные платежи по долгу, делённые на валовой ежемесячный доход, умноженные на 100. Это широко используемый показатель affordability.', uz: 'Qarz-daromad nisbati (DTI) oylik qarz to’lovlarini yalpi oylik daromadga bo’lib, 100 ga ko’paytirish orqali hisoblanadi. Bu keng tarqalgan moliyaviy qulaylik ko’rsatmasidir.' },
    example: { en: 'Debt payments: 2,000,000 UZS. Gross income: 10,000,000 UZS. DTI = 20%.', ru: 'Платежи по долгу: 2 000 000 UZS. Валовой доход: 10 000 000 UZS. DTI = 20%.', uz: 'Qarz to’lovlari: 2,000,000 UZS. Yalpi daromad: 10,000,000 UZS. DTI = 20%.' },
    whyItMatters: { en: 'A lower ratio usually means less financial strain and more flexibility.', ru: 'Низкий показатель обычно означает меньшую нагрузку и больше свободы.', uz: 'Past nisbati odatda kamroq moliyaviy bosim va ko’proq moslashuv imkonini beradi.' },
    source: { en: 'Consumer Financial Protection Bureau', ru: 'Consumer Financial Protection Bureau', uz: 'Consumer Financial Protection Bureau' },
    formula: { en: 'DTI = monthly debt payments ÷ gross monthly income × 100', ru: 'DTI = ежемесячные платежи по долгу ÷ валовой месячный доход × 100', uz: 'DTI = oylik qarz to’lovlari ÷ yalpi oylik daromad × 100' },
    interactiveAction: 'dti-calculator',
    teaser: { en: 'See how much of your income is already committed to debt payments.', ru: 'Посмотрите, какая часть дохода уже идет на выплаты по долгам.', uz: 'Daromadingizning qanchasi allaqachon qarz to’lovlariga sarflanganligini ko’ring.' }
  },
  {
    id: 9,
    title: { en: 'Know Your Savings Rate', ru: 'Знайте свою норму сбережений', uz: 'Jamg’arma stavkangizni bilib oling' },
    category: 'Savings',
    isPro: false,
    shortDescription: { en: 'Measure your savings as a share of net income.', ru: 'Измеряйте накопления как долю от чистого дохода.', uz: 'Jamg’armalaringizni sof daromadning ulushi sifatida o’lchang.' },
    fullExplanation: { en: 'Savings rate is a useful way to quantify whether your saving habits are growing with income. It is calculated as savings divided by net income, multiplied by 100.', ru: 'Норма сбережений помогает понять, растут ли ваши накопления вместе с доходом. Она рассчитывается как сбережения, делённые на чистый доход, умноженные на 100.', uz: 'Jamg’arma stavkasi daromad bilan birga jamg’arma odatingiz ortib borayotganini ko’rsatadi. U jamg’arma sof daromadga bo’linib, 100 ga ko’paytirilishi bilan hisoblanadi.' },
    example: { en: 'Income: 10,000,000 UZS. Savings: 2,000,000 UZS. Savings rate: 20%.', ru: 'Доход: 10 000 000 UZS. Сбережения: 2 000 000 UZS. Норма сбережений: 20%.', uz: 'Daromad: 10,000,000 UZS. Jamg’arma: 2,000,000 UZS. Jamg’arma stavkasi: 20%.' },
    whyItMatters: { en: 'Tracking this number helps you evaluate whether your saving rate is improving over time.', ru: 'Отслеживание этого показателя помогает понять, улучшается ли ваша дисциплина накоплений.', uz: 'Bu ko’rsatmani kuzatish tejash odatingiz yildan-yilga yaxshilanayotganini aniqlashga yordam beradi.' },
    source: { en: 'Consumer Financial Protection Bureau', ru: 'Consumer Financial Protection Bureau', uz: 'Consumer Financial Protection Bureau' },
    formula: { en: 'Savings rate = savings ÷ net income × 100', ru: 'Норма сбережений = сбережения ÷ чистый доход × 100', uz: 'Jamg’arma stavkasi = jamg’arma ÷ sof daromad × 100' },
    interactiveAction: 'savings-rate',
    teaser: { en: 'Turn savings into a measurable metric.', ru: 'Преобразуйте сбережения в измеримый показатель.', uz: 'Jamg’armalarni o’lchanadigan ko’rsatmaga aylantiring.' }
  },
  {
    id: 10,
    title: { en: 'Small Savings Add Up', ru: 'Небольшие накопления складываются', uz: 'Kichik jamg’armalar ham yig’iladi' },
    category: 'Compound Growth',
    isPro: false,
    shortDescription: { en: 'Small recurring amounts become significant over time before investment return is considered.', ru: 'Небольшие регулярные суммы со временем становятся заметными даже до учета доходности.', uz: 'Kichik muntazam summalar vaqt o’tishi bilan sezilarli bo’lib ketadi, hatto daromadlilikni hisobga olmaganda ham.' },
    fullExplanation: { en: 'Consistent daily or monthly contributions can grow into a meaningful amount over years. This example shows the total before considering investment returns.', ru: 'Регулярные ежедневные или ежемесячные взносы со временем могут превратиться в заметную сумму. Пример показывает итог до учета доходности инвестиций.', uz: 'Muntazam kundalik yoki oylik badallar yillar davomida sezilarli summaga aylanishi mumkin. Bu misol investitsiya daromadini hisobga olmagandan oldin natijani ko’rsatadi.' },
    example: { en: '5,000 UZS/day. 1 year: 1,825,000 UZS. 5 years: 9,125,000 UZS. 10 years: 18,250,000 UZS.', ru: '5 000 UZS в день. 1 год: 1 825 000 UZS. 5 лет: 9 125 000 UZS. 10 лет: 18 250 000 UZS.', uz: 'Kuniga 5,000 UZS. 1 yil: 1,825,000 UZS. 5 yil: 9,125,000 UZS. 10 yil: 18,250,000 UZS.' },
    whyItMatters: { en: 'Small, repeated actions can be more sustainable than waiting for a large lump sum.', ru: 'Небольшие регулярные действия более устойчивы, чем ожидание крупной единовременной суммы.', uz: 'Kichik va muntazam harakatlar katta bir martalik summani kutishdan ko’ra barqarorroq bo’ladi.' },
    source: { en: 'Vanguard examples of recurring savings', ru: 'Примеры регулярных сбережений от Vanguard', uz: 'Vanguard muntazam jamg’arma misollari' },
    formula: { en: 'Total = daily amount × 365 × years', ru: 'Итог = ежедневная сумма × 365 × годы', uz: 'Jami = kunlik summa × 365 × yil' },
    interactiveAction: 'future-savings',
    teaser: { en: 'See how consistent habits can add up over time.', ru: 'Посмотрите, как регулярные привычки складываются в значимую сумму.', uz: 'Muntazam odatlarning vaqt bo’yicha qanday yig’ilishini ko’ring.' }
  },
  {
    id: 11,
    title: { en: 'Employer Match', ru: 'Матч от работодателя', uz: 'Ish beruvchining moslashuvi' },
    category: 'Retirement',
    isPro: true,
    shortDescription: { en: 'If your employer matches retirement contributions, understand the formula and the cap.', ru: 'Если работодатель делает матчинг к пенсионным взносам, важно понимать формулу и лимит.', uz: 'Agar ish beruvchi pensiya hissalariga moslik beradigan bo’lsa, formulani va limitni tushunib oling.' },
    fullExplanation: { en: 'A common workplace plan may match part of employee contributions, such as 50% of what you contribute up to a set limit. Actual employer plans vary, so it is important to review the specific terms in your plan document.', ru: 'Во многих компаниях работодатель дополняет часть взносов сотрудника, например 50% от вклада до установленного лимита. Реальные условия зависят от плана работодателя, поэтому обязательно изучайте документы плана.', uz: 'Ko’pgina ish joylarida ish beruvchi xodimning hissasiga mos ravishda qo’shimcha beradi, masalan, qo’shgan summaning 50% gacha. Aniq shartlar ish beruvchining rejasi bilan farq qilishi mumkin.' },
    example: { en: 'Employee contributes 5%. Employer matches 50% of the contribution up to a stated limit.', ru: 'Сотрудник вносит 5%. Работодатель дополняет 50% от взноса до установленного лимита.', uz: 'Xodim 5% hissa qo’shadi. Ish beruvchi qo’shgan summaning 50% gacha moslik beradi.' },
    whyItMatters: { en: 'Employer matching can materially increase retirement savings when a plan allows it.', ru: 'Матчинг работодателя может заметно увеличить пенсионные накопления.', uz: 'Ish beruvchining mosligi pensiya jamg’armasini sezilarli oshirishi mumkin.' },
    source: { en: 'IRS', ru: 'IRS', uz: 'IRS' },
    formula: { en: 'Employer match = employee contribution × match rate, capped by plan rules', ru: 'Матч работодателя = взнос сотрудника × ставка матча, с ограничением плана', uz: 'Ish beruvchining mosligi = xodim hissasi × moslik stavkasi, rejadagi limit bilan cheklangan' },
    teaser: { en: 'Learn how your employer may amplify your retirement contributions.', ru: 'Узнайте, как работодатель может увеличить ваши пенсионные взносы.', uz: 'Ish beruvchi pensiya hissangizni qanday oshirishini bilib oling.' }
  },
  {
    id: 12,
    title: { en: 'Save Part of Every Raise', ru: 'Отложите часть любого повышения', uz: 'Har o’sishga qismi sarflang' },
    category: 'Growth',
    isPro: true,
    shortDescription: { en: 'When income rises, direct some of the increase to savings instead of increasing spending by the full amount.', ru: 'Когда доход растёт, часть прироста направляйте в сбережения, а не увеличивайте расходы на всю сумму.', uz: 'Daromad oshganida, oshishning bir qismini jamg’armaga yo’naltiring, emaski, barcha miqdorni sarflashga yo’naltirasiz.' },
    fullExplanation: { en: 'A practical strategy is to save part of any raise rather than spending the full increase. Example: income rises from 10M to 12M, leaving 2M more cash. Saving 50% of the increase means 1M goes to savings and 1M can be used for spending.', ru: 'Практическая стратегия — откладывать часть любого повышения, а не тратить весь прирост. Например: доход вырос с 10M до 12M, вместе с тем прибавилось 2M. Откладывая 50% прироста, 1M идет в накопления, а 1M можно потратить.', uz: 'Amaliy strategiya — har qanday daromad oshishining bir qismini jamg’armaga yo’naltirish, emaski, butun oshishni xarajatlarga sarflash. Masalan: daromad 10M dan 12M gacha oshdi, bu 2M ortiqcha pulga olib keldi. Oshishning 50% ni tejash 1M jamg’armaga, 1M esa sarflashga ketadi.' },
    whyItMatters: { en: 'This turns raises into compounding savings rather than a full lifestyle increase.', ru: 'Так повышение дохода превращается в накопление, а не в полный рост уровня жизни.', uz: 'Bu daromad oshishini butunlay turmush tarzini oshirishga emas, balki jamg’arma ko’payishiga olib keladi.' },
    source: { en: 'Practical budgeting strategy; not an official universal rule', ru: 'Практическая стратегия бюджетирования; не официальный универсальный принцип', uz: 'Amaliy byudjet strategiyasi; rasmiy universal qoidalar emas' },
    formula: { en: 'Savings from raise = raise amount × chosen share', ru: 'Накопления с повышения = сумма повышения × выбранная доля', uz: 'Oshishdan jamg’arma = oshish miqdori × tanlangan ulush' },
    teaser: { en: 'Use income growth to accelerate savings, not just spending.', ru: 'Используйте рост дохода для ускорения накоплений, а не только трат.', uz: 'Daromadning o’sishini faqat xarajatlar emas, jamg’arma tezlatish uchun ishlating.' }
  },
  {
    id: 13,
    title: { en: 'Create Separate Funds for Large Goals', ru: 'Создавайте отдельные фонды для больших целей', uz: 'Katta maqsadlar uchun alohida fond yarating' },
    category: 'Goals',
    isPro: true,
    shortDescription: { en: 'Set up separate savings buckets for big purchases, travel, education, and emergencies.', ru: 'Создайте отдельные фонды для крупных покупок, путешествий, образования и ЧП.', uz: 'Yirik xaridlar, sayohat, ta’lim va favqulodda holatlar uchun alohida fondlar yarating.' },
    fullExplanation: { en: 'Separate funds make it easier to track progress and reduce the temptation to mix goals together. For example, a car target of 120M UZS with 30M already saved and a monthly contribution of 3M can be tracked independently.', ru: 'Отдельные фонды проще отслеживать и меньше соблазна смешать цели. Например, цель на машину 120M UZS, уже накоплено 30M, ежемесячный вклад 3M.', uz: 'Alohida fondlar istaklarni kuzatishni osonlashtiradi va maqsadlarni aralashtirishdan saqlaydi. Masalan, mashina maqsadi 120M UZS bo’lib, hozir 30M to’plangan va oylik badal 3M.' },
    whyItMatters: { en: 'A dedicated goal fund keeps attention on the target and reduces financial drift.', ru: 'Специализированный фонд помогает удерживать фокус на цели и уменьшает распыление усилий.', uz: 'Alohida maqsad fondi e’tiborni maqsadga jalb etadi va moliyaviy tarqalishni kamaytiradi.' },
    source: { en: 'Practical money management guidance', ru: 'Практическое управление деньгами', uz: 'Amaliy pul boshqaruvi ko’rsatmalari' },
    formula: { en: 'Estimated completion = remaining amount ÷ monthly contribution', ru: 'Ориентир по сроку = оставшаяся сумма ÷ ежемесячный вклад', uz: 'Taxminiy tugash vaqti = qolgan summa ÷ oylik badal' },
    interactiveAction: 'goal-completion',
    teaser: { en: 'Give each major goal its own dedicated savings track.', ru: 'Дайте каждой большой цели собственный запас по накоплениям.', uz: 'Har bir katta maqsad uchun alohida jamg’arma yo’li yarating.' }
  },
  {
    id: 14,
    title: { en: 'Measure a Purchase in Months of Saving', ru: 'Измеряйте покупки в месяцах накоплений', uz: 'Xaridlarni tejash oyiga o’lchang' },
    category: 'Spending',
    isPro: true,
    shortDescription: { en: 'See the real opportunity cost of a purchase by translating the price into months of savings.', ru: 'Поймите реальную стоимость покупки через количество месяцев накоплений.', uz: 'Xaridning haqiqiy imkoniyat tannarxini tejash oylarida o’lchang.' },
    fullExplanation: { en: 'A phone costing 5M UZS and monthly savings of 1M means the purchase represents roughly 5 months of current savings. This makes the trade-off more concrete.', ru: 'Телефон за 5M UZS при ежемесячных накоплениях 1M означает, что покупка стоит около 5 месяцев текущих накоплений. Так проще оценить компромисс.', uz: 'Narxi 5M UZS bo’lgan telefon va oylik jamg’arma 1M bo’lsa, xarid hozirgi tejashning taxminan 5 oyiga teng bo’ladi. Bu muqobil tanlovni yanada aniq ko’rsatadi.' },
    whyItMatters: { en: 'It helps prevent impulse purchases from feeling cheap in the moment.', ru: 'Это помогает не покупать импульсивно, потому что цена кажется незначительной.', uz: 'Bu impulsiv xaridlarni aniqroq ko’rsatib, oson qaror qabul qilishga to’sqinlik qiladi.' },
    source: { en: 'Practical spending framework', ru: 'Практическая рамка расходов', uz: 'Amaliy xarajatlar ramkasi' },
    formula: { en: 'Purchase cost in savings months = price ÷ monthly savings', ru: 'Стоимость покупки в месяцах накоплений = цена ÷ ежемесячные сбережения', uz: 'Xaridning tejash oylaridagi qiymati = narx ÷ oylik jamg’arma' },
    interactiveAction: 'purchase-cost',
    teaser: { en: 'Translate large purchases into time instead of just seeing a sticker price.', ru: 'Смотрите на покупки как на время накоплений, а не только на ценник.', uz: 'Katta xaridlarni faqat narx emas, tejash vaqti sifatida o’lchang.' }
  },
  {
    id: 15,
    title: { en: 'Diversification', ru: 'Диверсификация', uz: 'Diversifikatsiya' },
    category: 'Investing',
    isPro: true,
    shortDescription: { en: 'Avoid concentrating too much of an investment portfolio in one asset or category.', ru: 'Не концентрируйте слишком большую долю портфеля в одном активе или категории.', uz: 'Portfelning katta qismini bir aktivga yoki toifaga to’plab qo’ymang.' },
    fullExplanation: { en: 'Diversification is a risk-management concept that spreads money across different areas to reduce concentration risk. It does not mean every person should follow one exact allocation. Example: 90% in one asset and 10% in another is a high-concentration portfolio.', ru: 'Диверсификация — это концепция управления рисками, при которой деньги распределяются между разными активами. Это не означает, что всем нужна одна и та же доля. Пример: 90% в одном активе и 10% в другом — высокая концентрация.', uz: 'Diversifikatsiya xatarlarni boshqarish konsepsiyasi bo’lib, pulni turli aktivlarga taqsimlash orqali kontsentratsiya riskini kamaytiradi. Bu har kimga bir xil nisbatni qoidaga aylantirish degani emas. Masalan: 90% bir aktivda, 10% boshqasida — yuqori kontsentratsiya.' },
    whyItMatters: { en: 'It reduces vulnerability to a single company, sector, or investment type.', ru: 'Это снижает зависимость от одного сектора, компании или типа активов.', uz: 'Bu bir kompaniya, sektor yoki aktiv turiga qaramlikni kamaytiradi.' },
    source: { en: 'SEC / Investor.gov', ru: 'SEC / Investor.gov', uz: 'SEC / Investor.gov' },
    formula: { en: 'Diversification = spread allocations across multiple categories', ru: 'Диверсификация = распределение между несколькими категориями активов', uz: 'Diversifikatsiya = bir nechta aktiv toifalariga taqsimlash' },
    interactiveAction: 'portfolio-concentration',
    teaser: { en: 'Reduce concentration risk by avoiding one dominant position.', ru: 'Снижение риска концентрации за счет отказа от одного доминирующего актива.', uz: 'Bir ustun aktivga qaramlikni kamaytirib, kontsentratsiya riskini pasaytiring.' }
  },
  {
    id: 16,
    title: { en: 'Review Your Portfolio Every 6–12 Months', ru: 'Проверяйте портфель каждые 6–12 месяцев', uz: 'Portfelni har 6–12 oyda bir tekshirib oling' },
    category: 'Review',
    isPro: true,
    shortDescription: { en: 'Review asset allocation periodically to confirm it still fits your goals and risk tolerance.', ru: 'Проверяйте распределение активов, чтобы оно соответствовало целям и допустимому риску.', uz: 'Aktiv taqsimotini maqsadlaringiz va riskga tayyorligingizga mosligini tekshirib turing.' },
    fullExplanation: { en: 'Investment portfolios can drift over time as markets move and personal goals change. Reviewing every 6–12 months helps you decide whether rebalancing is needed without overtrading.', ru: 'Портфель со временем может отклоняться от целевого состава из-за рыночных изменений и новых целей. Проверка каждые 6–12 месяцев помогает понять, нужен ли ребаланс, без лишней торговли.', uz: 'Investitsiya portfeli vaqt o’tishi bilan bozordagi o’zgarishlar va shaxsiy maqsadlar sababli siljishi mumkin. Har 6–12 oyda tekshirish rebalanslash zarurati mavjudligini aniqlashga yordam beradi, lekin ortiqcha savdo qilishdan qochadi.' },
    whyItMatters: { en: 'It keeps your strategy aligned with your actual financial situation.', ru: 'Это помогает удерживать стратегию в соответствии с текущей ситуацией.', uz: 'Bu strategiyani hozirgi moliyaviy vaziyatga mos holda saqlashga yordam beradi.' },
    source: { en: 'Investor.gov', ru: 'Investor.gov', uz: 'Investor.gov' },
    formula: { en: 'Review cadence = every 6–12 months', ru: 'Период проверки = каждые 6–12 месяцев', uz: 'Tekshiruv davri = har 6–12 oyda bir' },
    teaser: { en: 'Keep your portfolio aligned without unnecessary trading.', ru: 'Поддерживайте портфель в соответствие без лишней торговли.', uz: 'Portfelni ortiqcha savdo qilmasdan muvozanatda saqlang.' }
  },
  {
    id: 17,
    title: { en: 'Investment Fees Matter', ru: 'Комиссии по инвестициям имеют значение', uz: 'Investitsiya komissiyalari muhim' },
    category: 'Fees',
    isPro: true,
    shortDescription: { en: 'Even small annual fees can have a significant long-term impact on results.', ru: 'Даже небольшие ежегодные комиссии могут сильно повлиять на долгосрочный результат.', uz: 'Hatto kichik yillik komissiyalar ham uzoq muddatdagi natijaga katta ta’sir ko’rsatishi mumkin.' },
    fullExplanation: { en: 'Fees compound over time. A difference of 0.5% or 1% may seem small in a single year, but over decades it can materially affect final value. This is an educational estimate, not a guarantee.', ru: 'Комиссии увеличиваются со временем. Разница в 0,5% или 1% может выглядеть незначительно, но за десятилетия сильно влияет на итоговый результат. Это оценка, не гарантия.', uz: 'Komissiyalar vaqt bilan yig’iladi. Bir yilda 0,5% yoki 1% farq kichik ko’rinishi mumkin, ammo o’n yillar davomida yakuniy natijaga katta ta’sir ko’rsatadi. Bu taxminiy ma’lumot, kafolat emas.' },
    whyItMatters: { en: 'Lower fees can improve the long-term value of regular investing.', ru: 'Низкие комиссии помогают сохранить большую часть заработанного дохода.', uz: 'Past komissiyalar uzoq muddatli investitsiya natijasini yaxshilashga yordam beradi.' },
    source: { en: 'SEC', ru: 'SEC', uz: 'SEC' },
    formula: { en: 'Final value is sensitive to both return rate and fees', ru: 'Итоговая сумма зависит и от доходности, и от комиссии', uz: 'Yakuniy qiymat daromadlilik va komissiyalarga ta’sir qiladi' },
    interactiveAction: 'investment-fees',
    teaser: { en: 'Compare two fee scenarios and see how much the difference is worth over time.', ru: 'Сравните две комиссии и посмотрите, насколько это меняет итог.', uz: 'Ikki komissiya senariysini taqqoslang va bu farq nega muhimligini ko’ring.' }
  },
  {
    id: 18,
    title: { en: 'Compound Growth Rewards Time', ru: 'Сложный рост вознаграждает время', uz: 'Kompound o’sishi vaqtni mukofotlaydi' },
    category: 'Growth',
    isPro: true,
    shortDescription: { en: 'The earlier you start, the more time compounding has to work for you.', ru: 'Чем раньше вы начнёте, тем больше времени сложный процент будет работать на вас.', uz: 'Qanchalik erta boshlasangiz, kompozitsiya shuncha ko’p ishlaydi.' },
    fullExplanation: { en: 'Starting at age 20 instead of 30 can lead to a much larger balance over the same monthly contribution. This is a projection, not a promise of future returns.', ru: 'Начало в 20 лет вместо 30 может дать заметно большую сумму при одинаковых ежемесячных взносах. Это прогноз, а не обещание будущей доходности.', uz: '20 yoshda boshlash 30 yoshda boshlashdan ko’ra bir xil oylik badal bilan ancha katta balansga olib kelishi mumkin. Bu prognoz, bo’lajak daromad kafolati emas.' },
    whyItMatters: { en: 'Time is one of the biggest advantages in long-term investing.', ru: 'Время — один из самых мощных факторов в долгосрочных инвестициях.', uz: 'Vaqt uzoq muddatli investitsiyadagi eng muhim afzalliklardan biridir.' },
    source: { en: 'Investor.gov / compound growth principles', ru: 'Investor.gov / принципы сложного роста', uz: 'Investor.gov / kompozitsiya o’sishi tamoyillari' },
    formula: { en: 'Future balance depends on start age, contribution rate, and time horizon', ru: 'Итоговая сумма зависит от возраста, взноса и горизонта времени', uz: 'Yakuniy balans boshlang’ich yosh, badal va vaqt oralig’iga bog’liq' },
    interactiveAction: 'compound-growth',
    teaser: { en: 'Compare the impact of starting earlier versus later.', ru: 'Сравните эффект раннего запуска и более позднего старта.', uz: 'Ertaroq boshlash va kechroq boshlashning ta’sirini taqqoslang.' }
  },
  {
    id: 19,
    title: { en: '60/30/10 + 15 Guideline', ru: 'Руководство 60/30/10 + 15', uz: '60/30/10 + 15 ko’rsatmasi' },
    category: 'Budgeting',
    isPro: true,
    shortDescription: { en: 'A Fidelity-style framework combining essentials, lifestyle, short-term goals, and retirement saving.', ru: 'Рамка Fidelity, объединяющая базовые расходы, желания, краткосрочные цели и накопления на пенсию.', uz: 'Fidelity uslubidagi ramka muhim xarajatlar, xohishlar, qisqa muddatli maqsadlar va pensiya jamg’armasini birlashtiradi.' },
    fullExplanation: { en: 'The rule allocates 60% to essentials, 30% to nice-to-haves, 10% to near-term goals and emergency savings, and 15% to retirement savings. The 15% retirement target is a separate long-term guideline and not a universal rule for everyone.', ru: 'Правило делит доход на 60% на базовые нужды, 30% на желаемые траты, 10% на краткосрочные цели и аварийный фонд, и 15% на накопления на пенсию. 15% — отдельный долгосрочный ориентир, а не универсальная норма для всех.', uz: 'Qoidada daromad 60% muhim ehtiyojlarga, 30% xohishlarga, 10% qisqa muddatli maqsadlarga va favqulodda fondga, 15% pensiya jamg’armasiga ajratiladi. 15% pensiya maqsadi alohida uzoq muddatli ko’rsatma bo’lib, har kimga ma’lum qoidalar bilan mos kelmaydi.' },
    whyItMatters: { en: 'It offers a broader view of how income can be balanced across short- and long-term priorities.', ru: 'Это даёт более широкую картину баланса между краткосрочными и долгосрочными приоритетами.', uz: 'Bu daromadni qisqa va uzoq muddatli maqsadlar o’rtasida muvozanatlashga yordam beradi.' },
    source: { en: 'Fidelity', ru: 'Fidelity', uz: 'Fidelity' },
    formula: { en: '60% essentials + 30% nice-to-haves + 10% near-term goals + 15% retirement savings', ru: '60% базовые расходы + 30% желания + 10% краткосрочные цели + 15% накопления на пенсию', uz: '60% muhim ehtiyojlar + 30% xohishlar + 10% qisqa muddatli maqsadlar + 15% pensiya jamg’armasi' },
    interactiveAction: 'sixty-thirty-ten-fifteen',
    teaser: { en: 'Test a broader budgeting framework that separates everyday spending from retirement planning.', ru: 'Проверьте более широкую схему бюджета, разделяющую повседневные расходы и пенсию.', uz: 'Kunlik xarajatlar va pensiya rejalashtirishni ajratib turuvchi kengroq byudjet ramkasini sinab ko’ring.' }
  },
  {
    id: 20,
    title: { en: 'Emergency Fund vs Long-Term Investing', ru: 'Фонд на ЧП vs долгосрочные инвестиции', uz: 'Favqulodda fond va uzoq muddatli investitsiyalar' },
    category: 'Planning',
    isPro: true,
    shortDescription: { en: 'Emergency savings and long-term investing serve different needs and should be kept separate.', ru: 'Фонд на ЧП и долгосрочные инвестиции решают разные задачи и должны быть разделены.', uz: 'Favqulodda fond va uzoq muddatli investitsiyalar turli maqsadlarga xizmat qiladi va alohida saqlanishi kerak.' },
    fullExplanation: { en: 'Emergency savings should be easily accessible for unexpected expenses, while long-term investments are intended for longer horizons and may be less liquid. The right mix depends on your household and risk tolerance.', ru: 'Фонд на ЧП должен быть легко доступным для непредвиденных расходов, тогда как долгосрочные инвестиции рассчитаны на более длинные сроки и могут быть менее ликвидными. Оптимальная смесь зависит от вашей семьи и риск-профиля.', uz: 'Favqulodda fond kutilmagan xarajatlar uchun osongina foydalanish mumkin bo’lishi kerak, uzoq muddatli investitsiyalar esa uzoq vaqtga mo’ljallangan va kamroq likvid bo’lishi mumkin. Mos nisbati oilangiz va riska tayyorligingizga bog’liq.' },
    whyItMatters: { en: 'This distinction helps protect both short-term stability and long-term wealth building.', ru: 'Это разделение защищает и краткосрочную стабильность, и долгосрочное накопление капитала.', uz: 'Bu ajratish qisqa muddatli barqarorlik va uzoq muddatli boylikni qurishga yordam beradi.' },
    source: { en: 'Vanguard / Investor.gov', ru: 'Vanguard / Investor.gov', uz: 'Vanguard / Investor.gov' },
    formula: { en: 'Emergency fund progress = current emergency savings ÷ target safety buffer', ru: 'Прогресс фонда на ЧП = текущие накопления ÷ целевой буфер безопасности', uz: 'Favqulodda fondning rivoji = hozirgi jamg’arma ÷ maqsadli xavfsizlik buferi' },
    interactiveAction: 'emergency-vs-investing',
    teaser: { en: 'Balance accessible cash for emergencies with money meant for long-term growth.', ru: 'Сбалансируйте доступные средства на ЧП и деньги для долгосрочного роста.', uz: 'Favqulodda fond va uzoq muddatli o’sishga mo’ljallangan pullar o’rtasida muvozanat yarating.' }
  }
]
