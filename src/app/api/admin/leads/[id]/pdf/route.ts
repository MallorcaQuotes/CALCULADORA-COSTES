import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkAdminAuth } from '@/lib/auth/admin';
import { generateEstimatePdf } from '@/lib/pdf/generator';
import { SupportedLanguage } from '@/lib/i18n';

export async function GET(
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
      },
    });

    if (!lead || !lead.estimate || !lead.project) {
      return NextResponse.json({ error: 'Datos no encontrados' }, { status: 404 });
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

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="MallorcaQuotes_${lead.reference}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Error al generar el PDF' }, { status: 500 });
  }
}
