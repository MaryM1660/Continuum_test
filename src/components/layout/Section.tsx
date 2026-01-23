import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme, useIsAppleHIG, useAppleHIGTheme, useOldTheme } from '../../theme/useTheme';
import { isAppleHIGTheme } from '../../theme/migration-utils';

interface SectionProps {
  children: React.ReactNode;
  style?: ViewStyle;
  gap?: number;
  marginTop?: number | 'none';
  marginBottom?: number;
}

/**
 * Секция контента с вертикальными отступами
 * Используется для группировки связанных элементов
 * Поддерживает как старую, так и новую тему Apple HIG
 */
export const Section: React.FC<SectionProps> = ({
  children,
  style,
  gap,
  marginTop,
  marginBottom,
}) => {
  const theme = useTheme();
  const isAppleHIG = useIsAppleHIG();
  
  // Получаем spacing в зависимости от темы
  let defaultSectionGap: number;
  if (isAppleHIG && isAppleHIGTheme(theme)) {
    // Новая тема Apple HIG
    defaultSectionGap = theme.spacing['2xl']; // 32px (стандартный отступ для секций)
  } else {
    // Старая тема
    const oldTheme = useOldTheme();
    defaultSectionGap = oldTheme.spacingPatterns.sectionGap;
  }

  const sectionStyle: ViewStyle = {
    marginTop: marginTop === 'none' 
      ? 0 
      : marginTop !== undefined 
        ? marginTop 
        : defaultSectionGap,
    marginBottom: marginBottom ?? 0,
  };

  return (
    <View style={[styles.section, sectionStyle, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    width: '100%',
  },
});

