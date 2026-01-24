// Система типографики на основе iOS Human Interface Guidelines и Material Design
// Оптимизирована для серьезных тех специалистов - хорошая читаемость, не слишком мелко

// Типографика по официальным гайдлайнам Apple HIG (iOS 17/18)
// Использует SF Pro шрифты и точные размеры из Apple Human Interface Guidelines
export const typography = {
  // Заголовки (Headings) - Apple HIG
  h1: {
    fontSize: 34,      // Large Title (Apple HIG)
    lineHeight: 41,    // Apple стандарт
    fontWeight: '700' as const, // Bold
    letterSpacing: 0.37, // Apple стандарт
  },
  h2: {
    fontSize: 28,      // Title 1 (Apple HIG)
    lineHeight: 34,    // Apple стандарт
    fontWeight: '700' as const,
    letterSpacing: 0.36, // Apple стандарт
  },
  h3: {
    fontSize: 22,      // Title 2 (Apple HIG)
    lineHeight: 28,    // Apple стандарт
    fontWeight: '700' as const, // Bold (Apple стандарт)
    letterSpacing: 0.35, // Apple стандарт
  },
  h4: {
    fontSize: 20,      // Title 3 (Apple HIG)
    lineHeight: 25,    // Apple стандарт
    fontWeight: '600' as const, // Semibold
    letterSpacing: 0.38, // Apple стандарт
  },
  
  // Основной текст (Body) - Apple HIG
  bodyLarge: {
    fontSize: 17,      // Body (Apple HIG)
    lineHeight: 22,    // Apple стандарт
    fontWeight: '400' as const, // Regular
    letterSpacing: -0.41, // Apple стандарт
  },
  body: {
    fontSize: 17,      // Body (Apple HIG)
    lineHeight: 22,    // Apple стандарт
    fontWeight: '400' as const,
    letterSpacing: -0.41, // Apple стандарт
  },
  bodyMedium: {
    fontSize: 16,      // Callout (Apple HIG)
    lineHeight: 21,    // Apple стандарт
    fontWeight: '400' as const,
    letterSpacing: -0.32, // Apple стандарт
  },
  bodySmall: {
    fontSize: 15,      // Subhead (Apple HIG)
    lineHeight: 20,    // Apple стандарт
    fontWeight: '400' as const,
    letterSpacing: -0.24, // Apple стандарт
  },
  
  // Вспомогательный текст (Supporting) - Apple HIG
  caption: {
    fontSize: 13,      // Footnote (Apple HIG)
    lineHeight: 18,    // Apple стандарт
    fontWeight: '400' as const,
    letterSpacing: -0.08, // Apple стандарт
  },
  captionSmall: {
    fontSize: 12,      // Caption 1 (Apple HIG)
    lineHeight: 16,    // Apple стандарт
    fontWeight: '400' as const,
    letterSpacing: 0, // Apple стандарт
  },
  
  // Кнопки и действия (Buttons) - Apple HIG
  button: {
    fontSize: 17,      // Body для кнопок (Apple HIG)
    lineHeight: 22,    // Apple стандарт
    fontWeight: '400' as const, // Regular (нежирный)
    letterSpacing: -0.41, // Apple стандарт
  },
  buttonLarge: {
    fontSize: 17,      // Body (Apple HIG - кнопки используют Body размер)
    lineHeight: 22,    // Apple стандарт
    fontWeight: '400' as const, // Regular (нежирный)
    letterSpacing: -0.41, // Apple стандарт
  },
  buttonSmall: {
    fontSize: 15,      // Subhead для маленьких кнопок
    lineHeight: 20,    // Apple стандарт
    fontWeight: '400' as const, // Regular (нежирный)
    letterSpacing: -0.24, // Apple стандарт
  },
  
  // Специальные случаи - Apple HIG
  label: {
    fontSize: 13,      // Footnote для лейблов
    lineHeight: 18,    // Apple стандарт
    fontWeight: '400' as const, // Regular (Apple стандарт)
    letterSpacing: -0.08, // Apple стандарт
  },
  overline: {
    fontSize: 11,      // Caption 2 (Apple HIG)
    lineHeight: 13,    // Apple стандарт
    fontWeight: '400' as const,
    letterSpacing: 0.07, // Apple стандарт
    textTransform: 'uppercase' as const,
  },
} as const;

// Типы для TypeScript
export type TypographyVariant = keyof typeof typography;
export type FontWeight = '400' | '500' | '600' | '700';

// Вспомогательная функция для получения стилей типографики
export const getTypographyStyle = (variant: TypographyVariant) => {
  return typography[variant];
};

// Паттерны типографики для часто используемых случаев
export const typographyPatterns = {
  // Заголовки экранов
  screenTitle: typography.h1,
  sectionTitle: typography.h3,
  cardTitle: typography.h4,
  
  // Основной контент
  bodyText: typography.body,
  bodySecondary: typography.bodyMedium,
  bodyTertiary: typography.bodySmall,
  
  // Навигация и меню
  navTitle: typography.h2,
  navItem: typography.body,
  navItemSecondary: typography.bodyMedium,
  
  // Формы
  input: typography.body,
  inputLabel: typography.label,
  inputHelper: typography.caption,
  
  // Кнопки
  primaryButton: typography.buttonLarge,
  secondaryButton: typography.button,
  tertiaryButton: typography.buttonSmall,
} as const;

