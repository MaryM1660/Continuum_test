import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme, useIsAppleHIG, useAppleHIGTheme, useOldTheme } from '../../theme/useTheme';
import { isAppleHIGTheme } from '../../theme/migration-utils';

interface ContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: boolean | number;
  paddingHorizontal?: boolean | number;
  paddingVertical?: boolean | number;
}

/**
 * Основной контейнер с отступами
 * Используется для обертки контента на экранах
 * Поддерживает как старую, так и новую тему Apple HIG
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  style,
  padding = true,
  paddingHorizontal,
  paddingVertical,
}) => {
  const theme = useTheme();
  const isAppleHIG = useIsAppleHIG();
  
  // Получаем spacing patterns в зависимости от темы
  let containerPaddingHorizontal: number;
  let containerPaddingVertical: number;
  
  if (isAppleHIG && isAppleHIGTheme(theme)) {
    // Новая тема Apple HIG
    containerPaddingHorizontal = theme.spacingPatterns.container.paddingHorizontal;
    containerPaddingVertical = theme.spacingPatterns.container.paddingVertical;
  } else {
    // Старая тема
    const oldTheme = useOldTheme();
    containerPaddingHorizontal = oldTheme.spacingPatterns.containerPaddingHorizontal;
    containerPaddingVertical = oldTheme.spacingPatterns.containerPaddingVertical;
  }

  // Определяем paddingHorizontal
  let horizontalPadding: number = 0;
  if (paddingHorizontal !== undefined) {
    horizontalPadding = typeof paddingHorizontal === 'number' 
      ? paddingHorizontal 
      : paddingHorizontal 
        ? containerPaddingHorizontal 
        : 0;
  } else if (padding !== false) {
    horizontalPadding = typeof padding === 'number' 
      ? padding 
      : containerPaddingHorizontal;
  }

  // Определяем paddingVertical
  let verticalPadding: number = 0;
  if (paddingVertical !== undefined) {
    verticalPadding = typeof paddingVertical === 'number' 
      ? paddingVertical 
      : paddingVertical 
        ? containerPaddingVertical 
        : 0;
  } else if (padding !== false) {
    verticalPadding = typeof padding === 'number' 
      ? padding 
      : containerPaddingVertical;
  }

  const containerStyle: ViewStyle = {
    paddingHorizontal: horizontalPadding,
    paddingVertical: verticalPadding,
  };

  return (
    <View style={[styles.container, containerStyle, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

