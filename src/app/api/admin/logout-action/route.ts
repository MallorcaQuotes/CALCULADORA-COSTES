import { NextResponse } from 'next/server';
import { clearAdminCookie } from '@/lib/auth/admin';

export async function GET() {
  clearAdminCookie();
  return NextResponse.redirect(new URL('/admin/login', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'));
}
