/**
 * Single source of truth for diary-category accent colors.
 *
 * These drive the category pill hover color in BOTH places it appears — the
 * home "The Diary" strip and the /diary grid — so the two never drift apart.
 * The four categories in active use are Branding, Strategy, Culture and
 * Insights; Design/Motion exist in the schema but aren't used yet (sensible
 * fallbacks kept so a future post still gets a colored pill).
 */
export const CATEGORY_COLORS: Record<string, string> = {
  Branding: '#DA291C', // brand red
  Strategy: '#004c95', // brand blue
  Culture: '#f9b311', // brand gold
  Insights: '#1f9d57', // green
  // Not currently used by any post — fallbacks within the brand triad.
  Design: '#f9b311',
  Motion: '#004c95',
}

/** Default pill color for an unknown / missing category. */
export const CATEGORY_FALLBACK = '#DA291C'

export function categoryColor(category?: string): string {
  return CATEGORY_COLORS[category || ''] || CATEGORY_FALLBACK
}
