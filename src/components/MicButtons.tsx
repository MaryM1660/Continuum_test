import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, useIsAppleHIG, useAppleHIGTheme, useOldTheme } from '../theme/useTheme';
import { isAppleHIGTheme } from '../theme/migration-utils';
import { Icon } from './icons';
import { LiquidGlassButton } from './LiquidGlassButton';
import { MicrophoneSelector } from './MicrophoneSelector';

interface MicButtonsProps {
  isMuted: boolean;
  onToggleMute: () => void;
}

export const MicButtons: React.FC<MicButtonsProps> = ({
  isMuted,
  onToggleMute,
}) => {
  const theme = useTheme();
  const isAppleHIG = useIsAppleHIG();
  
  // Получаем spacing в зависимости от темы
  let spacing: any;
  if (isAppleHIG && isAppleHIGTheme(theme)) {
    spacing = theme.spacing;
  } else {
    const oldTheme = useOldTheme();
    spacing = oldTheme.spacing;
  }
  
  // Получаем primary цвет в зависимости от темы
  let primaryColor: string;
  if (isAppleHIG && isAppleHIGTheme(theme)) {
    primaryColor = theme.colors.primary;
  } else {
    const oldTheme = useOldTheme();
    primaryColor = oldTheme.primary;
  }

  return (
    <View style={[styles.container, { paddingVertical: spacing.lg }]}>
      <View style={styles.buttonsRow}>
        {/* Кнопка выбора микрофона слева */}
        <MicrophoneSelector
          onDeviceSelect={(deviceId) => {
            console.log('🎤 [MICBUTTONS] Device selected:', deviceId);
          }}
        />
        
        {/* Основная кнопка микрофона в стиле liquid glass */}
        <LiquidGlassButton
          onPress={() => {
            console.log('🎤 [MICBUTTONS] Button clicked! Calling onToggleMute...');
            onToggleMute();
          }}
          variant="primary"
          style={styles.mainButton}
          borderRadius={44}
        >
          <View style={{ justifyContent: 'center', alignItems: 'center' }} pointerEvents="none">
            {isMuted ? (
              <View style={{ position: 'relative', width: 36, height: 36, justifyContent: 'center', alignItems: 'center' }} pointerEvents="none">
                <Icon name="Microphone" size={36} color={primaryColor} />
                <View
                  pointerEvents="none"
                  style={{ position: 'absolute', width: 40, height: 2, backgroundColor: primaryColor, transform: [{ rotate: '45deg' }] }}
                />
              </View>
            ) : (
              <Icon name="Microphone" size={36} color={primaryColor} />
            )}
          </View>
        </LiquidGlassButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16, // spacing.base
  },
  mainButton: {
    width: 88, // spacing['4xl'] * 1.83 (округлено до ближайшего четного)
    height: 88,
    borderRadius: 44,
  },
});

