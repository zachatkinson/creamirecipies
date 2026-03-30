/** Shared formatting utilities */

import type { Locale } from '../i18n';

/** Format a publish date for display (e.g., "Mar 27, 2026" or "March 27, 2026") */
export function formatPublishDate(date: string, locale: Locale | string, style: 'short' | 'long' = 'short'): string {
  return new Date(date).toLocaleDateString(locale, {
    month: style,
    day: 'numeric',
    year: 'numeric',
  });
}
