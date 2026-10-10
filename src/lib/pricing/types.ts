export type QualityLevel = 'Básica' | 'Media' | 'Alta';

export type ClimateOption = 'Convencional' | 'Aerotermia' | 'Aerotermia + suelo radiante';

export type PoolOption = 'Sin piscina' | 'Pequeña' | 'Mediana' | 'Grande';

export interface PricingItemRate {
  key: string;
  name: string;
  unit: string;
  rates: {
    Básica: number;
    Media: number;
    Alta: number;
  };
}

export interface PricingConfig {
  version: string;
  marginRate: number; // e.g. 0.30
  contingencyRate: number; // e.g. 0.05 (for ±5% display range calculation)
  projectLicencesRate: number; // e.g. 0.10
  poolSurfaceM2: {
    'Sin piscina': number;
    'Pequeña': number;
    'Mediana': number;
    'Grande': number;
  };
  rates: Record<string, PricingItemRate>;
}

export interface DetailedEstimateInput {
  builtAreaM2: number;
  floors: number;
  bedrooms: number;
  bathrooms: number;
  quality: QualityLevel;
  climateSystem: ClimateOption;
  domotics: boolean;
  pool: PoolOption;
  exteriorParkingSpaces: number;
  exteriorGardenM2: number;
  projectLicences: boolean;
}

export interface QuickEstimateInput {
  builtAreaM2: number;
  quality: QualityLevel;
  pool: 'no' | 'yes' | PoolOption;
}

export interface LineItemResult {
  key: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  baseTotal: number;
  customerTotal: number; // baseTotal * (1 + marginRate)
}

export interface EstimateResult {
  pricingVersion: string;
  inputs: DetailedEstimateInput;
  lineItems: LineItemResult[];
  baseSubtotal: number;
  marginAmount: number;
  centralTotal: number; // Total with margin (and project/licence if selected)
  lowEstimate: number; // Central * (1 - contingencyRate)
  highEstimate: number; // Central * (1 + contingencyRate)
  pricePerM2: number;
  projectLicencesAmount: number;
}
