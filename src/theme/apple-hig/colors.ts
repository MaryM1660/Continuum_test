/**
 * Apple Human Interface Guidelines - Colors
 * 
 * Источник: https://developer.apple.com/design/human-interface-guidelines/color
 * Спецификации: https://developer.apple.com/design/human-interface-guidelines/color#Specifications
 * 
 * Все цвета строго соответствуют Apple System Colors для iOS 17/18
 * Точные RGB значения из раздела Specifications
 * Поддержка Light и Dark Mode, а также Increased Contrast
 */

// ============================================================================
// System Colors (Light Mode - Default)
// ============================================================================
// Источник: https://developer.apple.com/design/human-interface-guidelines/color#Specifications
// Таблица "System colors" - колонка "Default (light)"

export const systemColorsLight = {
  // Основные цвета
  red: 'rgb(255, 56, 60)',        // R-255,G-56,B-60
  orange: 'rgb(255, 141, 40)',    // R-255,G-141,B-40
  yellow: 'rgb(255, 204, 0)',     // R-255,G-204,B-0
  green: 'rgb(52, 199, 89)',      // R-52,G-199,B-89
  mint: 'rgb(0, 200, 179)',       // R-0,G-200,B-179
  teal: 'rgb(0, 195, 208)',       // R-0,G-195,B-208
  cyan: 'rgb(0, 192, 232)',       // R-0,G-192,B-232
  blue: 'rgb(0, 136, 255)',       // R-0,G-136,B-255
  indigo: 'rgb(97, 85, 245)',     // R-97,G-85,B-245
  purple: 'rgb(203, 48, 224)',    // R-203,G-48,B-224
  pink: 'rgb(255, 45, 85)',       // R-255,G-45,B-85
  brown: 'rgb(172, 127, 94)',     // R-172,G-127,B-94
} as const;

// ============================================================================
// System Colors (Dark Mode - Default)
// ============================================================================
// Источник: https://developer.apple.com/design/human-interface-guidelines/color#Specifications
// Таблица "System colors" - колонка "Default (dark)"

export const systemColorsDark = {
  // Основные цвета
  red: 'rgb(255, 66, 69)',        // R-255,G-66,B-69
  orange: 'rgb(255, 146, 48)',    // R-255,G-146,B-48
  yellow: 'rgb(255, 214, 0)',     // R-255,G-214,B-0
  green: 'rgb(48, 209, 88)',       // R-48,G-209,B-88
  mint: 'rgb(0, 218, 195)',       // R-0,G-218,B-195
  teal: 'rgb(0, 210, 224)',       // R-0,G-210,B-224
  cyan: 'rgb(60, 211, 254)',       // R-60,G-211,B-254
  blue: 'rgb(0, 145, 255)',       // R-0,G-145,B-255
  indigo: 'rgb(109, 124, 255)',   // R-109,G-124,B-255
  purple: 'rgb(219, 52, 242)',    // R-219,G-52,B-242
  pink: 'rgb(255, 55, 95)',       // R-255,G-55,B-95
  brown: 'rgb(183, 138, 102)',    // R-183,G-138,B-102
} as const;

// ============================================================================
// System Colors (Light Mode - Increased Contrast)
// ============================================================================
// Источник: https://developer.apple.com/design/human-interface-guidelines/color#Specifications
// Таблица "System colors" - колонка "Increased contrast (light)"

export const systemColorsLightHighContrast = {
  red: 'rgb(233, 21, 45)',        // R-233,G-21,B-45
  orange: 'rgb(197, 83, 0)',      // R-197,G-83,B-0
  yellow: 'rgb(161, 106, 0)',     // R-161,G-106,B-0
  green: 'rgb(0, 137, 50)',       // R-0,G-137,B-50
  mint: 'rgb(0, 133, 117)',       // R-0,G-133,B-117
  teal: 'rgb(0, 129, 152)',       // R-0,G-129,B-152
  cyan: 'rgb(0, 126, 174)',       // R-0,G-126,B-174
  blue: 'rgb(30, 110, 244)',      // R-30,G-110,B-244
  indigo: 'rgb(86, 74, 222)',     // R-86,G-74,B-222
  purple: 'rgb(176, 47, 194)',    // R-176,G-47,B-194
  pink: 'rgb(231, 18, 77)',       // R-231,G-18,B-77
  brown: 'rgb(149, 109, 81)',     // R-149,G-109,B-81
} as const;

// ============================================================================
// System Colors (Dark Mode - Increased Contrast)
// ============================================================================
// Источник: https://developer.apple.com/design/human-interface-guidelines/color#Specifications
// Таблица "System colors" - колонка "Increased contrast (dark)"

export const systemColorsDarkHighContrast = {
  red: 'rgb(255, 97, 101)',       // R-255,G-97,B-101
  orange: 'rgb(255, 160, 86)',    // R-255,G-160,B-86
  yellow: 'rgb(254, 223, 67)',    // R-254,G-223,B-67
  green: 'rgb(74, 217, 104)',     // R-74,G-217,B-104
  mint: 'rgb(84, 223, 203)',      // R-84,G-223,B-203
  teal: 'rgb(59, 221, 236)',      // R-59,G-221,B-236
  cyan: 'rgb(109, 217, 255)',     // R-109,G-217,B-255
  blue: 'rgb(92, 184, 255)',      // R-92,G-184,B-255
  indigo: 'rgb(167, 170, 255)',   // R-167,G-170,B-255
  purple: 'rgb(234, 141, 255)',   // R-234,G-141,B-255
  pink: 'rgb(255, 138, 196)',     // R-255,G-138,B-196
  brown: 'rgb(219, 166, 121)',    // R-219,G-166,B-121
} as const;

// ============================================================================
// iOS/iPadOS System Gray Colors (Light Mode - Default)
// ============================================================================
// Источник: https://developer.apple.com/design/human-interface-guidelines/color#iOS-iPadOS-system-gray-colors
// Таблица "iOS, iPadOS system gray colors" - колонка "Default (light)"

export const systemGrayColorsLight = {
  gray: 'rgb(142, 142, 147)',     // R-142,G-142,B-147
  gray2: 'rgb(174, 174, 178)',    // R-174,G-174,B-178
  gray3: 'rgb(199, 199, 204)',    // R-199,G-199,B-204
  gray4: 'rgb(209, 209, 214)',    // R-209,G-209,B-214
  gray5: 'rgb(229, 229, 234)',    // R-229,G-229,B-234
  gray6: 'rgb(242, 242, 247)',    // R-242,G-242,B-247
} as const;

// ============================================================================
// iOS/iPadOS System Gray Colors (Dark Mode - Default)
// ============================================================================
// Источник: https://developer.apple.com/design/human-interface-guidelines/color#iOS-iPadOS-system-gray-colors
// Таблица "iOS, iPadOS system gray colors" - колонка "Default (dark)"

export const systemGrayColorsDark = {
  gray: 'rgb(142, 142, 147)',     // R-142,G-142,B-147
  gray2: 'rgb(99, 99, 102)',      // R-99,G-99,B-102
  gray3: 'rgb(72, 72, 74)',       // R-72,G-72,B-74
  gray4: 'rgb(58, 58, 60)',       // R-58,G-58,B-60
  gray5: 'rgb(44, 44, 46)',       // R-44,G-44,B-46
  gray6: 'rgb(28, 28, 30)',       // R-28,G-28,B-30
} as const;

// ============================================================================
// Label Colors
// ============================================================================

/**
 * Label Colors - Apple HIG стандарт
 * 
 * Label: основной текст
 * Secondary Label: 60% opacity от Label
 * Tertiary Label: 30% opacity от Label
 * Quaternary Label: 18% opacity от Label
 */

export const labelColorsLight = {
  label: '#000000',           // Основной текст
  secondaryLabel: 'rgba(60, 60, 67, 0.6)',   // 60% opacity от Label
  tertiaryLabel: 'rgba(60, 60, 67, 0.3)',    // 30% opacity от Label
  quaternaryLabel: 'rgba(60, 60, 67, 0.18)', // 18% opacity от Label
} as const;

export const labelColorsDark = {
  label: '#FFFFFF',           // Основной текст
  secondaryLabel: 'rgba(235, 235, 245, 0.6)', // 60% opacity от Label
  tertiaryLabel: 'rgba(235, 235, 245, 0.3)',  // 30% opacity от Label
  quaternaryLabel: 'rgba(235, 235, 245, 0.18)', // 18% opacity от Label
} as const;

// ============================================================================
// Background Colors
// ============================================================================

/**
 * Background Colors - Apple HIG стандарт
 * 
 * System Background: основной фон
 * Secondary System Background: вторичный фон (для группированных элементов)
 * Tertiary System Background: третичный фон (для elevated surfaces)
 */

export const backgroundColorsLight = {
  systemBackground: '#FFFFFF',
  secondarySystemBackground: '#F2F2F7',
  tertiarySystemBackground: '#FFFFFF',
} as const;

export const backgroundColorsDark = {
  systemBackground: '#000000',
  secondarySystemBackground: '#1C1C1E',
  tertiarySystemBackground: '#2C2C2E',
} as const;

// ============================================================================
// Separator Colors
// ============================================================================

/**
 * Separator Colors - Apple HIG стандарт
 * 
 * Separator: стандартный разделитель
 * Opaque Separator: непрозрачный разделитель
 */

export const separatorColorsLight = {
  separator: '#C6C6C8',
  opaqueSeparator: '#C6C6C8',
} as const;

export const separatorColorsDark = {
  separator: '#38383A',
  opaqueSeparator: '#38383A',
} as const;

// ============================================================================
// Liquid Glass Colors
// ============================================================================

/**
 * Liquid Glass Colors - Apple HIG стандарт
 * 
 * Используются белые полупрозрачные цвета для всех вариантов
 * Primary: rgba(255, 255, 255, 0.12-0.2)
 * Secondary: rgba(255, 255, 255, 0.1-0.15)
 * Border: rgba(255, 255, 255, 0.2)
 * Highlight: rgba(255, 255, 255, 0.3)
 */

export const liquidGlassColors = {
  // Фоновые цвета для Liquid Glass
  primaryBackground: 'rgba(255, 255, 255, 0.15)',
  primaryBackgroundAlt: 'rgba(255, 255, 255, 0.2)',
  secondaryBackground: 'rgba(255, 255, 255, 0.12)',
  secondaryBackgroundAlt: 'rgba(255, 255, 255, 0.1)',
  
  // Границы
  border: 'rgba(255, 255, 255, 0.2)',
  borderWidth: 1.5,
  
  // Блик
  highlight: 'rgba(255, 255, 255, 0.3)',
  highlightEnd: 'rgba(255, 255, 255, 0)',
} as const;

// ============================================================================
// Semantic Colors (для удобства использования)
// ============================================================================
// Используем точные значения из systemColors

export const semanticColorsLight = {
  primary: systemColorsLight.blue,      // rgb(0, 136, 255)
  error: systemColorsLight.red,          // rgb(255, 56, 60)
  success: systemColorsLight.green,      // rgb(52, 199, 89)
  warning: systemColorsLight.orange,    // rgb(255, 141, 40)
  info: systemColorsLight.blue,          // rgb(0, 136, 255)
} as const;

export const semanticColorsDark = {
  primary: systemColorsDark.blue,       // rgb(0, 145, 255)
  error: systemColorsDark.red,           // rgb(255, 66, 69)
  success: systemColorsDark.green,       // rgb(48, 209, 88)
  warning: systemColorsDark.orange,      // rgb(255, 146, 48)
  info: systemColorsDark.blue,           // rgb(0, 145, 255)
} as const;

