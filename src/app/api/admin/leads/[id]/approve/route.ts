import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkAdminAuth } from '@/lib/auth/admin';
import { calculateNextDeliverySlot } from '@/lib/scheduling/delivery';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!checkAdminAuth()) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const leadId = params.id;

  try {
    const lead = await db.lead.findUnique({
      where: { id: leadId },
      include: { delivery: true },
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead no encontrado' }, { status: 404 });
    }

    // Calculate delivery slot according to Europe/Madrid rules (>=12h delay, 10:00-14:00)
    const now = new Date();
    const scheduledFor = calculateNextDeliverySlot(lead.createdAt, now);

    // Update lead status to Programado
    await db.lead.update({
      where: { id: leadId },
      data: { status: 'Programado' },
    });

    // Record approval
    await db.approval.upsert({
      where: { leadId },
      create: {
        leadId,
        decision: 'Aprobado',
        decidedBy: 'Propietario Admin',
        decidedAt: now,
      },
      update: {
        decision: 'Aprobado',
        decidedBy: 'Propietario Admin',
        decidedAt: now,
      },
    });

    // Upsert EmailDelivery record
    await db.emailDelivery.upsert({
      where: { leadId },
      create: {
        leadId,
        recipient: lead.email,
        scheduledFor,
        status: 'Programado',
      },
      update: {
        scheduledFor,
        status: 'Programado',
      },
    });

    return NextResponse.json({
      success: true,
      status: 'Programado',
      scheduledFor: scheduledFor.toISOString(),
    });
  } catch (error: any) {
    console.error('Error approving lead:', error);
    return NextResponse.json({ error: 'Error aprobando el lead' }, { status: 500 });
  }
}
