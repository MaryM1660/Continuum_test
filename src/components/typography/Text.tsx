import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { useTheme, useIsAppleHIG, useAppleHIGTheme, useOldTheme } from '../../theme/useTheme';
import { TypographyVariant } from '../../theme/typography';
import { isAppleHIGTheme } from '../../theme/migration-utils';
import type { Theme } from '../../theme/colors';
import type { AppleHIGTheme } from '../../theme/apple-hig/theme';

interface TextProps extends RNTextProps {
  variant?: TypographyVariant | 'largeTitle' | 'title1' | 'title2' | 'title3' | 'headline' | 'callout' | 'subheadline' | 'footnote' | 'caption1' | 'caption2';
  color?: 'primary' | 'secondary' | 'tertiary' | 'disabled' | 'error' | 'success' | 'warning' | 'info';
  align?: 'left' | 'center' | 'right';
}

/**
 * Маппинг старых вариантов типографики на новые (Apple HIG)
 * Также поддерживаем прямые варианты Apple HIG
 */
const variantMapping: Record<TypographyVariant | 'largeTitle' | 'title1' | 'title2' | 'title3' | 'headline' | 'callout' | 'subheadline' | 'footnote' | 'caption1' | 'caption2', keyof AppleHIGTheme['typography']> = {
  h1: 'largeTitle',
  h2: 'title1',
  h3: 'title2',
  h4: 'title3',
  bodyLarge: 'body',
  body: 'body',
  bodyMedium: 'callout',
  bodySmall: 'subheadline',
  caption: 'footnote',
  captionSmall: 'caption1',
  label: 'subheadline',
  button: 'body', // Apple HIG использует body для кнопок
  buttonLarge: 'body',
  buttonSmall: 'subheadline',
  overline: 'caption2',
  // Прямые варианты Apple HIG
  largeTitle: 'largeTitle',
  title1: 'title1',
  title2: 'title2',
  title3: 'title3',
  headline: 'headline',
  callout: 'callout',
  subheadline: 'subheadline',
  footnote: 'footnote',
  caption1: 'caption1',
  caption2: 'caption2',
};

/**
 * Текстовый компонент с применением типографической системы Apple HIG
 * Поддерживает как старую, так и новую тему для плавной миграции
 */
export const Text: React.FC<TextProps> = ({
  variant = 'body',
  color,
  align,
  style,
  children,
  ...props
}) => {
  const theme = useTheme();
  const isAppleHIG = useIsAppleHIG();
  
  // Получаем стиль типографики в зависимости от темы
  let typographyStyle: any;
  if (isAppleHIG && isAppleHIGTheme(theme)) {
    // Используем новую тему Apple HIG
    const newVariant = variantMapping[variant as keyof typeof variantMapping] || 'body';
    typographyStyle = theme.typography[newVariant];
  } else {
    // Используем старую тему
    const oldTheme = useOldTheme();
    typographyStyle = oldTheme.typography[variant];
  }

  // Определяем цвет текста
  let textColor: string;
  if (isAppleHIG && isAppleHIGTheme(theme)) {
    // Новая тема Apple HIG
    switch (color) {
      case 'primary':
        textColor = theme.colors.primary;
        break;
      case 'secondary':
        textColor = theme.colors.textSecondary;
        break;
      case 'tertiary':
        textColor = theme.colors.textTertiary;
        break;
      case 'disabled':
        textColor = theme.colors.textDisabled;
        break;
      case 'error':
        textColor = theme.colors.error;
        break;
      case 'success':
        textColor = theme.colors.success;
        break;
      case 'warning':
        textColor = theme.colors.warning;
        break;
      case 'info':
        textColor = theme.colors.info;
        break;
      default:
        textColor = theme.colors.text;
    }
  } else {
    // Старая тема
    const oldTheme = useOldTheme();
    switch (color) {
      case 'primary':
        textColor = oldTheme.primary;
        break;
      case 'secondary':
        textColor = oldTheme.textSecondary;
        break;
      case 'tertiary':
        textColor = oldTheme.textTertiary;
        break;
      case 'disabled':
        textColor = oldTheme.textDisabled;
        break;
      case 'error':
        textColor = oldTheme.error;
        break;
      case 'success':
        textColor = oldTheme.success;
        break;
      case 'warning':
        textColor = oldTheme.warning;
        break;
      case 'info':
        textColor = oldTheme.info || oldTheme.primary;
        break;
      default:
        textColor = oldTheme.text;
    }
  }

  return (
    <RNText
      style={[
        typographyStyle,
        {
          color: textColor,
          textAlign: align,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

