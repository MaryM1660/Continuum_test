/**
 * Apple Human Interface Guidelines - Border Radius
 * 
 * Источник: https://developer.apple.com/design/human-interface-guidelines/layout
 * 
 * Стандартные радиусы скругления для элементов интерфейса
 */

// ============================================================================
// Border Radius Values
// ============================================================================

/**
 * Border Radius - Apple HIG стандарт
 * 
 * Стандартные радиусы для различных элементов
 */

export const borderRadius = {
  small: 8,      // Маленькие элементы (badges, tags)
  medium: 12,    // Средние элементы (кнопки, карточки)
  large: 16,     // Большие элементы (модальные окна, панели)
  xlarge: 20,    // Очень большие элементы
  round: 9999,   // Круглые элементы (кнопки, аватары) - используем большое значение
} as const;

// ============================================================================
// Border Radius Patterns (для часто используемых случаев)
// ============================================================================

/**
 * Border Radius Patterns - Apple HIG стандарт
 * 
 * Паттерны радиусов для различных компонентов
 */

export const borderRadiusPatterns = {
  // Кнопки
  button: borderRadius.medium,      // 12px
  buttonRound: borderRadius.round,   // Круглые кнопки
  
  // Карточки
  card: borderRadius.large,          // 16px
  
  // Модальные окна и панели
  modal: borderRadius.large,          // 16px
  sheet: borderRadius.large,         // 16px
  
  // Поля ввода
  input: borderRadius.medium,        // 12px
  
  // Badges и tags
  badge: borderRadius.small,         // 8px
  
  // Аватары
  avatar: borderRadius.round,        // Круглые
  
  // Иконки в контейнерах
  iconContainer: borderRadius.small, // 8px
} as const;


