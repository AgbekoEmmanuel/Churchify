// Member authentication.
//
// The app is invite-only: there is NO public sign-up. A member account exists only
// once the church office creates it (e.g. from the member register in the
// First-Timers / membership tracker). People who are not yet members can browse
// the public side as guests, or send a "request access" form for the office to
// approve.
//
// This file is the single seam to swap for the real backend (Supabase auth on the
// tracker's project). Until then it uses a local demo directory so the full
// member experience can be tested.

const DEMO_DIRECTORY = [
  {
    id: 'demo-1',
    memberId: 'TBC-0427',
    phone: '0241234567',
    password: 'balance2026',
    firstName: 'Ama',
    lastName: 'Mensah',
    fellowshipId: 'philadelphia',
    department: 'Ushering',
    memberSince: '2024-03-10',
    role: 'member',
  },
];

export const DEMO_CREDENTIALS = { identifier: 'TBC-0427', password: 'balance2026' };

const normalise = (v) => String(v || '').trim().toUpperCase().replace(/\s+/g, '').replace(/^\+233/, '0');

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export async function signInMember(identifier, password) {
  await wait(700);
  const id = normalise(identifier);
  const member = DEMO_DIRECTORY.find((m) => normalise(m.memberId) === id || normalise(m.phone) === id);
  if (!member || member.password !== password) {
    const err = new Error('We couldn’t find a member account with those details. Check your Member ID or phone number and password.');
    err.code = 'invalid';
    throw err;
  }
  const { password: _pw, ...profile } = member;
  return { token: `demo.${member.id}.${Date.now()}`, profile };
}

export async function submitAccessRequest(form) {
  await wait(900);
  // TODO: insert into a `membership_requests` table for the church office to review.
  return { reference: `REQ-${Math.floor(100000 + Math.random() * 900000)}`, ...form };
}

export async function requestPasswordReset(identifier) {
  await wait(700);
  // TODO: trigger an SMS/OTP via the backend.
  return { ok: true, identifier };
}
