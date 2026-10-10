import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { calculateDetailedEstimate } from '@/lib/pricing/engine';
import { DEFAULT_PRICING_CONFIG } from '@/lib/pricing/config';
import { DetailedEstimateInput, QualityLevel, ClimateOption, PoolOption } from '@/lib/pricing/types';
import { sendTelegramLeadNotification } from '@/lib/telegram';
import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Extract text fields
    const firstName = (formData.get('firstName') as string)?.trim() || '';
    const lastName = (formData.get('lastName') as string)?.trim() || '';
    const email = (formData.get('email') as string)?.trim().toLowerCase() || '';
    const phone = (formData.get('phone') as string)?.trim() || '';
    const nationality = (formData.get('nationality') as string)?.trim() || 'Unknown';
    const language = (formData.get('language') as string)?.trim() || 'en';
    const location = (formData.get('location') as string)?.trim() || 'Mallorca';
    const plotOwned = (formData.get('plotOwned') as string)?.trim() || 'no';

    // Calculation inputs
    const builtAreaM2 = Number(formData.get('builtAreaM2')) || 150;
    const floors = Number(formData.get('floors')) || 1;
    const bedrooms = Number(formData.get('bedrooms')) || 2;
    const bathrooms = Number(formData.get('bathrooms')) || 2;
    const quality = (formData.get('quality') as QualityLevel) || 'Media';
    const climateSystem = (formData.get('climateSystem') as ClimateOption) || 'Aerotermia + suelo radiante';
    const domotics = formData.get('domotics') === 'true';
    const pool = (formData.get('pool') as PoolOption) || 'Sin piscina';
    const exteriorParkingSpaces = Number(formData.get('exteriorParkingSpaces')) || 0;
    const exteriorGardenM2 = Number(formData.get('exteriorGardenM2')) || 0;
    const projectLicences = formData.get('projectLicences') === 'true';

    // Basic validation
    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { error: 'Por favor complete todos los datos de contacto obligatorios.' },
        { status: 400 }
      );
    }

    // Optional file upload
    const file = formData.get('plans') as File | null;
    let savedFileName: string | null = null;
    let originalFileName: string | null = null;

    if (file && file.size > 0) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: 'Formato de archivo no válido. Solo se admiten PDF, PNG o JPG.' },
          { status: 400 }
        );
      }

      if (file.size > 15 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'El archivo excede el tamaño máximo permitido de 15MB.' },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadsDir = path.join(process.cwd(), 'storage', 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });

      const ext = path.extname(file.name) || (file.type === 'application/pdf' ? '.pdf' : '.jpg');
      savedFileName = `${randomUUID()}${ext}`;
      originalFileName = file.name;
      await fs.writeFile(path.join(uploadsDir, savedFileName), buffer);
    }

    // Load active pricing configuration from DB (if any)
    const activeConfigRecord = await db.pricingConfiguration.findFirst({
      where: { isActive: true },
    });

    let pricingConfig = DEFAULT_PRICING_CONFIG;
    if (activeConfigRecord && activeConfigRecord.itemsJson) {
      try {
        const parsedRates = JSON.parse(activeConfigRecord.itemsJson);
        pricingConfig = {
          ...DEFAULT_PRICING_CONFIG,
          version: activeConfigRecord.version,
          marginRate: activeConfigRecord.marginRate,
          contingencyRate: activeConfigRecord.contingencyRate,
          projectLicencesRate: activeConfigRecord.projectLicencesRate,
          rates: parsedRates,
        };
      } catch (err) {
        console.error('Failed to parse active pricing config from DB, using defaults', err);
      }
    }

    const calcInput: DetailedEstimateInput = {
      builtAreaM2,
      floors,
      bedrooms,
      bathrooms,
      quality,
      climateSystem,
      domotics,
      pool,
      exteriorParkingSpaces,
      exteriorGardenM2,
      projectLicences,
    };

    const estimateResult = calculateDetailedEstimate(calcInput, pricingConfig);

    // Generate unique reference (e.g. MQ-10023)
    const leadCount = await db.lead.count();
    const reference = `MQ-${String(10001 + leadCount).padStart(5, '0')}`;

    // Create records in database
    const lead = await db.lead.create({
      data: {
        reference,
        firstName,
        lastName,
        email,
        phone,
        nationality,
        language,
        location,
        plotOwned,
        status: 'En revisión',
        plansFileUrl: savedFileName,
        plansFileName: originalFileName,
        project: {
          create: {
            builtAreaM2,
            floors,
            bedrooms,
            bathrooms,
            quality,
            climateSystem,
            domotics,
            pool,
            parkingSpaces: exteriorParkingSpaces,
            gardenM2: exteriorGardenM2,
            projectLicences,
          },
        },
        estimate: {
          create: {
            pricingVersion: estimateResult.pricingVersion,
            centralTotal: estimateResult.centralTotal,
            lowEstimate: estimateResult.lowEstimate,
            highEstimate: estimateResult.highEstimate,
            appliedMargin: pricingConfig.marginRate,
            projectLicencesAmount: estimateResult.projectLicencesAmount,
            lineItems: {
              create: estimateResult.lineItems.map((item, idx) => ({
                key: item.key,
                name: item.name,
                quantity: item.quantity,
                unit: item.unit,
                unitPrice: item.unitPrice,
                total: item.customerTotal,
                orderIndex: idx,
              })),
            },
          },
        },
      },
      include: {
        project: true,
        estimate: {
          include: {
            lineItems: true,
          },
        },
      },
    });

    // Dispatch Telegram notification to owner
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.mallorcaquotes.com';
    const adminLeadUrl = `${appUrl}/admin/leads/${lead.id}`;

    sendTelegramLeadNotification({
      reference: lead.reference,
      language: lead.language,
      nationality: lead.nationality,
      location: lead.location,
      plotOwned: lead.plotOwned,
      builtAreaM2,
      floors,
      bedrooms,
      bathrooms,
      quality,
      pool,
      lowEstimate: estimateResult.lowEstimate,
      highEstimate: estimateResult.highEstimate,
      customerName: `${firstName} ${lastName}`,
      email,
      phone,
      adminLeadUrl,
    }).catch((e) => console.error('Telegram dispatch error', e));

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      reference: lead.reference,
      estimate: {
        lowEstimate: estimateResult.lowEstimate,
        highEstimate: estimateResult.highEstimate,
        pricePerM2: estimateResult.pricePerM2,
      },
    });
  } catch (error) {
    console.error('Error processing detailed estimate:', error);
    return NextResponse.json(
      { error: 'Error interno procesando la estimación.' },
      { status: 500 }
    );
  }
}
