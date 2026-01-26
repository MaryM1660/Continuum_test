// Сервис для работы с аудио устройствами (микрофоны)
import { Platform } from 'react-native';
import { Audio } from 'expo-av';

export interface AudioInputDevice {
  id: string;
  label: string;
  type: 'builtin' | 'bluetooth' | 'wired' | 'usb' | 'default';
  isDefault?: boolean;
}

class AudioDeviceService {
  private selectedDeviceId: string | null = null;

  /**
   * Получить список доступных микрофонов
   */
  async getAvailableDevices(): Promise<AudioInputDevice[]> {
    // ВАЖНО: Проверяем не только Platform.OS, но и наличие Web API
    // На мобильном веб-браузере Platform.OS === 'web', но нужно убедиться
    const isWeb = Platform.OS === 'web' || (typeof window !== 'undefined' && typeof navigator !== 'undefined' && navigator.mediaDevices);
    
    console.log('🔍 [AUDIO] Platform detection:', {
      PlatformOS: Platform.OS,
      hasWindow: typeof window !== 'undefined',
      hasNavigator: typeof navigator !== 'undefined',
      hasMediaDevices: typeof navigator !== 'undefined' && !!navigator.mediaDevices,
      isWeb: isWeb
    });
    
    if (isWeb) {
      return this.getWebDevices();
    } else {
      return this.getMobileDevices();
    }
  }

  /**
   * Получить устройства для web платформы
   */
  private async getWebDevices(): Promise<AudioInputDevice[]> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        console.warn('MediaDevices API not available');
        return [{ id: 'default', label: 'Default Microphone', type: 'default', isDefault: true }];
      }

      // ВАЖНО: Сначала нужно получить разрешение, чтобы получить labels устройств
      // Без разрешения labels будут пустыми
      // В мобильном Chrome это особенно важно
      let permissionGranted = false;
      let tempStream: MediaStream | null = null;
      
      // ВАЖНО: Проверяем, есть ли уже активный поток микрофона
      // Если есть, используем его для получения labels
      let hasActiveStream = false;
      try {
        // Пытаемся получить активные треки из всех возможных источников
        if (typeof window !== 'undefined' && (window as any).currentMediaStream) {
          const existingStream = (window as any).currentMediaStream;
          const tracks = existingStream.getAudioTracks();
          if (tracks.length > 0 && tracks[0].readyState === 'live') {
            console.log('✅ [AUDIO] Found existing active media stream, using it');
            tempStream = existingStream;
            permissionGranted = true;
            hasActiveStream = true;
          }
        }
      } catch (e) {
        // Игнорируем ошибки при проверке существующего потока
      }

      // Если нет активного потока, запрашиваем новый
      if (!hasActiveStream) {
        try {
          console.log('🎤 [AUDIO] Requesting permission to enumerate devices...');
          console.log('🎤 [AUDIO] User agent:', typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown');
          
          // Запрашиваем разрешение с более явными constraints
          tempStream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            }
          });
          permissionGranted = true;
          console.log('✅ [AUDIO] Permission granted, can enumerate devices with labels');
          console.log('✅ [AUDIO] Stream tracks:', tempStream.getTracks().map(t => ({
            kind: t.kind,
            label: t.label,
            enabled: t.enabled,
            readyState: t.readyState
          })));
          
          // Сохраняем поток глобально для возможного повторного использования
          if (typeof window !== 'undefined') {
            (window as any).currentMediaStream = tempStream;
          }
        } catch (error: any) {
          console.warn('⚠️ [AUDIO] Permission not granted or error:', error.message);
          console.warn('⚠️ [AUDIO] Error details:', {
            name: error.name,
            message: error.message,
            constraint: error.constraint
          });
          // Продолжаем, но labels могут быть пустыми
        }
      }
      
      // ВАЖНО: В мобильном Chrome нужно подождать больше перед enumerateDevices
      // чтобы система успела обновить список устройств
      // Увеличиваем задержку для мобильных устройств
      // Также проверяем touch events для более точного определения мобильного устройства
      const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
      const hasTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) || 
                       (hasTouch && window.innerWidth < 768); // Дополнительная проверка по размеру экрана
      
      const delay = isMobile ? 1000 : 200; // Увеличена задержка для мобильных до 1 секунды
      console.log(`⏳ [AUDIO] Waiting ${delay}ms before enumerating devices (mobile: ${isMobile}, hasTouch: ${hasTouch})...`);
      await new Promise(resolve => setTimeout(resolve, delay));

      // Получаем список устройств
      // ВАЖНО: На мобильных устройствах может потребоваться несколько попыток
      console.log('🎤 [AUDIO] Enumerating devices...');
      let devices: MediaDeviceInfo[] = [];
      let attempts = 0;
      const maxAttempts = isMobile ? 3 : 1;
      
      while (attempts < maxAttempts && devices.length === 0) {
        devices = await navigator.mediaDevices.enumerateDevices();
        console.log(`🎤 [AUDIO] Attempt ${attempts + 1}: Total devices found: ${devices.length}`);
        
        if (devices.length === 0 && attempts < maxAttempts - 1) {
          // Ждем еще немного перед следующей попыткой
          await new Promise(resolve => setTimeout(resolve, 300));
        }
        attempts++;
      }
      
      console.log(`🎤 [AUDIO] Final total devices found: ${devices.length}`);
      
      // ВАЖНО: НЕ останавливаем поток сразу, если он был только что создан
      // На мобильном Chrome это может привести к потере labels
      // Останавливаем только если это был временный поток (не сохраненный глобально)
      // НО: на мобильных устройствах лучше не останавливать поток вообще, 
      // чтобы система могла использовать его для перечисления устройств
      // (isMobile уже объявлена выше на строке 117)
      
      if (tempStream && !hasActiveStream && !isMobile) {
        // На десктопе останавливаем поток через задержку
        setTimeout(() => {
          try {
            tempStream?.getTracks().forEach(track => {
              if (track.readyState === 'live') {
                track.stop();
                console.log('🛑 [AUDIO] Stopped temp stream track');
              }
            });
          } catch (e) {
            // Игнорируем ошибки при остановке
          }
        }, 1000); // Останавливаем через 1 секунду после enumerateDevices
      } else if (tempStream && isMobile) {
        // На мобильных не останавливаем поток - он нужен для правильного перечисления
        console.log('📱 [AUDIO] Keeping stream alive on mobile for device enumeration');
      }

      // ВАЖНО: На мобильных устройствах используем label из активного трека потока
      // если enumerateDevices не вернул labels
      let trackLabel: string | null = null;
      if (tempStream && isMobile) {
        const tracks = tempStream.getAudioTracks();
        if (tracks.length > 0 && tracks[0].label) {
          trackLabel = tracks[0].label;
          console.log('📱 [AUDIO] Using track label from active stream:', trackLabel);
        }
      }

      const audioInputs = devices
        .filter(device => device.kind === 'audioinput')
        .map((device, index) => {
          let type: AudioInputDevice['type'] = 'builtin';
          // Используем label из устройства, или из трека, или пустую строку
          let label = device.label || trackLabel || '';
          
          console.log(`🎤 [AUDIO] Device ${index}:`, {
            deviceId: device.deviceId,
            label: label || '(empty)',
            groupId: device.groupId,
            fromTrack: !!trackLabel && !device.label
          });
          
          // Если label пустой (нет разрешения или устройство не перечислено)
          if (!label || label.trim() === '') {
            // Пытаемся определить по deviceId или groupId
            const deviceId = device.deviceId || '';
            const deviceIdLower = deviceId.toLowerCase();
            if (deviceIdLower === 'default' || deviceIdLower.includes('default')) {
              label = 'Default Microphone';
              type = 'default';
            } else if (deviceIdLower === 'communications') {
              label = 'Communications Microphone';
              type = 'default';
            } else {
              // В мобильном Chrome устройства могут иметь пустые labels, но разные deviceId
              // На мобильных устройствах часто только одно устройство - встроенный микрофон
              if (isMobile && devices.filter(d => d.kind === 'audioinput').length === 1) {
                label = 'Built-in Microphone';
                type = 'builtin';
              } else {
                // Используем deviceId для различения (безопасно)
                const deviceIdPreview = deviceId ? (deviceId.length > 8 ? deviceId.substring(0, 8) + '...' : deviceId) : 'unknown';
                label = `Microphone ${index + 1}${deviceId ? ` (${deviceIdPreview})` : ''}`;
                // Пытаемся определить тип по groupId или другим признакам
                if (device.groupId && device.groupId.includes('bluetooth')) {
                  type = 'bluetooth';
                  label = 'Bluetooth Device';
                } else if (device.groupId && device.groupId.includes('headset')) {
                  type = 'wired';
                  label = 'Wired Headset';
                }
              }
            }
          } else {
            // Определяем тип устройства по label
            const labelLower = label.toLowerCase();
            if (labelLower.includes('bluetooth') || labelLower.includes('bt') || labelLower.includes('wireless')) {
              type = 'bluetooth';
            } else if (labelLower.includes('headset') || labelLower.includes('headphone') || labelLower.includes('earphone')) {
              type = 'wired';
            } else if (labelLower.includes('usb')) {
              type = 'usb';
            } else if (labelLower.includes('default') || labelLower.includes('built-in') || labelLower.includes('internal')) {
              type = 'default';
            }
          }

          return {
            id: device.deviceId || `device-${index}`, // Fallback если deviceId undefined
            label: label,
            type: type,
            isDefault: index === 0 || device.deviceId === 'default' || !device.deviceId,
          };
        });

      // Если нет устройств, возвращаем дефолтное
      if (audioInputs.length === 0) {
        console.warn('⚠️ [AUDIO] No audio input devices found');
        console.warn('⚠️ [AUDIO] This might happen if:');
        console.warn('   - Permission was not granted');
        console.warn('   - No audio input devices are connected');
        console.warn('   - Browser does not support enumerateDevices');
        return [{ id: 'default', label: 'Default Microphone', type: 'default', isDefault: true }];
      }

      console.log(`✅ [AUDIO] Found ${audioInputs.length} audio input devices:`);
      audioInputs.forEach((device, index) => {
        const deviceId = device.id || 'unknown';
        const deviceIdPreview = typeof deviceId === 'string' && deviceId.length > 20 
          ? deviceId.substring(0, 20) + '...' 
          : deviceId;
        console.log(`   ${index + 1}. ${device.label} (${device.type}) - ID: ${deviceIdPreview}`);
      });
      
      return audioInputs;
    } catch (error) {
      console.error('❌ [AUDIO] Error getting web devices:', error);
      return [{ id: 'default', label: 'Default Microphone', type: 'default', isDefault: true }];
    }
  }

  /**
   * Получить устройства для мобильных платформ
   * На мобильных выбор микрофона ограничен системными настройками
   */
  private async getMobileDevices(): Promise<AudioInputDevice[]> {
    try {
      // На мобильных платформах expo-av не предоставляет прямого API для получения списка устройств
      // Возвращаем системные опции
      const devices: AudioInputDevice[] = [
        {
          id: 'default',
          label: 'System Default',
          type: 'default',
          isDefault: true,
        },
      ];

      // Пытаемся определить доступные типы устройств через Audio API
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        // На iOS можно определить тип текущего устройства через AVAudioSession
        // Но для Expo managed workflow это ограничено
        // Добавляем общие опции
        devices.push(
          {
            id: 'builtin',
            label: 'Built-in Microphone',
            type: 'builtin',
          },
          {
            id: 'bluetooth',
            label: 'Bluetooth Device',
            type: 'bluetooth',
          },
          {
            id: 'wired',
            label: 'Wired Headset',
            type: 'wired',
          }
        );
      } catch (error) {
        console.warn('Error setting audio mode:', error);
      }

      return devices;
    } catch (error) {
      console.error('Error getting mobile devices:', error);
      return [{ id: 'default', label: 'System Default', type: 'default', isDefault: true }];
    }
  }

  /**
   * Выбрать устройство
   */
  async selectDevice(deviceId: string): Promise<boolean> {
    try {
      this.selectedDeviceId = deviceId;
      
      if (Platform.OS === 'web') {
        // На web можно использовать deviceId в getUserMedia constraints
        return true;
      } else {
        // На мобильных выбор устройства происходит через системные настройки
        // expo-av использует системное устройство по умолчанию
        console.log('Device selection on mobile is handled by system settings');
        return true;
      }
    } catch (error) {
      console.error('Error selecting device:', error);
      return false;
    }
  }

  /**
   * Получить текущее выбранное устройство
   */
  getSelectedDeviceId(): string | null {
    return this.selectedDeviceId;
  }

  /**
   * Получить constraints для getUserMedia с выбранным устройством
   */
  getMediaConstraints(): MediaStreamConstraints {
    if (Platform.OS === 'web' && this.selectedDeviceId && this.selectedDeviceId !== 'default') {
      return {
        audio: {
          deviceId: { exact: this.selectedDeviceId },
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      };
    }
    
    return {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    };
  }
}

export const audioDeviceService = new AudioDeviceService();

