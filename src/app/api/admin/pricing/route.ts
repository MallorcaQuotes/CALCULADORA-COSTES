import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkAdminAuth } from '@/lib/auth/admin';

export async function POST(req: NextRequest) {
  if (!checkAdminAuth()) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      marginRate,
      contingencyRate,
      projectLicencesRate,
      deliveryMinDelayHours,
      deliveryWindowStartHour,
      deliveryWindowEndHour,
      rates,
    } = body;

    const activeConfig = await db.pricingConfiguration.findFirst({
      where: { isActive: true },
    });

    if (activeConfig) {
      await db.pricingConfiguration.update({
        where: { id: activeConfig.id },
        data: {
          marginRate: Number(marginRate),
          contingencyRate: Number(contingencyRate),
          projectLicencesRate: Number(projectLicencesRate),
          deliveryMinDelayHours: Number(deliveryMinDelayHours),
          deliveryWindowStartHour: Number(deliveryWindowStartHour),
          deliveryWindowEndHour: Number(deliveryWindowEndHour),
          itemsJson: JSON.stringify(rates),
          updatedAt: new Date(),
        },
      });
    } else {
      await db.pricingConfiguration.create({
        data: {
          version: '1.1',
          isActive: true,
          marginRate: Number(marginRate),
          contingencyRate: Number(contingencyRate),
          projectLicencesRate: Number(projectLicencesRate),
          deliveryMinDelayHours: Number(deliveryMinDelayHours),
          deliveryWindowStartHour: Number(deliveryWindowStartHour),
          deliveryWindowEndHour: Number(deliveryWindowEndHour),
          timezone: 'Europe/Madrid',
          itemsJson: JSON.stringify(rates),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error saving pricing config:', error);
    return NextResponse.json({ error: 'Error guardando tarifas' }, { status: 500 });
  }
}
