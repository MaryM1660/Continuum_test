import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, View, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, useIsAppleHIG, useAppleHIGTheme, useOldTheme } from '../theme/useTheme';
import { isAppleHIGTheme } from '../theme/migration-utils';
import { Text } from './typography';

// Условный импорт BlurView только для native
let BlurView: any;
if (Platform.OS !== 'web') {
  try {
    BlurView = require('expo-blur').BlurView;
  } catch (e) {
    console.warn('expo-blur not available, using fallback');
  }
}

interface LiquidGlassButtonProps {
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  textVariant?: 'button' | 'buttonLarge';
  borderRadius?: number;
}

export const LiquidGlassButton: React.FC<LiquidGlassButtonProps> = ({
  onPress,
  disabled = false,
  style,
  children,
  variant = 'primary',
  textVariant = 'button',
  borderRadius = 16,
}) => {
  const theme = useTheme();
  const isAppleHIG = useIsAppleHIG();
  const isPrimary = variant === 'primary';
  
  // Получаем параметры Liquid Glass в зависимости от темы
  let glassColor1: string;
  let glassColor2: string;
  let borderColor: string;
  let borderWidth: number;
  let blurRadius: string;
  let textColor: string;
  let backgroundColor: string;
  let highlightColor: string;
  let highlightColorEnd: string;
  let shadowStyle: any;
  let blurIntensity: number;
  let blurTint: 'light' | 'dark';
  
  if (isAppleHIG && isAppleHIGTheme(theme)) {
    // Новая тема Apple HIG
    const liquidGlass = theme.materials.liquidGlass;
    // Для светлой темы используем более высокую opacity для видимости
    // На темной теме используем стандартные значения
    let opacity: number;
    if (theme.isDark) {
      opacity = isPrimary 
        ? liquidGlass.backgroundOpacity.primary 
        : liquidGlass.backgroundOpacity.secondary;
    } else {
      // На светлой теме нужна значительно более высокая opacity
      opacity = isPrimary ? 0.7 : 0.6; // Достаточно высокая для видимости
    }
    
    glassColor1 = theme.isDark 
      ? `rgba(255, 255, 255, ${opacity + 0.05})`
      : `rgba(255, 255, 255, ${opacity + 0.1})`;
    glassColor2 = `rgba(255, 255, 255, ${opacity})`;
    
    // Граница: на светлой теме темная, на темной - светлая
    borderColor = theme.isDark 
      ? liquidGlass.border.color 
      : 'rgba(0, 0, 0, 0.15)'; // Темная граница на светлой теме
    borderWidth = liquidGlass.border.width;
    blurRadius = liquidGlass.backdropFilter.blur;
    highlightColor = liquidGlass.highlight.color;
    highlightColorEnd = liquidGlass.highlight.colorEnd;
    backgroundColor = `rgba(255, 255, 255, ${opacity})`;
    blurIntensity = liquidGlass.blurIntensity.light;
    blurTint = theme.isDark ? 'dark' : 'light';
    
    // Цвет текста
    textColor = isPrimary ? theme.colors.primary : theme.colors.text;
    
    // Тени из новой темы
    const shadow = theme.shadows.patterns.buttonLiquidGlass;
    shadowStyle = Platform.OS === 'web' 
      ? { boxShadow: shadow.boxShadow }
      : {
          shadowColor: shadow.external.shadowColor,
          shadowOffset: shadow.external.shadowOffset,
          shadowOpacity: shadow.external.shadowOpacity,
          shadowRadius: shadow.external.shadowRadius,
          elevation: shadow.external.elevation,
        };
  } else {
    // Старая тема (обратная совместимость)
    const oldTheme = useOldTheme();
    glassColor1 = isPrimary
      ? 'rgba(255, 255, 255, 0.7)'
      : 'rgba(255, 255, 255, 0.6)';
    glassColor2 = isPrimary
      ? 'rgba(255, 255, 255, 0.5)'
      : 'rgba(255, 255, 255, 0.4)';
    borderColor = 'rgba(255, 255, 255, 0.18)';
    borderWidth = 1;
    blurRadius = '20px';
    highlightColor = 'rgba(255, 255, 255, 0.3)';
    highlightColorEnd = 'rgba(255, 255, 255, 0)';
    backgroundColor = isPrimary
      ? 'rgba(255, 255, 255, 0.7)'
      : 'rgba(255, 255, 255, 0.6)';
    blurIntensity = 20;
    blurTint = oldTheme.background === '#FFFFFF' ? 'light' : 'dark';
    textColor = isPrimary ? oldTheme.primary : oldTheme.text;
    shadowStyle = {
      shadowColor: '#000',
      shadowOffset: { width: 3, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 8,
    };
  }

  // Для web используем CSS backdrop-filter
  if (Platform.OS === 'web') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.9}
        style={[styles.container, { borderRadius }, style]}
      >
        <View
          style={[
            styles.glassContainer,
            {
              borderRadius,
              borderColor,
              borderWidth,
              opacity: disabled ? 0.5 : 1,
              backgroundColor,
              backdropFilter: `blur(${blurRadius}) saturate(180%)`,
              WebkitBackdropFilter: `blur(${blurRadius}) saturate(180%)`,
              ...(Platform.OS === 'web' ? shadowStyle : {}),
            } as any,
          ]}
        >
          <LinearGradient
            colors={[glassColor1, glassColor2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFill, { borderRadius }]}
          />
          {/* Верхний блик */}
          <LinearGradient
            colors={[highlightColor, highlightColorEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.4 }}
            style={[styles.highlight, { borderRadius }]}
          />
          <View style={[styles.content, { borderRadius }]}>
            {typeof children === 'string' ? (
              <Text 
                variant={textVariant} 
                color={isPrimary ? 'primary' : undefined}
                style={isPrimary ? undefined : { color: textColor }}
              >
                {children}
              </Text>
            ) : (
              children
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Для native используем BlurView из expo-blur
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.9}
      style={[styles.container, { borderRadius }, style]}
    >
      <BlurView
        intensity={blurIntensity}
        tint={blurTint}
        style={[
          styles.glassContainer,
          {
            borderRadius,
            borderColor,
            borderWidth,
            opacity: disabled ? 0.5 : 1,
            overflow: 'hidden',
          },
        ]}
      >
        <LinearGradient
          colors={[glassColor1, glassColor2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {/* Верхний блик */}
        <LinearGradient
          colors={[highlightColor, highlightColorEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.4 }}
          style={[styles.highlight, { borderRadius }]}
        />
        <View style={[styles.content, { borderRadius }]}>
          {typeof children === 'string' ? (
            <Text 
              variant={textVariant} 
              color={isPrimary ? 'primary' : undefined}
              style={isPrimary ? undefined : { color: textColor }}
            >
              {children}
            </Text>
          ) : (
            children
          )}
        </View>
      </BlurView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    // Тени применяются динамически в зависимости от темы
  },
  glassContainer: {
    overflow: 'hidden',
    position: 'relative',
    minHeight: 48,
    width: '100%',
    height: '100%',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',  // Согласно гайдлайну - более мягкий блик
    pointerEvents: 'none',
  },
  content: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    minHeight: 48,
    width: '100%',
    height: '100%',
    position: 'relative',
  },
});
