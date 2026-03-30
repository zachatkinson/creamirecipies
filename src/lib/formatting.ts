/** Shared formatting utilities */

import type { Locale } from '../i18n';

/** Format a publish date for display (e.g., "Mar 27, 2026") */
export function formatPublishDate(date: string, locale: Locale | string): string {
  return new Date(date).toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
