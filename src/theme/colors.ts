// Цветовая схема приложения
// Primary accent: #1F7EB9 (blue)
// Современная палитра для серьезных тех специалистов
// Высокий контраст, eye-friendly, соответствует WCAG AA стандартам

// Импорт типографики
import { typography, typographyPatterns } from './typography';

// Единая система отступов на основе 8pt grid (Apple HIG стандарт)
// Следуем официальным iOS Human Interface Guidelines
export const spacing = {
  xs: 4,    // 0.5x grid (минимальный отступ)
  sm: 8,    // 1x grid (базовый минимальный отступ Apple)
  md: 12,   // 1.5x grid
  base: 16, // 2x grid (стандартный отступ Apple)
  lg: 20,   // 2.5x grid
  xl: 24,   // 3x grid (стандартный отступ для контейнеров Apple)
  '2xl': 32, // 4x grid (стандартный отступ для секций Apple)
  '3xl': 40, // 5x grid
  '4xl': 48, // 6x grid (стандартный размер touch target Apple)
  '5xl': 64, // 8x grid
  '6xl': 80, // 10x grid
  '7xl': 96, // 12x grid
} as const;

// Паттерны отступов для часто используемых случаев
export const spacingPatterns = {
  // Отступы для контейнеров
  containerPadding: spacing.xl,      // 24px
  containerPaddingHorizontal: spacing.xl, // 24px
  containerPaddingVertical: spacing.base, // 16px
  
  // Отступы для элементов списка
  listItemPadding: spacing.xl,        // 24px
  listItemPaddingVertical: spacing.lg, // 20px
  
  // Отступы для кнопок
  buttonPaddingHorizontal: spacing['3xl'], // 40px
  buttonPaddingVertical: spacing.lg,       // 20px
  buttonGap: spacing.base,                 // 16px
  
  // Отступы для карточек
  cardPadding: spacing.xl,            // 24px
  cardGap: spacing.base,              // 16px
  
  // Отступы для заголовков
  headerPadding: spacing.xl,          // 24px
  headerPaddingBottom: spacing.lg,    // 20px
  
  // Отступы для секций
  sectionGap: spacing['2xl'],          // 32px
  sectionPadding: spacing.xl,         // 24px
  
  // Отступы для иконок
  iconMargin: spacing.lg,              // 20px
  iconSize: spacing['4xl'],           // 48px
  
  // Минимальные отступы
  minTouchTarget: spacing['4xl'],     // 48px (iOS/Android minimum)
} as const;

const baseTheme = {
  // Единая система отступов
  spacing,
  spacingPatterns,
  // Система типографики
  typography,
  typographyPatterns,
};

export const lightTheme = {
  ...baseTheme,
  // Primary colors - Apple System Blue
  primary: '#007AFF',        // iOS System Blue (официальный Apple)
  primaryDark: '#0051D5',    // Для pressed состояний
  primaryLight: '#5AC8FA',   // Для светлых акцентов
  primaryContrast: '#FFFFFF', // Текст на primary фоне
  
  // Background colors - Apple System Colors
  background: '#FFFFFF',           // System Background (светлая тема)
  surface: '#F2F2F7',              // System Grouped Background (Apple стандарт)
  surfaceElevated: '#FFFFFF',      // Приподнятые поверхности
  surfaceHover: '#E5E5EA',         // Hover состояние (Apple стандарт)
  
  // Text colors - Apple Label Colors
  text: '#000000',                 // Label (основной текст Apple)
  textSecondary: '#3C3C43',        // Secondary Label (60% opacity)
  textTertiary: '#3C3C43',         // Tertiary Label (30% opacity) - визуально #B3B3B7
  textDisabled: '#C7C7CC',         // Disabled Label
  
  // Border и разделители
  border: '#D0D7DE',               // Границы
  divider: '#D8DEE4',              // Разделители
  borderLight: '#E1E8ED',          // Светлые границы
  
  // Semantic colors - современные и профессиональные
  error: '#DA3633',                // Ошибки (красный)
  errorLight: '#FFEBEE',           // Светлый фон для ошибок
  success: '#238636',              // Успех (зеленый)
  successLight: '#E8F5E9',         // Светлый фон для успеха
  warning: '#9E6A03',              // Предупреждения (оранжевый)
  warningLight: '#FFF3E0',         // Светлый фон для предупреждений
  info: '#0969DA',                 // Информация (синий)
  infoLight: '#E3F2FD',             // Светлый фон для информации
  
};

export const darkTheme = {
  ...baseTheme,
  // Primary colors - Apple System Blue (темная тема)
  primary: '#0A84FF',              // iOS System Blue (темная тема)
  primaryDark: '#409CFF',          // Для pressed
  primaryLight: '#64D2FF',         // Для светлых акцентов
  primaryContrast: '#000000',      // Текст на primary фоне
  
  // Background colors - Apple System Colors (темная тема)
  background: '#000000',           // System Background (темная тема)
  surface: '#1C1C1E',              // System Grouped Background (Apple стандарт)
  surfaceElevated: '#2C2C2E',      // Приподнятые поверхности
  surfaceHover: '#3A3A3C',         // Hover состояние (Apple стандарт)
  
  // Text colors - Apple Label Colors (темная тема)
  text: '#FFFFFF',                  // Label (основной текст Apple)
  textSecondary: '#EBEBF5',         // Secondary Label (60% opacity)
  textTertiary: '#EBEBF5',         // Tertiary Label (30% opacity) - визуально #999999
  textDisabled: '#48484A',         // Disabled Label
  
  // Border и разделители
  border: '#30363D',               // Границы
  divider: '#21262D',              // Разделители
  borderLight: '#21262D',          // Светлые границы
  
  // Semantic colors - адаптированные для темной темы
  error: '#F85149',                // Ошибки
  errorLight: '#490202',           // Темный фон для ошибок
  success: '#3FB950',              // Успех
  successLight: '#033A16',         // Темный фон для успеха
  warning: '#D29922',              // Предупреждения
  warningLight: '#3D1F00',         // Темный фон для предупреждений
  info: '#58A6FF',                 // Информация
  infoLight: '#0C2D6B',            // Темный фон для информации
  
};

export type Theme = typeof lightTheme;

