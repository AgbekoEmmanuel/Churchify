// Connection to the church database: the Supabase project behind the
// First-Timers tracker. This is the hub of The Balance Church ecosystem; the
// members app reads from it through small, privacy-safe database functions
// (see balance-church-–-first-timers-tracker/supabase/members_app.sql).
//
// No SDK needed for reads: each function is a POST to Supabase's REST API.
// When member sign-in moves to Supabase, pass the member's access token as
// `token` so the database knows who is asking.

const URL = process.env.EXPO_PUBLIC_TBC_SUPABASE_URL;
const KEY = process.env.EXPO_PUBLIC_TBC_SUPABASE_ANON_KEY;

export const churchDbConfigured = !!(URL && KEY);

export async function callFunction(name, args = {}, { token, timeoutMs = 10000 } = {}) {
  if (!churchDbConfigured) throw new Error('not-configured');
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${URL}/rest/v1/rpc/${name}`, {
      method: 'POST',
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${token || KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(args),
      signal: ctrl.signal,
    });
    if (res.status === 404) throw new Error('not-set-up'); // members_app.sql not run yet
    if (!res.ok) throw new Error(`db-${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

// Upcoming birthdays (next `days` days): [{ id, name, birth_month, birth_day, fellowship }]
export const fetchUpcomingBirthdays = (days = 31) => callFunction('app_upcoming_birthdays', { days_ahead: days });
