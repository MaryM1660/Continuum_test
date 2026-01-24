/**
 * Apple Human Interface Guidelines - Materials
 * 
 * Источник: https://developer.apple.com/design/human-interface-guidelines/materials
 * 
 * Liquid Glass эффекты и параметры материалов
 */

// ============================================================================
// Liquid Glass Parameters
// ============================================================================

/**
 * Liquid Glass - Apple HIG стандарт
 * 
 * Параметры для создания Liquid Glass эффекта
 */

export const liquidGlass = {
  // Backdrop Filter (для web)
  backdropFilter: {
    blur: '18px',
    saturate: '180%',
    full: 'blur(18px) saturate(180%)',
  },
  
  // Background Opacity - Apple HIG стандарт
  // Liquid Glass адаптируется к фону: на светлом фоне светлее, на темном - темнее
  backgroundOpacity: {
    // Light theme (светлая тема) - белые полупрозрачные цвета
    light: {
      primary: 0.15,      // Основной вариант для светлой темы
      primaryAlt: 0.2,    // Альтернативный основной
      secondary: 0.12,    // Вторичный вариант
      secondaryAlt: 0.1,  // Альтернативный вторичный
    },
    // Dark theme (темная тема) - темные полупрозрачные цвета
    dark: {
      primary: 0.15,      // Основной вариант для темной темы
      primaryAlt: 0.2,    // Альтернативный основной
      secondary: 0.12,    // Вторичный вариант
      secondaryAlt: 0.1,  // Альтернативный вторичный
    },
  },
  
  // Background Colors - адаптивные цвета для обеих тем
  // Согласно HIG: "Liquid Glass адаптируется между светлым и темным видом в зависимости от контента"
  backgroundColors: {
    // Light theme - белые полупрозрачные
    light: {
      primary: 'rgba(255, 255, 255, 0.15)',
      primaryAlt: 'rgba(255, 255, 255, 0.2)',
      secondary: 'rgba(255, 255, 255, 0.12)',
      secondaryAlt: 'rgba(255, 255, 255, 0.1)',
    },
    // Dark theme - темные полупрозрачные (черные с прозрачностью)
    dark: {
      primary: 'rgba(0, 0, 0, 0.15)',
      primaryAlt: 'rgba(0, 0, 0, 0.2)',
      secondary: 'rgba(0, 0, 0, 0.12)',
      secondaryAlt: 'rgba(0, 0, 0, 0.1)',
    },
  },
  
  // Border - адаптивные границы для обеих тем
  border: {
    // Light theme - темная граница на светлом фоне
    light: {
      color: 'rgba(0, 0, 0, 0.1)',
      width: 1.5,
    },
    // Dark theme - светлая граница на темном фоне
    dark: {
      color: 'rgba(255, 255, 255, 0.2)',
      width: 1.5,
    },
  },
  
  // Highlight (верхний блик) - адаптивные блики для обеих тем
  highlight: {
    // Light theme - светлый блик
    light: {
      color: 'rgba(255, 255, 255, 0.3)',
      colorEnd: 'rgba(255, 255, 255, 0)',
      height: '40%',
    },
    // Dark theme - темный блик (или отсутствие блика)
    dark: {
      color: 'rgba(255, 255, 255, 0.15)',
      colorEnd: 'rgba(255, 255, 255, 0)',
      height: '40%',
    },
  },
  
  // Blur Intensity (для native BlurView)
  blurIntensity: {
    light: 20,
    dark: 20,
  },
} as const;

// ============================================================================
// Material Types
// ============================================================================

/**
 * Material Types - Apple HIG стандарт
 * 
 * Типы материалов для различных контекстов
 */

export const materialTypes = {
  liquidGlass: 'liquidGlass',
  blur: 'blur',
  translucent: 'translucent',
} as const;

// ============================================================================
// Material Patterns (для часто используемых случаев)
// ============================================================================

/**
 * Material Patterns - Apple HIG стандарт
 * 
 * Паттерны материалов для различных компонентов
 */

export const materialPatterns = {
  // Кнопки
  button: {
    type: materialTypes.liquidGlass,
    backgroundOpacity: liquidGlass.backgroundOpacity.primary,
    border: liquidGlass.border,
    highlight: liquidGlass.highlight,
  },
  
  // Карточки
  card: {
    type: materialTypes.liquidGlass,
    backgroundOpacity: liquidGlass.backgroundOpacity.secondary,
    border: liquidGlass.border,
  },
  
  // Панели
  panel: {
    type: materialTypes.liquidGlass,
    backgroundOpacity: liquidGlass.backgroundOpacity.primary,
    border: liquidGlass.border,
  },
} as const;

