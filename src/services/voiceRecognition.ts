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
            } else {
              interimTranscript += transcript;
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
          this.isListening = false;
        };
      }
    }
  }

  async startListening(
    onResult: (result: VoiceRecognitionResult) => void,
    onError?: (error: Error) => void
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

    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (error) {
      console.error('Error starting recognition:', error);
      return false;
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
        this.isListening = false;
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
  }

  isAvailable(): boolean {
    return Platform.OS === 'web' && this.recognition !== null;
  }
}

export const voiceRecognitionService = new VoiceRecognitionService();

