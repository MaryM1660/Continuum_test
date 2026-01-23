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
import { MicButtons } from '../components/MicButtons';
import { useTheme } from '../theme/useTheme';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import { COACH_PHRASES, speakText } from '../services/mockVoice';
import { microphoneService } from '../services/microphone';
import { voiceRecognitionService } from '../services/voiceRecognition';
import { llmService } from '../services/llmService';
import { RootStackParamList } from '../../App';
import { ScreenContainer, Container, Stack, Section } from '../components/layout';
import { Text } from '../components/typography';
import { Icon } from '../components/icons';
import { LiquidGlassButton } from '../components/LiquidGlassButton';

type TalkScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Talk'>;

interface TalkScreenProps {
  onOpenDrawer?: () => void;
}

type OnboardingStep = 1 | 2 | 3 | 'complete';

export const TalkScreen: React.FC<TalkScreenProps> = ({ onOpenDrawer }) => {
  const theme = useTheme();
  // navigation и onOpenDrawer могут использоваться в будущем для навигации
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasMicPermission, setHasMicPermission] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isWaitingForUser, setIsWaitingForUser] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [isProcessingLLM, setIsProcessingLLM] = useState(false);
  const [displayText, setDisplayText] = useState<string>(''); // Текст для отображения на экране
  const [speechText, setSpeechText] = useState<string>(''); // Текст для озвучки
  
  // Refs
  const wasMutedBeforeProcessing = React.useRef<boolean>(false);
  const lastInterimText = React.useRef<string>('');
  const lastInterimTime = React.useRef<number>(0);
  const silenceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const isMutedRef = React.useRef<boolean>(true); // Ref для актуального состояния isMuted
  
  // Синхронизируем ref с state
  React.useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Запрос разрешения на микрофон
  const requestMicPermission = async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'web') {
        // ВАЖНО: На веб НЕ вызываем getUserMedia() отдельно!
        // Speech Recognition САМ запросит разрешение при start()
        // Просто проверяем доступность API
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          console.log('✅ [PERMISSION] MediaDevices API available - Speech Recognition will request permission');
          // Не запрашиваем разрешение здесь - пусть Speech Recognition сделает это
          // Просто помечаем, что API доступен
          setHasMicPermission(true); // Условно true, реальное разрешение запросит Speech Recognition
          return true;
        } else {
          console.warn('❌ [PERMISSION] MediaDevices API not available');
          setHasMicPermission(false);
          return false;
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

      await speakText(text);
      
      clearInterval(interval);
      setAudioLevel(0);
    } catch (error) {
      console.error('Error speaking:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  // Проверка разрешения микрофона при загрузке экрана
  useEffect(() => {
    const checkMicPermission = async () => {
      if (Platform.OS === 'web') {
        // На веб проверяем через navigator.permissions
        try {
          if (navigator.permissions && navigator.permissions.query) {
            const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
            if (result.state === 'granted') {
              setHasMicPermission(true);
              // Если разрешение есть, идем на онбординг или главный экран
              if (onboardingStep === 1) {
                setIsWaitingForUser(true);
              }
            } else {
              // Если разрешения нет, показываем STEP 3
              setOnboardingStep(3);
              setIsWaitingForUser(true);
            }
          } else {
            // Если API permissions недоступен, проверяем через попытку доступа
            // Но не запрашиваем разрешение автоматически
            setOnboardingStep(1);
            setIsWaitingForUser(true);
          }
        } catch (error) {
          console.log('Permission check not available, starting with onboarding');
          setOnboardingStep(1);
          setIsWaitingForUser(true);
        }
      } else {
        // На мобильных проверяем через expo-av
        try {
          const { status } = await Audio.getPermissionsAsync();
          if (status === 'granted') {
            setHasMicPermission(true);
            if (onboardingStep === 1) {
              setIsWaitingForUser(true);
            }
          } else {
            setOnboardingStep(3);
            setIsWaitingForUser(true);
          }
        } catch (error) {
          console.log('Error checking permission, starting with onboarding');
          setOnboardingStep(1);
          setIsWaitingForUser(true);
        }
      }
    };

    checkMicPermission();
  }, []);

  // Cleanup при размонтировании
  useEffect(() => {
    return () => {
      if (Platform.OS === 'web') {
        try {
          microphoneService.stopRecording();
        } catch (error) {
          // Игнорируем ошибки при остановке, если сервис не запущен
          console.log('Cleanup: microphoneService already stopped');
        }
        try {
          voiceRecognitionService.stopListening();
        } catch (error) {
          // Игнорируем ошибки при остановке, если сервис не запущен
          console.log('Cleanup: voiceRecognitionService already stopped');
        }
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
    
    console.log('handleStep3 called - requesting microphone permission');
    setIsWaitingForUser(false);
    
    try {
      // Запрашиваем реальное разрешение на микрофон
      const granted = await requestMicPermission();
      console.log('Microphone permission result:', granted);
      
      // БЕЗ разрешения НЕ переходим дальше
      if (!granted) {
        setIsWaitingForUser(true);
        if (Platform.OS !== 'web') {
          Alert.alert(
            'Microphone Permission Required',
            'This app requires microphone access to function. Please grant permission to continue.',
            [
              { text: 'Cancel', style: 'cancel', onPress: () => setIsWaitingForUser(true) },
              { text: 'Retry', onPress: handleStep3 },
            ]
          );
        } else {
          Alert.alert(
            'Microphone Permission Required',
            'Please allow microphone access in your browser settings to continue.',
            [{ text: 'OK', onPress: () => setIsWaitingForUser(true) }]
          );
        }
        return;
      }
      
      // Только если разрешение получено, переходим на главный экран
      setHasMicPermission(true);
      setOnboardingStep('complete');
      // НЕ включаем микрофон автоматически - пользователь сам включит кнопкой
      setIsMuted(true);
      
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
      // В случае ошибки остаемся на STEP 3
      setIsWaitingForUser(true);
      Alert.alert(
        'Error',
        'Failed to request microphone permission. Please try again.',
        [{ text: 'OK', onPress: () => setIsWaitingForUser(true) }]
      );
    }
  };

  const handleMainScreenWelcome = async () => {
    console.log('handleMainScreenWelcome called');
    try {
      // НЕ устанавливаем displayText - текст не показываем на экране, только озвучиваем
      // setDisplayText(`${COACH_PHRASES.main.welcome}\n\n${COACH_PHRASES.main.chooseOption}`);
      
      // Устанавливаем текст только для озвучки
      const welcomeSpeech = `${COACH_PHRASES.main.welcome} ${COACH_PHRASES.main.chooseOption}`;
      setSpeechText(welcomeSpeech);
      
      // Всегда показываем контент СРАЗУ
      setIsWaitingForUser(true);
      console.log('UI should be visible now');
      
      // Озвучиваем асинхронно, не блокируя UI
      (async () => {
        try {
          await speak(welcomeSpeech);
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

  // Единый callback для обработки результатов распознавания
  // Используется и при первоначальном запуске, и при возобновлении после ответа коуча
  const createRecognitionCallback = () => {
    return (result: any) => {
      console.log('✅ [MAIN] Recognition result received!', result);
      console.log('✅ [MAIN] Text:', result.text, 'isFinal:', result.isFinal);
      
      // Обновляем распознанный текст для отображения
      setRecognizedText(result.text);
      
      // ВАЖНО: Логируем ВСЕ результаты, особенно финальные
      if (result.isFinal) {
        console.log('🎉🎉🎉 [MAIN] FINAL RESULT RECEIVED:', result.text);
        console.log('🎉🎉🎉 [MAIN] FULL SENTENCE:', result.text);
        console.log('═══════════════════════════════════════════════════════════');
        console.log('🎤 ВЫ СКАЗАЛИ (ФИНАЛЬНЫЙ РЕЗУЛЬТАТ):', result.text);
        console.log('═══════════════════════════════════════════════════════════');
        
        // Очищаем таймер тишины
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = null;
        }
        lastInterimText.current = '';
        lastInterimTime.current = 0;
        
        // Отправляем в LLM
        console.log('📤 [MAIN] Sending to LLM:', result.text);
        setTimeout(() => {
          handleUserSpeech(result.text);
        }, 500);
      } else {
        // ПРОМЕЖУТОЧНЫЙ РЕЗУЛЬТАТ - выводим в консоль
        console.log('⏳ [MAIN] Interim result:', result.text);
        console.log('───────────────────────────────────────────────────────────');
        console.log('🎤 ВЫ ГОВОРИТЕ (промежуточный):', result.text);
        console.log('───────────────────────────────────────────────────────────');
        
        // Сохраняем промежуточный результат для детекции тишины
        const currentText = result.text.trim();
        if (currentText) {
          lastInterimText.current = currentText;
          lastInterimTime.current = Date.now();
          
          // Очищаем предыдущий таймер
          if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
            silenceTimeoutRef.current = null;
          }
          
          // Проверяем, можно ли считать это предложением
          const hasSentenceEnd = /[.!?]\s*$/.test(currentText);
          const wordCount = currentText.split(/\s+/).length;
          
          // Если есть знак конца предложения И достаточно слов (минимум 5), считаем финальным
          if (hasSentenceEnd && wordCount >= 5) {
            console.log('📝 [MAIN] Sentence end detected, treating interim as final');
            console.log('🎉🎉🎉 [MAIN] FINAL SENTENCE (from sentence end):', currentText);
            console.log('═══════════════════════════════════════════════════════════');
            console.log('🎤 ВЫ СКАЗАЛИ (ФИНАЛЬНЫЙ - по знаку конца):', currentText);
            console.log('═══════════════════════════════════════════════════════════');
            
            setRecognizedText(currentText);
            setAudioLevel(0);
            
            console.log('📤 [MAIN] Sending to LLM (from sentence end):', currentText);
            setTimeout(() => {
              handleUserSpeech(currentText);
            }, 500);
            
            lastInterimText.current = '';
            lastInterimTime.current = 0;
          } else if (wordCount >= 50) {
            // Если нет конца предложения, но текст длинный (50+ слов), тоже считаем финальным
            console.log('📏 [MAIN] Long text detected (', wordCount, ' words), treating interim as final');
            console.log('🎉🎉🎉 [MAIN] FINAL SENTENCE (from length):', currentText);
            console.log('═══════════════════════════════════════════════════════════');
            console.log('🎤 ВЫ СКАЗАЛИ (ФИНАЛЬНЫЙ - по длине):', currentText);
            console.log('═══════════════════════════════════════════════════════════');
            
            setRecognizedText(currentText);
            setAudioLevel(0);
            
            console.log('📤 [MAIN] Sending to LLM (from length):', currentText);
            setTimeout(() => {
              handleUserSpeech(currentText);
            }, 500);
            
            lastInterimText.current = '';
            lastInterimTime.current = 0;
          } else {
            // Устанавливаем таймер на случай тишины
            silenceTimeoutRef.current = setTimeout(() => {
              const timeSinceLastUpdate = Date.now() - lastInterimTime.current;
              const savedText = lastInterimText.current;
              
              if (savedText && savedText.trim() && timeSinceLastUpdate >= 3000) {
                console.log('⏰ [MAIN] Silence detected (', timeSinceLastUpdate, 'ms), treating interim as final');
                console.log('🎉🎉🎉 [MAIN] FINAL SENTENCE (from silence):', savedText);
                console.log('═══════════════════════════════════════════════════════════');
                console.log('🎤 ВЫ СКАЗАЛИ (ФИНАЛЬНЫЙ - по тишине):', savedText);
                console.log('═══════════════════════════════════════════════════════════');
                
                setRecognizedText(savedText);
                setAudioLevel(0);
                
                console.log('📤 [MAIN] Sending to LLM (from silence):', savedText);
                setTimeout(() => {
                  handleUserSpeech(savedText);
                }, 500);
              }
            }, 3000);
          }
        }
      }
    };
  };

  // Единый callback для обработки ошибок
  const createErrorCallback = () => {
    return (error: Error) => {
      console.error('❌ [MAIN] Recognition error:', error);
      // no-speech и aborted - нормальные события, не останавливаем
      if (error.message && !error.message.includes('no-speech') && !error.message.includes('aborted')) {
        // Только критические ошибки останавливают запись
        console.error('❌ [MAIN] Critical error, stopping:', error);
        setIsRecording(false);
        setAudioLevel(0);
      }
    };
  };

  const handleToggleMute = async () => {
    console.log('🔘 [BUTTON] handleToggleMute called, current isMuted:', isMuted);
    const newMutedState = !isMuted;
    console.log('🔘 [BUTTON] newMutedState (will be):', newMutedState);
    
    if (Platform.OS === 'web') {
      if (newMutedState) {
        // ВЫКЛЮЧАЕМ микрофон
        // Останавливаем запись и распознавание
        console.log('Stopping recording and recognition');
        // НЕ используем microphoneService - только Speech Recognition
        voiceRecognitionService.stopListening();
        setIsRecording(false);
        setRecognizedText('');
        setAudioLevel(0);
        setIsMuted(true);
      } else {
        // ВКЛЮЧАЕМ микрофон
        console.log('🔘 [BUTTON] Enabling microphone...');
        
        // Запрашиваем разрешение, если еще не получено
        if (!hasMicPermission) {
          console.log('⚠️ [BUTTON] No microphone permission, redirecting to STEP 3');
          // Переходим на STEP 3 для запроса разрешения
          setOnboardingStep(3);
          setIsWaitingForUser(true);
          return;
        }
        
        console.log('🚀 [BUTTON] Starting recording and recognition');
        console.log('🚀 [BUTTON] voiceRecognitionService.isAvailable():', voiceRecognitionService.isAvailable());
        
        // Speech Recognition САМ запросит микрофон при start()
        // НЕ используем microphoneService - это создает конфликт!
        if (voiceRecognitionService.isAvailable()) {
          console.log('✅ [BUTTON] Service is available, calling startListening...');
          console.log('📞 [BUTTON] About to call voiceRecognitionService.startListening...');
          const recognitionStarted = await voiceRecognitionService.startListening(
            createRecognitionCallback(),
            createErrorCallback()
          );
          
          console.log('📞 [BUTTON] startListening returned:', recognitionStarted);
          if (recognitionStarted) {
            setIsRecording(true);
            setIsMuted(false);
            console.log('✅ [MAIN] Recognition started successfully! Microphone will be requested by Speech Recognition');
          } else {
            console.error('❌ [MAIN] Recognition failed to start!');
            Alert.alert(
              'Error', 
              'Could not start voice recognition. Please check:\n' +
              '1. Microphone permissions\n' +
              '2. Browser support (Chrome/Edge recommended)\n' +
              '3. Internet connection (required for speech recognition)'
            );
          }
        } else {
          Alert.alert('Not Supported', 'Voice recognition is not available in your browser. Please use Chrome or Edge.');
        }
      }
    } else {
      // На мобильных просто переключаем состояние
      setIsMuted(newMutedState);
    }
  };

  // Функция для записи на бэк (пока эмуляция)
  const logToBackend = async (type: 'voice' | 'button', content: string) => {
    // TODO: Заменить на реальный API вызов
    console.log(`📝 [BACKEND LOG] Type: ${type}, Content:`, content);
    // В будущем здесь будет fetch('/api/log', { method: 'POST', body: { type, content } })
  };

  const handleUserSpeech = async (text: string) => {
    if (isProcessingLLM || !text.trim()) {
      console.log('Skipping speech processing:', { isProcessingLLM, text: text.trim() });
      return;
    }

    console.log('🎤 [MICROPHONE] Processing user speech:', text);
    console.log('📝 [BACKEND] Logging to backend - Type: voice, Content:', text);
    
    // Записываем распознанный текст на бэк (не показываем на экране)
    await logToBackend('voice', text);
    
    // Сохраняем состояние микрофона перед обработкой
    wasMutedBeforeProcessing.current = isMuted;
    
    // Останавливаем запись во время обработки
    if (Platform.OS === 'web') {
      // НЕ используем microphoneService - только Speech Recognition
      voiceRecognitionService.stopListening();
      setIsRecording(false);
      setAudioLevel(0);
    }

    setIsProcessingLLM(true);
    setRecognizedText(''); // Очищаем, но не показываем

    try {
      // Отправляем в LLM
      const response = await llmService.chat(text);
      console.log('LLM response:', response);

      if (response.text) {
        // Устанавливаем текст для озвучки (но не для отображения, если не нужно)
        setSpeechText(response.text);
        // Озвучиваем ответ с текущей громкостью
        await speak(response.text);
      } else {
        const errorMsg = "I'm sorry, I didn't get a response. Could you try again?";
        setSpeechText(errorMsg);
        await speak(errorMsg);
      }
    } catch (error) {
      console.error('Error processing speech:', error);
      const errorMsg = "I'm sorry, I didn't catch that. Could you repeat?";
      setSpeechText(errorMsg);
      await speak(errorMsg);
    } finally {
      setIsProcessingLLM(false);
      // После ответа автоматически возобновляем запись (если микрофон НЕ выключен пользователем)
      // ВАЖНО: Используем ref для проверки актуального состояния isMuted в setTimeout
      if (Platform.OS === 'web' && hasMicPermission) {
        // Микрофон должен продолжать работать - возобновляем запись после небольшой задержки
        setTimeout(async () => {
          // Проверяем актуальное состояние через ref
          const currentIsMuted = isMutedRef.current;
          console.log('🔄 [RESUME] Resuming recording after response, isMuted (from ref):', currentIsMuted);
          
          // Если микрофон не выключен пользователем, возобновляем запись
          if (!currentIsMuted && voiceRecognitionService.isAvailable()) {
            console.log('🔄 [RESUME] Starting recognition...');
            const recognitionStarted = await voiceRecognitionService.startListening(
              createRecognitionCallback(),
              createErrorCallback()
            );
            
            if (recognitionStarted) {
              setIsRecording(true);
              console.log('✅ [RESUME] Recording resumed successfully');
            } else {
              console.error('❌ [RESUME] Failed to resume recording');
            }
          } else {
            console.log('⏸️ [RESUME] Not resuming - isMuted:', currentIsMuted, 'hasMicPermission:', hasMicPermission, 'isAvailable:', voiceRecognitionService.isAvailable());
          }
        }, 1000); // Задержка 1 секунда после ответа коуча
      } else {
        console.log('⏸️ [RESUME] Not resuming - Platform:', Platform.OS, 'hasMicPermission:', hasMicPermission);
      }
    }
  };



  const handleOption1 = async () => {
    // Кнопки всегда активны, независимо от записи
    const optionText = "Follow the coach's plan";
    
    // Записываем выбор на бэк
    await logToBackend('button', optionText);
    
    const speechResponse = "Great! Let's follow the coach's plan. I'll guide you through a structured conversation about your career.";
    
    // Устанавливаем текст для озвучки (но не меняем displayText, если не нужно)
    setSpeechText(speechResponse);
    
    // Озвучиваем ответ
    await speak(speechResponse);
  };

  const handleOption2 = async () => {
    // Кнопки всегда активны, независимо от записи
    const optionText = "Discuss your topic or document";
    
    // Записываем выбор на бэк
    await logToBackend('button', optionText);
    
    const speechResponse = "Perfect! Let's discuss your topic or document. What would you like to talk about?";
    
    // Устанавливаем текст для озвучки (но не меняем displayText, если не нужно)
    setSpeechText(speechResponse);
    
    // Озвучиваем ответ
    await speak(speechResponse);
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
                <LiquidGlassButton
                  onPress={handleStep1}
                  disabled={isSpeaking}
                  variant="primary"
                  theme={theme}
                  textVariant="buttonLarge"
                >
                  Hi
                </LiquidGlassButton>
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
                <LiquidGlassButton
                  onPress={handleStep2}
                  disabled={isSpeaking}
                  variant="primary"
                  theme={theme}
                  textVariant="buttonLarge"
                >
                  Ok
                </LiquidGlassButton>
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
                <LiquidGlassButton
                  onPress={handleStep3}
                  disabled={isSpeaking}
                  variant="primary"
                  theme={theme}
                  textVariant="buttonLarge"
                >
                  Turn on the mic
                </LiquidGlassButton>
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
          {isProcessingLLM ? (
            <Section marginTop="none">
              <Text variant="caption" align="center" style={{ maxWidth: '90%', color: theme.textSecondary }}>
                Thinking...
              </Text>
            </Section>
          ) : null}
{displayText ? (
            <Section marginTop="none">
              <Text variant="bodyLarge" align="center" style={{ maxWidth: '90%' }}>
                {displayText}
              </Text>
            </Section>
          ) : null}
          <Section marginTop="none">
            <Stack gap={theme.spacing.base} align="stretch">
              <LiquidGlassButton
                onPress={handleOption1}
                variant="secondary"
                theme={theme}
                textVariant="body"
              >
                {COACH_PHRASES.main.option1}
              </LiquidGlassButton>
              <LiquidGlassButton
                onPress={handleOption2}
                variant="secondary"
                theme={theme}
                textVariant="body"
              >
                {COACH_PHRASES.main.option2}
              </LiquidGlassButton>
            </Stack>
          </Section>
          <Section marginTop="none">
            <MicButtons
              theme={theme}
              isMuted={isMuted}
              onToggleMute={handleToggleMute}
            />
            {recognizedText ? (
              <View style={{ marginTop: theme.spacing.sm, paddingHorizontal: theme.spacing.base }}>
                <Text 
                  variant="caption" 
                  style={{ 
                    fontSize: 10, 
                    color: theme.textTertiary,
                    textAlign: 'center',
                    fontStyle: 'italic',
                  }}
                >
                  DEBUG: {recognizedText}
                </Text>
              </View>
            ) : null}
          </Section>
        </Stack>
      </Container>
    );
  };

  return (
    <ScreenContainer>
      <StatusBar style={theme.background === '#FFFFFF' ? 'dark' : 'light'} />
      {onboardingStep === 'complete' && (
        <LiquidGlassButton
          onPress={() => onOpenDrawer?.()}
          variant="secondary"
          theme={theme}
          style={styles.menuButton}
          borderRadius={24}
        >
          <Icon name="Bars3" size={28} color={theme.text} />
        </LiquidGlassButton>
      )}
      <View
        pointerEvents="none"
        style={styles.circleContainer}
      >
        <View style={[styles.blueCircle, { backgroundColor: theme.primary }]} />
      </View>
      <View style={styles.contentWrapper}>
        {onboardingStep !== 'complete' ? renderOnboardingContent() : renderMainContent()}
      </View>
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
  circleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  blueCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 40, // spacing['3xl']
    zIndex: 2,
    paddingTop: '50%', // Отступ сверху для контента
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
    // shadowColor применяется динамически через inline style
    shadowOffset: { width: 0, height: 4 }, // spacing.xs
    shadowOpacity: 0.3,
    shadowRadius: 8, // spacing.sm
    elevation: 8,
  },
  buttonText: {
    // Используем типографику из theme, цвет через theme.primaryContrast
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

