import React from 'react';
import { View, StyleSheet, ViewStyle, SafeAreaView } from 'react-native';
import { useTheme, useIsAppleHIG, useAppleHIGTheme, useOldTheme } from '../../theme/useTheme';
import { isAppleHIGTheme } from '../../theme/migration-utils';

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  safeArea?: boolean;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

/**
 * Контейнер для экрана с SafeAreaView
 * Используется как корневой контейнер для всех экранов
 * Поддерживает как старую, так и новую тему Apple HIG
 */
export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  style,
  safeArea = true,
  edges,
}) => {
  const theme = useTheme();
  const isAppleHIG = useIsAppleHIG();
  
  // Получаем цвет фона в зависимости от темы
  let backgroundColor: string;
  if (isAppleHIG && isAppleHIGTheme(theme)) {
    // Новая тема Apple HIG
    backgroundColor = theme.colors.background;
  } else {
    // Старая тема
    const oldTheme = useOldTheme();
    backgroundColor = oldTheme.background;
  }

  const content = (
    <View style={[styles.container, { backgroundColor }, style]}>
      {children}
    </View>
  );

  if (safeArea) {
    return (
      <SafeAreaView 
        style={[styles.safeArea, { backgroundColor }]}
        edges={edges}
      >
        {content}
      </SafeAreaView>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});

