// Цветовая схема приложения
// Primary accent: #1F7EB9 (blue)
// Современная палитра для серьезных тех специалистов
// Высокий контраст, eye-friendly, соответствует WCAG AA стандартам

// Импорт типографики
import { typography, typographyPatterns } from './typography';

// Единая система отступов на основе 4pt grid
// Следуем iOS Human Interface Guidelines и Material Design
export const spacing = {
  xs: 4,    // 1x grid
  sm: 8,    // 2x grid
  md: 12,   // 3x grid
  base: 16, // 4x grid (базовый отступ)
  lg: 20,   // 5x grid
  xl: 24,   // 6x grid
  '2xl': 32, // 8x grid
  '3xl': 40, // 10x grid
  '4xl': 48, // 12x grid
  '5xl': 64, // 16x grid
  '6xl': 80, // 20x grid
  '7xl': 96, // 24x grid
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
  // Primary colors - профессиональный синий
  primary: '#1F7EB9',        // Основной акцент
  primaryDark: '#1565A0',    // Для hover/pressed состояний
  primaryLight: '#4A9FD9',   // Для светлых акцентов
  primaryContrast: '#FFFFFF', // Текст на primary фоне
  
  // Background colors - чистый и минималистичный
  background: '#FFFFFF',           // Основной фон
  surface: '#F8F9FA',              // Поверхности (карточки, панели)
  surfaceElevated: '#FFFFFF',      // Приподнятые поверхности
  surfaceHover: '#F1F3F5',         // Hover состояние
  
  // Text colors - высокая читаемость
  text: '#0D1117',                 // Основной текст (почти черный для контраста)
  textSecondary: '#656D76',        // Вторичный текст (60% opacity эквивалент)
  textTertiary: '#8B949E',         // Третичный текст (40% opacity)
  textDisabled: '#B1BAC4',         // Отключенный текст
  
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
  // Primary colors - тот же синий, но адаптированный для темной темы
  primary: '#58A6FF',              // Более яркий для темного фона
  primaryDark: '#4493F8',          // Для hover/pressed
  primaryLight: '#79C0FF',         // Для светлых акцентов
  primaryContrast: '#0D1117',      // Текст на primary фоне
  
  // Background colors - глубокий темный, но не черный
  background: '#0D1117',           // Основной фон (GitHub dark style)
  surface: '#161B22',              // Поверхности
  surfaceElevated: '#1C2128',      // Приподнятые поверхности
  surfaceHover: '#21262D',         // Hover состояние
  
  // Text colors - высокая читаемость на темном
  text: '#F0F6FC',                  // Основной текст (почти белый)
  textSecondary: '#B1BAC4',         // Вторичный текст (70% opacity)
  textTertiary: '#8B949E',         // Третичный текст (50% opacity)
  textDisabled: '#484F58',         // Отключенный текст
  
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

