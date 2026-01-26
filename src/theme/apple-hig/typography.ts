/**
 * Apple Human Interface Guidelines - Typography
 * 
 * Источник: https://developer.apple.com/design/human-interface-guidelines/typography
 * 
 * Все значения строго соответствуют iOS/iPadOS Dynamic Type Text Styles
 * Используются размеры по умолчанию (Medium size)
 */

// ============================================================================
// Font Families
// ============================================================================

/**
 * Системные шрифты Apple
 * 
 * SF Pro: основной системный шрифт для iOS, iPadOS, macOS, tvOS, visionOS
 * Для web используем системные шрифты через font-family fallback
 */

export const fontFamilies = {
  sfPro: '-apple-system, BlinkMacSystemFont, "SF Pro", "SF Pro Text", "SF Pro Display", system-ui, sans-serif',
  sfCompact: '-apple-system, BlinkMacSystemFont, "SF Compact", system-ui, sans-serif',
  newYork: '"New York", "Times New Roman", serif',
} as const;

// ============================================================================
// Font Weights
// ============================================================================

/**
 * Font Weights - Apple HIG стандарт
 * 
 * Рекомендуемые: Regular (400), Medium (500), Semibold (600), Bold (700)
 * Избегать для основного текста: Ultralight, Thin, Light
 */

export const fontWeights = {
  ultralight: '100',
  thin: '200',
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
  black: '900',
} as const;

// ============================================================================
// iOS/iPadOS Dynamic Type Text Styles (Medium size)
// ============================================================================

/**
 * Text Styles - Apple HIG стандарт для iOS/iPadOS
 * 
 * Все значения соответствуют Medium size (default) из Apple HIG
 * fontSize, lineHeight, fontWeight, letterSpacing (tracking)
 */

export const textStyles = {
  // Large Title
  largeTitle: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: fontWeights.regular,
    letterSpacing: 0.37,
    fontFamily: fontFamilies.sfPro,
  },
  
  // Title 1
  title1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: fontWeights.regular,
    letterSpacing: 0.36,
    fontFamily: fontFamilies.sfPro,
  },
  
  // Title 2
  title2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: fontWeights.regular,
    letterSpacing: 0.35,
    fontFamily: fontFamilies.sfPro,
  },
  
  // Title 3
  title3: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: fontWeights.regular,
    letterSpacing: 0.38,
    fontFamily: fontFamilies.sfPro,
  },
  
  // Headline
  headline: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: fontWeights.semibold,
    letterSpacing: -0.41,
    fontFamily: fontFamilies.sfPro,
  },
  
  // Body (основной текст)
  body: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: fontWeights.regular,
    letterSpacing: -0.41,
    fontFamily: fontFamilies.sfPro,
  },
  
  // Callout
  callout: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: fontWeights.regular,
    letterSpacing: -0.32,
    fontFamily: fontFamilies.sfPro,
  },
  
  // Subheadline
  subheadline: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: fontWeights.regular,
    letterSpacing: -0.24,
    fontFamily: fontFamilies.sfPro,
  },
  
  // Footnote
  footnote: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: fontWeights.regular,
    letterSpacing: -0.08,
    fontFamily: fontFamilies.sfPro,
  },
  
  // Caption 1
  caption1: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: fontWeights.regular,
    letterSpacing: 0,
    fontFamily: fontFamilies.sfPro,
  },
  
  // Caption 2
  caption2: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: fontWeights.regular,
    letterSpacing: 0.07,
    fontFamily: fontFamilies.sfPro,
  },
} as const;

// ============================================================================
// Emphasized Variants (для заголовков)
// ============================================================================

/**
 * Emphasized Variants - Apple HIG стандарт
 * 
 * Используются для акцента в заголовках
 * Large Title, Title 1-3 используют Bold для emphasized
 * Headline, Body, Callout, Subheadline, Footnote, Caption используют Semibold для emphasized
 */

export const emphasizedTextStyles = {
  largeTitle: {
    ...textStyles.largeTitle,
    fontWeight: fontWeights.bold,
  },
  title1: {
    ...textStyles.title1,
    fontWeight: fontWeights.bold,
  },
  title2: {
    ...textStyles.title2,
    fontWeight: fontWeights.bold,
  },
  title3: {
    ...textStyles.title3,
    fontWeight: fontWeights.semibold,
  },
  headline: {
    ...textStyles.headline,
    fontWeight: fontWeights.semibold,
  },
  body: {
    ...textStyles.body,
    fontWeight: fontWeights.semibold,
  },
  callout: {
    ...textStyles.callout,
    fontWeight: fontWeights.semibold,
  },
  subheadline: {
    ...textStyles.subheadline,
    fontWeight: fontWeights.semibold,
  },
  footnote: {
    ...textStyles.footnote,
    fontWeight: fontWeights.semibold,
  },
  caption1: {
    ...textStyles.caption1,
    fontWeight: fontWeights.semibold,
  },
  caption2: {
    ...textStyles.caption2,
    fontWeight: fontWeights.semibold,
  },
} as const;

// ============================================================================
// Platform Defaults (для справки)
// ============================================================================

/**
 * Минимальные размеры шрифтов по платформам
 * Используем iOS/iPadOS как основу (Default: 17pt, Minimum: 11pt)
 */

export const platformDefaults = {
  ios: {
    default: 17,
    minimum: 11,
  },
  ipados: {
    default: 17,
    minimum: 11,
  },
} as const;


