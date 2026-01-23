import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../theme/colors';
import { useTheme } from '../theme/useTheme';
import { Icon } from './icons';

interface MicButtonsProps {
  theme: Theme;
  isMuted: boolean;
  isRecording?: boolean; // Индикация голоса пользователя
  audioLevel?: number; // Уровень звука пользователя (0-1)
  onToggleMute: () => void;
  onMicSelect?: () => void;
  onSoundLevel?: () => void;
}

export const MicButtons: React.FC<MicButtonsProps> = ({
  theme,
  isMuted,
  isRecording = false,
  audioLevel = 0,
  onToggleMute,
  onMicSelect,
  onSoundLevel,
}) => {
  const themeContext = useTheme();
  const spacing = themeContext.spacing;
  const spacingPatterns = themeContext.spacingPatterns;
  
  // Анимация пульсации для кнопки микрофона при записи
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    if (isRecording && !isMuted && audioLevel > 0) {
      // Пульсация в зависимости от уровня звука
      const targetScale = 1 + (audioLevel * 0.15); // От 1.0 до 1.15
      const targetOpacity = 0.7 + (audioLevel * 0.3); // От 0.7 до 1.0
      
      Animated.parallel([
        Animated.spring(pulseScale, {
          toValue: targetScale,
          useNativeDriver: true,
          tension: 50,
          friction: 3,
        }),
        Animated.timing(pulseOpacity, {
          toValue: targetOpacity,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Возвращаем к нормальному состоянию
      Animated.parallel([
        Animated.spring(pulseScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 3,
        }),
        Animated.timing(pulseOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isRecording, isMuted, audioLevel]);

  return (
    <View style={[styles.container, { paddingVertical: spacing.lg }]}>
      {/* Горизонтальная компоновка: вторичные кнопки слева, основной микрофон в центре, вторичные справа */}
      <View style={[styles.horizontalLayout, { gap: spacing.base }]}>
        {/* Вторичная кнопка слева - выбор устройства */}
        <TouchableOpacity 
          onPress={onMicSelect || (() => {})} 
          style={styles.secondaryButton}
          disabled={!onMicSelect}
        >
          <Icon name="AdjustmentsHorizontal" size={24} color={theme.textSecondary} />
        </TouchableOpacity>
        
        {/* Основная кнопка микрофона с пульсацией */}
        <Animated.View
          style={[
            styles.mainButton,
            {
              transform: [{ scale: pulseScale }],
              opacity: pulseOpacity,
            },
          ]}
        >
          <TouchableOpacity 
            onPress={() => {
              console.log('🎤 [MICBUTTONS] Button clicked! Calling onToggleMute...');
              onToggleMute();
            }} 
            style={styles.mainButtonTouchable}
          >
            <LinearGradient
              colors={isMuted ? ['#718096', '#4A5568'] : [theme.primary, theme.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.mainButtonGradient}
            >
              {isMuted ? (
                <View style={{ position: 'relative', width: 36, height: 36, justifyContent: 'center', alignItems: 'center' }} pointerEvents="none">
                  <Icon name="Microphone" size={36} color="#FFFFFF" />
                  <View
                    pointerEvents="none"
                    style={{ position: 'absolute', width: 40, height: 2, backgroundColor: '#FFFFFF', transform: [{ rotate: '45deg' }] }}
                  />
                </View>
              ) : (
                <Icon name="Microphone" size={36} color="#FFFFFF" />
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
        
        {/* Вторичная кнопка справа - громкость */}
        <TouchableOpacity 
          onPress={onSoundLevel || (() => {})} 
          style={styles.secondaryButton}
          disabled={!onSoundLevel}
        >
          <Icon name="SpeakerWave" size={24} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  horizontalLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainButton: {
    width: 88, // spacing['4xl'] * 1.83 (округлено до ближайшего четного)
    height: 88,
    borderRadius: 44,
    shadowColor: '#1F7EB9',
    shadowOffset: { width: 0, height: 6 }, // spacing.md / 2
    shadowOpacity: 0.4,
    shadowRadius: 12, // spacing.md
    elevation: 12,
  },
  mainButtonTouchable: {
    width: '100%',
    height: '100%',
    borderRadius: 44,
    overflow: 'hidden',
  },
  mainButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButton: {
    width: 48, // spacing['3xl']
    height: 48,
    borderRadius: 24,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.7,
  },
});

