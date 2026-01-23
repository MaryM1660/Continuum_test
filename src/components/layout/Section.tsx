import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/useTheme';

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
 */
export const Section: React.FC<SectionProps> = ({
  children,
  style,
  gap,
  marginTop,
  marginBottom,
}) => {
  const theme = useTheme();
  const patterns = theme.spacingPatterns;

  const sectionStyle: ViewStyle = {
    marginTop: marginTop === 'none' 
      ? 0 
      : marginTop !== undefined 
        ? marginTop 
        : patterns.sectionGap,
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

