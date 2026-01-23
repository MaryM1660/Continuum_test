// Реальное распознавание речи через Web Speech Recognition API
import { Platform } from 'react-native';

export interface VoiceRecognitionResult {
  text: string;
  confidence: number;
  isFinal: boolean;
}

class VoiceRecognitionService {
  private recognition: any = null;
  private isListening: boolean = false;
  private onResultCallback?: (result: VoiceRecognitionResult) => void;
  private onErrorCallback?: (error: Error) => void;
  private silenceTimeout: NodeJS.Timeout | null = null;
  private lastFinalText: string = '';
  private onSilenceCallback?: (finalText: string) => void;

  constructor() {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      // @ts-ignore - Web Speech Recognition API
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (event: any) => {
          let finalTranscript = '';
          let interimTranscript = '';
          let confidence = 0;

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            const isFinal = event.results[i].isFinal;
            confidence = event.results[i][0].confidence || 0.5;

            if (isFinal) {
              finalTranscript += transcript;
              // Накапливаем финальный текст
              if (finalTranscript.trim()) {
                this.lastFinalText = finalTranscript.trim();
                console.log('Final transcript received:', this.lastFinalText);
                // При финальном результате сразу отправляем (или через короткую паузу)
                this.resetSilenceTimeout(1000); // Короткая пауза после финального результата
              }
            } else {
              interimTranscript += transcript;
              // Сбрасываем таймаут при промежуточных результатах (пользователь еще говорит)
              if (interimTranscript.trim()) {
                this.resetSilenceTimeout();
              }
            }
          }

          const text = finalTranscript || interimTranscript;
          if (text && this.onResultCallback) {
            this.onResultCallback({
              text: text.trim(),
              confidence,
              isFinal: !!finalTranscript,
            });
          }
        };

        this.recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          if (this.onErrorCallback) {
            this.onErrorCallback(new Error(event.error));
          }
        };

        this.recognition.onend = () => {
          console.log('Recognition ended, was listening:', this.isListening);
          // Если есть финальный текст и мы все еще должны слушать, вызываем callback
          if (this.lastFinalText && this.onSilenceCallback) {
            console.log('Calling silence callback with:', this.lastFinalText);
            this.onSilenceCallback(this.lastFinalText);
            this.lastFinalText = '';
          }
          
          // НЕ перезапускаем автоматически - это будет делать TalkScreen
          // если микрофон все еще включен
        };
      }
    }
  }

  async startListening(
    onResult: (result: VoiceRecognitionResult) => void,
    onError?: (error: Error) => void,
    onSilence?: (finalText: string) => void,
    silenceTimeoutMs: number = 3000
  ): Promise<boolean> {
    if (!this.recognition) {
      console.warn('Speech Recognition not available');
      return false;
    }

    if (this.isListening) {
      return true;
    }

    this.onResultCallback = onResult;
    this.onErrorCallback = onError;
    this.onSilenceCallback = onSilence;
    this.lastFinalText = '';

    try {
      this.recognition.start();
      this.isListening = true;
      // Запускаем таймаут для автоматической отправки после паузы
      this.resetSilenceTimeout(silenceTimeoutMs);
      return true;
    } catch (error) {
      console.error('Error starting recognition:', error);
      return false;
    }
  }

  private resetSilenceTimeout(timeoutMs: number = 3000): void {
    if (this.silenceTimeout) {
      clearTimeout(this.silenceTimeout);
      this.silenceTimeout = null;
    }
    
    // Запускаем таймаут только если есть промежуточный или финальный текст
    if (this.onSilenceCallback) {
      this.silenceTimeout = setTimeout(() => {
        if (this.lastFinalText && this.onSilenceCallback) {
          console.log('Silence timeout triggered, sending:', this.lastFinalText);
          this.onSilenceCallback(this.lastFinalText);
          this.lastFinalText = '';
        }
        this.silenceTimeout = null;
      }, timeoutMs);
    }
  }

  stopListening(): void {
    if (this.silenceTimeout) {
      clearTimeout(this.silenceTimeout);
      this.silenceTimeout = null;
    }
    
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
        this.isListening = false;
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
    
    this.lastFinalText = '';
    this.onSilenceCallback = undefined;
  }

  isAvailable(): boolean {
    return Platform.OS === 'web' && this.recognition !== null;
  }
}

export const voiceRecognitionService = new VoiceRecognitionService();

