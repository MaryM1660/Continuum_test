import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/useTheme';

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
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  style,
  padding = true,
  paddingHorizontal,
  paddingVertical,
}) => {
  const theme = useTheme();
  const patterns = theme.spacingPatterns;

  // Определяем paddingHorizontal
  let horizontalPadding: number = 0;
  if (paddingHorizontal !== undefined) {
    horizontalPadding = typeof paddingHorizontal === 'number' 
      ? paddingHorizontal 
      : paddingHorizontal 
        ? patterns.containerPaddingHorizontal 
        : 0;
  } else if (padding !== false) {
    horizontalPadding = typeof padding === 'number' 
      ? padding 
      : patterns.containerPaddingHorizontal;
  }

  // Определяем paddingVertical
  let verticalPadding: number = 0;
  if (paddingVertical !== undefined) {
    verticalPadding = typeof paddingVertical === 'number' 
      ? paddingVertical 
      : paddingVertical 
        ? patterns.containerPaddingVertical 
        : 0;
  } else if (padding !== false) {
    verticalPadding = typeof padding === 'number' 
      ? padding 
      : patterns.containerPaddingVertical;
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

