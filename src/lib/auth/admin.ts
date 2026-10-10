import { cookies } from 'next/headers';

const ADMIN_COOKIE_NAME = 'mq_admin_session';

export function checkAdminAuth(): boolean {
  const cookieStore = cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const expectedSecret = process.env.ADMIN_SESSION_SECRET || 'mallorca-quotes-secure-session-key-dev-environment';
  return session === expectedSecret;
}

export function setAdminCookie() {
  const cookieStore = cookies();
  const expectedSecret = process.env.ADMIN_SESSION_SECRET || 'mallorca-quotes-secure-session-key-dev-environment';
  cookieStore.set(ADMIN_COOKIE_NAME, expectedSecret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export function clearAdminCookie() {
  const cookieStore = cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
