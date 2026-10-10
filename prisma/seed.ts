import { PrismaClient } from '@prisma/client';
import { DEFAULT_PRICING_CONFIG } from '../src/lib/pricing/config';

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.pricingConfiguration.findFirst({
    where: { isActive: true },
  });

  if (!existing) {
    await prisma.pricingConfiguration.create({
      data: {
        version: DEFAULT_PRICING_CONFIG.version,
        isActive: true,
        marginRate: DEFAULT_PRICING_CONFIG.marginRate,
        contingencyRate: DEFAULT_PRICING_CONFIG.contingencyRate,
        projectLicencesRate: DEFAULT_PRICING_CONFIG.projectLicencesRate,
        deliveryMinDelayHours: 12,
        deliveryWindowStartHour: 10,
        deliveryWindowEndHour: 14,
        timezone: 'Europe/Madrid',
        itemsJson: JSON.stringify(DEFAULT_PRICING_CONFIG.rates),
      },
    });
    console.log('Seed: Initial PricingConfiguration created.');
  } else {
    console.log('Seed: PricingConfiguration already exists.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
