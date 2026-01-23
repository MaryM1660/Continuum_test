import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Animated, PanResponder, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/useTheme';
import { Text } from './typography';
import { Icon } from './icons';

interface VolumeSliderProps {
  visible: boolean;
  volume: number; // 0-1
  onClose: () => void;
  onVolumeChange?: (volume: number) => void;
}

export const VolumeSlider: React.FC<VolumeSliderProps> = ({
  visible,
  volume,
  onClose,
  onVolumeChange,
}) => {
  const theme = useTheme();
  const spacing = theme.spacing;
  const [localVolume, setLocalVolume] = useState(volume);
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      setLocalVolume(volume);
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  const opacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handleVolumeChange = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setLocalVolume(clampedVolume);
    onVolumeChange?.(clampedVolume);
  };

  const sliderWidth = 280;
  const thumbSize = 24;
  const thumbPosition = (localVolume * (sliderWidth - thumbSize));

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {},
      onPanResponderMove: (evt, gestureState) => {
        const sliderStartX = 40; // Примерная позиция начала слайдера
        const newX = Math.max(0, Math.min(sliderWidth - thumbSize, gestureState.moveX - sliderStartX));
        const newVolume = newX / (sliderWidth - thumbSize);
        handleVolumeChange(newVolume);
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ translateY }],
              opacity,
            },
          ]}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={[styles.sliderContainer, { backgroundColor: theme.surfaceElevated }]}>
              <View style={styles.header}>
                <Icon name="SpeakerWave" size={24} color={theme.text} />
                <Text variant="body" style={styles.volumeText}>
                  {Math.round(localVolume * 100)}%
                </Text>
              </View>
              
              <View style={styles.sliderWrapper} {...panResponder.panHandlers}>
                {/* Трек слайдера */}
                <View style={[styles.track, { backgroundColor: theme.border }]}>
                  <LinearGradient
                    colors={[theme.primary, theme.primaryDark]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                      styles.trackFill,
                      {
                        width: `${localVolume * 100}%`,
                      },
                    ]}
                  />
                </View>
                
                {/* Ползунок */}
                <Animated.View
                  style={[
                    styles.thumb,
                    {
                      left: thumbPosition,
                      backgroundColor: theme.primary,
                    },
                  ]}
                />
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 100,
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  sliderContainer: {
    width: 320,
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  volumeText: {
    // variant="body" уже имеет правильный размер (17pt), добавляем только fontWeight для акцента
    fontWeight: '600',
  },
  sliderWrapper: {
    height: 40,
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
  },
  track: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  trackFill: {
    height: '100%',
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});

