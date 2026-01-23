import React, { useMemo } from "react";
import { Platform, useWindowDimensions, StyleSheet, View } from "react-native";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { useSharedValue, withSpring, useAnimatedStyle } from "react-native-reanimated";
import Animated from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Theme } from "../theme/colors";

// Skia не поддерживается на веб, используем fallback
let SkiaComponents: any = null;
let SkiaGestureComponents: any = null;
let Touchable: any = null;
let useGestureHandler: any = null;

if (Platform.OS !== 'web') {
  try {
    SkiaComponents = require("@shopify/react-native-skia");
    SkiaGestureComponents = require("react-native-skia-gesture");
    Touchable = SkiaGestureComponents.default || SkiaGestureComponents;
    useGestureHandler = SkiaGestureComponents.useGestureHandler;
  } catch (e) {
    console.warn('react-native-skia or react-native-skia-gesture not available');
  }
}

const BASE_R = 44;

// мягче, чем 60/-30
const SOFT_THRESHOLD = { mul: 26, bias: -12 };

interface FeatherCloudProps {
  theme: Theme;
  isSpeaking?: boolean; // Пульсация только на голос коуча
}

function FeatherCloudComponent({ theme, isSpeaking = false }: FeatherCloudProps) {
  const { width, height } = useWindowDimensions();

  // Центр облака - используем центр контейнера
  const cx0 = width / 2;
  const cy0 = height * 0.28;

  const cx = useSharedValue(cx0);
  const cy = useSharedValue(cy0);

  const context = useSharedValue({ x: 0, y: 0 });

  // Fallback для веб - простое облако
  if (Platform.OS === 'web' || !SkiaComponents || !useGestureHandler) {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(0.8);
    
    React.useEffect(() => {
      if (isSpeaking) {
        scale.value = withSpring(1.2);
        opacity.value = withSpring(1);
      } else {
        scale.value = withSpring(1.1);
        opacity.value = withSpring(0.9);
      }
    }, [isSpeaking]);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
      };
    });

    const primaryColor = theme.primary;
    const primaryLight = theme.primaryLight || '#4A9FD9';
    const cloudBase = theme.cloudBase || '#A8D5E2';
    const cloudGlow = theme.cloudGlow || '#7BC8E8';
    const accentColor = theme.accent || '#FFB200';

    const gradientColors = isSpeaking
      ? [primaryLight, primaryColor, cloudGlow, accentColor, primaryLight]
      : [primaryColor, primaryLight, cloudBase, cloudGlow, primaryColor];

    const ballSize = isSpeaking ? 200 : 180;

    return (
      <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center' }]}>
        <Animated.View style={[animatedStyle, { position: 'absolute', top: cy0 - ballSize / 2, left: cx0 - ballSize / 2 }]}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: ballSize,
              height: ballSize,
              borderRadius: ballSize / 2,
            }}
          />
        </Animated.View>
      </View>
    );
  }

  const gestureHandler = useGestureHandler({
    onStart: () => {
      "worklet";
      context.value = { x: cx.value, y: cy.value };
    },
    onActive: ({ translationX, translationY }) => {
      "worklet";
      cx.value = translationX + context.value.x;
      cy.value = translationY + context.value.y;
    },
    onEnd: () => {
      "worklet";
      cx.value = withSpring(cx0);
      cy.value = withSpring(cy0);
    },
  });

  // "скелет" облака: несколько пухов вдоль капсулы
  const puffs = useMemo(() => {
    const baseRadius = isSpeaking ? BASE_R * 1.1 : BASE_R;
    return [
      { dx: -120, dy: 0, r: baseRadius * 1.05 },
      { dx: -70, dy: -18, r: baseRadius * 1.15 },
      { dx: -20, dy: 10, r: baseRadius * 1.25 },
      { dx: 35, dy: -12, r: baseRadius * 1.18 },
      { dx: 90, dy: 14, r: baseRadius * 1.05 },
      { dx: 140, dy: -6, r: baseRadius * 0.95 },
    ];
  }, [isSpeaking]);

  // "перья" по краю
  const feathers = useMemo(() => {
    const pts: { dx: number; dy: number; r: number }[] = [];

    for (let i = 0; i < 18; i++) {
      const t = i / 17;
      const dx = -150 + t * 300;
      const dy = -55 + Math.sin(t * Math.PI * 2) * 10;
      pts.push({ dx, dy, r: 10 + (i % 3) * 2 });
    }

    for (let i = 0; i < 16; i++) {
      const t = i / 15;
      const dx = -140 + t * 280;
      const dy = 55 + Math.cos(t * Math.PI * 2) * 8;
      pts.push({ dx, dy, r: 9 + (i % 4) * 2 });
    }

    pts.push({ dx: -175, dy: -10, r: 12 });
    pts.push({ dx: -185, dy: 18, r: 10 });
    pts.push({ dx: 175, dy: 5, r: 12 });
    pts.push({ dx: 190, dy: -15, r: 10 });

    return pts;
  }, []);

  const { Blur, Circle, ColorMatrix, Group, Mask, Rect, SweepGradient, vec } = SkiaComponents;

  const metaballLayer = useMemo(() => {
    return (
      <>
        <Blur blur={24} />
        <ColorMatrix
          matrix={[
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, SOFT_THRESHOLD.mul, SOFT_THRESHOLD.bias,
          ]}
        />
      </>
    );
  }, []);

  // Адаптируем цвета под тему приложения
  const primaryColor = theme.primary; // #1F7EB9
  const primaryLight = theme.primaryLight || '#4A9FD9';
  const cloudBase = theme.cloudBase || '#A8D5E2';
  const cloudGlow = theme.cloudGlow || '#7BC8E8';
  const accentColor = theme.accent || '#FFB200';

  // Цвета для градиента - используем цвета темы
  const gradientColors = isSpeaking 
    ? [primaryLight, primaryColor, cloudGlow, accentColor, primaryLight]
    : [primaryColor, primaryLight, cloudBase, cloudGlow, primaryColor];

  const maskFixed = (
    <Group layer={metaballLayer}>
      <Touchable.Circle {...gestureHandler} cx={cx} cy={cy} r={1} color="white" />

      {/* основная группа облака */}
      <Group transform={[{ translateX: cx }, { translateY: cy }]}>
        {puffs.map((p, i) => (
          <Circle key={`p${i}`} cx={p.dx} cy={p.dy} r={p.r} color="white" />
        ))}
        {feathers.map((p, i) => (
          <Circle key={`f${i}`} cx={p.dx} cy={p.dy} r={p.r} color="white" />
        ))}
      </Group>
    </Group>
  );

  return (
    <Touchable.Canvas style={StyleSheet.absoluteFill}>
      {/* фон прозрачный - используем background из темы через родительский контейнер */}
      <Rect x={0} y={0} width={width} height={height} color="transparent" />

      {/* маска → заливка */}
      <Mask mask={maskFixed}>
        <Rect x={0} y={0} width={width} height={height}>
          <SweepGradient
            c={vec(width / 2, height / 2)}
            colors={gradientColors}
          />
        </Rect>
      </Mask>
    </Touchable.Canvas>
  );
}

// Экспортируем с gestureHandlerRootHOC только для нативных платформ
export const FeatherCloud = Platform.OS === 'web' 
  ? FeatherCloudComponent 
  : gestureHandlerRootHOC(FeatherCloudComponent);
