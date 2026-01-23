import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '../theme/colors';
import { useTheme } from '../theme/useTheme';
import { Icon } from './icons';
import { LiquidGlassButton } from './LiquidGlassButton';

interface MicButtonsProps {
  theme: Theme;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const MicButtons: React.FC<MicButtonsProps> = ({
  theme,
  isMuted,
  onToggleMute,
}) => {
  const themeContext = useTheme();
  const spacing = themeContext.spacing;
  const spacingPatterns = themeContext.spacingPatterns;

  return (
    <View style={[styles.container, { paddingVertical: spacing.lg }]}>
      {/* Основная кнопка микрофона в стиле liquid glass */}
      <LiquidGlassButton
        onPress={() => {
          console.log('🎤 [MICBUTTONS] Button clicked! Calling onToggleMute...');
          onToggleMute();
        }}
        variant="primary"
        theme={theme}
        style={styles.mainButton}
        borderRadius={44}
      >
        <View style={{ justifyContent: 'center', alignItems: 'center' }} pointerEvents="none">
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
        </View>
      </LiquidGlassButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  mainButton: {
    width: 88, // spacing['4xl'] * 1.83 (округлено до ближайшего четного)
    height: 88,
    borderRadius: 44,
  },
});

