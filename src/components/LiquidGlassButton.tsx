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
  
  // Цвета для liquid glass эффекта согласно официальному гайдлайну Apple HIG
  // Используем стандартные значения из iOS 17/18
  const glassColor1 = isPrimary
    ? 'rgba(255, 255, 255, 0.7)'  // Apple стандарт для primary (более выраженный)
    : 'rgba(255, 255, 255, 0.6)'; // Apple стандарт для secondary
  
  const glassColor2 = isPrimary
    ? 'rgba(255, 255, 255, 0.5)'  // Apple стандарт для primary (градиент)
    : 'rgba(255, 255, 255, 0.4)';  // Apple стандарт для secondary (градиент)

  // Убираем видимую обводку
  const borderColor = 'transparent';

  // Цвет текста по гайдлайну: на белом полупрозрачном фоне нужен темный текст для контраста
  // Primary кнопки: акцентный синий цвет для текста
  // Secondary кнопки: темный текст
  const textColor = isPrimary ? theme.primary : theme.text;

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
              borderColor: 'rgba(255, 255, 255, 0.18)',  // Apple HIG стандарт
              borderWidth: 1,
              opacity: disabled ? 0.5 : 1,
              backgroundColor: isPrimary
                ? 'rgba(255, 255, 255, 0.7)'  // Apple HIG стандарт
                : 'rgba(255, 255, 255, 0.6)', // Apple HIG стандарт
              backdropFilter: 'blur(20px)',  // Apple HIG стандарт: blur(20px)
              WebkitBackdropFilter: 'blur(20px)',
              // Тени по официальному гайдлайну Apple HIG
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)', // Apple HIG стандарт
            } as any,
          ]}
        >
          <LinearGradient
            colors={[glassColor1, glassColor2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFill, { borderRadius }]}
          />
          {/* Верхний блик - более мягкий согласно гайдлайну */}
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0)']}
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
        {/* Верхний блик - более мягкий согласно гайдлайну */}
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0)']}
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
    // Внешняя тень по гайдлайну для поднятия элемента
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
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
