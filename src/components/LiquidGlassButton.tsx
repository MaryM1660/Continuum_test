import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, View, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../theme/colors';
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
  theme: Theme;
  textVariant?: 'button' | 'buttonLarge';
  borderRadius?: number;
}

export const LiquidGlassButton: React.FC<LiquidGlassButtonProps> = ({
  onPress,
  disabled = false,
  style,
  children,
  variant = 'primary',
  theme,
  textVariant = 'button',
  borderRadius = 16,
}) => {
  const isPrimary = variant === 'primary';
  
  // Цвета для liquid glass эффекта - более заметные
  const glassColor1 = isPrimary
    ? 'rgba(31, 126, 185, 0.35)'
    : 'rgba(255, 255, 255, 0.25)';
  
  const glassColor2 = isPrimary
    ? 'rgba(31, 126, 185, 0.2)'
    : 'rgba(255, 255, 255, 0.15)';

  // Убираем видимую обводку
  const borderColor = 'transparent';

  const textColor = isPrimary ? theme.primaryContrast : theme.text;

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
              borderColor: 'transparent',
              borderWidth: 0,
              opacity: disabled ? 0.5 : 1,
              backgroundColor: isPrimary
                ? 'rgba(31, 126, 185, 0.3)'
                : 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(25px) saturate(200%)',
              WebkitBackdropFilter: 'blur(25px) saturate(200%)',
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
            colors={['rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.5 }}
            style={[styles.highlight, { borderRadius }]}
          />
          <View style={[styles.content, { borderRadius }]}>
            {typeof children === 'string' ? (
              <Text variant={textVariant} style={{ color: textColor }}>
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
        intensity={20}
        tint={theme.background === '#FFFFFF' ? 'light' : 'dark'}
        style={[
          styles.glassContainer,
          {
            borderRadius,
            borderColor: 'transparent',
            borderWidth: 0,
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
          colors={['rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.5 }}
          style={[styles.highlight, { borderRadius }]}
        />
        <View style={[styles.content, { borderRadius }]}>
          {typeof children === 'string' ? (
            <Text variant={textVariant} style={{ color: textColor }}>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
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
    height: '50%',
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
