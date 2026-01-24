import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, View, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, useIsAppleHIG, useAppleHIGTheme, useOldTheme } from '../theme/useTheme';
import { isAppleHIGTheme } from '../theme/migration-utils';
import { Text } from './typography';

// Условный импорт BlurView - expo-blur не работает на web
// Используем функцию для lazy loading, чтобы webpack не пытался загрузить модуль на web
const getBlurView = (): any => {
  if (Platform.OS === 'web') {
    return null;
  }
  try {
    // Используем require только для native платформ - webpack не будет пытаться загрузить это на web
    // @ts-ignore - expo-blur может быть не установлен
    return require('expo-blur').BlurView;
  } catch (e) {
    return null;
  }
};

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
  let borderColor: string;
  let borderWidth: number;
  let blurRadius: string;
  let textColor: string;
  let backgroundColor: string;
  let shadowStyle: any;
  let blurIntensity: number;
  let blurTint: 'light' | 'dark';
  
  if (isAppleHIG && isAppleHIGTheme(theme)) {
    // Новая тема Apple HIG - строго по документации
    const liquidGlass = theme.materials.liquidGlass;
    const isDark = theme.isDark;
    
    // Выбираем параметры в зависимости от темы
    const opacityConfig = isDark 
      ? liquidGlass.backgroundOpacity.dark 
      : liquidGlass.backgroundOpacity.light;
    
    const colorsConfig = isDark
      ? liquidGlass.backgroundColors.dark
      : liquidGlass.backgroundColors.light;
    
    const borderConfig = isDark
      ? liquidGlass.border.dark
      : liquidGlass.border.light;
    
    // Получаем opacity для текущего варианта
    const opacity = isPrimary 
      ? opacityConfig.primary 
      : opacityConfig.secondary;
    
    // Получаем минимальный полупрозрачный фон - НЕ градиент!
    // Liquid Glass показывает размытый фон через прозрачность
    backgroundColor = isPrimary 
      ? colorsConfig.primary 
      : colorsConfig.secondary;
    
    // Граница - строго по HIG
    borderColor = borderConfig.color;
    borderWidth = borderConfig.width;
    
    // Blur - НАСТОЯЩИЙ эффект размытия фона
    blurRadius = liquidGlass.backdropFilter.blur;
    blurIntensity = isDark 
      ? liquidGlass.blurIntensity.dark 
      : liquidGlass.blurIntensity.light;
    blurTint = isDark ? 'dark' : 'light';
    
    // Цвет текста - для primary используем accent color, для secondary - text color
    textColor = isPrimary ? theme.colors.primary : theme.colors.text;
    
    // Тени из новой темы - едва заметные
    const shadow = theme.shadows.patterns.buttonLiquidGlass;
    shadowStyle = Platform.OS === 'web' 
      ? { boxShadow: shadow.boxShadow }
      : {
          shadowColor: shadow.external.shadowColor,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05, // Едва заметная тень
          shadowRadius: 2,
          elevation: 1,
        };
  } else {
    // Старая тема (обратная совместимость)
    const oldTheme = useOldTheme();
    borderColor = 'rgba(255, 255, 255, 0.18)';
    borderWidth = 1;
    blurRadius = '20px';
    backgroundColor = isPrimary
      ? 'rgba(255, 255, 255, 0.15)'
      : 'rgba(255, 255, 255, 0.12)';
    blurIntensity = 20;
    blurTint = oldTheme.background === '#FFFFFF' ? 'light' : 'dark';
    textColor = isPrimary ? oldTheme.primary : oldTheme.text;
    shadowStyle = {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05, // Едва заметная тень
      shadowRadius: 2,
      elevation: 1,
    };
  }

  // Для web ИМИТИРУЕМ эффект Liquid Glass через CSS стили (градиенты, тени, блики)
  if (Platform.OS === 'web') {
    // Определяем isDark для web версии
    const isDarkWeb = isAppleHIG && isAppleHIGTheme(theme)
      ? theme.isDark
      : (useOldTheme().background !== '#FFFFFF');
    
    // Получаем полную строку boxShadow с внутренними и внешними тенями - едва заметные
    const fullBoxShadow = isAppleHIG && isAppleHIGTheme(theme)
      ? `0 1px 2px rgba(0, 0, 0, 0.04), inset 0 1px 1px rgba(255, 255, 255, 0.1), inset 0 -1px 1px rgba(0, 0, 0, 0.05)`
      : `0 1px 2px rgba(0, 0, 0, 0.04), inset 0 1px 1px rgba(255, 255, 255, 0.1), inset 0 -1px 1px rgba(0, 0, 0, 0.05)`;
    
    // ИМИТАЦИЯ Liquid Glass через CSS стили (без backdrop-filter):
    // 1. Градиентный фон для глубины
    // 2. Множественные тени для объема
    // 3. Светлый блик сверху через LinearGradient
    // 4. Блик на границе (border highlight)
    // 5. Полупрозрачный фон
    
    // Цвета для градиента фона - более контрастные для светлой темы
    const glassColors = isDarkWeb
      ? [
          'rgba(255, 255, 255, 0.12)',
          'rgba(255, 255, 255, 0.06)',
          'rgba(0, 0, 0, 0.18)',
        ]
      : [
          // Для светлой темы используем более контрастные цвета с легким серым оттенком
          'rgba(255, 255, 255, 0.35)',
          'rgba(240, 240, 245, 0.25)',
          'rgba(255, 255, 255, 0.2)',
        ];
    
    // Цвета для блика сверху - более яркий для светлой темы
    const highlightColors = isDarkWeb
      ? ['rgba(255, 255, 255, 0.18)', 'rgba(255, 255, 255, 0)']
      : ['rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0)'];
    
    // Цвета для блика на границе (border highlight) - светлый блик по верхнему краю границы
    const borderHighlightColors = isDarkWeb
      ? ['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0)']
      : ['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0)'];
    
    // Комплексные тени для имитации глубины и размытия - едва заметные
    const complexShadows = isDarkWeb
      ? `inset 0 1px 1px rgba(255, 255, 255, 0.05), inset 0 -1px 1px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.05)`
      : `inset 0 1px 1px rgba(255, 255, 255, 0.1), inset 0 -1px 1px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)`;
    
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.9}
        style={[styles.container, { borderRadius }, style]}
      >
        {/* Основной контейнер с градиентом - БЕЗ фона, только эффекты */}
        <LinearGradient
          colors={['transparent', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius,
            borderColor,
            borderWidth,
            opacity: disabled ? 0.5 : 1,
            // Комплексные тени для объема
            boxShadow: complexShadows,
            minHeight: 48,
            width: '100%',
            height: '100%',
            paddingVertical: 16,
            paddingHorizontal: 24,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            position: 'relative',
            backgroundColor: 'transparent',
          } as any}
        >
          {/* Светлый блик сверху для имитации отражения */}
          <LinearGradient
            colors={highlightColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '40%',
              borderRadius,
              pointerEvents: 'none',
            }}
          />
          {/* Блик на границе (border highlight) - светлый блик по верхнему краю */}
          <LinearGradient
            colors={borderHighlightColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: borderWidth + 2, // Немного больше ширины границы
              borderRadius,
              pointerEvents: 'none',
              borderTopLeftRadius: borderRadius,
              borderTopRightRadius: borderRadius,
            }}
          />
          {/* Контент поверх эффекта */}
          <View style={{ position: 'relative', zIndex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
            {typeof children === 'string' ? (
              <Text 
                variant={textVariant} 
                color={isPrimary ? 'primary' : undefined}
                style={[
                  isPrimary ? undefined : { color: textColor },
                  { textAlign: 'center' }
                ]}
              >
                {children}
              </Text>
            ) : (
              <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                {children}
              </View>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  // Для native используем BlurView из expo-blur - НАСТОЯЩИЙ Liquid Glass эффект
  // Получаем BlurView только для native платформ
  const BlurView = getBlurView();
  
  // Проверяем, что BlurView доступен (только для native)
  if (!BlurView) {
    // Fallback для native, если expo-blur не доступен
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.9}
        style={[styles.container, { borderRadius }, style, shadowStyle]}
      >
        <View
          style={[
            styles.glassContainer,
            {
              borderRadius,
              borderColor,
              borderWidth,
              opacity: disabled ? 0.5 : 1,
              overflow: 'hidden',
              backgroundColor: 'transparent',
            },
          ]}
        >
          <View style={[styles.content, { borderRadius }]}>
            {typeof children === 'string' ? (
              <Text 
                variant={textVariant} 
                color={isPrimary ? 'primary' : undefined}
                style={[
                  isPrimary ? undefined : { color: textColor },
                  { textAlign: 'center' }
                ]}
              >
                {children}
              </Text>
            ) : (
              <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                {children}
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.9}
      style={[styles.container, { borderRadius }, style, shadowStyle]}
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
            backgroundColor: 'transparent',
          },
        ]}
      >
        {/* НЕТ градиентов! BlurView сам создает эффект размытия */}
        <View style={[styles.content, { borderRadius }]}>
          {typeof children === 'string' ? (
            <Text 
              variant={textVariant} 
              color={isPrimary ? 'primary' : undefined}
              style={[
                isPrimary ? undefined : { color: textColor },
                { textAlign: 'center' }
              ]}
            >
              {children}
            </Text>
          ) : (
            <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
              {children}
            </View>
          )}
        </View>
      </BlurView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // НЕ используем overflow: hidden - это может блокировать backdrop-filter!
    // Тени применяются динамически в зависимости от темы
  },
  glassContainer: {
    // НЕ используем overflow: hidden - backdrop-filter требует видимости фона за элементом!
    position: 'relative',
    minHeight: 48,
    width: '100%',
    height: '100%',
    // Liquid Glass эффект создается backdrop-filter/blur, а не градиентами!
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
