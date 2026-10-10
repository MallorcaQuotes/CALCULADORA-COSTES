import assert from 'node:assert';
import { calculateDetailedEstimate, calculateQuickEstimate } from '../lib/pricing/engine';
import { DetailedEstimateInput } from '../lib/pricing/types';
import { calculateNextDeliverySlot } from '../lib/scheduling/delivery';

function runTests() {
  console.log('=== STARTING PRICING & SCHEDULING TESTS ===\n');

  // Test 1: Excel baseline scenario
  console.log('Test 1: Excel baseline scenario...');
  const baseInput: DetailedEstimateInput = {
    builtAreaM2: 100,
    floors: 2,
    bedrooms: 2,
    bathrooms: 2,
    quality: 'Media',
    climateSystem: 'Aerotermia + suelo radiante',
    domotics: false,
    pool: 'Mediana',
    exteriorParkingSpaces: 0,
    exteriorGardenM2: 0,
    projectLicences: false,
  };
  const res1 = calculateDetailedEstimate(baseInput);

  assert(res1.centralTotal > 0, 'Central total must be positive');
  assert.strictEqual(res1.lowEstimate, Math.round(res1.centralTotal * 0.95), 'Low must be central * 0.95');
  assert.strictEqual(res1.highEstimate, Math.round(res1.centralTotal * 1.05), 'High must be central * 1.05');

  const sumItems1 = res1.lineItems.reduce((acc, it) => acc + it.customerTotal, 0);
  assert.strictEqual(sumItems1, res1.centralTotal, 'Sum of customer line items must equal central total');

  for (const item of res1.lineItems) {
    assert(!item.name.toLowerCase().includes('margen'), 'No margin in line item name');
    assert(!item.name.toLowerCase().includes('beneficio'), 'No profit in line item name');
    assert(!item.name.toLowerCase().includes('imprevistos'), 'No contingency in line item name');
  }
  console.log(`✓ Test 1 passed: Central Total = €${res1.centralTotal.toLocaleString()}, Range: €${res1.lowEstimate.toLocaleString()} - €${res1.highEstimate.toLocaleString()}`);

  // Test 2: Quality variation comparison
  console.log('\nTest 2: Quality tiers comparison...');
  const resBasic = calculateDetailedEstimate({ ...baseInput, quality: 'Básica' });
  const resMedia = calculateDetailedEstimate({ ...baseInput, quality: 'Media' });
  const resAlta = calculateDetailedEstimate({ ...baseInput, quality: 'Alta' });

  assert(resBasic.centralTotal < resMedia.centralTotal, 'Basic should cost less than Medium');
  assert(resMedia.centralTotal < resAlta.centralTotal, 'Medium should cost less than High');
  console.log(`✓ Test 2 passed: Basic: €${resBasic.centralTotal.toLocaleString()} < Media: €${resMedia.centralTotal.toLocaleString()} < Alta: €${resAlta.centralTotal.toLocaleString()}`);

  // Test 3: Project & Licences option
  console.log('\nTest 3: Project & Licences option...');
  const resWithLicences = calculateDetailedEstimate({ ...baseInput, projectLicences: true });
  assert(resWithLicences.centralTotal > res1.centralTotal, 'Licences should increase total');
  const licenceItem = resWithLicences.lineItems.find(i => i.key === 'proyecto_licencias');
  assert(licenceItem !== undefined, 'Licence line item must be present');
  const sumItemsLic = resWithLicences.lineItems.reduce((acc, it) => acc + it.customerTotal, 0);
  assert.strictEqual(sumItemsLic, resWithLicences.centralTotal, 'Line items with licences must sum to central total');
  console.log(`✓ Test 3 passed: With licences total = €${resWithLicences.centralTotal.toLocaleString()} (Licences fee: €${licenceItem?.customerTotal.toLocaleString()})`);

  // Test 4: Pool variations
  console.log('\nTest 4: Pool variations...');
  const resNoPool = calculateDetailedEstimate({ ...baseInput, pool: 'Sin piscina' });
  const resSmallPool = calculateDetailedEstimate({ ...baseInput, pool: 'Pequeña' });
  const resMediumPool = calculateDetailedEstimate({ ...baseInput, pool: 'Mediana' });
  const resLargePool = calculateDetailedEstimate({ ...baseInput, pool: 'Grande' });

  assert(resNoPool.centralTotal < resSmallPool.centralTotal, 'Small pool > no pool');
  assert(resSmallPool.centralTotal < resMediumPool.centralTotal, 'Medium pool > small pool');
  assert(resMediumPool.centralTotal < resLargePool.centralTotal, 'Large pool > medium pool');
  console.log(`✓ Test 4 passed: No Pool (€${resNoPool.centralTotal.toLocaleString()}) < Small (€${resSmallPool.centralTotal.toLocaleString()}) < Medium (€${resMediumPool.centralTotal.toLocaleString()}) < Large (€${resLargePool.centralTotal.toLocaleString()})`);

  // Test 5: Quick Estimate consistency
  console.log('\nTest 5: Quick Estimate calculator...');
  const quickRes = calculateQuickEstimate({
    builtAreaM2: 250,
    quality: 'Alta',
    pool: 'yes',
  });
  assert(quickRes.centralTotal > 0, 'Quick calc central total must be positive');
  assert.strictEqual(quickRes.lowEstimate, Math.round(quickRes.centralTotal * 0.95), 'Quick calc low estimate');
  assert.strictEqual(quickRes.highEstimate, Math.round(quickRes.centralTotal * 1.05), 'Quick calc high estimate');
  console.log(`✓ Test 5 passed: Quick Calc (250m², Alta, Pool) = €${quickRes.lowEstimate.toLocaleString()} - €${quickRes.highEstimate.toLocaleString()}`);

  // Test 6: Europe/Madrid delivery scheduling
  console.log('\nTest 6: Europe/Madrid delivery window scheduling...');
  // Scenario A: Lead created Monday at 16:00 Madrid time (14:00 UTC)
  // +12h is Tuesday 04:00 Madrid -> Scheduled for Tuesday at 10:00 Madrid
  const leadA = new Date('2026-10-05T14:00:00.000Z'); // 16:00 Madrid (CEST is UTC+2 in Oct)
  const slotA = calculateNextDeliverySlot(leadA, leadA);
  const slotAStr = slotA.toLocaleString('es-ES', { timeZone: 'Europe/Madrid' });
  console.log(`Lead Monday 16:00 -> Scheduled delivery: ${slotAStr}`);
  assert(slotAStr.includes('10:00:00') && slotAStr.includes('6/10/2026'), 'Slot A should be Tuesday 10:00');

  // Scenario B: Lead created Monday at 00:30 Madrid (Sunday 22:30 UTC)
  // +12h is Monday 12:30 Madrid -> Within window! Scheduled for Monday 12:30 Madrid
  const leadB = new Date('2026-10-04T22:30:00.000Z');
  const slotB = calculateNextDeliverySlot(leadB, leadB);
  const slotBStr = slotB.toLocaleString('es-ES', { timeZone: 'Europe/Madrid' });
  console.log(`Lead Monday 00:30 -> Scheduled delivery: ${slotBStr}`);
  assert(slotBStr.includes('12:30:00') && slotBStr.includes('5/10/2026'), 'Slot B should be Monday 12:30');

  console.log('\n========================================');
  console.log('ALL TESTS PASSED SUCCESSFULLY!');
  console.log('========================================\n');
}

runTests();
