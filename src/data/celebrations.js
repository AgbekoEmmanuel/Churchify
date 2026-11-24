// Birthdays in the church family (members only).
//
// SAMPLE DATA, used only until the church database function is set up
// (tracker: supabase/members_app.sql). The real list comes from the tracker's
// birthday list. Only the day and
// month are shown, never the year of birth.
//
// Dates are generated relative to today so the demo always has someone to
// celebrate this week.

const fmt = (d) => `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const inDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return fmt(d); };

export const birthdays = [
  { id: 'b1', name: 'Kwame Asante', fellowshipId: 'balance', date: inDays(0) },
  { id: 'b2', name: 'Abena Owusu', fellowshipId: 'smyrna', date: inDays(0) },
  { id: 'b3', name: 'Yaw Boateng', fellowshipId: 'berea', date: inDays(1) },
  { id: 'b4', name: 'Esi Quaye', fellowshipId: 'philadelphia', date: inDays(2) },
  { id: 'b5', name: 'Kojo Antwi', fellowshipId: 'ephesus', date: inDays(4) },
  { id: 'b6', name: 'Akosua Darko', fellowshipId: 'laodicea', date: inDays(6) },
  { id: 'b7', name: 'Nana Ama Addo', fellowshipId: 'philippi', date: inDays(9) },
  { id: 'b8', name: 'Selorm Agbeko', fellowshipId: 'thyatira', date: inDays(13) },
  { id: 'b9', name: 'Fiifi Mensah', fellowshipId: 'pergamos', date: inDays(18) },
  { id: 'b10', name: 'Adwoa Sarpong', fellowshipId: 'balance', date: inDays(23) },
  { id: 'b11', name: 'Edem Kpodo', fellowshipId: 'smyrna', date: inDays(27) },
];


export const wishTemplates = [
  'Happy birthday! May this new year be balanced for dominion. 🎉',
  'Celebrating you today! God’s favour surround you like a shield.',
  'Happy birthday from the family! Arise and shine — your light has come.',
];
