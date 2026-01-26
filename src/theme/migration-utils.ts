/**
 * Утилиты для миграции на Apple HIG стили
 * 
 * Помогают конвертировать старые значения в новые и проверять соответствие HIG
 */

import { Theme } from './colors';
import { AppleHIGTheme } from './apple-hig/theme';

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Проверяет, является ли тема новой темой Apple HIG
 */
export function isAppleHIGTheme(theme: Theme | AppleHIGTheme): theme is AppleHIGTheme {
  return 'colorScheme' in theme && 'isDark' in theme && 'colors' in theme && 'system' in theme.colors;
}

/**
 * Проверяет, является ли тема старой темой
 */
export function isOldTheme(theme: Theme | AppleHIGTheme): theme is Theme {
  return !isAppleHIGTheme(theme);
}

// ============================================================================
// Конвертация значений
// ============================================================================

/**
 * Конвертирует старый цвет primary в новый цвет из Apple HIG
 */
export function convertPrimaryColor(oldTheme: Theme, newTheme: AppleHIGTheme): string {
  if (isOldTheme(oldTheme)) {
    return newTheme.colors.primary;
  }
  return newTheme.colors.primary;
}

/**
 * Конвертирует старый цвет текста в новый цвет из Apple HIG
 */
export function convertTextColor(
  oldColor: 'primary' | 'secondary' | 'tertiary' | 'disabled',
  newTheme: AppleHIGTheme
): string {
  switch (oldColor) {
    case 'primary':
      return newTheme.colors.primary;
    case 'secondary':
      return newTheme.colors.textSecondary;
    case 'tertiary':
      return newTheme.colors.textTertiary;
    case 'disabled':
      return newTheme.colors.textDisabled;
    default:
      return newTheme.colors.text;
  }
}

/**
 * Конвертирует старый spacing в новый spacing из Apple HIG
 */
export function convertSpacing(
  oldSpacing: keyof Theme['spacing'],
  newTheme: AppleHIGTheme
): number {
  const mapping: Record<string, keyof typeof newTheme.spacing> = {
    xs: 'xs',
    sm: 'sm',
    md: 'md',
    base: 'base',
    lg: 'lg',
    xl: 'xl',
    '2xl': '2xl',
    '3xl': '3xl',
    '4xl': '4xl',
    '5xl': '5xl',
    '6xl': '6xl',
    '7xl': '7xl',
  };
  
  const newKey = mapping[oldSpacing];
  return newKey ? newTheme.spacing[newKey] : newTheme.spacing.base;
}

// ============================================================================
// Валидация соответствия Apple HIG
// ============================================================================

/**
 * Проверяет, является ли значение spacing кратным 8pt (Apple HIG стандарт)
 */
export function isValidSpacing(value: number): boolean {
  return value % 8 === 0;
}

/**
 * Проверяет, является ли значение touch target достаточным (минимум 48px)
 */
export function isValidTouchTarget(size: number): boolean {
  return size >= 48;
}

/**
 * Проверяет, является ли цвет системным цветом Apple
 */
export function isSystemColor(color: string): boolean {
  // Список системных цветов Apple (iOS System Colors)
  const systemColors = [
    '#007AFF', // System Blue (light)
    '#0A84FF', // System Blue (dark)
    '#34C759', // System Green (light)
    '#32D74B', // System Green (dark)
    '#FF3B30', // System Red (light)
    '#FF453A', // System Red (dark)
    '#FF9500', // System Orange (light)
    '#FF9F0A', // System Orange (dark)
    '#FFCC00', // System Yellow (light)
    '#FFD60A', // System Yellow (dark)
    '#5856D6', // System Purple (light)
    '#5E5CE6', // System Purple (dark)
    '#FF2D55', // System Pink (light)
    '#FF375F', // System Pink (dark)
  ];
  
  return systemColors.includes(color.toUpperCase());
}

/**
 * Проверяет, является ли размер шрифта валидным для Apple HIG
 */
export function isValidFontSize(size: number): boolean {
  // Валидные размеры шрифтов из Apple HIG (iOS Dynamic Type)
  const validSizes = [11, 12, 13, 15, 16, 17, 20, 22, 28, 34];
  return validSizes.includes(size);
}

// ============================================================================
// Утилиты для поиска проблем
// ============================================================================

export interface StyleIssue {
  type: 'color' | 'spacing' | 'fontSize' | 'touchTarget' | 'borderRadius';
  value: string | number;
  message: string;
  suggestion?: string;
}

/**
 * Проверяет стиль на соответствие Apple HIG и возвращает список проблем
 */
export function validateStyle(style: Record<string, any>, theme: AppleHIGTheme): StyleIssue[] {
  const issues: StyleIssue[] = [];

  // Проверка цветов
  if (style.color && typeof style.color === 'string') {
    if (!isSystemColor(style.color) && !style.color.startsWith('theme.')) {
      issues.push({
        type: 'color',
        value: style.color,
        message: 'Цвет не является системным цветом Apple',
        suggestion: 'Используйте theme.colors.system.* или theme.colors.label.*',
      });
    }
  }

  // Проверка spacing
  ['padding', 'margin', 'gap', 'paddingHorizontal', 'paddingVertical', 
   'marginHorizontal', 'marginVertical', 'paddingTop', 'paddingBottom',
   'marginTop', 'marginBottom'].forEach(prop => {
    if (style[prop] && typeof style[prop] === 'number') {
      if (!isValidSpacing(style[prop])) {
        issues.push({
          type: 'spacing',
          value: style[prop],
          message: `Значение ${prop} не кратно 8pt (Apple HIG стандарт)`,
          suggestion: `Используйте theme.spacing.* (значения кратны 8pt)`,
        });
      }
    }
  });

  // Проверка fontSize
  if (style.fontSize && typeof style.fontSize === 'number') {
    if (!isValidFontSize(style.fontSize)) {
      issues.push({
        type: 'fontSize',
        value: style.fontSize,
        message: 'Размер шрифта не соответствует Apple HIG',
        suggestion: 'Используйте theme.typography.* (Large Title, Title 1-3, Body, etc.)',
      });
    }
  }

  // Проверка touch targets
  if (style.width && style.height && 
      typeof style.width === 'number' && typeof style.height === 'number') {
    const minSize = Math.min(style.width, style.height);
    if (minSize < 48 && style.onPress) {
      issues.push({
        type: 'touchTarget',
        value: minSize,
        message: 'Touch target меньше 48px (Apple HIG минимум)',
        suggestion: 'Увеличьте размер до минимум 48px или используйте theme.layout.touchTargets.minimum',
      });
    }
  }

  return issues;
}


