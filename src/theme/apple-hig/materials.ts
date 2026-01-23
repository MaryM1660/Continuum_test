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
  
  // Background Opacity
  backgroundOpacity: {
    primary: 0.15,      // Основной вариант
    primaryAlt: 0.2,    // Альтернативный основной
    secondary: 0.12,    // Вторичный вариант
    secondaryAlt: 0.1,  // Альтернативный вторичный
  },
  
  // Border
  border: {
    color: 'rgba(255, 255, 255, 0.2)',
    width: 1.5,
  },
  
  // Highlight (верхний блик)
  highlight: {
    color: 'rgba(255, 255, 255, 0.3)',
    colorEnd: 'rgba(255, 255, 255, 0)',
    height: '40%',      // Высота блика от верха элемента
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

