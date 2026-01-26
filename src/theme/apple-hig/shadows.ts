/**
 * Apple Human Interface Guidelines - Shadows
 * 
 * Источник: https://developer.apple.com/design/human-interface-guidelines/materials
 * 
 * Тени для Liquid Glass и других элементов интерфейса
 */

// ============================================================================
// External Shadows (внешние тени)
// ============================================================================

/**
 * External Shadows - Apple HIG стандарт
 * 
 * Внешние тени для поднятия элементов над фоном
 */

export const externalShadows = {
  // Маленькая тень
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // для Android
  },
  
  // Средняя тень
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4, // для Android
  },
  
  // Большая тень
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8, // для Android
  },
  
  // Очень большая тень
  xlarge: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12, // для Android
  },
} as const;

// ============================================================================
// Internal Shadows (внутренние тени) - для Liquid Glass
// ============================================================================

/**
 * Internal Shadows - Apple HIG стандарт для Liquid Glass
 * 
 * Внутренние тени для создания глубины в Liquid Glass эффекте
 * Используются только для web (через box-shadow inset)
 */

export const internalShadows = {
  // Внутренняя тень для Liquid Glass
  liquidGlass: {
    // Множественные внутренние тени для глубины
    // Формат: 'inset offsetX offsetY blurRadius spreadRadius color'
    shadows: [
      'inset 0 1px 2px 0 rgba(0, 0, 0, 0.1)',
      'inset 0 -1px 1px 0 rgba(0, 0, 0, 0.05)',
      'inset 0 0 1px 0 rgba(0, 0, 0, 0.1)',
    ],
    // Объединенная строка для использования в boxShadow
    combined: 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.1), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.05), inset 0 0 1px 0 rgba(0, 0, 0, 0.1)',
  },
} as const;

// ============================================================================
// Combined Shadows (комбинированные тени для Liquid Glass)
// ============================================================================

/**
 * Combined Shadows - Apple HIG стандарт для Liquid Glass
 * 
 * Комбинация внутренних и внешних теней для полного Liquid Glass эффекта
 */

export const combinedShadows = {
  // Liquid Glass с полным эффектом (web)
  liquidGlassFull: {
    // Внешняя тень
    external: externalShadows.large,
    // Внутренние тени (только для web)
    internal: internalShadows.liquidGlass.combined,
    // Полная строка для boxShadow (web)
    boxShadow: `${externalShadows.large.shadowOffset.width}px ${externalShadows.large.shadowOffset.height}px ${externalShadows.large.shadowRadius}px rgba(0, 0, 0, ${externalShadows.large.shadowOpacity}), ${internalShadows.liquidGlass.combined}`,
  },
} as const;

// ============================================================================
// Shadow Patterns (для часто используемых случаев)
// ============================================================================

/**
 * Shadow Patterns - Apple HIG стандарт
 * 
 * Паттерны теней для различных компонентов
 */

export const shadowPatterns = {
  // Кнопки
  button: externalShadows.medium,
  
  // Кнопки Liquid Glass
  buttonLiquidGlass: combinedShadows.liquidGlassFull,
  
  // Карточки
  card: externalShadows.small,
  
  // Модальные окна
  modal: externalShadows.xlarge,
  
  // Панели
  panel: externalShadows.medium,
} as const;


