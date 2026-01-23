import React, { useEffect, useRef } from "react";
import { Platform, View, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Svg, Path as SvgPath, Defs, LinearGradient as SvgLinearGradient, RadialGradient, Stop } from "react-native-svg";
import { Theme } from "../theme/colors";

// Skia не поддерживается на веб, используем fallback
let SkiaComponents: any = null;
if (Platform.OS !== 'web') {
  try {
    SkiaComponents = require("@shopify/react-native-skia");
  } catch (e) {
    console.warn('react-native-skia not available');
  }
}

const CLOUD_SIZE = 200;
const WIDTH = CLOUD_SIZE;
const HEIGHT = CLOUD_SIZE;
const CX = WIDTH / 2;
const CY = HEIGHT / 2;

interface FeatherCloudProps {
  theme: Theme;
  isSpeaking?: boolean;
  audioLevel?: number; // 0-1 для эквалайзера
}

function makeCloudPath(time: number, radius = 70, isSpeaking = false, audioLevel = 0, PathClass: any) {
  if (!PathClass) return null;
  
  const points = 12;
  const path = new PathClass();
  
  // Увеличиваем амплитуду пульсации когда говорит
  const baseNoise = isSpeaking ? 15 : 12;
  const audioBoost = isSpeaking ? audioLevel * 8 : 0;
  
  for (let i = 0; i <= points; i++) {
    const a = (i / points) * Math.PI * 2;
    const noise =
      Math.sin(a * 3 + time * 0.0006) * (baseNoise + audioBoost) +
      Math.sin(a * 7 - time * 0.0003) * (6 + audioBoost * 0.5);

    const r = radius + noise;
    const x = CX + Math.cos(a) * r;
    const y = CY + Math.sin(a) * r * 0.7;

    if (i === 0) path.moveTo(x, y);
    else path.lineTo(x, y);
  }
  path.close();
  return path;
}

// Создаем перьевую форму с четкими краями и эффектом свечения изнутри
function createFeatherPath(centerX: number, centerY: number, width: number, height: number, rotation: number = 0): string {
  // Создаем форму пера с четкими перьевыми краями
  const w = width / 2;
  const h = height / 2;
  
  // Перьевая форма: вытянутый эллипс с неровными перьевыми краями
  const points: Array<[number, number]> = [];
  const numPoints = 20; // Больше точек для более детальной формы
  
  for (let i = 0; i <= numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    // Создаем неровные перьевые края - более выраженные
    const noise1 = Math.sin(angle * 6) * 0.2;
    const noise2 = Math.cos(angle * 4) * 0.15;
    const noise3 = Math.sin(angle * 10) * 0.08;
    const r = 1 + noise1 + noise2 + noise3;
    const x = centerX + Math.cos(angle) * w * r;
    const y = centerY + Math.sin(angle) * h * r;
    points.push([x, y]);
  }
  
  // Поворачиваем точки
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);
  const rotatedPoints = points.map(([x, y]) => {
    const dx = x - centerX;
    const dy = y - centerY;
    return [
      centerX + dx * cos - dy * sin,
      centerY + dx * sin + dy * cos,
    ];
  });
  
  // Создаем SVG path с плавными кривыми для перьевого эффекта
  let path = `M ${rotatedPoints[0][0]} ${rotatedPoints[0][1]}`;
  for (let i = 1; i < rotatedPoints.length; i++) {
    const prev = rotatedPoints[i - 1];
    const curr = rotatedPoints[i];
    const next = rotatedPoints[(i + 1) % rotatedPoints.length];
    // Используем квадратичные кривые для плавных перьевых краев
    const cpX = (curr[0] + next[0]) / 2;
    const cpY = (curr[1] + next[1]) / 2;
    path += ` Q ${curr[0]} ${curr[1]} ${cpX} ${cpY}`;
  }
  path += ' Z';
  
  return path;
}

export function FeatherCloud({ theme, isSpeaking = false, audioLevel = 0 }: FeatherCloudProps) {
  // Fallback для веб - создаем перьевое облачко с четкими краями
  if (Platform.OS === 'web' || !SkiaComponents) {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const pulseValue = useRef(new Animated.Value(1)).current;
    
    useEffect(() => {
      const colorAnimation = Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 3000, // Быстрее для более заметного переливания
          useNativeDriver: false,
        })
      );
      
      // Увеличиваем амплитуду пульсации
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: isSpeaking ? 1.25 : 1.12, // Больше амплитуда
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      );
      
      colorAnimation.start();
      pulseAnimation.start();
      
      return () => {
        colorAnimation.stop();
        pulseAnimation.stop();
      };
    }, [animatedValue, pulseValue, isSpeaking]);

    // Создаем цвета для градиента
    const primaryColor = theme.primary; // #1F7EB9
    const primaryLight = theme.primaryLight || '#4A9FD9';
    const cloudBase = theme.cloudBase || '#A8D5E2';
    const cloudGlow = theme.cloudGlow || '#7BC8E8';
    
    // Создаем перьевое облачко из множества перьевых форм с четкими краями
    const featherParts = [
      // Основные перья - крупные
      { centerX: 70, centerY: 70, width: 80, height: 60, rotation: -20, opacity: 0.85 },
      { centerX: 100, centerY: 50, width: 90, height: 70, rotation: 10, opacity: 0.9 },
      { centerX: 130, centerY: 70, width: 80, height: 60, rotation: 25, opacity: 0.85 },
      { centerX: 85, centerY: 100, width: 70, height: 50, rotation: -10, opacity: 0.8 },
      { centerX: 115, centerY: 100, width: 70, height: 50, rotation: 15, opacity: 0.8 },
      // Средние перья
      { centerX: 60, centerY: 60, width: 50, height: 35, rotation: -30, opacity: 0.75 },
      { centerX: 110, centerY: 40, width: 55, height: 40, rotation: 5, opacity: 0.8 },
      { centerX: 140, centerY: 60, width: 50, height: 35, rotation: 35, opacity: 0.75 },
      { centerX: 75, centerY: 90, width: 45, height: 30, rotation: -15, opacity: 0.7 },
      { centerX: 125, centerY: 90, width: 45, height: 30, rotation: 20, opacity: 0.7 },
      // Мелкие перьевые детали
      { centerX: 50, centerY: 55, width: 30, height: 20, rotation: -40, opacity: 0.65 },
      { centerX: 150, centerY: 55, width: 30, height: 20, rotation: 45, opacity: 0.65 },
      { centerX: 95, centerY: 85, width: 25, height: 18, rotation: 0, opacity: 0.6 },
      { centerX: 105, centerY: 85, width: 25, height: 18, rotation: 10, opacity: 0.6 },
      { centerX: 80, centerY: 75, width: 20, height: 15, rotation: -25, opacity: 0.55 },
      { centerX: 120, centerY: 75, width: 20, height: 15, rotation: 30, opacity: 0.55 },
    ];
    
    const scale = pulseValue;
    
    // Анимируем цвет свечения для эффекта Siri
    const glowColor = animatedValue.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: [primaryColor, primaryLight, cloudGlow, primaryColor, primaryLight],
    });
    
    return (
      <Animated.View 
        style={[
          styles.fallbackContainer,
          {
            transform: [{ scale }],
            // Эффект свечения как у кнопки Siri - только через CSS filter на веб (без shadow для прозрачности)
            ...(Platform.OS === 'web' && {
              filter: `drop-shadow(0 0 ${isSpeaking ? '30px' : '20px'} ${primaryColor}80) drop-shadow(0 0 ${isSpeaking ? '15px' : '10px'} ${primaryLight}60)`,
            }),
            // Для мобильных платформ используем shadow
            ...(Platform.OS !== 'web' && {
              shadowColor: primaryColor,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: isSpeaking ? 1.0 : 0.7,
              shadowRadius: isSpeaking ? 40 : 25,
              elevation: isSpeaking ? 25 : 18,
            }),
          },
        ]}
      >
        <Svg width={WIDTH} height={HEIGHT} style={[StyleSheet.absoluteFill, { backgroundColor: 'transparent' }]} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
          <Defs>
            {/* Радиальные градиенты для эффекта свечения изнутри - яркий центр, темные края */}
            <RadialGradient id="featherRadial1" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={primaryLight} stopOpacity="1.0" />
              <Stop offset="25%" stopColor={primaryColor} stopOpacity="0.95" />
              <Stop offset="50%" stopColor={cloudGlow} stopOpacity="0.8" />
              <Stop offset="75%" stopColor={primaryColor} stopOpacity="0.6" />
              <Stop offset="100%" stopColor={cloudBase} stopOpacity="0.4" />
            </RadialGradient>
            <RadialGradient id="featherRadial2" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={cloudGlow} stopOpacity="1.0" />
              <Stop offset="25%" stopColor={primaryLight} stopOpacity="0.9" />
              <Stop offset="50%" stopColor={primaryColor} stopOpacity="0.75" />
              <Stop offset="75%" stopColor={cloudGlow} stopOpacity="0.55" />
              <Stop offset="100%" stopColor={cloudBase} stopOpacity="0.35" />
            </RadialGradient>
            <RadialGradient id="featherRadial3" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={primaryColor} stopOpacity="1.0" />
              <Stop offset="25%" stopColor={cloudGlow} stopOpacity="0.9" />
              <Stop offset="50%" stopColor={cloudBase} stopOpacity="0.75" />
              <Stop offset="75%" stopColor={primaryColor} stopOpacity="0.6" />
              <Stop offset="100%" stopColor={primaryLight} stopOpacity="0.4" />
            </RadialGradient>
            {/* Линейные градиенты для дополнительного эффекта */}
            <SvgLinearGradient id="featherGrad1" x1="50%" y1="50%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={primaryLight} stopOpacity="1.0" />
              <Stop offset="30%" stopColor={primaryColor} stopOpacity="0.85" />
              <Stop offset="70%" stopColor={cloudGlow} stopOpacity="0.65" />
              <Stop offset="100%" stopColor={cloudBase} stopOpacity="0.45" />
            </SvgLinearGradient>
            <SvgLinearGradient id="featherGrad2" x1="50%" y1="50%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={cloudGlow} stopOpacity="1.0" />
              <Stop offset="30%" stopColor={primaryLight} stopOpacity="0.85" />
              <Stop offset="70%" stopColor={primaryColor} stopOpacity="0.65" />
              <Stop offset="100%" stopColor={cloudBase} stopOpacity="0.45" />
            </SvgLinearGradient>
            <SvgLinearGradient id="featherGrad3" x1="50%" y1="50%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={primaryColor} stopOpacity="1.0" />
              <Stop offset="30%" stopColor={cloudGlow} stopOpacity="0.85" />
              <Stop offset="70%" stopColor={cloudBase} stopOpacity="0.65" />
              <Stop offset="100%" stopColor={primaryLight} stopOpacity="0.45" />
            </SvgLinearGradient>
          </Defs>
          {featherParts.map((feather, index) => {
            const path = createFeatherPath(
              feather.centerX,
              feather.centerY,
              feather.width,
              feather.height,
              (feather.rotation * Math.PI) / 180
            );
            // Используем разные градиенты для разных частей для эффекта переливания
            const gradientIndex = (index + Math.floor(animatedValue.__getValue() * 4)) % 4;
            const gradientId = `featherRadial${gradientIndex + 1}`;
            
            // Базовая opacity с небольшими вариациями
            const baseOpacity = isSpeaking ? feather.opacity + 0.2 : feather.opacity;
            
            return (
              <SvgPath
                key={index}
                d={path}
                fill={`url(#${gradientId})`}
                opacity={baseOpacity}
                stroke={primaryLight}
                strokeWidth={0.5}
                strokeOpacity={0.5}
                filter="url(#glow)"
              />
            );
          })}
        </Svg>
      </Animated.View>
    );
  }

  const { Canvas, Group, Paint, Path, Blur, SweepGradient, vec, useClockValue, useComputedValue } = SkiaComponents;
  const clock = useClockValue();

  // Адаптируем цвета под тему приложения (primary: #1F7EB9)
  const primaryColor = theme.primary;
  const primaryLight = theme.primaryLight;
  const cloudBase = theme.cloudBase;
  const cloudGlow = theme.cloudGlow;
  
  const path1 = useComputedValue(
    () => makeCloudPath(clock.current, 70, isSpeaking, audioLevel, Path),
    [clock, isSpeaking, audioLevel]
  );
  const path2 = useComputedValue(
    () => makeCloudPath(clock.current + 4000, 60, isSpeaking, audioLevel, Path),
    [clock, isSpeaking, audioLevel]
  );
  const path3 = useComputedValue(
    () => makeCloudPath(clock.current + 8000, 50, isSpeaking, audioLevel, Path),
    [clock, isSpeaking, audioLevel]
  );

  return (
    <Canvas style={{ width: WIDTH, height: HEIGHT }}>
      <Group>
        {/* BACK LAYER */}
        <Group opacity={isSpeaking ? 0.3 : 0.25}>
          <Path path={path1}>
            <Paint>
              <SweepGradient
                c={vec(CX, CY)}
                colors={[primaryColor, primaryLight, cloudGlow, primaryColor]}
              />
              <Blur blur={30} />
            </Paint>
          </Path>
        </Group>

        {/* MID LAYER */}
        <Group opacity={isSpeaking ? 0.4 : 0.35}>
          <Path path={path2}>
            <Paint>
              <SweepGradient
                c={vec(CX, CY)}
                colors={[primaryLight, cloudGlow, cloudBase, primaryLight]}
              />
              <Blur blur={22} />
            </Paint>
          </Path>
        </Group>

        {/* FRONT LAYER */}
        <Group opacity={isSpeaking ? 0.5 : 0.45}>
          <Path path={path3}>
            <Paint>
              <SweepGradient
                c={vec(CX, CY)}
                colors={[cloudBase, primaryLight, cloudGlow, cloudBase]}
              />
              <Blur blur={14} />
            </Paint>
          </Path>
        </Group>
      </Group>
    </Canvas>
  );
}

const styles = StyleSheet.create({
  fallbackContainer: {
    width: WIDTH,
    height: HEIGHT,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  fallbackCloudPart: {
    position: 'absolute',
  },
});
