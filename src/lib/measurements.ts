/** Shared measurement and unit constants for recipe scaling */

/** Unit label translations */
export const UNIT_LABELS: Record<string, string> = {
  en: 'Units:', fr: 'Unites :', es: 'Unidades:', de: 'Einheiten:', pt: 'Unidades:',
};

/** US/Metric toggle labels */
export const MEASUREMENT_LABELS: Record<string, Record<string, string>> = {
  us: { en: 'US', fr: 'US', es: 'US', de: 'US', pt: 'US' },
  metric: { en: 'Metric', fr: 'Metrique', es: 'Metrico', de: 'Metrisch', pt: 'Metrico' },
};

/** Unit name translations */
export const UNIT_TRANSLATIONS: Record<string, Record<string, string>> = {
  cup: { en: 'cup', fr: 'tasse', es: 'taza', de: 'Tasse', pt: 'xicara' },
  tablespoon: { en: 'tablespoon', fr: 'c. a soupe', es: 'cucharada', de: 'EL', pt: 'colher de sopa' },
  teaspoon: { en: 'teaspoon', fr: 'c. a cafe', es: 'cucharadita', de: 'TL', pt: 'colher de cha' },
  oz: { en: 'oz', fr: 'oz', es: 'oz', de: 'oz', pt: 'oz' },
  lb: { en: 'lb', fr: 'lb', es: 'lb', de: 'lb', pt: 'lb' },
  'fl oz': { en: 'fl oz', fr: 'fl oz', es: 'fl oz', de: 'fl oz', pt: 'fl oz' },
};

/** US to metric conversion factors */
export const METRIC_CONVERSIONS: Record<string, { unit: string; multiplier: number }> = {
  cup: { unit: 'ml', multiplier: 240 },
  tablespoon: { unit: 'ml', multiplier: 15 },
  teaspoon: { unit: 'ml', multiplier: 5 },
  oz: { unit: 'g', multiplier: 28.35 },
  lb: { unit: 'g', multiplier: 453.6 },
  'fl oz': { unit: 'ml', multiplier: 29.6 },
};

/** Measurement system type */
export type MeasurementSystem = 'us' | 'metric';
