// МАКСИМАЛЬНО ПРОСТОЕ распознавание речи - как в примерах MDN
// КЛЮЧЕВОЕ: Speech Recognition САМ запрашивает микрофон при start()
// НО: Для выбора конкретного устройства нужно сначала запросить getUserMedia с нужным устройством
import { Platform } from 'react-native';
import { audioDeviceService } from './audioDeviceService';

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
  private SpeechRecognitionClass: any = null;

  constructor() {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      // @ts-ignore
      this.SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (this.SpeechRecognitionClass) {
        console.log('✅ [SPEECH] SpeechRecognition class available');
      } else {
        console.error('❌ [SPEECH] SpeechRecognition class NOT available');
      }
    }
  }

  private createRecognition(): any {
    if (!this.SpeechRecognitionClass) {
      console.error('❌ [SPEECH] Cannot create recognition - class not available');
      return null;
    }

    console.log('🔧 [SPEECH] Creating new SpeechRecognition instance...');
    const recognition = new this.SpeechRecognitionClass();
    
    // ПРОСТЫЕ настройки - ТОЧНО как в рабочем тестовом экране
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = navigator.language || 'en-US';
    console.log('🔧 [SPEECH] Recognition configured:', {
      continuous: recognition.continuous,
      interimResults: recognition.interimResults,
      lang: recognition.lang
    });

    // Логируем все события для отладки
    recognition.onstart = () => {
      console.log('✅✅✅ [SPEECH] onstart event fired - Recognition started!');
      console.log('✅ [SPEECH] this.isListening:', this.isListening);
      console.log('✅ [SPEECH] this.onResultCallback exists:', !!this.onResultCallback);
    };

    recognition.onaudiostart = () => {
      console.log('🎤🎤🎤 [SPEECH] onaudiostart event fired - Audio capture started!');
      console.log('🎤 [SPEECH] Microphone should be receiving audio now');
      // Проверяем доступные аудио устройства
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        navigator.mediaDevices.enumerateDevices().then(devices => {
          const audioInputs = devices.filter(d => d.kind === 'audioinput');
          console.log('🎤 [SPEECH] Available audio input devices:', audioInputs.length);
          audioInputs.forEach((device, index) => {
            console.log(`   Device ${index}:`, {
              label: device.label || 'Unknown',
              deviceId: device.deviceId
            });
          });
        });
      }
    };

    recognition.onaudioend = () => {
      console.log('🔇 [SPEECH] onaudioend event fired - Audio capture ended');
      console.log('⚠️ [SPEECH] Audio capture ended - this may indicate no sound detected');
    };

    recognition.onsoundstart = () => {
      console.log('🔊🔊🔊 [SPEECH] onsoundstart event fired - Sound detected!');
    };

    recognition.onspeechstart = () => {
      console.log('🗣️🗣️🗣️ [SPEECH] onspeechstart event fired - Speech detected!');
    };

    recognition.onspeechend = () => {
      console.log('🔇 [SPEECH] onspeechend event fired - Speech ended');
    };

    recognition.onresult = (event: any) => {
          console.log('🎯 [SPEECH] onresult event fired!');
          console.log('🎯 [SPEECH] event.resultIndex:', event.resultIndex);
          console.log('🎯 [SPEECH] event.results.length:', event.results.length);
          console.log('🎯 [SPEECH] this.onResultCallback exists:', !!this.onResultCallback);
          
          let finalText = '';
          let interimText = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            const isFinal = event.results[i].isFinal;
            console.log(`🎯 [SPEECH] Result ${i}: "${transcript}" (isFinal: ${isFinal})`);
            if (isFinal) {
              finalText += transcript;
            } else {
              interimText += transcript;
            }
          }

          const text = finalText || interimText;
          console.log('🎯 [SPEECH] Combined text:', text);
          console.log('🎯 [SPEECH] Final text:', finalText);
          console.log('🎯 [SPEECH] Interim text:', interimText);
          
          if (text && this.onResultCallback) {
            console.log('✅ [SPEECH] Calling onResultCallback with:', { text: text.trim(), isFinal: !!finalText });
            try {
              this.onResultCallback({
                text: text.trim(),
                confidence: event.results[event.results.length - 1][0].confidence || 0.5,
                isFinal: !!finalText,
              });
              console.log('✅ [SPEECH] onResultCallback executed successfully');
            } catch (error) {
              console.error('❌ [SPEECH] Error in onResultCallback:', error);
            }
          } else {
            if (!text) {
              console.warn('⚠️ [SPEECH] No text to process');
            }
            if (!this.onResultCallback) {
              console.error('❌ [SPEECH] onResultCallback is not set!');
            }
          }
        };

    recognition.onerror = (event: any) => {
          console.error('❌ [SPEECH] Error:', event.error, event);
          // no-speech - это НОРМАЛЬНО, не ошибка (пользователь просто не говорит)
          if (event.error === 'no-speech') {
            console.log('ℹ️ [SPEECH] No speech detected (normal - user not speaking)');
            return; // НЕ вызываем callback для no-speech
          }
          // aborted - тоже нормально (может быть вызвано stop())
          if (event.error === 'aborted') {
            console.log('ℹ️ [SPEECH] Recognition aborted (normal)');
            return;
          }
          // Другие ошибки - вызываем callback
          if (this.onErrorCallback) {
            this.onErrorCallback(new Error(event.error));
          }
        };

    // ВАЖНО: В continuous mode нужно перезапускать вручную при onend
    // ИСПОЛЬЗУЕМ ПРОСТУЮ ЛОГИКУ КАК В РАБОЧЕМ ТЕСТОВОМ ЭКРАНЕ
    recognition.onend = () => {
      console.log('⏹️ [SPEECH] Recognition ended');
      console.log('⏹️ [SPEECH] this.isListening:', this.isListening);
      console.log('⏹️ [SPEECH] this.onResultCallback exists:', !!this.onResultCallback);
      
      const shouldContinue = this.isListening && this.onResultCallback;
      
      // Если мы все еще должны слушать, перезапускаем
      // ТОЧНО КАК В РАБОЧЕМ ТЕСТОВОМ ЭКРАНЕ - просто вызываем start() на том же recognition
      if (shouldContinue) {
        console.log('🔄 [SPEECH] Auto-restarting recognition (continuous mode)...');
        
        // Небольшая задержка перед перезапуском (как в тестовом экране)
        setTimeout(() => {
          if (this.onResultCallback && this.recognition) {
            try {
              // ПРОСТО перезапускаем тот же recognition (как в тестовом экране)
              console.log('🔄 [SPEECH] Restarting recognition...');
              this.recognition.start();
              this.isListening = true;
              console.log('✅ [SPEECH] Restarted successfully');
            } catch (error: any) {
              console.error('❌ [SPEECH] Failed to restart:', error);
              if (error.message && error.message.includes('already started')) {
                // Если "already started", значит уже работает
                this.isListening = true;
                console.log('ℹ️ [SPEECH] Already started, continuing...');
              } else {
                this.isListening = false;
              }
            }
          } else {
            console.log('ℹ️ [SPEECH] No callback or recognition, not restarting');
            this.isListening = false;
          }
        }, 100);
      } else {
        console.log('ℹ️ [SPEECH] Not restarting - shouldContinue was false');
        this.isListening = false;
      }
    };

    return recognition;
  }

  async startListening(
    onResult: (result: VoiceRecognitionResult) => void,
    onError?: (error: Error) => void
  ): Promise<boolean> {
    console.log('🔍 [SPEECH] startListening called');
    console.log('🔍 [SPEECH] SpeechRecognitionClass available:', !!this.SpeechRecognitionClass);
    console.log('🔍 [SPEECH] this.isListening:', this.isListening);
    
    if (!this.SpeechRecognitionClass) {
      console.error('❌ [SPEECH] SpeechRecognition class not available');
      return false;
    }

    // Останавливаем предыдущий recognition, если есть
    if (this.recognition && this.isListening) {
      console.log('🛑 [SPEECH] Stopping previous recognition...');
      try {
        this.recognition.stop();
        this.isListening = false;
        // Ждем немного перед перезапуском
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (e) {
        console.log('ℹ️ [SPEECH] Error stopping (may not be started):', e);
      }
    }

    // ВАЖНО: Создаем НОВЫЙ экземпляр каждый раз - ТОЧНО КАК В РАБОЧЕМ ТЕСТОВОМ ЭКРАНЕ!
    console.log('🔧 [SPEECH] Creating fresh recognition instance...');
    this.recognition = this.createRecognition();
    
    if (!this.recognition) {
      console.error('❌ [SPEECH] Failed to create recognition instance');
      return false;
    }

    this.onResultCallback = onResult;
    this.onErrorCallback = onError;
    
    console.log('🔍 [SPEECH] Callbacks set:', {
      hasResultCallback: !!this.onResultCallback,
      hasErrorCallback: !!this.onErrorCallback
    });

    try {
      // ВАЖНО: Для выбора конкретного микрофона нужно сначала запросить getUserMedia
      // с нужным устройством. Это "настроит" систему на использование этого устройства.
      // Speech Recognition API не поддерживает прямой выбор устройства, но если мы
      // запросим getUserMedia с нужным устройством перед запуском, система может использовать его.
      const selectedDeviceId = audioDeviceService.getSelectedDeviceId();
      if (selectedDeviceId && selectedDeviceId !== 'default') {
        console.log('🎤 [SPEECH] Selected device:', selectedDeviceId);
        try {
          const constraints = audioDeviceService.getMediaConstraints();
          console.log('🎤 [SPEECH] Requesting media stream with constraints:', constraints);
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          console.log('✅ [SPEECH] Got media stream with selected device');
          
          // Проверяем, какое устройство реально используется
          const audioTracks = stream.getAudioTracks();
          if (audioTracks.length > 0) {
            const track = audioTracks[0];
            const settings = track.getSettings();
            console.log('🎤 [SPEECH] Active device settings:', {
              deviceId: settings.deviceId,
              label: track.label,
              groupId: settings.groupId
            });
          }
          
          // НЕ останавливаем поток сразу - даем системе время "переключиться" на это устройство
          // Speech Recognition создаст свой поток, но система может использовать то же устройство
          // Остановим поток через небольшую задержку
          setTimeout(() => {
            try {
              stream.getTracks().forEach(track => {
                if (track.readyState === 'live') {
                  track.stop();
                  console.log('🛑 [SPEECH] Stopped preview stream track');
                }
              });
            } catch (e) {
              // Игнорируем ошибки при остановке
            }
          }, 500);
        } catch (error: any) {
          console.warn('⚠️ [SPEECH] Could not get media stream with selected device, using default:', error.message);
        }
      } else {
        console.log('ℹ️ [SPEECH] No specific device selected, using system default');
      }
      
      // Speech Recognition САМ запросит микрофон при start()
      // Но если мы уже запросили getUserMedia с нужным устройством,
      // система будет использовать это устройство
      console.log('🚀 [SPEECH] Calling recognition.start()...');
      this.recognition.start();
      this.isListening = true;
      console.log('✅ [SPEECH] recognition.start() called successfully');
      console.log('✅ [SPEECH] isListening set to true');
      console.log('✅ [SPEECH] Waiting for onstart event...');
      return true;
    } catch (error: any) {
      console.error('❌ [SPEECH] Start error:', error);
      console.error('❌ [SPEECH] Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      if (error.message && error.message.includes('already started')) {
        console.log('ℹ️ [SPEECH] Already started, setting isListening to true');
        this.isListening = true;
        return true;
      }
      this.isListening = false;
      return false;
    }
  }

  stopListening(): void {
    console.log('🛑 [SPEECH] Stopping');
    this.isListening = false;
    
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (error) {
        console.error('❌ [SPEECH] Stop error:', error);
      }
    }
    
    this.onResultCallback = undefined;
    this.onErrorCallback = undefined;
  }

  isAvailable(): boolean {
    const available = Platform.OS === 'web' && this.SpeechRecognitionClass !== null;
    console.log('🔍 [SPEECH] isAvailable() called:', {
      platform: Platform.OS,
      hasSpeechRecognitionClass: !!this.SpeechRecognitionClass,
      result: available
    });
    return available;
  }
}

export const voiceRecognitionService = new VoiceRecognitionService();
