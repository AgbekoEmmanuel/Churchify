// Member content. Sermons are real (seeded from the YouTube channel feed and
// refreshed live on device). Events, announcements and fellowship notices are
// SAMPLE content standing in until the app is wired to the church admin backend.
import { flyers, photos } from './church';

export const sermonSeed = [
  { id: '98ZuWVWCtUY', raw: 'Buying Dominion || 18th November 2026 || Midweek Service || Apostle Michael Dadzie ||TBC', published: '2026-11-19' },
  { id: 'yksOIvjUKho', raw: 'Buying Dominion || Apostle Michael Dadzie || The Balance Church', published: '2026-11-18' },
  { id: '-mKjFqwTZnQ', raw: 'The Attitudes of TrailBlazers || 15th, November 2026|| Sunday Service || Apostle Michael Dadzie |TBC', published: '2026-11-16' },
  { id: 'eQ9Gg-TKmzs', raw: 'The Attitudes of TrailBlazers || Apostle Michael Dadzie || The Balance Church', published: '2026-11-15' },
  { id: '--SmMi01Dh8', raw: 'Leading The Next Generation Church || First Edition ||  Apostle Michael Dadzie || The Balance Church', published: '2026-11-11' },
  { id: 'RAkROi4d4GI', raw: 'The Making of TrailBlazers || 8th, November 2026|| Sunday Service || Apostle Michael Dadzie||TBC', published: '2026-11-08' },
  { id: 'U3km8uDywgU', raw: 'The Making of TrailBlazers || Apostle Michael Dadzie|| The Balance Church', published: '2026-11-08' },
  { id: 'H5f2rZI3T5M', raw: 'The Mechanics Of Ministry || Apostle Michael Dadzie ||TBC', published: '2026-11-07' },
  { id: 'PcfPfTNp2Xg', raw: 'Trail Blazers || 1st November, 2026|| Sunday Service || Apostle Michael Dadzie||TBC', published: '2026-11-02' },
  { id: 'kd28mGr0Hmk', raw: 'Trail Blazers || Apostle Michael Dadzie || The Balance Church', published: '2026-11-01' },
  { id: 'shUNuQqVXHs', raw: 'The Exceptional Youth || 28th October, 2026|| Midweek Service || Apostle Michael Dadzie||TBC', published: '2026-10-29' },
  { id: 'Exk2pnNxxwg', raw: 'The Exceptional Youth || Apostle Michael Dadzie||TBC', published: '2026-10-29' },
  { id: 'EyDc6f_n-VY', raw: 'Prophetic Association || 25th October, 2026|| Sunday Service || Apostle Michael Dadzie||TBC', published: '2026-10-26' },
  { id: 'UuiEzs9RWkE', raw: 'Prophetic Association || Apostle Michael Dadzie || The Balance Church', published: '2026-10-25' },
  { id: 'ENGRozWrmkM', raw: 'Impartation Of Academic Grace || 10th,October 2026 || Prayer Intense || Apostle Michael Dadzie ||TBC', published: '2026-10-24' },
];

const daysFromNow = (d, h = 10, m = 0) => {
  const t = new Date();
  t.setUTCDate(t.getUTCDate() + d);
  t.setUTCHours(h, m, 0, 0);
  return t.toISOString();
};

// SAMPLE — replace with the events table from the admin backend.
export const events = [
  { id: 'e1', title: 'Wisdom Service', category: 'Special Program', date: daysFromNow(6, 9, 0), venue: 'Dome of Excellence', image: flyers.wisdomService, membersOnly: false,
    description: 'A special gathering on the subject of wisdom with Apostle Michael Dadzie. Come expectant and bring a friend.' },
  { id: 'e2', title: 'Great Grace — 5 Nights of Prayer', category: 'Prayers', date: daysFromNow(10, 18, 30), venue: 'Dome of Excellence', image: flyers.greatGrace, membersOnly: false,
    description: 'Five consecutive nights of intense prayer as we position ourselves for great grace. Monday to Friday, 6:30 PM nightly.' },
  { id: 'e3', title: 'Becoming a Focused Youth', category: 'Midweek', date: daysFromNow(13, 18, 0), venue: 'Dome of Excellence', image: flyers.focusedYouth, membersOnly: false,
    description: 'Midweek teaching on focus, discipline and early arrival for the young people of this generation.' },
  { id: 'e4', title: 'Mighty Women — Ladies Camp', category: 'Fellowship', date: daysFromNow(19, 10, 0), venue: 'Oak Villa Estate', image: flyers.mightyWomen, membersOnly: true,
    description: 'An exclusive camp for the women of The Balance Church. Registration is limited to members.' },
  { id: 'e5', title: 'Possessing the Universities', category: 'Special Program', date: daysFromNow(26, 10, 0), venue: 'Dome of Excellence', image: flyers.possessingUniversities, membersOnly: false,
    description: 'Equipping students to take territory on campus — academically, spiritually and in leadership.' },
  { id: 'e6', title: 'Marketplace Apostles', category: 'Sunday Service', date: daysFromNow(34, 10, 0), venue: 'Dome of Excellence', image: flyers.marketplaceApostles, membersOnly: false,
    description: 'A Sunday dedicated to the ambidextrous mandate: carrying the Kingdom into business and the marketplace.' },
];

// SAMPLE — replace with the announcements table from the admin backend.
export const announcements = [
  { id: 'a1', title: 'Workers’ meeting this Saturday', body: 'All heads of department and workers are to meet at the Dome of Excellence at 4:00 PM. Attendance is compulsory.', date: daysFromNow(-1), pinned: true, audience: 'Workers' },
  { id: 'a2', title: 'Year-end thanksgiving service', body: 'Begin preparing your thanksgiving offering and testimony. Testimony forms are available from your fellowship leader.', date: daysFromNow(-2), audience: 'All members' },
  { id: 'a3', title: 'Fellowship reports due', body: 'Fellowship leaders should submit November attendance and follow-up reports by the last Sunday of the month.', date: daysFromNow(-4), audience: 'Leaders' },
  { id: 'a4', title: 'Choir & Minstrels auditions', body: 'Gifted in music? Auditions for the Minstrels hold after midweek service. Speak to the music director.', date: daysFromNow(-6), audience: 'All members' },
];

// SAMPLE — per-fellowship notices.
export const fellowshipNotices = [
  { id: 'f1', title: 'Fellowship meeting after Sunday service', body: 'We gather at our usual spot right after service. New members, come say hi!', date: daysFromNow(-1) },
  { id: 'f2', title: 'Visitation this week', body: 'We are checking on members who have missed service recently. Volunteer with your leader.', date: daysFromNow(-3) },
];

export const dailyWords = [
  { text: 'Every one with one of his hands wrought in the work, and with the other hand held a weapon.', ref: 'Nehemiah 4:17' },
  { text: 'And it shall come to pass in the last days, that the mountain of the Lord’s house shall be established in the top of the mountains.', ref: 'Isaiah 2:2' },
  { text: 'Arise, shine; for thy light is come, and the glory of the Lord is risen upon thee.', ref: 'Isaiah 60:1' },
  { text: 'Seest thou a man diligent in his business? he shall stand before kings.', ref: 'Proverbs 22:29' },
  { text: 'A wise man is strong; yea, a man of knowledge increaseth strength.', ref: 'Proverbs 24:5' },
  { text: 'Ye are the light of the world. A city that is set on an hill cannot be hid.', ref: 'Matthew 5:14' },
  { text: 'The kingdoms of this world are become the kingdoms of our Lord, and of his Christ.', ref: 'Revelation 11:15' },
];

export const heroImages = [photos.congregationDome, photos.stageJesus, photos.crowd, photos.worshipHand];

export const prayerCategories = ['Personal', 'Family', 'Academics', 'Career & Business', 'Health', 'Thanksgiving'];
