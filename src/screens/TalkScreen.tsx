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
import { microphoneService } from '../services/microphone';
import { voiceRecognitionService } from '../services/voiceRecognition';
import { llmService } from '../services/llmService';
import { voiceEmulator } from '../services/voiceEmulator';
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
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [isProcessingLLM, setIsProcessingLLM] = useState(false);
  const wasMutedBeforeProcessing = React.useRef<boolean>(false);

  // Запрос разрешения на микрофон
  const requestMicPermission = async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'web') {
        // На веб используем Web API
        try {
          const granted = await microphoneService.requestPermission();
          if (granted) {
            setHasMicPermission(true);
            console.log('Microphone permission granted');
            return true;
          } else {
            console.warn('Microphone permission denied by user');
            // На веб все равно продолжаем, но без доступа к микрофону
            setHasMicPermission(false);
            return true; // Разрешаем продолжение даже без разрешения
          }
        } catch (error) {
          console.error('Error requesting mic permission:', error);
          // На веб продолжаем даже при ошибке
          setHasMicPermission(false);
          return true;
        }
      } else {
        // На мобильных используем expo-av
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
      }
    } catch (error) {
      console.error('Error requesting mic permission:', error);
      // На веб продолжаем даже при ошибке
      if (Platform.OS === 'web') {
        setHasMicPermission(false);
        return true;
      }
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

  // Cleanup при размонтировании
  useEffect(() => {
    return () => {
      if (Platform.OS === 'web') {
        microphoneService.stopRecording();
        voiceRecognitionService.stopListening();
      }
    };
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
    
    console.log('handleStep3 called');
    setIsWaitingForUser(false);
    
    try {
      // Запрашиваем реальное разрешение на микрофон
      const granted = await requestMicPermission();
      console.log('Microphone permission result:', granted);
      
      // Всегда переходим на главный экран (на веб даже без разрешения)
      setOnboardingStep('complete');
      setIsMuted(false);
      
      // Инициализируем LLM
      try {
        llmService.resetConversation();
      } catch (error) {
        console.warn('Error initializing LLM:', error);
      }
      
      // Переход к основному экрану с озвучиванием
      setTimeout(() => {
        console.log('Calling handleMainScreenWelcome');
        handleMainScreenWelcome();
      }, 300);
    } catch (error) {
      console.error('Error in handleStep3:', error);
      // В случае ошибки все равно переходим на главный экран
      setOnboardingStep('complete');
      setIsMuted(false);
      setIsWaitingForUser(true);
      setTimeout(() => {
        handleMainScreenWelcome();
      }, 300);
    }
  };

  const handleMainScreenWelcome = async () => {
    console.log('handleMainScreenWelcome called');
    try {
      // Всегда показываем контент СРАЗУ, даже если речь не работает
      setIsWaitingForUser(true);
      console.log('UI should be visible now');
      
      // Пытаемся озвучить, но не блокируем UI если это не работает
      // Запускаем асинхронно, не ждем
      (async () => {
        try {
          await speak(COACH_PHRASES.main.welcome);
          await speak(COACH_PHRASES.main.chooseOption);
        } catch (error) {
          console.warn('Speech error in welcome:', error);
          // UI уже показан, продолжаем работу
        }
      })();
    } catch (error) {
      console.error('Error in handleMainScreenWelcome:', error);
      // В любом случае показываем UI
      setIsWaitingForUser(true);
    }
  };

  const handleToggleMute = async () => {
    console.log('handleToggleMute called, current isMuted:', isMuted);
    const newMutedState = !isMuted;
    console.log('newMutedState:', newMutedState);
    
    if (Platform.OS === 'web') {
      if (newMutedState) {
        // Останавливаем запись и распознавание
        console.log('Stopping recording and recognition');
        microphoneService.stopRecording();
        voiceRecognitionService.stopListening();
        voiceEmulator.stopEmulation();
        setIsRecording(false);
        setRecognizedText('');
        setIsMuted(true);
      } else {
        // Запрашиваем разрешение, если еще не получено
        if (!hasMicPermission) {
          console.log('Requesting microphone permission');
          const granted = await requestMicPermission();
          if (!granted) {
            Alert.alert(
              'Microphone Required',
              'Please allow microphone access to use voice features.',
              [{ text: 'OK' }]
            );
            return;
          }
        }
        
        console.log('Starting recording and recognition');
        
        // Для тестирования: можно использовать эмулятор (установите true)
        const USE_EMULATOR = true; // ВРЕМЕННО true для тестирования, в production false
        
        if (USE_EMULATOR) {
          // Используем эмулятор для тестирования без микрофона
          console.log('Using voice emulator for testing');
          setIsRecording(true);
          setIsMuted(false);
          voiceEmulator.startEmulation((text, isFinal) => {
            console.log('Emulator text:', text, 'isFinal:', isFinal);
            setRecognizedText(text);
            // При финальном результате отправляем в LLM
            if (isFinal && text.trim()) {
              setTimeout(() => {
                handleUserSpeech(text);
              }, 500);
            }
          });
          return;
        }
        
        // Начинаем запись и распознавание
        const micStarted = await microphoneService.startRecording((level) => {
          setAudioLevel(level);
        });

        if (micStarted && voiceRecognitionService.isAvailable()) {
          const recognitionStarted = await voiceRecognitionService.startListening(
            (result) => {
              console.log('Recognition result:', result);
              setRecognizedText(result.text);
              // При финальном результате сразу отправляем (через короткую паузу)
              if (result.isFinal && result.text.trim()) {
                console.log('Final result received, will send to LLM:', result.text);
                // Небольшая задержка перед отправкой
                setTimeout(() => {
                  handleUserSpeech(result.text);
                }, 500);
              }
            },
            (error) => {
              console.error('Voice recognition error:', error);
              setIsRecording(false);
              // При ошибке пытаемся перезапустить
              if (error.message.includes('no-speech') || error.message.includes('aborted')) {
                console.log('Recognition error, will retry...');
                setTimeout(() => {
                  if (!isMuted && hasMicPermission) {
                    voiceRecognitionService.startListening(
                      (result) => {
                        setRecognizedText(result.text);
                        if (result.isFinal && result.text.trim()) {
                          setTimeout(() => {
                            handleUserSpeech(result.text);
                          }, 500);
                        }
                      },
                      (err) => console.error('Retry error:', err),
                      undefined,
                      2000
                    );
                  }
                }, 1000);
              }
            },
            // Callback при паузе (fallback, если финальный результат не пришел)
            (finalText: string) => {
              console.log('Silence callback triggered, final text:', finalText);
              if (finalText.trim()) {
                handleUserSpeech(finalText);
              }
            },
            2000 // 2 секунды тишины (fallback)
          );
          
          if (recognitionStarted) {
            setIsRecording(true);
            setIsMuted(false);
            console.log('Recording and recognition started');
          } else {
            microphoneService.stopRecording();
            Alert.alert('Error', 'Could not start voice recognition. Please try again.');
          }
        } else {
          if (!micStarted) {
            Alert.alert('Error', 'Could not access microphone. Please check permissions.');
          } else if (!voiceRecognitionService.isAvailable()) {
            Alert.alert('Not Supported', 'Voice recognition is not available in your browser. Please use Chrome or Edge.');
          }
        }
      }
    } else {
      // На мобильных просто переключаем состояние
      setIsMuted(newMutedState);
    }
  };

  const handleUserSpeech = async (text: string) => {
    if (isProcessingLLM || !text.trim()) {
      console.log('Skipping speech processing:', { isProcessingLLM, text: text.trim() });
      return;
    }

    console.log('Processing user speech:', text);
    
    // Сохраняем состояние микрофона перед обработкой
    wasMutedBeforeProcessing.current = isMuted;
    
    // Останавливаем запись во время обработки
    if (Platform.OS === 'web') {
      microphoneService.stopRecording();
      voiceRecognitionService.stopListening();
      setIsRecording(false);
    }

    setIsProcessingLLM(true);
    setRecognizedText('');

    try {
      // Отправляем в LLM
      const response = await llmService.chat(text);
      console.log('LLM response:', response);

      if (response.text) {
        // Озвучиваем ответ с текущей громкостью
        await speak(response.text);
      } else {
        await speak("I'm sorry, I didn't get a response. Could you try again?");
      }
    } catch (error) {
      console.error('Error processing speech:', error);
      await speak("I'm sorry, I didn't catch that. Could you repeat?");
    } finally {
      setIsProcessingLLM(false);
      // После ответа автоматически возобновляем запись (если микрофон был включен)
      if (Platform.OS === 'web' && hasMicPermission && !wasMutedBeforeProcessing.current) {
        // Проверяем, был ли микрофон включен до обработки
        // Если был включен, возобновляем запись после небольшой задержки
        setTimeout(async () => {
          console.log('Resuming recording after response');
          // Перезапускаем запись и распознавание
          const micStarted = await microphoneService.startRecording((level) => {
            setAudioLevel(level);
          });

          if (micStarted && voiceRecognitionService.isAvailable()) {
            const recognitionStarted = await voiceRecognitionService.startListening(
              (result) => {
                setRecognizedText(result.text);
              },
              (error) => {
                console.error('Voice recognition error:', error);
                setIsRecording(false);
              },
              (finalText: string) => {
                if (finalText.trim()) {
                  handleUserSpeech(finalText);
                }
              },
              3000
            );
            
            if (recognitionStarted) {
              setIsRecording(true);
            }
          }
        }, 1500); // Даем время на завершение речи
      }
    }
  };

  // Обработка изменения громкости
  const handleSoundLevel = () => {
    setShowVolumeSlider(true);
  };

  const handleVolumeChange = (newVolume: number) => {
    console.log('Volume changed to:', newVolume);
    setVolume(newVolume);
    // Громкость будет применена при следующем speak()
    // Можно также применить к текущей речи, если она идет
    if (Platform.OS === 'web' && 'speechSynthesis' in window && isSpeaking) {
      // Останавливаем текущую речь и перезапускаем с новой громкостью
      // (в реальности это сложно, поэтому просто применяем к следующей)
    }
  };

  // Обработка выбора аудио устройства
  const handleMicSelect = () => {
    if (Platform.OS === 'web') {
      // На веб выбор устройств ограничен браузером
      // Показываем информативное сообщение
      Alert.alert(
        'Device Selection',
        'On web, audio devices are managed by your browser. To change devices:\n\n' +
        '1. Click the lock icon in your browser address bar\n' +
        '2. Go to Site Settings\n' +
        '3. Change microphone and speaker settings\n\n' +
        'Or use your system settings to set default devices.',
        [{ text: 'OK' }]
      );
    } else {
      setShowDeviceSelector(true);
    }
  };

  const handleInputDeviceSelect = (deviceId: string) => {
    setInputDevice(deviceId);
    // На веб это эмуляция, реальное переключение требует перезапуска записи
    if (Platform.OS === 'web' && isRecording) {
      Alert.alert(
        'Device Changed',
        'To apply the new microphone, please stop and restart recording.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleOutputDeviceSelect = (deviceId: string) => {
    setOutputDevice(deviceId);
    // На веб это эмуляция, реальное переключение требует системных настроек
    if (Platform.OS === 'web') {
      Alert.alert(
        'Output Device',
        'On web, speaker output is controlled by your system. Please change the default audio output in your system settings.',
        [{ text: 'OK' }]
      );
    }
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
          {/* Показываем распознанный текст, если есть */}
          {recognizedText && (
            <Section marginTop="none">
              <Text variant="caption" align="center" style={{ maxWidth: '90%', fontStyle: 'italic', color: theme.textSecondary }}>
                You said: "{recognizedText}"
              </Text>
            </Section>
          )}

          {/* Показываем статус обработки */}
          {isProcessingLLM && (
            <Section marginTop="none">
              <Text variant="caption" align="center" style={{ maxWidth: '90%', color: theme.textSecondary }}>
                Thinking...
              </Text>
            </Section>
          )}

          {/* Показываем текст только после озвучивания */}
          {isWaitingForUser && !isRecording && (
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

          {/* Показываем инструкцию при записи */}
          {isRecording && (
            <Section marginTop="none">
              <Text variant="body" align="center" style={{ maxWidth: '90%' }}>
                Listening... Speak now
              </Text>
            </Section>
          )}
          
          <Section marginTop="none">
            {isWaitingForUser && !isRecording && (
              <Stack gap={theme.spacing.base} align="stretch">
                <TouchableOpacity
                  onPress={handleOption1}
                  disabled={isSpeaking || isProcessingLLM}
                  style={[
                    styles.optionButton,
                    { 
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                      opacity: (isSpeaking || isProcessingLLM) ? 0.5 : 1,
                    }
                  ]}
                >
                  <Text variant="body" align="center">
                    {COACH_PHRASES.main.option1}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleOption2}
                  disabled={isSpeaking || isProcessingLLM}
                  style={[
                    styles.optionButton,
                    { 
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                      opacity: (isSpeaking || isProcessingLLM) ? 0.5 : 1,
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

