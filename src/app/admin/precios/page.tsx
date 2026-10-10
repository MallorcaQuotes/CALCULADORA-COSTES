import React from 'react';
import { redirect } from 'next/navigation';
import { checkAdminAuth } from '@/lib/auth/admin';
import { db } from '@/lib/db';
import { DEFAULT_PRICING_CONFIG } from '@/lib/pricing/config';
import PricingConfigEditor from '@/components/admin/PricingConfigEditor';

export const dynamic = 'force-dynamic';

export default async function AdminPricingPage() {
  if (!checkAdminAuth()) {
    redirect('/admin/login');
  }

  const activeConfig = await db.pricingConfiguration.findFirst({
    where: { isActive: true },
  });

  let rates = DEFAULT_PRICING_CONFIG.rates;
  let marginRate = DEFAULT_PRICING_CONFIG.marginRate;
  let contingencyRate = DEFAULT_PRICING_CONFIG.contingencyRate;
  let projectLicencesRate = DEFAULT_PRICING_CONFIG.projectLicencesRate;
  let deliveryMinDelayHours = 12;
  let deliveryWindowStartHour = 10;
  let deliveryWindowEndHour = 14;

  if (activeConfig) {
    marginRate = activeConfig.marginRate;
    contingencyRate = activeConfig.contingencyRate;
    projectLicencesRate = activeConfig.projectLicencesRate;
    deliveryMinDelayHours = activeConfig.deliveryMinDelayHours;
    deliveryWindowStartHour = activeConfig.deliveryWindowStartHour;
    deliveryWindowEndHour = activeConfig.deliveryWindowEndHour;
    try {
      rates = JSON.parse(activeConfig.itemsJson);
    } catch (e) {
      console.error('Failed to parse pricing items JSON', e);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-med-dark font-normal">
          Configuración de Precios y Parámetros
        </h1>
        <p className="text-xs text-med-muted mt-1">
          Ajusta las tarifas unitarias de las 21 partidas y los multiplicadores de margen y entrega de MallorcaQuotes.
        </p>
      </div>

      <PricingConfigEditor
        initialRates={rates}
        initialMargin={marginRate}
        initialContingency={contingencyRate}
        initialLicences={projectLicencesRate}
        initialMinDelay={deliveryMinDelayHours}
        initialStartHour={deliveryWindowStartHour}
        initialEndHour={deliveryWindowEndHour}
      />
    </div>
  );
}
