import { useState, useCallback, useEffect } from 'react';
import type { Ingredient, ModelRef } from '../../lib/types';
import type { Locale } from '../../i18n';
import { INGREDIENT_GROUP_LABELS, INGREDIENT_GROUP_ORDER } from '../../lib/blog';
import { UNIT_LABELS, MEASUREMENT_LABELS, UNIT_TRANSLATIONS, METRIC_CONVERSIONS } from '../../lib/measurements';
import type { MeasurementSystem } from '../../lib/measurements';

const GROUP_LABELS = INGREDIENT_GROUP_LABELS;
const GROUP_ORDER = INGREDIENT_GROUP_ORDER;

import { amazonProductUrl } from '../../lib/affiliate';

interface IngredientWithAsin extends Ingredient {
  amazon_asin?: string | null;
}

interface Props {
  ingredients: IngredientWithAsin[];
  models: ModelRef[];
  recipePintSize: '16oz' | '24oz';
  isSwirl: boolean;
  modelOnly?: boolean;
  locale?: Locale;
}

function convertToMetric(amount: string, unit: string | null): { amount: string; unit: string } {
  if (!unit) return { amount, unit: '' };
  const conversion = METRIC_CONVERSIONS[unit.toLowerCase()];
  if (!conversion) return { amount, unit };

  const num = parseFloat(amount);
  if (isNaN(num)) return { amount, unit };

  const converted = num * conversion.multiplier;
  return {
    amount: converted >= 100 ? Math.round(converted).toString() : converted.toFixed(0),
    unit: conversion.unit,
  };
}

/** Scale a fractional amount string like "1/3" or "1.5" */
function scaleAmount(amount: string, scale: number): string {
  if (scale === 1) return amount;

  // Handle fractions like "1/3", "1/2", "3/4"
  const fractionMatch = amount.match(/^(\d+)\/(\d+)$/);
  if (fractionMatch) {
    const num = parseInt(fractionMatch[1]) * scale;
    const den = parseInt(fractionMatch[2]);
    const value = num / den;
    return formatNumber(value);
  }

  // Handle mixed numbers like "1 1/2"
  const mixedMatch = amount.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixedMatch) {
    const whole = parseInt(mixedMatch[1]);
    const num = parseInt(mixedMatch[2]);
    const den = parseInt(mixedMatch[3]);
    const value = (whole + num / den) * scale;
    return formatNumber(value);
  }

  // Handle plain numbers
  const num = parseFloat(amount);
  if (!isNaN(num)) {
    return formatNumber(num * scale);
  }

  return amount; // Can't parse — return as-is
}

function formatNumber(n: number): string {
  // Common fractions for readability
  const fractions: [number, string][] = [
    [0.125, '1/8'], [0.25, '1/4'], [0.333, '1/3'], [0.375, '3/8'],
    [0.5, '1/2'], [0.625, '5/8'], [0.667, '2/3'], [0.75, '3/4'], [0.875, '7/8'],
  ];

  const whole = Math.floor(n);
  const frac = n - whole;

  if (frac < 0.05) return String(whole || '0');

  // Find closest fraction
  const closest = fractions.reduce((best, [val, label]) =>
    Math.abs(frac - val) < Math.abs(frac - best[0]) ? [val, label] : best,
    [999, ''] as [number, string]
  );

  if (Math.abs(frac - closest[0]) < 0.05) {
    return whole > 0 ? `${whole} ${closest[1]}` : closest[1];
  }

  // Fall back to decimal
  return n % 1 === 0 ? String(n) : n.toFixed(1);
}

export default function ScalableIngredients({ ingredients, locale = 'en' }: Props) {
  const [scale, setScale] = useState(1);
  const [measureSystem, setMeasureSystem] = useState<MeasurementSystem>(() => {
    if (typeof document !== 'undefined') {
      return (document.cookie.split('; ').find((c) => c.startsWith('measure_system='))?.split('=')[1] as MeasurementSystem) || 'us';
    }
    return 'us';
  });

  // Listen for model changes from the "Before You Begin" dropdown
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.scale) setScale(detail.scale);
    };
    window.addEventListener('creami-model-change', handler);
    return () => window.removeEventListener('creami-model-change', handler);
  }, []);

  const toggleMeasureSystem = useCallback(() => {
    setMeasureSystem((prev) => {
      const next = prev === 'us' ? 'metric' : 'us';
      document.cookie = `measure_system=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
      return next;
    });
  }, []);

  // Group ingredients
  const groups: Record<string, Ingredient[]> = {};
  for (const ing of ingredients) {
    const group = ing.group_name || 'base';
    if (!groups[group]) groups[group] = [];
    groups[group].push(ing);
  }

  const sortedGroups = GROUP_ORDER.filter((g) => groups[g]);

  return (
    <div>
      {/* US / Metric toggle */}
      <div className="print-hide flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
        <span className="text-xs text-slate-500">{UNIT_LABELS[locale]}</span>
        <button
          onClick={toggleMeasureSystem}
          className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
            measureSystem === 'us' ? 'bg-berry text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          {MEASUREMENT_LABELS.us[locale]}
        </button>
        <button
          onClick={toggleMeasureSystem}
          className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
            measureSystem === 'metric' ? 'bg-berry text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          {MEASUREMENT_LABELS.metric[locale]}
        </button>
      </div>

      <div className="space-y-6">
        {sortedGroups.map((groupName) => (
          <div key={groupName}>
            {sortedGroups.length > 1 && (
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                {GROUP_LABELS[groupName]?.[locale] ?? GROUP_LABELS[groupName]?.['en'] ?? groupName}
              </h4>
            )}
            <ul className="space-y-2">
              {groups[groupName].map((ingredient, i) => {
                const scaledAmount = scaleAmount(ingredient.amount, scale);
                const isScaled = scale !== 1;

                // Apply metric conversion if needed
                let displayAmount = scaledAmount;
                let displayUnit = ingredient.unit ?? '';
                // Translate unit name for non-English locales (US mode only)
                if (locale !== 'en' && measureSystem === 'us' && displayUnit) {
                  displayUnit = UNIT_TRANSLATIONS[displayUnit.toLowerCase()]?.[locale] ?? displayUnit;
                }
                if (measureSystem === 'metric' && ingredient.unit) {
                  const scaledNum = parseFloat(scaledAmount.replace(/\s+/g, '+').split('+').reduce((a, b) => {
                    const frac = b.match(/^(\d+)\/(\d+)$/);
                    return String(Number(a) + (frac ? Number(frac[1]) / Number(frac[2]) : Number(b) || 0));
                  }, '0'));
                  if (!isNaN(scaledNum)) {
                    const metric = convertToMetric(String(scaledNum), ingredient.unit);
                    displayAmount = metric.amount;
                    displayUnit = metric.unit;
                  }
                }

                const isChanged = isScaled || measureSystem === 'metric';

                return (
                  <li
                    key={i}
                    className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0"
                  >
                    <span className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full border-2 border-[#F4B8C1]/40" />
                    <div className="flex-1">
                      <span className="font-medium text-slate-700">{ingredient.name}</span>
                      {/* Affiliate links disabled until traffic grows — enable by removing false && */}
                      {false && ingredient.amazon_asin && (
                        <a
                          href={amazonProductUrl(ingredient.amazon_asin!)}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="inline-flex items-center ml-1.5 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 hover:text-berry bg-slate-50 hover:bg-blush/10 rounded transition-colors"
                          aria-label={`Buy ${ingredient.name} on Amazon`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          buy
                        </a>
                      )}
                      <span className={`ml-2 text-sm ${isChanged ? 'text-berry font-medium' : 'text-slate-500'}`}>
                        {displayAmount}{displayUnit ? ` ${displayUnit}` : ''}
                      </span>
                      {isScaled && measureSystem === 'us' && (
                        <span className="ml-1 text-[10px] text-slate-400 line-through">
                          {ingredient.amount}{ingredient.unit ? ` ${ingredient.unit}` : ''}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
