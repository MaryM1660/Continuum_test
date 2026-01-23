import React from 'react';
import { View, StyleSheet, ViewStyle, SafeAreaView } from 'react-native';
import { useTheme } from '../../theme/useTheme';

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  safeArea?: boolean;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

/**
 * Контейнер для экрана с SafeAreaView
 * Используется как корневой контейнер для всех экранов
 */
export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  style,
  safeArea = true,
  edges,
}) => {
  const theme = useTheme();

  const content = (
    <View style={[styles.container, { backgroundColor: theme.background }, style]}>
      {children}
    </View>
  );

  if (safeArea) {
    return (
      <SafeAreaView 
        style={[styles.safeArea, { backgroundColor: theme.background }]}
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

