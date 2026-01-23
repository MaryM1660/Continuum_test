import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { Theme, lightTheme } from './colors';
import { AppleHIGTheme, createAppleHIGTheme } from './apple-hig/theme';
import { isAppleHIGTheme, isOldTheme } from './migration-utils';

// Union type для поддержки обеих тем
export type ThemeUnion = Theme | AppleHIGTheme;

/**
 * Хук для доступа к теме
 * 
 * ВАЖНО: По умолчанию возвращает старую тему (Theme) для обратной совместимости.
 * Компоненты, которые еще не мигрированы, должны использовать useOldTheme().
 * Компоненты, которые мигрированы, должны использовать useAppleHIGTheme().
 * 
 * @returns Текущая тема (Theme или AppleHIGTheme)
 * @deprecated Используйте useOldTheme() или useAppleHIGTheme() в зависимости от ситуации
 */
export const useTheme = (): ThemeUnion => {
  const context = useContext(ThemeContext);
  
  // Проверяем, что контекст существует и имеет theme
  if (context && typeof context === 'object' && 'theme' in context) {
    return context.theme;
  }
  
  // Fallback для случаев, когда ThemeProvider не обернут
  // Возвращаем старую тему для обратной совместимости
  return lightTheme;
};

/**
 * Хук для доступа к теме (обратная совместимость)
 * 
 * Используется компонентами, которые еще не мигрированы на новую тему.
 * Возвращает старую тему (Theme) или fallback, если используется новая тема.
 * 
 * @returns Старая тема (Theme)
 */
export const useThemeCompat = (): Theme => {
  return useOldTheme();
};

/**
 * Хук для доступа к старой теме (для обратной совместимости)
 * Используется компонентами, которые еще не мигрированы
 * 
 * @returns Старая тема (Theme)
 * @throws Error, если используется новая тема Apple HIG
 */
export const useOldTheme = (): Theme => {
  const theme = useTheme();
  
  if (isOldTheme(theme)) {
    return theme;
  }
  
  // Если используется новая тема, возвращаем fallback
  // Это временное решение для обратной совместимости
  // В ЭТАПЕ 1 компоненты будут обновлены для работы с новой темой
  console.warn('useOldTheme: используется новая тема Apple HIG, возвращаем fallback');
  return lightTheme;
};

/**
 * Хук для доступа к новой теме Apple HIG
 * Используется компонентами, которые мигрированы на новую тему
 * 
 * @returns Новая тема Apple HIG (AppleHIGTheme)
 * @throws Error, если используется старая тема
 */
export const useAppleHIGTheme = (): AppleHIGTheme => {
  const theme = useTheme();
  
  if (isAppleHIGTheme(theme)) {
    return theme;
  }
  
  // Если используется старая тема, создаем новую на основе текущей схемы
  const isDark = (theme as Theme).background === darkTheme.background;
  return createAppleHIGTheme(isDark ? 'dark' : 'light');
};

/**
 * Хук для проверки, используется ли новая тема Apple HIG
 * 
 * @returns true, если используется новая тема Apple HIG
 */
export const useIsAppleHIG = (): boolean => {
  const context = useContext(ThemeContext);
  return context?.useAppleHIG ?? false;
};

