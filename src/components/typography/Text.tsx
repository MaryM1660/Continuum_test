import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { TypographyVariant } from '../../theme/typography';

interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: 'primary' | 'secondary' | 'tertiary' | 'disabled' | 'error' | 'success' | 'warning' | 'info';
  align?: 'left' | 'center' | 'right';
}

/**
 * Текстовый компонент с применением типографической системы
 * Используйте для всего текста в приложении
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
  const typographyStyle = theme.typography[variant];

  // Определяем цвет текста
  let textColor = theme.text;
  if (color === 'primary') {
    textColor = theme.primary;
  } else if (color === 'secondary') {
    textColor = theme.textSecondary;
  } else if (color === 'tertiary') {
    textColor = theme.textTertiary;
  } else if (color === 'disabled') {
    textColor = theme.textDisabled;
  } else if (color === 'error') {
    textColor = theme.error;
  } else if (color === 'success') {
    textColor = theme.success;
  } else if (color === 'warning') {
    textColor = theme.warning;
  } else if (color === 'info') {
    textColor = theme.info || theme.primary;
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

