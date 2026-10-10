import { PricingConfig } from './types';

export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  version: '1.0',
  marginRate: 0.30, // 30% internal margin
  contingencyRate: 0.05, // ±5% uncertainty range
  projectLicencesRate: 0.10, // 10% optional project & licences
  poolSurfaceM2: {
    'Sin piscina': 0,
    'Pequeña': 6,
    'Mediana': 12,
    'Grande': 20,
  },
  rates: {
    excavacion: {
      key: 'excavacion',
      name: 'Excavación',
      unit: '€/m²',
      rates: {
        Básica: 75.9625,
        Media: 72.924,
        Alta: 69.8855,
      },
    },
    estructura: {
      key: 'estructura',
      name: 'Estructura',
      unit: '€/m²',
      rates: {
        Básica: 625,
        Media: 720,
        Alta: 862.5,
      },
    },
    cubierta: {
      key: 'cubierta',
      name: 'Cubierta',
      unit: '€/m²',
      rates: {
        Básica: 100,
        Media: 120,
        Alta: 149.5,
      },
    },
    fachada: {
      key: 'fachada',
      name: 'Fachada',
      unit: '€/m²',
      rates: {
        Básica: 150,
        Media: 180,
        Alta: 230,
      },
    },
    tabiqueria: {
      key: 'tabiqueria',
      name: 'Tabiquería',
      unit: '€/m²',
      rates: {
        Básica: 56.25,
        Media: 84,
        Alta: 103.5,
      },
    },
    acabados_paredes: {
      key: 'acabados_paredes',
      name: 'Acabados paredes',
      unit: '€/m²',
      rates: {
        Básica: 87.5,
        Media: 144,
        Alta: 195.5,
      },
    },
    suelos: {
      key: 'suelos',
      name: 'Suelos',
      unit: '€/m²',
      rates: {
        Básica: 125,
        Media: 144,
        Alta: 184,
      },
    },
    electricidad: {
      key: 'electricidad',
      name: 'Electricidad',
      unit: '€/m²',
      rates: {
        Básica: 93.75,
        Media: 108,
        Alta: 138,
      },
    },
    fontaneria: {
      key: 'fontaneria',
      name: 'Fontanería',
      unit: '€/m²',
      rates: {
        Básica: 87.5,
        Media: 108,
        Alta: 138,
      },
    },
    ventanas: {
      key: 'ventanas',
      name: 'Ventanas + persianas',
      unit: '€/ud',
      rates: {
        Básica: 437.5,
        Media: 480,
        Alta: 517.5,
      },
    },
    cristalera: {
      key: 'cristalera',
      name: 'Cristalera salón',
      unit: '€/ud',
      rates: {
        Básica: 7500,
        Media: 9600,
        Alta: 13800,
      },
    },
    puertas_interiores: {
      key: 'puertas_interiores',
      name: 'Puertas interiores',
      unit: '€/ud',
      rates: {
        Básica: 312.5,
        Media: 480,
        Alta: 805,
      },
    },
    puerta_principal: {
      key: 'puerta_principal',
      name: 'Puerta principal',
      unit: '€/ud',
      rates: {
        Básica: 1875,
        Media: 3600,
        Alta: 5750,
      },
    },
    banos: {
      key: 'banos',
      name: 'Baños',
      unit: '€/ud',
      rates: {
        Básica: 3750,
        Media: 9000,
        Alta: 13800,
      },
    },
    cocina: {
      key: 'cocina',
      name: 'Cocina',
      unit: '€/ud',
      rates: {
        Básica: 10000,
        Media: 19200,
        Alta: 28750,
      },
    },
    climatizacion_convencional: {
      key: 'climatizacion_convencional',
      name: 'Climatización convencional',
      unit: '€/m²',
      rates: {
        Básica: 100,
        Media: 96,
        Alta: 92,
      },
    },
    climatizacion_aerotermia: {
      key: 'climatizacion_aerotermia',
      name: 'Aerotermia',
      unit: '€/m²',
      rates: {
        Básica: 150,
        Media: 144,
        Alta: 138,
      },
    },
    climatizacion_suelo_radiante: {
      key: 'climatizacion_suelo_radiante',
      name: 'Aerotermia + suelo radiante',
      unit: '€/m²',
      rates: {
        Básica: 237.5,
        Media: 228,
        Alta: 218.5,
      },
    },
    domotica: {
      key: 'domotica',
      name: 'Domótica',
      unit: '€/ud',
      rates: {
        Básica: 6250,
        Media: 12000,
        Alta: 23000,
      },
    },
    piscina: {
      key: 'piscina',
      name: 'Piscina',
      unit: '€/m² lámina',
      rates: {
        Básica: 1875,
        Media: 2400,
        Alta: 2875,
      },
    },
    jardin_exterior: {
      key: 'jardin_exterior',
      name: 'Jardín / exterior',
      unit: '€/m²',
      rates: {
        Básica: 125,
        Media: 180,
        Alta: 230,
      },
    },
    aparcamiento: {
      key: 'aparcamiento',
      name: 'Aparcamiento exterior',
      unit: '€/plaza',
      rates: {
        Básica: 5000,
        Media: 7200,
        Alta: 9200,
      },
    },
    escaleras: {
      key: 'escaleras',
      name: 'Escaleras',
      unit: '€/tramo',
      rates: {
        Básica: 5000,
        Media: 7200,
        Alta: 10350,
      },
    },
  },
};
