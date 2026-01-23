// Система типографики на основе iOS Human Interface Guidelines и Material Design
// Оптимизирована для серьезных тех специалистов - хорошая читаемость, не слишком мелко

export const typography = {
  // Заголовки (Headings)
  h1: {
    fontSize: 34,      // iOS Large Title, Material Headline 1
    lineHeight: 40,    // 1.18x для комфортного чтения
    fontWeight: '700' as const, // Bold
    letterSpacing: 0.37, // iOS standard
  },
  h2: {
    fontSize: 28,      // iOS Title 1, Material Headline 2
    lineHeight: 34,    // 1.21x
    fontWeight: '700' as const,
    letterSpacing: 0.36,
  },
  h3: {
    fontSize: 22,      // iOS Title 2, Material Headline 3
    lineHeight: 28,    // 1.27x
    fontWeight: '600' as const, // Semibold
    letterSpacing: 0.35,
  },
  h4: {
    fontSize: 20,      // iOS Title 3, Material Headline 4
    lineHeight: 26,    // 1.3x
    fontWeight: '600' as const,
    letterSpacing: 0.38,
  },
  
  // Основной текст (Body)
  bodyLarge: {
    fontSize: 17,      // iOS Body, Material Body 1 (стандарт для мобильных)
    lineHeight: 24,    // 1.41x - оптимально для чтения
    fontWeight: '400' as const, // Regular
    letterSpacing: -0.41, // iOS standard для body
  },
  body: {
    fontSize: 17,      // iOS Body (основной размер текста)
    lineHeight: 24,
    fontWeight: '400' as const,
    letterSpacing: -0.41,
  },
  bodyMedium: {
    fontSize: 16,      // Для вторичного контента
    lineHeight: 22,    // 1.38x
    fontWeight: '400' as const,
    letterSpacing: -0.32,
  },
  bodySmall: {
    fontSize: 15,      // iOS Subhead, Material Body 2
    lineHeight: 20,    // 1.33x
    fontWeight: '400' as const,
    letterSpacing: -0.24,
  },
  
  // Вспомогательный текст (Supporting)
  caption: {
    fontSize: 13,      // iOS Caption, Material Caption
    lineHeight: 18,    // 1.38x
    fontWeight: '400' as const,
    letterSpacing: -0.08,
  },
  captionSmall: {
    fontSize: 12,      // iOS Caption 2
    lineHeight: 16,    // 1.33x
    fontWeight: '400' as const,
    letterSpacing: 0,
  },
  
  // Кнопки и действия (Buttons)
  button: {
    fontSize: 17,      // iOS Button, Material Button
    lineHeight: 22,    // Компактнее для кнопок
    fontWeight: '600' as const, // Semibold для акцента
    letterSpacing: -0.41,
  },
  buttonLarge: {
    fontSize: 18,      // Для больших CTA кнопок
    lineHeight: 24,
    fontWeight: '600' as const,
    letterSpacing: -0.45,
  },
  buttonSmall: {
    fontSize: 15,      // Для маленьких кнопок
    lineHeight: 20,
    fontWeight: '600' as const,
    letterSpacing: -0.24,
  },
  
  // Специальные случаи
  label: {
    fontSize: 13,      // Для лейблов форм
    lineHeight: 18,
    fontWeight: '500' as const, // Medium для выделения
    letterSpacing: -0.08,
  },
  overline: {
    fontSize: 11,      // Material Overline
    lineHeight: 16,
    fontWeight: '500' as const,
    letterSpacing: 1.5, // Большой letter-spacing для uppercase
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

