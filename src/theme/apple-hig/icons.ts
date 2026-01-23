/**
 * Apple Human Interface Guidelines - Icons
 * 
 * Источник: https://developer.apple.com/design/human-interface-guidelines/icons
 * 
 * Спецификации для иконок: размеры, стили, weights, SF Symbols
 */

// ============================================================================
// Icon Sizes
// ============================================================================

/**
 * Icon Sizes - Apple HIG стандарт
 * 
 * Стандартные размеры иконок в points (для использования с @2x и @3x scale factors)
 * Размеры основаны на 8pt grid системе Apple
 */

export const iconSizes = {
  // Маленькие иконки
  xs: 12,      // 12pt (для очень маленьких элементов)
  sm: 16,      // 16pt (стандартный минимальный размер)
  md: 20,      // 20pt (для списков и меню)
  base: 24,    // 24pt (стандартный размер для большинства UI элементов)
  
  // Средние иконки
  lg: 28,      // 28pt (для кнопок и важных элементов)
  xl: 32,      // 32pt (для больших кнопок)
  '2xl': 36,   // 36pt (для крупных элементов)
  
  // Большие иконки
  '3xl': 40,   // 40pt (для очень крупных элементов)
  '4xl': 44,   // 44pt (стандартный размер touch target)
  '5xl': 48,   // 48pt (минимальный размер touch target)
  '6xl': 56,   // 56pt (для больших touch targets)
  '7xl': 64,   // 64pt (для очень больших элементов)
  '8xl': 72,   // 72pt (для крупных визуальных элементов)
  '9xl': 80,   // 80pt (для очень крупных визуальных элементов)
  '10xl': 96,  // 96pt (для больших визуальных элементов)
  '11xl': 128, // 128pt (для очень больших визуальных элементов)
} as const;

// ============================================================================
// Icon Size Patterns (для часто используемых случаев)
// ============================================================================

/**
 * Icon Size Patterns - Apple HIG стандарт
 * 
 * Стандартные размеры для различных типов иконок
 */

export const iconSizePatterns = {
  // Toolbar icons
  toolbar: iconSizes.base,      // 24pt
  
  // Tab bar icons
  tabBar: iconSizes.base,       // 24pt
  
  // Navigation bar icons
  navigationBar: iconSizes.base, // 24pt
  
  // Button icons
  button: iconSizes.lg,         // 28pt
  
  // List item icons
  listItem: iconSizes.md,       // 20pt
  
  // Menu icons
  menu: iconSizes.md,           // 20pt
  
  // Status bar icons
  statusBar: iconSizes.sm,      // 16pt
  
  // Large visual icons
  largeVisual: iconSizes['8xl'], // 72pt
  
  // App icon (для справки, основной размер в images.ts)
  appIcon: 1024,                // 1024pt для App Store
} as const;

// ============================================================================
// Icon Styles
// ============================================================================

/**
 * Icon Styles - Apple HIG стандарт
 * 
 * Стили иконок: filled (заполненные) и outlined (контурные)
 * SF Symbols поддерживает оба стиля
 */

export const iconStyles = {
  filled: 'filled',      // Заполненные иконки
  outlined: 'outlined', // Контурные иконки
} as const;

export type IconStyle = typeof iconStyles[keyof typeof iconStyles];

// ============================================================================
// Icon Font Weights
// ============================================================================

/**
 * Icon Font Weights - Apple HIG стандарт
 * 
 * Font weights для SF Symbols (совпадают с системными font weights)
 * Рекомендуемые: Regular (400), Medium (500), Semibold (600), Bold (700)
 */

export const iconFontWeights = {
  ultralight: '100',
  thin: '200',
  light: '300',
  regular: '400',    // Рекомендуется для большинства иконок
  medium: '500',     // Рекомендуется для акцентов
  semibold: '600',   // Рекомендуется для важных элементов
  bold: '700',       // Рекомендуется для заголовков и акцентов
  heavy: '800',
  black: '900',
} as const;

export type IconFontWeight = typeof iconFontWeights[keyof typeof iconFontWeights];

// ============================================================================
// SF Symbols Rendering Modes
// ============================================================================

/**
 * SF Symbols Rendering Modes - Apple HIG стандарт
 * 
 * Источник: https://developer.apple.com/design/human-interface-guidelines/sf-symbols#Rendering-modes
 * Режимы отображения SF Symbols
 */

export const sfSymbolRenderingModes = {
  monochrome: 'monochrome',           // Монохромный (один цвет)
  hierarchical: 'hierarchical',       // Иерархический (разные opacity одного цвета)
  palette: 'palette',                 // Палитра (несколько цветов)
  multicolor: 'multicolor',           // Многоцветный (предустановленные цвета)
} as const;

export type SFSymbolRenderingMode = typeof sfSymbolRenderingModes[keyof typeof sfSymbolRenderingModes];

// ============================================================================
// Standard Icon Actions (SF Symbols)
// ============================================================================

/**
 * Standard Icon Actions - Apple HIG стандарт
 * 
 * Источник: Таблицы из Icons HIG
 * Стандартные SF Symbols для различных действий
 */

export const standardIconActions = {
  // Editing
  cut: 'scissors',
  copy: 'document.on.document',
  paste: 'document.on.clipboard',
  done: 'checkmark',
  save: 'square.and.arrow.down',
  
  // Selection
  select: 'checkmark.circle',
  deselect: 'xmark',
  close: 'xmark.circle',
  delete: 'trash',
  
  // Text formatting
  superscript: 'textformat.superscript',
  subscript: 'textformat.subscript',
  bold: 'bold',
  italic: 'italic',
  underline: 'underline',
  
  // Search
  search: 'magnifyingglass',
  find: 'text.page.badge.magnifyingglass',
  findAndReplace: 'text.magnifyingglass',
  findNext: 'arrow.down.circle',
  findPrevious: 'arrow.up.circle',
  
  // Sharing and exporting
  share: 'square.and.arrow.up',
  export: 'square.and.arrow.up.on.square',
  print: 'printer',
  
  // Users and accounts
  account: 'person.crop.circle',
  user: 'person',
  profile: 'person.circle',
  
  // Ratings
  like: 'hand.thumbsup',
  dislike: 'hand.thumbsdown',
  
  // Layer ordering
  bringToFront: 'square.3.layers.3d.top.filled',
  sendToBack: 'square.3.layers.3d.bottom.filled',
  bringForward: 'square.2.layers.3d.top.filled',
  sendBackward: 'square.2.layers.3d.bottom.filled',
  
  // Other
  alarm: 'alarm',
  archive: 'archivebox',
  calendar: 'calendar',
} as const;

// ============================================================================
// Icon Color Guidelines
// ============================================================================

/**
 * Icon Color Guidelines - Apple HIG стандарт
 * 
 * Рекомендации по использованию цветов для иконок
 */

export const iconColorGuidelines = {
  // Использование системных цветов
  useSystemColors: true,
  
  // Цвета для различных состояний
  states: {
    default: 'systemBlue',      // Синий для активных элементов
    disabled: 'systemGray',     // Серый для неактивных элементов
    destructive: 'systemRed',   // Красный для деструктивных действий
    warning: 'systemOrange',    // Оранжевый для предупреждений
    success: 'systemGreen',     // Зеленый для успешных действий
  },
  
  // Адаптация к темной теме
  adaptToDarkMode: true,
  
  // Использование accent color
  useAccentColor: true,
} as const;

// ============================================================================
// Icon Patterns (для часто используемых случаев)
// ============================================================================

/**
 * Icon Patterns - Apple HIG стандарт
 * 
 * Паттерны для различных типов иконок
 */

export const iconPatterns = {
  // Toolbar icon
  toolbar: {
    size: iconSizePatterns.toolbar,
    weight: iconFontWeights.regular,
    style: iconStyles.outlined,
    renderingMode: sfSymbolRenderingModes.monochrome,
  },
  
  // Tab bar icon
  tabBar: {
    size: iconSizePatterns.tabBar,
    weight: iconFontWeights.regular,
    style: iconStyles.outlined,
    renderingMode: sfSymbolRenderingModes.monochrome,
  },
  
  // Button icon
  button: {
    size: iconSizePatterns.button,
    weight: iconFontWeights.medium,
    style: iconStyles.filled,
    renderingMode: sfSymbolRenderingModes.monochrome,
  },
  
  // List item icon
  listItem: {
    size: iconSizePatterns.listItem,
    weight: iconFontWeights.regular,
    style: iconStyles.outlined,
    renderingMode: sfSymbolRenderingModes.monochrome,
  },
  
  // Menu icon
  menu: {
    size: iconSizePatterns.menu,
    weight: iconFontWeights.regular,
    style: iconStyles.outlined,
    renderingMode: sfSymbolRenderingModes.monochrome,
  },
} as const;

