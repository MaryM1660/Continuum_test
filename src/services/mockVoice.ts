// Эмуляция голосового взаимодействия

export interface VoiceMessage {
  id: string;
  text: string;
  duration: number; // в секундах
  audioLevel?: number; // 0-1 для визуализации
}

// Эмулированные фразы коуча
export const COACH_PHRASES = {
  onboarding: {
    step1: "Hello!",
    step2: "I am AI career coach. I can help you to define your career strategy, talk to you about your experience and goals, or discuss career-related docs",
    step3: "It would be great if you start talking to me by voice. Is that ok?",
  },
  main: {
    welcome: "Hi! I'm here to help you think through your career. Feel free to speak openly - the more details, stories, and even messy thoughts you share, the more useful our conversation will be.",
    chooseOption: "What would you like to start with?",
    option1: "Follow the coach's plan",
    option2: "Discuss your topic or document",
  },
};

// Синтез речи с использованием expo-speech (мобильные) или Web Speech API (веб)
import { Platform } from 'react-native';

let Speech: any = null;
if (Platform.OS !== 'web') {
  Speech = require('expo-speech');
}

export const speakText = async (text: string, volume: number = 0.8): Promise<void> => {
  return new Promise((resolve) => {
    try {
      if (Platform.OS === 'web') {
        // Используем Web Speech API для веб-версии
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          try {
            // Проверяем, что мы на HTTPS или localhost (требование браузера)
            const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            
            if (!isSecure) {
              console.warn('Web Speech API requires HTTPS. Using fallback timing.');
              const duration = Math.max(text.length * 0.05 * 1000, 1000);
              setTimeout(() => resolve(), duration);
              return;
            }
            
            // Отменяем предыдущую речь
            window.speechSynthesis.cancel();
            
            // Небольшая задержка для стабильности
            setTimeout(() => {
              try {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'en-US';
                utterance.rate = 0.9;
                utterance.pitch = 1.0;
                utterance.volume = volume;
                
                let resolved = false;
                const duration = Math.max(text.length * 0.05 * 1000, 1000); // Минимум 1 секунда
                
                utterance.onend = () => {
                  if (!resolved) {
                    resolved = true;
                    resolve();
                  }
                };
                
                utterance.onerror = (error) => {
                  console.warn('Speech error (using fallback):', error);
                  // В случае ошибки все равно резолвим через задержку
                  if (!resolved) {
                    resolved = true;
                    setTimeout(() => resolve(), Math.min(duration, 2000));
                  }
                };
                
                // Пытаемся запустить речь
                window.speechSynthesis.speak(utterance);
                
                // Fallback таймаут: всегда резолвим через расчетное время
                setTimeout(() => {
                  if (!resolved) {
                    resolved = true;
                    resolve();
                  }
                }, duration);
              } catch (error) {
                console.warn('Error creating utterance:', error);
                const duration = Math.max(text.length * 0.05 * 1000, 1000);
                setTimeout(() => resolve(), duration);
              }
            }, 100);
          } catch (error) {
            console.warn('Error starting speech:', error);
            // Эмулируем задержку для визуализации
            const duration = Math.max(text.length * 0.05 * 1000, 1000);
            setTimeout(() => resolve(), duration);
          }
        } else {
          // Если Web Speech API не поддерживается, эмулируем задержку
          console.warn('Web Speech API not supported');
          const duration = Math.max(text.length * 0.05 * 1000, 1000);
          setTimeout(() => resolve(), duration);
        }
      } else {
        // Используем expo-speech для мобильных платформ
        if (Speech) {
          Speech.speak(text, {
            language: 'en-US',
            pitch: 1.0,
            rate: 0.9,
            onDone: () => {
              resolve();
            },
            onStopped: () => {
              resolve();
            },
            onError: (error: any) => {
              console.error('Speech error:', error);
              resolve();
            },
          });
        } else {
          resolve();
        }
      }
    } catch (error) {
      console.error('Error starting speech:', error);
      resolve();
    }
  });
};

// Эмуляция получения уровня аудио для визуализации
export const getAudioLevel = (): number => {
  // Эмулируем случайный уровень для демонстрации
  return Math.random() * 0.5 + 0.3;
};

// Эмуляция распознавания речи пользователя
export const recognizeSpeech = async (): Promise<string> => {
  // В реальном приложении здесь будет распознавание речи
  // Для прототипа возвращаем эмулированный текст
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("This is an emulated user speech input for the prototype.");
    }, 1000);
  });
};

