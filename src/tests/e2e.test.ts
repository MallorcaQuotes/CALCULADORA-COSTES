import assert from 'node:assert';
import { db } from '../lib/db';
import { calculateDetailedEstimate } from '../lib/pricing/engine';
import { DEFAULT_PRICING_CONFIG } from '../lib/pricing/config';
import { calculateNextDeliverySlot } from '../lib/scheduling/delivery';
import { generateEstimatePdf } from '../lib/pdf/generator';
import { sendEstimateEmail } from '../lib/email/sender';
import { SupportedLanguage } from '../lib/i18n';

async function runEndToEndTests() {
  console.log('=== STARTING END-TO-END FLOW VERIFICATION ===\n');

  // 1. Simulate Lead Creation directly in DB
  console.log('Step 1: Testing Lead & Estimate Creation...');
  const testRef = `MQ-TEST-${Date.now().toString().slice(-4)}`;
  const calcResult = calculateDetailedEstimate({
    builtAreaM2: 240,
    floors: 2,
    bedrooms: 4,
    bathrooms: 3,
    quality: 'Alta',
    climateSystem: 'Aerotermia + suelo radiante',
    domotics: true,
    pool: 'Mediana',
    exteriorParkingSpaces: 2,
    exteriorGardenM2: 150,
    projectLicences: true,
  });

  const lead = await db.lead.create({
    data: {
      reference: testRef,
      firstName: 'Maximilian',
      lastName: 'Weber',
      email: 'm.weber@example.de',
      phone: '+49 171 9876543',
      nationality: 'German',
      language: 'de',
      location: 'Santanyí',
      plotOwned: 'yes',
      status: 'En revisión',
      project: {
        create: {
          builtAreaM2: 240,
          floors: 2,
          bedrooms: 4,
          bathrooms: 3,
          quality: 'Alta',
          climateSystem: 'Aerotermia + suelo radiante',
          domotics: true,
          pool: 'Mediana',
          parkingSpaces: 2,
          gardenM2: 150,
          projectLicences: true,
        },
      },
      estimate: {
        create: {
          pricingVersion: calcResult.pricingVersion,
          centralTotal: calcResult.centralTotal,
          lowEstimate: calcResult.lowEstimate,
          highEstimate: calcResult.highEstimate,
          appliedMargin: DEFAULT_PRICING_CONFIG.marginRate,
          projectLicencesAmount: calcResult.projectLicencesAmount,
          lineItems: {
            create: calcResult.lineItems.map((item, idx) => ({
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
        include: { lineItems: true },
      },
    },
  });

  assert(lead.id, 'Lead ID must be generated');
  assert.strictEqual(lead.status, 'En revisión', 'Initial status must be "En revisión"');
  assert.strictEqual(lead.estimate?.lineItems.length, calcResult.lineItems.length, 'All line items must be persisted');
  console.log(`✓ Step 1 passed: Created Lead #${lead.reference} for ${lead.firstName} ${lead.lastName} (Status: ${lead.status})`);

  // 2. Simulate Admin Approval & Delivery Scheduling
  console.log('\nStep 2: Testing Admin Approval & Delivery Window Calculation...');
  const scheduledTime = calculateNextDeliverySlot(lead.createdAt, new Date());
  
  await db.lead.update({
    where: { id: lead.id },
    data: { status: 'Programado' },
  });

  const deliveryRecord = await db.emailDelivery.create({
    data: {
      leadId: lead.id,
      recipient: lead.email,
      scheduledFor: scheduledTime,
      status: 'Programado',
    },
  });

  assert.strictEqual(deliveryRecord.status, 'Programado', 'Delivery must be scheduled');
  const madridTimeStr = scheduledTime.toLocaleString('es-ES', { timeZone: 'Europe/Madrid' });
  console.log(`✓ Step 2 passed: Lead approved and scheduled for delivery on ${madridTimeStr} (Madrid Time)`);

  // 3. Test PDF Generation in EN, ES, DE
  console.log('\nStep 3: Testing Vector PDF Generation in all 3 languages...');
  for (const lang of ['en', 'es', 'de'] as SupportedLanguage[]) {
    const pdfBuf = await generateEstimatePdf({
      reference: lead.reference,
      customerName: `${lead.firstName} ${lead.lastName}`,
      email: lead.email,
      phone: lead.phone,
      location: lead.location,
      builtAreaM2: 240,
      floors: 2,
      bedrooms: 4,
      bathrooms: 3,
      quality: 'Alta',
      climateSystem: 'Aerotermia + suelo radiante',
      domotics: true,
      pool: 'Mediana',
      exteriorParking: 2,
      exteriorGardenM2: 150,
      projectLicences: true,
      centralTotal: calcResult.centralTotal,
      lowEstimate: calcResult.lowEstimate,
      highEstimate: calcResult.highEstimate,
      pricePerM2: Math.round(calcResult.centralTotal / 240),
      language: lang,
      lineItems: calcResult.lineItems,
      createdAt: lead.createdAt,
    });

    assert(pdfBuf.length > 1000, `PDF in ${lang} must be valid vector buffer (>1KB)`);
    // Verify no margin text leaked into the raw PDF string
    const pdfStr = pdfBuf.toString('binary');
    assert(!pdfStr.toLowerCase().includes('beneficio 30%'), 'No 30% margin in PDF');
    assert(!pdfStr.toLowerCase().includes('internal margin'), 'No internal margin in PDF');
    console.log(`✓ PDF generated for language [${lang.toUpperCase()}]: size ${pdfBuf.length} bytes`);
  }

  // 4. Test Email Sending Simulation with PDF
  console.log('\nStep 4: Testing Email Delivery with PDF attachment...');
  const testPdf = await generateEstimatePdf({
    reference: lead.reference,
    customerName: `${lead.firstName} ${lead.lastName}`,
    email: lead.email,
    phone: lead.phone,
    location: lead.location,
    builtAreaM2: 240,
    floors: 2,
    bedrooms: 4,
    bathrooms: 3,
    quality: 'Alta',
    climateSystem: 'Aerotermia + suelo radiante',
    domotics: true,
    pool: 'Mediana',
    exteriorParking: 2,
    exteriorGardenM2: 150,
    projectLicences: true,
    centralTotal: calcResult.centralTotal,
    lowEstimate: calcResult.lowEstimate,
    highEstimate: calcResult.highEstimate,
    pricePerM2: Math.round(calcResult.centralTotal / 240),
    language: 'de',
    lineItems: calcResult.lineItems,
    createdAt: lead.createdAt,
  });

  const emailRes = await sendEstimateEmail({
    recipientEmail: lead.email,
    customerName: `${lead.firstName} ${lead.lastName}`,
    reference: lead.reference,
    location: lead.location,
    lowEstimate: calcResult.lowEstimate,
    highEstimate: calcResult.highEstimate,
    language: 'de',
    pdfBuffer: testPdf,
  });

  assert(emailRes.success, 'Email delivery simulation should succeed');
  console.log(`✓ Step 4 passed: Email delivered with message ID: ${emailRes.messageId}`);

  // 5. Cleanup test lead
  console.log('\nStep 5: Cleaning up test records...');
  await db.lead.delete({ where: { id: lead.id } });
  console.log('✓ Step 5 passed: Test record cleaned up.');

  console.log('\n=============================================');
  console.log('ALL END-TO-END FLOW TESTS COMPLETED WITH SUCCESS!');
  console.log('=============================================\n');
}

runEndToEndTests()
  .catch((err) => {
    console.error('E2E Test Failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
