// "Business & Health" — the Sunday business and health segments, in the app.
// Business items summarise public Ghanaian news reporting (sources listed on each
// story). Health items are general wellbeing guidance, not medical advice.
// Later this should come from the admin backend so the media team can post weekly.

const img = {
  cedi: require('../../assets/church/news/cedi_heritage.jpg'),
  accra: require('../../assets/church/news/accra_business.jpg'),
  plate: require('../../assets/church/news/balanced_plate.jpg'),
  veg: require('../../assets/church/news/vegetables.jpg'),
  water: require('../../assets/church/news/water.jpg'),
  fruit: require('../../assets/church/news/fruit.jpg'),
};

export const newsCategories = {
  business: {
    id: 'business',
    label: 'Business',
    title: 'Business & Money',
    tagline: 'Earthly principles for dominion — the marketplace, money and the economy.',
    icon: 'trending-up',
    accent: '#D6AE5E',
    gradient: ['#2B2008', '#120D04'],
    cover: img.accra,
  },
  health: {
    id: 'health',
    label: 'Health',
    title: 'Health & Wellness',
    tagline: 'Your body is a temple — practical wisdom for a balanced, healthy life.',
    icon: 'leaf',
    accent: '#6FD39B',
    gradient: ['#0C2418', '#06130C'],
    cover: img.veg,
  },
};

export const articles = [
  {
    id: 'new-cedi-notes',
    category: 'business',
    title: 'Bank of Ghana unveils new “Heritage Series” cedi notes',
    summary: 'Eight upgraded denominations, the GH¢2 note returns, and your old notes remain legal tender.',
    date: '2026-11-12',
    readMins: 3,
    image: img.cedi,
    imageCredit: 'Photo: Pulse Ghana via Yen.com.gh',
    keyFacts: [
      { label: 'Launched', value: '12 Nov' },
      { label: 'In circulation', value: '1 Dec' },
      { label: 'Denominations', value: '8 notes' },
    ],
    body: [
      'The Bank of Ghana has launched its upgraded “Heritage Series” banknotes at the Bank Square in Accra, with President John Dramani Mahama in attendance. The notes are expected to reach the public through commercial banks from December 1, 2026.',
      'The series covers eight denominations — GH¢1, GH¢2, GH¢5, GH¢10, GH¢20, GH¢50, GH¢100 and GH¢200. The GH¢2 note makes a return, while the Bank has ruled out introducing a GH¢500 note.',
      'The notes keep their 100% cotton base with added reinforcement to last longer in circulation; the Bank opted against polymer notes because of Ghana’s tropical climate. They carry enhanced security features to make counterfeiting harder, and improved tactile markings with different sizes to help visually impaired Ghanaians tell the notes apart.',
      'Importantly, the existing cedi notes remain legal tender and will circulate alongside the new ones. No deadline for withdrawing the old notes has been announced.',
    ],
    takeaways: [
      'You do not need to rush to exchange your old notes — they are still valid.',
      'Be alert to fraudsters claiming old notes have “expired”.',
      'Take time to learn the new security features when the notes reach your bank.',
      'Follow official Bank of Ghana notices for any changes.',
    ],
    sources: [
      { name: 'Yen.com.gh', url: 'https://yen.com.gh/ghana/315565-ghanas-cedi-notes-launched-november-12-quality-features-denominations/' },
      { name: 'Graphic Online', url: 'https://www.graphic.com.gh/business/business-news/bog-postpones-new-cedi-notes-launch-to-november-12-heres-what-to-know.html' },
      { name: 'GhanaWeb', url: 'https://www.ghanaweb.com/GhanaHomePage/business/BoG-unveils-new-cedi-notes-with-stronger-security-features-2061021' },
    ],
  },
  {
    id: 'cedi-depreciation-november',
    category: 'business',
    title: 'Cedi depreciation widens to 10.6% as dollar supply tightens',
    summary: 'The cedi trades around GH¢11.69 to the dollar while inflation stays low at 5.5%.',
    date: '2026-11-17',
    readMins: 2,
    image: img.accra,
    imageCredit: 'Photo: Accra skyline, Synth85 / Wikimedia Commons (CC BY-SA 4.0)',
    keyFacts: [
      { label: 'Cedi vs $ (YTD)', value: '−10.6%' },
      { label: 'Cedi to $1', value: '11.69' },
      { label: 'Inflation (Oct)', value: '5.5%' },
    ],
    body: [
      'Bank of Ghana data shows the cedi’s year-to-date depreciation against the US dollar widened to 10.6% in November, up from 9.5% in September, with the currency trading around GH¢11.69 to the dollar.',
      'Analysts point to tighter dollar supply, linked in part to the shift of foreign-exchange intermediation from the Bank of Ghana to the Ghana Gold Board, alongside lower gold prices and reserve accumulation.',
      'Inflation remains comparatively low: headline inflation was 5.5% in October, up slightly from 5.2% in September and still below the Bank of Ghana’s medium-term target band of 6–10%. A weaker cedi, however, can push up the cost of imported goods and raw materials.',
    ],
    takeaways: [
      'If your business imports goods, budget for higher dollar costs.',
      'Review prices and contracts that depend on the exchange rate.',
      'Diligence and planning beat panic — keep records and a buffer.',
    ],
    sources: [
      { name: 'Citi Newsroom', url: 'https://www.citinewsroom.com/2026/11/cedi-depreciation-reaches-10-6-in-november-bog-data/' },
      { name: 'MyJoyOnline', url: 'https://www.myjoyonline.com/cedi-depreciates-by-10-6-to-dollar-as-of-november-2026-bog/' },
    ],
  },
  {
    id: 'balanced-plate',
    category: 'health',
    title: 'Eat the rainbow: how to build a balanced plate',
    summary: 'A simple plate guide using everyday Ghanaian foods — half veg, a quarter grains, a quarter protein.',
    date: '2026-11-15',
    readMins: 3,
    image: img.plate,
    imageCredit: 'Photo: Winniepix / Wikimedia Commons (CC BY 2.0)',
    keyFacts: [
      { label: 'Vegetables & fruit', value: '½ plate' },
      { label: 'Whole grains', value: '¼ plate' },
      { label: 'Protein', value: '¼ plate' },
    ],
    body: [
      'A balanced diet simply means giving your body the right mix of foods in the right amounts. One easy way to remember it is the plate method.',
      'Fill half your plate with vegetables and fruit — kontomire, garden eggs, cabbage, carrots, okro, pawpaw, oranges or pineapple. The more colours, the wider the range of vitamins and minerals.',
      'Make a quarter of the plate whole grains or starchy foods — brown rice, oats, millet, or our kenkey, banku and yam in sensible portions. Use the last quarter for protein: beans (red-red), fish, eggs, chicken or groundnuts.',
      'Go easy on salt, sugar and deep-fried foods, use oils such as palm oil in moderation, and drink water with your meals instead of sugary drinks.',
    ],
    takeaways: [
      'Half the plate: vegetables and fruit.',
      'A quarter: whole grains or starchy staples.',
      'A quarter: beans, fish, eggs or lean meat.',
      'Less salt, sugar and frying — more water.',
    ],
    sources: [],
  },
  {
    id: 'hydration',
    category: 'health',
    title: 'Water: the simplest health habit you can start today',
    summary: 'Why staying hydrated matters in our heat, and easy ways to drink more water.',
    date: '2026-11-08',
    readMins: 2,
    image: img.water,
    imageCredit: 'Photo: Kurt Kaiser / Wikimedia Commons (CC0)',
    keyFacts: [
      { label: 'Aim for', value: '~8 glasses' },
      { label: 'In the heat', value: 'Drink more' },
      { label: 'Swap', value: 'Soda → water' },
    ],
    body: [
      'Water keeps your energy up, helps digestion, regulates body temperature and supports your kidneys. In Accra’s heat — and through long services and busy weeks — it is easy to get mildly dehydrated without noticing.',
      'Most adults do well with around eight glasses a day, and more when it is hot or you are active. Thirst, headaches, tiredness and dark urine are early signs you need more.',
      'Carry a bottle, drink a glass when you wake up, and choose water over sugary drinks.',
    ],
    takeaways: [
      'Keep a water bottle with you — including to church.',
      'Start every morning with a glass of water.',
      'Replace one sugary drink a day with water.',
    ],
    sources: [],
  },
  {
    id: 'fruit-over-fizz',
    category: 'health',
    title: 'Fruit over fizz: smarter snacking for busy days',
    summary: 'Swap sugary snacks for fresh, local fruit — your energy and waistline will thank you.',
    date: '2026-11-01',
    readMins: 2,
    image: img.fruit,
    imageCredit: 'Photo: Unsplash via Wikimedia Commons (CC0)',
    keyFacts: [
      { label: 'Snack on', value: 'Whole fruit' },
      { label: 'Limit', value: 'Sugary drinks' },
      { label: 'Try', value: 'Local & seasonal' },
    ],
    body: [
      'Sugary snacks and soft drinks give a quick rush followed by a crash. Whole fruit gives you natural sweetness along with fibre, vitamins and water.',
      'We are blessed with excellent local fruit — oranges, pawpaw, pineapple, watermelon, bananas, mangoes and avocado. Keep some within reach at home, at work or in your bag.',
      'Whole fruit is better than juice: the fibre keeps you full and slows the sugar. Pair fruit with a handful of groundnuts for a snack that lasts.',
    ],
    takeaways: [
      'Keep fruit where you can see it.',
      'Choose whole fruit over juice.',
      'Pair fruit with groundnuts for lasting energy.',
    ],
    sources: [],
  },
];

export const articlesBy = (cat) => articles.filter((a) => a.category === cat);
