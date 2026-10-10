import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkAdminAuth } from '@/lib/auth/admin';
import { generateEstimatePdf } from '@/lib/pdf/generator';
import { sendEstimateEmail } from '@/lib/email/sender';
import { SupportedLanguage } from '@/lib/i18n';

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
      include: {
        project: true,
        estimate: {
          include: {
            lineItems: {
              orderBy: { orderIndex: 'asc' },
            },
          },
        },
        delivery: true,
      },
    });

    if (!lead || !lead.estimate || !lead.project) {
      return NextResponse.json({ error: 'Datos de lead incompletos' }, { status: 400 });
    }

    const pdfBuffer = await generateEstimatePdf({
      reference: lead.reference,
      customerName: `${lead.firstName} ${lead.lastName}`,
      email: lead.email,
      phone: lead.phone,
      location: lead.location,
      builtAreaM2: lead.project.builtAreaM2,
      floors: lead.project.floors,
      bedrooms: lead.project.bedrooms,
      bathrooms: lead.project.bathrooms,
      quality: lead.project.quality,
      climateSystem: lead.project.climateSystem,
      domotics: lead.project.domotics,
      pool: lead.project.pool,
      exteriorParking: lead.project.parkingSpaces,
      exteriorGardenM2: lead.project.gardenM2,
      projectLicences: lead.project.projectLicences,
      centralTotal: lead.estimate.centralTotal,
      lowEstimate: lead.estimate.lowEstimate,
      highEstimate: lead.estimate.highEstimate,
      pricePerM2: Math.round(lead.estimate.centralTotal / lead.project.builtAreaM2),
      language: lead.language as SupportedLanguage,
      lineItems: lead.estimate.lineItems.map((it) => ({
        key: it.key,
        name: it.name,
        quantity: it.quantity,
        unit: it.unit,
        unitPrice: it.unitPrice,
        customerTotal: it.total,
      })),
      createdAt: lead.createdAt,
    });

    const emailResult = await sendEstimateEmail({
      recipientEmail: lead.email,
      customerName: `${lead.firstName} ${lead.lastName}`,
      reference: lead.reference,
      location: lead.location,
      lowEstimate: lead.estimate.lowEstimate,
      highEstimate: lead.estimate.highEstimate,
      language: lead.language as SupportedLanguage,
      pdfBuffer,
    });

    if (!emailResult.success) {
      await db.emailDelivery.upsert({
        where: { leadId },
        create: {
          leadId,
          recipient: lead.email,
          scheduledFor: new Date(),
          status: 'Error',
          errorMessage: emailResult.error || 'Fallo de envío',
          attempts: 1,
        },
        update: {
          status: 'Error',
          errorMessage: emailResult.error || 'Fallo de envío',
          attempts: { increment: 1 },
        },
      });

      return NextResponse.json({ error: 'Fallo al enviar correo: ' + emailResult.error }, { status: 500 });
    }

    const now = new Date();
    await db.lead.update({
      where: { id: leadId },
      data: { status: 'Enviado' },
    });

    await db.emailDelivery.upsert({
      where: { leadId },
      create: {
        leadId,
        recipient: lead.email,
        scheduledFor: now,
        sentAt: now,
        status: 'Enviado',
        attempts: 1,
      },
      update: {
        sentAt: now,
        status: 'Enviado',
        attempts: { increment: 1 },
        errorMessage: null,
      },
    });

    return NextResponse.json({ success: true, status: 'Enviado' });
  } catch (error: any) {
    console.error('Error sending estimate now:', error);
    return NextResponse.json({ error: error.message || 'Error en el envío' }, { status: 500 });
  }
}
