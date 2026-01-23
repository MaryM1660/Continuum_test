import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../theme/colors';
import { useTheme } from '../theme/useTheme';
import { Icon } from './icons';

interface MicButtonsProps {
  theme: Theme;
  isMuted: boolean;
  onToggleMute: () => void;
  onMicSelect?: () => void;
  onSoundLevel?: () => void;
}

export const MicButtons: React.FC<MicButtonsProps> = ({
  theme,
  isMuted,
  onToggleMute,
  onMicSelect,
  onSoundLevel,
}) => {
  const themeContext = useTheme();
  const spacing = themeContext.spacing;
  const spacingPatterns = themeContext.spacingPatterns;

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
        
        {/* Основная кнопка микрофона */}
        <TouchableOpacity onPress={onToggleMute} style={styles.mainButton}>
          <LinearGradient
            colors={isMuted ? ['#718096', '#4A5568'] : [theme.primary, theme.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.mainButtonGradient}
          >
            {isMuted ? (
              <View style={{ position: 'relative', width: 36, height: 36, justifyContent: 'center', alignItems: 'center' }}>
                <Icon name="Microphone" size={36} color="#FFFFFF" />
                <View style={{ position: 'absolute', width: 40, height: 2, backgroundColor: '#FFFFFF', transform: [{ rotate: '45deg' }] }} />
              </View>
            ) : (
              <Icon name="Microphone" size={36} color="#FFFFFF" />
            )}
          </LinearGradient>
        </TouchableOpacity>
        
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
    overflow: 'hidden',
    shadowColor: '#1F7EB9',
    shadowOffset: { width: 0, height: 6 }, // spacing.md / 2
    shadowOpacity: 0.4,
    shadowRadius: 12, // spacing.md
    elevation: 12,
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

