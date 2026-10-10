import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateEstimatePdf } from '@/lib/pdf/generator';
import { sendEstimateEmail } from '@/lib/email/sender';
import { SupportedLanguage } from '@/lib/i18n';

export async function GET(req: NextRequest) {
  // Verify cron secret if configured
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || 'mq-delivery-cron-secret-2026';

  if (authHeader && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const now = new Date();

  try {
    // Find all scheduled deliveries that are due now
    const dueDeliveries = await db.emailDelivery.findMany({
      where: {
        status: 'Programado',
        scheduledFor: { lte: now },
      },
      include: {
        lead: {
          include: {
            project: true,
            estimate: {
              include: {
                lineItems: {
                  orderBy: { orderIndex: 'asc' },
                },
              },
            },
          },
        },
      },
      take: 20, // Process in batches
    });

    const results = [];

    for (const delivery of dueDeliveries) {
      const { lead } = delivery;
      if (!lead || !lead.estimate || !lead.project) {
        continue;
      }

      try {
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

        if (emailResult.success) {
          await db.lead.update({
            where: { id: lead.id },
            data: { status: 'Enviado' },
          });

          await db.emailDelivery.update({
            where: { id: delivery.id },
            data: {
              status: 'Enviado',
              sentAt: new Date(),
              attempts: { increment: 1 },
              errorMessage: null,
            },
          });

          results.push({ leadId: lead.id, reference: lead.reference, status: 'sent' });
        } else {
          await db.emailDelivery.update({
            where: { id: delivery.id },
            data: {
              status: 'Error',
              attempts: { increment: 1 },
              errorMessage: emailResult.error || 'Failed to dispatch email',
            },
          });

          results.push({ leadId: lead.id, reference: lead.reference, status: 'error', error: emailResult.error });
        }
      } catch (err: any) {
        console.error(`Error processing delivery for lead ${lead.id}:`, err);
        await db.emailDelivery.update({
          where: { id: delivery.id },
          data: {
            status: 'Error',
            attempts: { increment: 1 },
            errorMessage: err.message,
          },
        });
        results.push({ leadId: lead.id, reference: lead.reference, status: 'error', error: err.message });
      }
    }

    return NextResponse.json({
      success: true,
      processedCount: results.length,
      results,
    });
  } catch (error: any) {
    console.error('Error running deliveries cron:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
