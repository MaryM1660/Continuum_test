import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Platform, Dimensions } from 'react-native';
import { useSharedValue, withRepeat, withTiming, interpolate, Easing } from 'react-native-reanimated';

// Условный импорт Skia только для native
let SkiaComponents: any = null;
if (Platform.OS !== 'web') {
  try {
    SkiaComponents = require('@shopify/react-native-skia');
  } catch (e) {
    console.warn('Skia not available');
  }
}
import { useTheme, useIsAppleHIG, useAppleHIGTheme } from '../theme/useTheme';
import { isAppleHIGTheme } from '../theme/migration-utils';

interface AnimatedBackgroundProps {
  style?: any;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * iOS-style живой фон с мягкими градиентами и зерном
 * 
 * Особенности:
 * - Очень медленная анимация (90+ секунд на цикл)
 * - Мягкие градиенты в стиле Apple
 * - Легкое зерно для текстуры
 * - Поддержка dark/light тем
 * - Легковесно (60fps)
 */
export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ style }) => {
  const theme = useTheme();
  const isAppleHIG = useIsAppleHIG();
  
  // Определяем, какая тема используется
  const isDark = isAppleHIG && isAppleHIGTheme(theme)
    ? theme.isDark
    : (theme as any).background === '#000000' || (theme as any).background === '#1C1C1E';
  
  // Анимационные значения для очень медленного движения
  const progress = useSharedValue(0);
  
  // Запускаем анимацию (20 секунд на полный цикл - более заметное и быстрое движение)
  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { 
        duration: 20000, // 20 секунд для более заметного движения
        easing: Easing.linear,
      }),
      -1, // бесконечное повторение
      false // без реверса
    );
  }, []);
  
  // Для native: анимационные значения для Skia
  let offsetX: any = null;
  let offsetY: any = null;
  let noiseOffset: any = null;
  
  if (Platform.OS !== 'web' && SkiaComponents) {
    offsetX = SkiaComponents.useValue(0);
    offsetY = SkiaComponents.useValue(0);
    noiseOffset = SkiaComponents.useValue(0);
    
    // Синхронизируем значения для Skia
    SkiaComponents.useSharedValueEffect(() => {
      // Более заметное движение градиента (2% экрана за цикл)
      const maxOffsetX = SCREEN_WIDTH * 0.02;
      const maxOffsetY = SCREEN_HEIGHT * 0.015;
      
      offsetX.current = interpolate(progress.value, [0, 1], [0, maxOffsetX]);
      offsetY.current = interpolate(progress.value, [0, 1], [0, maxOffsetY]);
      
      // Движение шума
      noiseOffset.current = interpolate(progress.value, [0, 1], [0, 5]);
    }, progress);
  }
  
  // Цвета для градиентов в зависимости от темы
  const getGradientColors = () => {
    if (isDark) {
      // Dark theme: deep indigo / purple / near-black
      return {
        start: '#1a1a2e',      // deep indigo-black
        middle1: '#16213e',    // dark indigo
        middle2: '#0f3460',    // deep blue-indigo
        end: '#0a0a1a',        // near-black
      };
    } else {
      // Light theme: off-white / soft blue / light blue
      return {
        start: '#f0f4f8',      // off-white with blue tint
        middle1: '#e1ecf4',    // soft blue
        middle2: '#d0e3f0',    // light blue
        end: '#b8d4e8',        // soft blue
      };
    }
  };
  
  const colors = getGradientColors();
  
  // Для web используем fallback (LinearGradient из expo-linear-gradient) с анимацией
  if (Platform.OS === 'web' || !SkiaComponents) {
    const { LinearGradient: ExpoLinearGradient } = require('expo-linear-gradient');
    const [gradientStart, setGradientStart] = React.useState({ x: 0, y: 0 });
    const [gradientEnd, setGradientEnd] = React.useState({ x: 1, y: 1 });
    
    // Обновляем позиции градиента для web
    useEffect(() => {
      const maxOffsetX = 0.02; // 2% экрана
      const maxOffsetY = 0.015; // 1.5% экрана
      
      const updateGradient = () => {
        const progressValue = progress.value;
        setGradientStart({
          x: interpolate(progressValue, [0, 1], [0, maxOffsetX]),
          y: interpolate(progressValue, [0, 1], [0, maxOffsetY]),
        });
        setGradientEnd({
          x: interpolate(progressValue, [0, 1], [1, 1 + maxOffsetX]),
          y: interpolate(progressValue, [0, 1], [1, 1 + maxOffsetY]),
        });
      };
      
      // Обновляем каждые 16ms для плавной анимации (~60fps)
      const interval = setInterval(updateGradient, 16);
      
      return () => clearInterval(interval);
    }, [progress]);
    
    return (
      <View style={[StyleSheet.absoluteFill, style]}>
        <ExpoLinearGradient
          colors={[colors.start, colors.middle1, colors.middle2, colors.end]}
          start={gradientStart}
          end={gradientEnd}
          style={StyleSheet.absoluteFill}
        />
        {/* Виньетка для dark theme */}
        {isDark && (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: 'transparent',
                // @ts-ignore - CSS для виньетки
                boxShadow: 'inset 0 0 200px 100px rgba(0, 0, 0, 0.3)',
              } as any,
            ]}
          />
        )}
        {/* Зерно для web через SVG фильтр */}
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: isDark ? 0.03 : 0.015,
              backgroundColor: 'transparent',
              // @ts-ignore - CSS для зерна
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              pointerEvents: 'none',
            } as any,
          ]}
        />
      </View>
    );
  }
  
  // Fallback для случаев, когда размеры экрана еще не определены
  const canvasWidth = SCREEN_WIDTH || 375;
  const canvasHeight = SCREEN_HEIGHT || 812;
  
  // Вычисляем позиции градиента с учетом анимации
  const { Canvas, LinearGradient, Rect, vec, useComputedValue } = SkiaComponents;
  
  const gradientStart = useComputedValue(() => {
    return vec(offsetX.current, offsetY.current);
  }, [offsetX, offsetY]);
  
  const gradientEnd = useComputedValue(() => {
    return vec(canvasWidth + offsetX.current, canvasHeight + offsetY.current);
  }, [offsetX, offsetY, canvasWidth, canvasHeight]);
  
  // Для native используем Skia
  return (
    <View style={[StyleSheet.absoluteFill, style]}>
      <Canvas style={StyleSheet.absoluteFill}>
        {/* Основной градиентный фон */}
        <Rect x={0} y={0} width={canvasWidth} height={canvasHeight}>
          <LinearGradient
            start={gradientStart}
            end={gradientEnd}
            colors={[colors.start, colors.middle1, colors.middle2, colors.end]}
            positions={[0, 0.3, 0.7, 1]}
          />
        </Rect>
        
        {/* Виньетка для dark theme (темные края) */}
        {isDark && (
          <>
            {/* Верхняя и нижняя виньетка */}
            <Rect x={0} y={0} width={canvasWidth} height={canvasHeight * 0.3}>
              <LinearGradient
                start={vec(canvasWidth / 2, 0)}
                end={vec(canvasWidth / 2, canvasHeight * 0.3)}
                colors={['rgba(0, 0, 0, 0.3)', 'transparent']}
              />
            </Rect>
            <Rect x={0} y={canvasHeight * 0.7} width={canvasWidth} height={canvasHeight * 0.3}>
              <LinearGradient
                start={vec(canvasWidth / 2, canvasHeight * 0.7)}
                end={vec(canvasWidth / 2, canvasHeight)}
                colors={['transparent', 'rgba(0, 0, 0, 0.3)']}
              />
            </Rect>
            {/* Боковые виньетки */}
            <Rect x={0} y={0} width={canvasWidth * 0.2} height={canvasHeight}>
              <LinearGradient
                start={vec(0, canvasHeight / 2)}
                end={vec(canvasWidth * 0.2, canvasHeight / 2)}
                colors={['rgba(0, 0, 0, 0.25)', 'transparent']}
              />
            </Rect>
            <Rect x={canvasWidth * 0.8} y={0} width={canvasWidth * 0.2} height={canvasHeight}>
              <LinearGradient
                start={vec(canvasWidth * 0.8, canvasHeight / 2)}
                end={vec(canvasWidth, canvasHeight / 2)}
                colors={['transparent', 'rgba(0, 0, 0, 0.25)']}
              />
            </Rect>
          </>
        )}
        
        {/* Зерно через паттерн (очень легкое) */}
        <Rect 
          x={0} 
          y={0} 
          width={canvasWidth} 
          height={canvasHeight}
          opacity={isDark ? 0.03 : 0.015}
        >
          {/* Используем простой паттерн для зерна */}
          <LinearGradient
            start={vec(0, 0)}
            end={vec(canvasWidth, canvasHeight)}
            colors={[
              'rgba(255, 255, 255, 0.01)',
              'rgba(255, 255, 255, 0.005)',
              'rgba(255, 255, 255, 0.01)',
              'rgba(255, 255, 255, 0.005)',
            ]}
            positions={[0, 0.33, 0.66, 1]}
          />
        </Rect>
      </Canvas>
    </View>
  );
};

