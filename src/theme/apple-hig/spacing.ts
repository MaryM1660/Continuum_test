/**
 * Apple Human Interface Guidelines - Spacing
 * 
 * Источник: https://developer.apple.com/design/human-interface-guidelines/layout
 * 
 * Все значения основаны на 8pt grid системе Apple
 */

// ============================================================================
// Base Spacing (8pt Grid System)
// ============================================================================

/**
 * Base Spacing - Apple HIG 8pt grid система
 * 
 * Все значения кратны 8pt (базовая единица сетки Apple)
 */

export const spacing = {
  xs: 4,      // 0.5x grid (минимальный отступ)
  sm: 8,      // 1x grid (базовый минимальный отступ Apple)
  md: 12,     // 1.5x grid
  base: 16,   // 2x grid (стандартный отступ Apple)
  lg: 20,     // 2.5x grid
  xl: 24,     // 3x grid (стандартный отступ для контейнеров Apple)
  '2xl': 32,  // 4x grid (стандартный отступ для секций Apple)
  '3xl': 40,  // 5x grid
  '4xl': 48,  // 6x grid (стандартный размер touch target Apple)
  '5xl': 64,  // 8x grid
  '6xl': 80,  // 10x grid
  '7xl': 96,  // 12x grid
} as const;

// ============================================================================
// Container Padding
// ============================================================================

/**
 * Container Padding - Apple HIG стандарт
 * 
 * Стандартные отступы для контейнеров и секций
 */

export const containerPadding = {
  horizontal: spacing.xl,    // 24px (Apple стандарт)
  vertical: spacing.base,    // 16px (Apple стандарт)
  default: spacing.xl,       // 24px (для всех сторон)
} as const;

// ============================================================================
// Touch Targets
// ============================================================================

/**
 * Touch Targets - Apple HIG стандарт
 * 
 * Минимальные размеры для интерактивных элементов
 */

export const touchTargets = {
  minimum: spacing['4xl'],      // 48px (iOS/Android minimum)
  recommended: 44,              // 44px (iOS recommended)
  comfortable: spacing['5xl'],   // 64px (для важных элементов)
} as const;

// ============================================================================
// Spacing Patterns (для часто используемых случаев)
// ============================================================================

/**
 * Spacing Patterns - Apple HIG стандарт
 * 
 * Паттерны отступов для часто используемых компонентов
 */

export const spacingPatterns = {
  // Отступы для контейнеров
  container: {
    padding: containerPadding.default,
    paddingHorizontal: containerPadding.horizontal,
    paddingVertical: containerPadding.vertical,
  },
  
  // Отступы для элементов списка
  listItem: {
    padding: spacing.xl,           // 24px
    paddingVertical: spacing.lg,   // 20px
    paddingHorizontal: spacing.xl,  // 24px
  },
  
  // Отступы для кнопок
  button: {
    paddingHorizontal: spacing['3xl'], // 40px
    paddingVertical: spacing.lg,        // 20px
    gap: spacing.base,                 // 16px (между иконкой и текстом)
  },
  
  // Отступы для карточек
  card: {
    padding: spacing.xl,    // 24px
    gap: spacing.base,      // 16px (между элементами внутри карточки)
  },
  
  // Отступы для заголовков
  header: {
    padding: spacing.xl,         // 24px
    paddingBottom: spacing.lg,    // 20px
  },
  
  // Отступы для секций
  section: {
    marginBottom: spacing['2xl'], // 32px
    paddingHorizontal: spacing.xl, // 24px
  },
  
  // Отступы для форм
  form: {
    fieldGap: spacing.base,       // 16px (между полями)
    labelMarginBottom: spacing.sm, // 8px (отступ от label до input)
  },
} as const;


