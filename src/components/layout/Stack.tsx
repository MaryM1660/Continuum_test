import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/useTheme';

interface StackProps {
  children: React.ReactNode;
  direction?: 'vertical' | 'horizontal';
  gap?: number;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
  style?: ViewStyle;
  flex?: number;
}

/**
 * Вертикальный или горизонтальный стек с gap между элементами
 * Аналог VStack/HStack из популярных UI библиотек
 */
export const Stack: React.FC<StackProps> = ({
  children,
  direction = 'vertical',
  gap,
  align = 'stretch',
  justify = 'start',
  style,
  flex,
}) => {
  const theme = useTheme();
  const spacing = theme.spacing;

  // Определяем gap по умолчанию
  const defaultGap = gap ?? spacing.base;

  const stackStyle: ViewStyle = {
    flexDirection: direction === 'horizontal' ? 'row' : 'column',
    gap: defaultGap,
    alignItems: align === 'start' ? 'flex-start' 
      : align === 'end' ? 'flex-end'
      : align === 'center' ? 'center'
      : 'stretch',
    justifyContent: justify === 'start' ? 'flex-start'
      : justify === 'end' ? 'flex-end'
      : justify === 'center' ? 'center'
      : justify === 'space-between' ? 'space-between'
      : 'space-around',
    flex: flex,
  };

  return (
    <View style={[styles.stack, stackStyle, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  stack: {
    width: '100%',
  },
});

