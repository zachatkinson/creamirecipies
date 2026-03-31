/** Amazon affiliate configuration */

export const AMAZON_TAG = typeof import.meta !== 'undefined'
  ? (import.meta.env?.PUBLIC_AMAZON_TAG || 'eatcreami03-20')
  : 'eatcreami03-20';

/** Build an Amazon product URL with affiliate tag */
export function amazonProductUrl(asin: string): string {
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_TAG}`;
}
