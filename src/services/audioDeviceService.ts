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
    if (Platform.OS === 'web') {
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
      let permissionGranted = false;
      let tempStream: MediaStream | null = null;
      
      try {
        tempStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        permissionGranted = true;
        console.log('✅ [AUDIO] Permission granted, can enumerate devices with labels');
      } catch (error: any) {
        console.warn('⚠️ [AUDIO] Permission not granted or error:', error.message);
        // Продолжаем, но labels могут быть пустыми
      }

      // Получаем список устройств
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      // Останавливаем временный поток, если был создан
      if (tempStream) {
        tempStream.getTracks().forEach(track => track.stop());
        tempStream = null;
      }

      const audioInputs = devices
        .filter(device => device.kind === 'audioinput')
        .map((device, index) => {
          let type: AudioInputDevice['type'] = 'builtin';
          let label = device.label;
          
          // Если label пустой (нет разрешения или устройство не перечислено)
          if (!label || label.trim() === '') {
            // Пытаемся определить по deviceId
            if (device.deviceId === 'default' || device.deviceId.includes('default')) {
              label = 'Default Microphone';
              type = 'default';
            } else {
              label = `Microphone ${index + 1}`;
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
            id: device.deviceId,
            label: label,
            type: type,
            isDefault: index === 0 || device.deviceId === 'default',
          };
        });

      // Если нет устройств, возвращаем дефолтное
      if (audioInputs.length === 0) {
        console.warn('⚠️ [AUDIO] No audio input devices found');
        return [{ id: 'default', label: 'Default Microphone', type: 'default', isDefault: true }];
      }

      console.log(`✅ [AUDIO] Found ${audioInputs.length} audio input devices:`, audioInputs.map(d => d.label));
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

