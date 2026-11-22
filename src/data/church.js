// Everything here is public information taken from The Balance Church website
// and official flyers. Member-only content lives in ./content.js.

export const brand = {
  mark: require('../../assets/church/brand/mark_hd_white.png'),
  wordmark: require('../../assets/church/brand/wordmark_white.png'),
  logoFull: require('../../assets/church/brand/logo_full_white.png'),
};

export const photos = {
  congregationDome: require('../../assets/church/photos/congregation_dome.jpg'),
  congregationWide: require('../../assets/church/photos/congregation_wide.jpg'),
  crowd: require('../../assets/church/photos/crowd.jpg'),
  stageJesus: require('../../assets/church/photos/stage_jesus.jpg'),
  apostleBW: require('../../assets/church/photos/apostle_bw.jpg'),
  apostlePortrait: require('../../assets/church/photos/apostle_portrait.jpg'),
  preaching: require('../../assets/church/photos/preaching.jpg'),
  worshipHand: require('../../assets/church/photos/worship_hand.jpg'),
  choir: require('../../assets/church/photos/choir.jpg'),
  keysBW: require('../../assets/church/photos/keys_bw.jpg'),
  worshipYouth: require('../../assets/church/photos/worship_youth.jpg'),
  worshipGroup: require('../../assets/church/photos/worship_group.jpg'),
  ministers: require('../../assets/church/photos/ministers.jpg'),
  members: require('../../assets/church/photos/members.jpg'),
  fellowship: require('../../assets/church/photos/fellowship.jpg'),
  fellowship2: require('../../assets/church/photos/fellowship2.jpg'),
  minstrel: require('../../assets/church/photos/minstrel.jpg'),
  yearTheme: require('../../assets/church/photos/year_theme.jpg'),
};

export const church = {
  name: 'The Balance Church',
  short: 'TBC',
  hashtag: '#whereGodlives',
  tagline: 'Spiritual and earthly principles, balanced for dominion.',
  story:
    'Founded on the belief that life has both spiritual and physical principles that, when balanced, lead to dominion. The Balance Church is dedicated to raising a generation of young people grounded in the Word of God and equipped to make an impact in the world.',
  mission: {
    text: 'Declaring the holistic message of balance with an ambidextrous mandate to incorporate earthly and spiritual principles for dominion.',
    ref: 'Nehemiah 4:17–18',
  },
  vision: {
    text: 'Raising and equipping the younger generation with a dispensational body of truth consistent with the civilization to invade and dominate the mountains of influence until the kingdoms of the world become the kingdom of our Lord.',
    ref: 'Isaiah 2:2',
  },
  yearTheme: {
    year: 2026,
    title: 'Visibility',
    subtitle: 'Unusual Attention · Mighty Recognitions',
  },
  venue: 'Dome of Excellence',
  address: 'Hawa Avenue, Accra, Ghana',
  mapsUrl: 'https://maps.google.com/?q=The+Balance+Church,+Hawa+Avenue,+Accra',
  phone: '+233 54 074 0816',
  phoneRaw: '+233540740816',
  whatsapp: 'https://wa.me/233540740816',
  email: 'thebalancechurch24@gmail.com',
};

export const modelsOfEmphasis = [
  'Jesus', 'The Holy Spirit', 'The Church', 'Consecration', 'Capacity Building', 'Mentorship',
  'Early Achievement', 'Posterity', 'Excellence', 'Diligence', 'Wisdom', 'Prosperity',
  'Influence', 'Leadership', 'Honour', 'Business',
];

export const leaders = [
  {
    id: 'apostle',
    name: 'Apostle Michael Dadzie',
    role: 'General Overseer',
    image: require('../../assets/church/leaders/apostle.png'),
    bio: [
      "A man set apart for the Master's use, whose assignment is the liberation of young people through the incorporation of spiritual and earthly principles for dominion — the ambidextrous mandate. For over 15 years he has dedicated his life to impacting the youth, ensuring they are nourished spiritually, emotionally, psychologically and in every facet of life.",
      'He commenced his ministry on the land of Ghana National College; it evolved into the Gathering of Champions Network in Accra, and finally The Balance Church in Prime Accra. He continues to charge and challenge the youth of this generation to affect their world.',
    ],
  },
  {
    id: 'resident',
    name: 'Rev. Moses Obeng Mensah',
    role: 'Resident Pastor',
    image: require('../../assets/church/leaders/resident_pastor.png'),
    bio: [
      'Rev. Moses Obeng Mensah is the Resident Pastor of The Balance Church. His ministry and mandate is to preach servanthood, loyalty, honour and the art of following to his generation.',
      'Interwoven in his assignment is to communicate to the body of Christ the subject of spiritual fathers and sons, the wisdom to work the relationship, and how the gap between spiritual fathers and sons can be bridged.',
    ],
  },
];

// Accra runs on GMT (UTC+0) all year — times below are UTC.
export const services = [
  { id: 'sunday', name: 'Sunday Service', day: 0, hour: 10, minute: 0, durationMin: 180, label: 'Sundays · 10:00 AM' },
  { id: 'midweek', name: 'Midweek Service', day: 3, hour: 18, minute: 30, durationMin: 150, label: 'Wednesdays · 6:30 PM' },
];

export const socials = [
  { id: 'youtube', label: 'YouTube', icon: 'logo-youtube', url: 'https://www.youtube.com/@ApostleMichaelDadzie' },
  { id: 'instagram', label: 'Instagram', icon: 'logo-instagram', url: 'https://instagram.com/_thebalancechurch' },
  { id: 'tiktok', label: 'TikTok', icon: 'logo-tiktok', url: 'https://tiktok.com/@thebalancechurch' },
  { id: 'facebook', label: 'Facebook', icon: 'logo-facebook', url: 'https://www.facebook.com/michael.dadzie.001' },
];

export const youtube = {
  channelId: 'UCjYedhCXDHfrixRivg3blOA',
  channelUrl: 'https://www.youtube.com/@ApostleMichaelDadzie',
  liveUrl: 'https://www.youtube.com/@ApostleMichaelDadzie/live',
};

export const giving = [
  {
    id: 'tithe',
    title: 'Tithe',
    blurb: 'Faithfulness in our stewardship and commitment.',
    network: 'MTN MoMo',
    number: '0241042935',
    merchantId: '620311',
    accountName: 'The Balance Church',
    icon: 'shield-checkmark-outline',
  },
  {
    id: 'offering',
    title: 'Offering',
    blurb: 'Giving into the vision and operations of the church.',
    network: 'MTN MoMo',
    number: '0542046346',
    accountName: 'Balance Church Offering',
    icon: 'heart-outline',
  },
];
export const givingAbroad = ['WorldRemit', 'Sendwave'];

export const fellowships = [
  { id: 'balance', name: 'Balance', accent: '#D6AE5E', description: 'Finding the center where work, rest, and worship intersect in a rhythmic life.' },
  { id: 'ephesus', name: 'Ephesus', accent: '#E0705A', description: 'Returning to our first love through service, tradition, and shared community roots.' },
  { id: 'smyrna', name: 'Smyrna', accent: '#E39A4B', description: "Resilient faith that blooms even in the hardest soil of life's many trials." },
  { id: 'pergamos', name: 'Pergamos', accent: '#C77DA8', description: 'The strength of conviction meeting the grace of an open and humble mind.' },
  { id: 'thyatira', name: 'Thyatira', accent: '#9C86E0', description: 'A sanctuary for the weary, where hospitality is practiced as a high and holy art.' },
  { id: 'philadelphia', name: 'Philadelphia', accent: '#6FB3E8', description: 'The fellowship of brotherly and sisterly love, where every door is an open invitation.' },
  { id: 'laodicea', name: 'Laodicea', accent: '#E8C25A', description: 'A call to spiritual awakening and the pursuit of gold tried in the fire.' },
  { id: 'philippi', name: 'Philippi', accent: '#5BC7A4', description: "Radical joy and sacrificial friendship, modeling the early church's generous heart." },
  { id: 'berea', name: 'Berea', accent: '#7FA7D9', description: 'Diligent seekers who examine the Word with noble curiosity and sharp focus.' },
];

export const books = [
  { id: 'principles', title: 'Principles of Life', cover: require('../../assets/church/books/principles_of_life.jpg') },
  { id: 'transformed', title: 'Transformed', cover: require('../../assets/church/books/transformed.jpg') },
  { id: 'breaking', title: 'Breaking Mediocrity', cover: require('../../assets/church/books/breaking_mediocrity.jpg') },
  { id: 'boldly', title: 'Come Boldly!', cover: require('../../assets/church/books/come_boldly.jpg') },
  { id: 'leadership', title: 'The Leadership Principles of Jesus', cover: require('../../assets/church/books/leadership_jesus.jpg') },
];

export const flyers = {
  marketplaceApostles: require('../../assets/church/events/marketplace_apostles.jpg'),
  swollenSunday: require('../../assets/church/events/swollen_sunday.jpg'),
  focusedYouth: require('../../assets/church/events/focused_youth.jpg'),
  mightyWomen: require('../../assets/church/events/mighty_women.jpg'),
  greatGrace: require('../../assets/church/events/great_grace.jpg'),
  possessingUniversities: require('../../assets/church/events/possessing_universities.jpg'),
  stretch: require('../../assets/church/events/stretch.jpg'),
  wisdomService: require('../../assets/church/events/wisdom_service.jpg'),
  wiseVirgins: require('../../assets/church/events/wise_virgins.jpg'),
};

export const getFellowship = (id) => fellowships.find((f) => f.id === id);

// Congregation shots from the Dome of Excellence, all 4:3.
export const congregationPhotos = [
  require('../../assets/church/congregation/congregation_1.jpg'),
  require('../../assets/church/congregation/congregation_2.jpg'),
  require('../../assets/church/congregation/congregation_3.jpg'),
  require('../../assets/church/congregation/congregation_4.jpg'),
  require('../../assets/church/congregation/congregation_5.jpg'),
  require('../../assets/church/congregation/congregation_6.jpg'),
  require('../../assets/church/congregation/congregation_7.jpg'),
];
export const fellowshipPhoto = (f) => {
  const i = Math.max(0, fellowships.findIndex((x) => x.id === (f && f.id)));
  return congregationPhotos[i % congregationPhotos.length];
};
