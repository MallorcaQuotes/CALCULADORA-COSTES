import { NextRequest, NextResponse } from 'next/server';
import { setAdminCookie, clearAdminCookie } from '@/lib/auth/admin';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const expectedPassword = process.env.ADMIN_PASSWORD || 'MallorcaAdmin2026!';

    if (password === expectedPassword) {
      setAdminCookie();
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Contraseña de administrador incorrecta.' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Error del servidor.' }, { status: 500 });
  }
}

export async function DELETE() {
  clearAdminCookie();
  return NextResponse.json({ success: true });
}
