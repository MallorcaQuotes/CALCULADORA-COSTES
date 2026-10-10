import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkAdminAuth } from '@/lib/auth/admin';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!checkAdminAuth()) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const leadId = params.id;

  try {
    const lead = await db.lead.findUnique({ where: { id: leadId } });

    if (!lead) {
      return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 });
    }

    const now = new Date();

    await db.lead.update({
      where: { id: leadId },
      data: { status: 'Rechazado' },
    });

    await db.approval.upsert({
      where: { leadId },
      create: {
        leadId,
        decision: 'Rechazado',
        decidedBy: 'Propietario Admin',
        decidedAt: now,
      },
      update: {
        decision: 'Rechazado',
        decidedBy: 'Propietario Admin',
        decidedAt: now,
      },
    });

    // Delete or cancel any pending email delivery
    await db.emailDelivery.deleteMany({
      where: { leadId },
    });

    return NextResponse.json({ success: true, status: 'Rechazado' });
  } catch (error: any) {
    console.error('Error rejecting lead:', error);
    return NextResponse.json({ error: 'Error rechazando el lead' }, { status: 500 });
  }
}
