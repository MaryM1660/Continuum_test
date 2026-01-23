import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Cloud } from '../components/Cloud';
import { MicButtons } from '../components/MicButtons';
import { useTheme } from '../theme/useTheme';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import { COACH_PHRASES, speakText } from '../services/mockVoice';
import { RootStackParamList } from '../../App';
import { ScreenContainer, Container, Stack, Section } from '../components/layout';
import { Text } from '../components/typography';
import { Icon } from '../components/icons';
import { VolumeSlider } from '../components/VolumeSlider';
import { DeviceSelector } from '../components/DeviceSelector';

type TalkScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Talk'>;

interface TalkScreenProps {
  onOpenDrawer?: () => void;
}

type OnboardingStep = 1 | 2 | 3 | 'complete';

export const TalkScreen: React.FC<TalkScreenProps> = ({ onOpenDrawer }) => {
  const theme = useTheme();
  const navigation = useNavigation<TalkScreenNavigationProp>();
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasMicPermission, setHasMicPermission] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isWaitingForUser, setIsWaitingForUser] = useState(false);
  const [volume, setVolume] = useState(0.8); // 0-1
  const [audioDevice, setAudioDevice] = useState<string>('speaker'); // 'speaker', 'headphones', 'bluetooth'
  const [inputDevice, setInputDevice] = useState<string>('phone'); // 'phone', 'headphones'
  const [outputDevice, setOutputDevice] = useState<string>('speaker'); // 'speaker', 'headphones'
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showDeviceSelector, setShowDeviceSelector] = useState(false);

  // Запрос разрешения на микрофон
  const requestMicPermission = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status === 'granted') {
        setHasMicPermission(true);
        return true;
      } else {
        Alert.alert(
          'Microphone Permission',
          'This app requires microphone access to function. Please grant permission in settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Retry', onPress: requestMicPermission },
          ]
        );
        return false;
      }
    } catch (error) {
      console.error('Error requesting mic permission:', error);
      return false;
    }
  };

  // Озвучивание текста
  const speak = async (text: string) => {
    // Останавливаем предыдущую речь, если она идет
    if (Platform.OS === 'web') {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } else {
      const Speech = require('expo-speech');
      Speech.stop();
    }
    
    setIsSpeaking(true);
    try {
      // Визуализация звука во время речи
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 0.5 + 0.3);
      }, 100);

      await speakText(text, volume);
      
      clearInterval(interval);
      setAudioLevel(0);
    } catch (error) {
      console.error('Error speaking:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  // Автоматическое отображение кнопки при загрузке экрана (без озвучивания)
  useEffect(() => {
    if (onboardingStep === 1) {
      // На первом экране просто показываем кнопку без озвучивания
      setIsWaitingForUser(true);
    }
  }, []);

  // Обработка шагов онбординга
  const handleStep1 = async () => {
    if (!isWaitingForUser) return;
    
    // Переходим на шаг 2 без озвучивания
    setOnboardingStep(2);
    setIsWaitingForUser(true); // Сразу показываем кнопку
  };

  const handleStep2 = async () => {
    if (!isWaitingForUser) return;
    
    // Переходим на шаг 3 без озвучивания
    setOnboardingStep(3);
    setIsWaitingForUser(true); // Сразу показываем кнопку микрофона
  };

  const handleStep3 = async () => {
    if (isSpeaking || !isWaitingForUser) return;
    
    setIsWaitingForUser(false);
    const granted = await requestMicPermission();
    if (granted) {
      setOnboardingStep('complete');
      setIsMuted(false); // Разблокируем микрофон после получения разрешения
      // Переход к основному экрану с озвучиванием
      setTimeout(() => {
        handleMainScreenWelcome();
      }, 500);
    } else {
      setIsWaitingForUser(true); // Если разрешение не получено, остаемся на шаге 3
    }
  };

  const handleMainScreenWelcome = async () => {
    await speak(COACH_PHRASES.main.welcome);
    await speak(COACH_PHRASES.main.chooseOption);
    setIsWaitingForUser(true);
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Обработка изменения громкости
  const handleSoundLevel = () => {
    setShowVolumeSlider(true);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  // Обработка выбора аудио устройства
  const handleMicSelect = () => {
    setShowDeviceSelector(true);
  };

  const handleInputDeviceSelect = (deviceId: string) => {
    setInputDevice(deviceId);
  };

  const handleOutputDeviceSelect = (deviceId: string) => {
    setOutputDevice(deviceId);
  };

  const handleOption1 = async () => {
    if (isSpeaking || !isWaitingForUser) return;
    
    setIsWaitingForUser(false);
    await speak("Great! Let's follow the coach's plan. I'll guide you through a structured conversation about your career.");
    setIsWaitingForUser(true);
  };

  const handleOption2 = async () => {
    if (isSpeaking || !isWaitingForUser) return;
    
    setIsWaitingForUser(false);
    await speak("Perfect! Let's discuss your topic or document. What would you like to talk about?");
    setIsWaitingForUser(true);
  };

  const renderOnboardingContent = () => {
    switch (onboardingStep) {
      case 1:
        return (
          <Container>
            <Stack gap={theme.spacing['2xl']} align="center">
              <Text variant="bodyLarge" align="center" style={{ maxWidth: '90%' }}>
                {COACH_PHRASES.onboarding.step1}
              </Text>
              {isWaitingForUser && (
                <TouchableOpacity
                  onPress={handleStep1}
                  disabled={isSpeaking}
                  style={[
                    styles.button,
                    { 
                      backgroundColor: theme.primary,
                      opacity: isSpeaking ? 0.5 : 1,
                    }
                  ]}
                >
                  <Text variant="buttonLarge" style={{ color: theme.primaryContrast }}>
                    Hi
                  </Text>
                </TouchableOpacity>
              )}
            </Stack>
          </Container>
        );
      case 2:
        return (
          <Container>
            <Stack gap={theme.spacing['2xl']} align="center">
              <Text variant="bodyLarge" align="center" style={{ maxWidth: '90%' }}>
                {COACH_PHRASES.onboarding.step2}
              </Text>
              {isWaitingForUser && (
                <TouchableOpacity
                  onPress={handleStep2}
                  disabled={isSpeaking}
                  style={[
                    styles.button,
                    { 
                      backgroundColor: theme.primary,
                      opacity: isSpeaking ? 0.5 : 1,
                    }
                  ]}
                >
                  <Text variant="buttonLarge" style={{ color: theme.primaryContrast }}>
                    Ok
                  </Text>
                </TouchableOpacity>
              )}
            </Stack>
          </Container>
        );
      case 3:
        return (
          <Container>
            <Stack gap={theme.spacing['2xl']} align="center">
              <Text variant="bodyLarge" align="center" style={{ maxWidth: '90%' }}>
                {COACH_PHRASES.onboarding.step3}
              </Text>
              {isWaitingForUser && (
                <MicButtons
                  theme={theme}
                  isMuted={false}
                  onToggleMute={handleStep3}
                  onMicSelect={handleMicSelect}
                  onSoundLevel={handleSoundLevel}
                />
              )}
            </Stack>
          </Container>
        );
      default:
        return null;
    }
  };

  const renderMainContent = () => {
    if (onboardingStep !== 'complete') return null;

    return (
      <Container>
        <Stack gap={theme.spacing['2xl']} align="center">
          {/* Показываем текст только после озвучивания */}
          {isWaitingForUser && (
            <Section marginTop="none">
              <Stack gap={theme.spacing.base} align="center">
                <Text variant="bodyLarge" align="center" style={{ maxWidth: '90%' }}>
                  {COACH_PHRASES.main.welcome}
                </Text>
                <Text variant="bodyLarge" align="center" style={{ maxWidth: '90%' }}>
                  {COACH_PHRASES.main.chooseOption}
                </Text>
              </Stack>
            </Section>
          )}
          
          <Section marginTop="none">
            {isWaitingForUser && (
              <Stack gap={theme.spacing.base} align="stretch">
                <TouchableOpacity
                  onPress={handleOption1}
                  disabled={isSpeaking}
                  style={[
                    styles.optionButton,
                    { 
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                      opacity: isSpeaking ? 0.5 : 1,
                    }
                  ]}
                >
                  <Text variant="body" align="center">
                    {COACH_PHRASES.main.option1}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleOption2}
                  disabled={isSpeaking}
                  style={[
                    styles.optionButton,
                    { 
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                      opacity: isSpeaking ? 0.5 : 1,
                    }
                  ]}
                >
                  <Text variant="body" align="center">
                    {COACH_PHRASES.main.option2}
                  </Text>
                </TouchableOpacity>
              </Stack>
            )}
          </Section>

          <Section marginTop="none">
            <MicButtons
              theme={theme}
              isMuted={isMuted}
              onToggleMute={handleToggleMute}
              onMicSelect={handleMicSelect}
              onSoundLevel={handleSoundLevel}
            />
          </Section>
        </Stack>
      </Container>
    );
  };

  return (
    <ScreenContainer>
      <StatusBar style={theme.background === '#FFFFFF' ? 'dark' : 'light'} />
      
      {/* Кнопка меню (drawer) */}
      {onboardingStep === 'complete' && (
        <TouchableOpacity
          onPress={() => onOpenDrawer?.()}
          style={[styles.menuButton, { backgroundColor: theme.surface }]}
        >
          <Icon name="Bars3" size={28} />
        </TouchableOpacity>
      )}
      
      {/* Облако - фиксированное в верхней части */}
      <View style={[styles.cloudContainer, { backgroundColor: 'transparent' }]}>
        <Cloud
          theme={theme}
          isSpeaking={isSpeaking}
          audioLevel={audioLevel}
        />
      </View>

      {/* Контент - с правильными отступами снизу */}
      <View style={styles.contentWrapper}>
        {onboardingStep !== 'complete' ? renderOnboardingContent() : renderMainContent()}
      </View>

      {/* Слайдер громкости */}
      <VolumeSlider
        visible={showVolumeSlider}
        volume={volume}
        onClose={() => setShowVolumeSlider(false)}
        onVolumeChange={handleVolumeChange}
      />

      {/* Селектор устройств */}
      <DeviceSelector
        visible={showDeviceSelector}
        selectedInputDevice={inputDevice}
        selectedOutputDevice={outputDevice}
        onClose={() => setShowDeviceSelector(false)}
        onInputDeviceSelect={handleInputDeviceSelect}
        onOutputDeviceSelect={handleOutputDeviceSelect}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    position: 'absolute',
    top: 50, // spacing['2xl'] + spacing.lg
    left: 20, // spacing.lg
    width: 48, // spacing['4xl']
    height: 48, // spacing['4xl']
    borderRadius: 24, // spacing['4xl'] / 2
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, // spacing.xs
    shadowOpacity: 0.15,
    shadowRadius: 8, // spacing.sm
    elevation: 8,
  },
  cloudContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    backgroundColor: 'transparent',
    overflow: 'visible', // Чтобы облачко не обрезалось
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 40, // spacing['3xl']
    zIndex: 2,
    paddingTop: '50%', // Отступ сверху, чтобы контент не налезал на облако
  },
  bodyText: {
    // Используем типографику из theme
    textAlign: 'center',
    maxWidth: '90%',
  },
  button: {
    paddingHorizontal: 40, // spacing['3xl']
    paddingVertical: 18, // spacing.lg - spacing.xs
    borderRadius: 28, // spacing['2xl'] - spacing.xs
    minWidth: 140,
    alignItems: 'center',
    shadowColor: '#1F7EB9',
    shadowOffset: { width: 0, height: 4 }, // spacing.xs
    shadowOpacity: 0.3,
    shadowRadius: 8, // spacing.sm
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    // Используем типографику из theme
  },
  optionButton: {
    padding: 24, // spacing.xl
    borderRadius: 16, // spacing.base
    borderWidth: 1.5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, // spacing.xs / 2
    shadowOpacity: 0.1,
    shadowRadius: 4, // spacing.xs
    elevation: 3,
  },
  optionText: {
    // Используем типографику из theme
  },
});

