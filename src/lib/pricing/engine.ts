import { DEFAULT_PRICING_CONFIG } from './config';
import {
  DetailedEstimateInput,
  EstimateResult,
  LineItemResult,
  PricingConfig,
  QuickEstimateInput,
} from './types';

function round(val: number): number {
  return Math.round(val);
}

export function calculateDetailedEstimate(
  input: DetailedEstimateInput,
  config: PricingConfig = DEFAULT_PRICING_CONFIG
): EstimateResult {
  const {
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
  } = input;

  const safeFloors = Math.max(1, floors);
  const safeArea = Math.max(1, builtAreaM2);

  // 1. Excavación
  const qExcavacion = safeArea;
  const rExcavacion = config.rates.excavacion.rates[quality];

  // 2. Estructura
  const qEstructura = safeArea;
  const rEstructura = config.rates.estructura.rates[quality];

  // 3. Cubierta
  const qCubierta = (safeArea / safeFloors) * 1.3;
  const rCubierta = config.rates.cubierta.rates[quality];

  // 4. Fachada: 4 * SQRT(m2 / floors) * 3 * floors
  const qFachada = 4 * Math.sqrt(safeArea / safeFloors) * 3 * safeFloors;
  const rFachada = config.rates.fachada.rates[quality];

  // 5. Tabiquería
  const qTabiqueria = safeArea * 2.5;
  const rTabiqueria = config.rates.tabiqueria.rates[quality];

  // 6. Acabados paredes
  const qAcabadosParedes = safeArea * 2.5;
  const rAcabadosParedes = config.rates.acabados_paredes.rates[quality];

  // 7. Suelos
  const qSuelos = safeArea;
  const rSuelos = config.rates.suelos.rates[quality];

  // 8. Electricidad
  const qElectricidad = safeArea;
  const rElectricidad = config.rates.electricidad.rates[quality];

  // 9. Fontanería
  const qFontaneria = safeArea;
  const rFontaneria = config.rates.fontaneria.rates[quality];

  // 10. Ventanas + persianas: (bedrooms + bathrooms + 2) * 1.4
  const qVentanas = (bedrooms + bathrooms + 2) * 1.4;
  const rVentanas = config.rates.ventanas.rates[quality];

  // 11. Cristalera salón
  const qCristalera = 1;
  const rCristalera = config.rates.cristalera.rates[quality];

  // 12. Puertas interiores: bedrooms + bathrooms + 3
  const qPuertasInteriores = bedrooms + bathrooms + 3;
  const rPuertasInteriores = config.rates.puertas_interiores.rates[quality];

  // 13. Puerta principal
  const qPuertaPrincipal = 1;
  const rPuertaPrincipal = config.rates.puerta_principal.rates[quality];

  // 14. Baños
  const qBanos = bathrooms;
  const rBanos = config.rates.banos.rates[quality];

  // 15. Cocina
  const qCocina = 1;
  const rCocina = config.rates.cocina.rates[quality];

  // 16. Climatización
  const qClimatizacion = safeArea;
  let rClimatizacion = config.rates.climatizacion_suelo_radiante.rates[quality];
  if (climateSystem === 'Convencional') {
    rClimatizacion = config.rates.climatizacion_convencional.rates[quality];
  } else if (climateSystem === 'Aerotermia') {
    rClimatizacion = config.rates.climatizacion_aerotermia.rates[quality];
  }

  // 17. Domótica
  const qDomotica = domotics ? 1 : 0;
  const rDomotica = config.rates.domotica.rates[quality];

  // 18. Piscina
  const poolM2 = config.poolSurfaceM2[pool] || 0;
  const qPiscina = poolM2;
  const rPiscina = config.rates.piscina.rates[quality];

  // 19. Jardín/exterior
  const qJardin = Math.max(0, exteriorGardenM2);
  const rJardin = config.rates.jardin_exterior.rates[quality];

  // 20. Aparcamiento exterior
  const qAparcamiento = Math.max(0, exteriorParkingSpaces);
  const rAparcamiento = config.rates.aparcamiento.rates[quality];

  // 21. Escaleras: max(floors - 1, 0)
  const qEscaleras = Math.max(0, safeFloors - 1);
  const rEscaleras = config.rates.escaleras.rates[quality];

  const rawItems = [
    { key: 'excavacion', name: 'Excavación', q: qExcavacion, unit: 'm²', rate: rExcavacion },
    { key: 'estructura', name: 'Estructura', q: qEstructura, unit: 'm²', rate: rEstructura },
    { key: 'cubierta', name: 'Cubierta', q: qCubierta, unit: 'm²', rate: rCubierta },
    { key: 'fachada', name: 'Fachada', q: qFachada, unit: 'm²', rate: rFachada },
    { key: 'tabiqueria', name: 'Tabiquería', q: qTabiqueria, unit: 'm²', rate: rTabiqueria },
    { key: 'acabados_paredes', name: 'Acabados paredes', q: qAcabadosParedes, unit: 'm²', rate: rAcabadosParedes },
    { key: 'suelos', name: 'Suelos', q: qSuelos, unit: 'm²', rate: rSuelos },
    { key: 'electricidad', name: 'Electricidad', q: qElectricidad, unit: 'm²', rate: rElectricidad },
    { key: 'fontaneria', name: 'Fontanería', q: qFontaneria, unit: 'm²', rate: rFontaneria },
    { key: 'ventanas', name: 'Ventanas y cerramientos', q: qVentanas, unit: 'ud', rate: rVentanas },
    { key: 'cristalera', name: 'Cristalera de salón', q: qCristalera, unit: 'ud', rate: rCristalera },
    { key: 'puertas_interiores', name: 'Puertas interiores', q: qPuertasInteriores, unit: 'ud', rate: rPuertasInteriores },
    { key: 'puerta_principal', name: 'Puerta principal', q: qPuertaPrincipal, unit: 'ud', rate: rPuertaPrincipal },
    { key: 'banos', name: 'Equipamiento de baños', q: qBanos, unit: 'ud', rate: rBanos },
    { key: 'cocina', name: 'Cocina de diseño', q: qCocina, unit: 'ud', rate: rCocina },
    { key: 'climatizacion', name: `Climatización (${climateSystem})`, q: qClimatizacion, unit: 'm²', rate: rClimatizacion },
    { key: 'domotica', name: 'Domótica / Smart Home', q: qDomotica, unit: 'ud', rate: rDomotica },
    { key: 'piscina', name: `Piscina (${pool})`, q: qPiscina, unit: 'm² lámina', rate: rPiscina },
    { key: 'jardin_exterior', name: 'Jardín y exteriores', q: qJardin, unit: 'm²', rate: rJardin },
    { key: 'aparcamiento', name: 'Plazas aparcamiento exterior', q: qAparcamiento, unit: 'plazas', rate: rAparcamiento },
    { key: 'escaleras', name: 'Escaleras', q: qEscaleras, unit: 'tramos', rate: rEscaleras },
  ];

  let baseSubtotal = 0;
  const lineItems: LineItemResult[] = rawItems.map((item) => {
    const baseTotal = item.q * item.rate;
    baseSubtotal += baseTotal;
    const customerTotal = round(baseTotal * (1 + config.marginRate));
    return {
      key: item.key,
      name: item.name,
      quantity: Number(item.q.toFixed(2)),
      unit: item.unit,
      unitPrice: Number(item.rate.toFixed(2)),
      baseTotal: Number(baseTotal.toFixed(2)),
      customerTotal,
    };
  });

  const constructionTotalBeforeLicences = round(baseSubtotal * (1 + config.marginRate));
  
  // Ensure line items sum up exactly to constructionTotalBeforeLicences
  const itemsSum = lineItems.reduce((acc, it) => acc + it.customerTotal, 0);
  const diff = constructionTotalBeforeLicences - itemsSum;
  if (diff !== 0 && lineItems.length > 0) {
    // Distribute difference into the largest line item (typically Estructura)
    const largestItem = lineItems.reduce((prev, curr) =>
      curr.customerTotal > prev.customerTotal ? curr : prev
    );
    largestItem.customerTotal += diff;
  }

  // Project & Licences option (10%)
  let projectLicencesAmount = 0;
  if (projectLicences) {
    projectLicencesAmount = round(constructionTotalBeforeLicences * config.projectLicencesRate);
    lineItems.push({
      key: 'proyecto_licencias',
      name: 'Proyecto arquitectónico, dirección facultativa y licencias',
      quantity: 1,
      unit: 'ud',
      unitPrice: projectLicencesAmount,
      baseTotal: round(projectLicencesAmount / (1 + config.marginRate)),
      customerTotal: projectLicencesAmount,
    });
  }

  const centralTotal = constructionTotalBeforeLicences + projectLicencesAmount;
  const lowEstimate = round(centralTotal * (1 - config.contingencyRate));
  const highEstimate = round(centralTotal * (1 + config.contingencyRate));
  const pricePerM2 = round(centralTotal / safeArea);

  return {
    pricingVersion: config.version,
    inputs: input,
    lineItems,
    baseSubtotal: round(baseSubtotal),
    marginAmount: round(baseSubtotal * config.marginRate),
    centralTotal,
    lowEstimate,
    highEstimate,
    pricePerM2,
    projectLicencesAmount,
  };
}

export function calculateQuickEstimate(
  input: QuickEstimateInput,
  config: PricingConfig = DEFAULT_PRICING_CONFIG
): EstimateResult {
  let mappedPool: DetailedEstimateInput['pool'] = 'Sin piscina';
  if (input.pool === 'yes') {
    mappedPool = 'Mediana';
  } else if (input.pool === 'no') {
    mappedPool = 'Sin piscina';
  } else {
    mappedPool = input.pool;
  }

  const m2 = Math.max(40, input.builtAreaM2);
  const floors = m2 > 200 ? 2 : 1;
  const bedrooms = Math.max(1, Math.min(6, Math.round(m2 / 55)));
  const bathrooms = Math.max(1, Math.min(5, Math.round(bedrooms * 0.75)));

  const detailedInput: DetailedEstimateInput = {
    builtAreaM2: m2,
    floors,
    bedrooms,
    bathrooms,
    quality: input.quality,
    climateSystem: 'Aerotermia + suelo radiante',
    domotics: false,
    pool: mappedPool,
    exteriorParkingSpaces: 0,
    exteriorGardenM2: 0,
    projectLicences: false,
  };

  return calculateDetailedEstimate(detailedInput, config);
}
