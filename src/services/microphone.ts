// Реальный доступ к микрофону через Web Audio API
import { Platform } from 'react-native';

export interface AudioLevelCallback {
  (level: number): void;
}

class MicrophoneService {
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array | null = null;
  private animationFrameId: number | null = null;
  private onLevelCallback: AudioLevelCallback | null = null;

  async requestPermission(): Promise<boolean> {
    if (Platform.OS !== 'web') {
      return false;
    }

    // Проверяем доступность API
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('getUserMedia is not supported');
      return false;
    }

    try {
      // Запрашиваем разрешение с правильными constraints
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });
      // Останавливаем сразу, просто проверяем доступ
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error: any) {
      console.error('Microphone permission denied:', error);
      if (error.name === 'NotAllowedError') {
        console.error('User denied microphone access');
      } else if (error.name === 'NotFoundError') {
        console.error('No microphone found');
      }
      return false;
    }
  }

  async startRecording(onLevel?: AudioLevelCallback): Promise<boolean> {
    if (Platform.OS !== 'web') {
      return false;
    }

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });

      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;
      
      source.connect(this.analyser);
      
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
      
      this.onLevelCallback = onLevel || null;
      
      this.startLevelMonitoring();
      
      return true;
    } catch (error) {
      console.error('Error starting microphone:', error);
      return false;
    }
  }

  private startLevelMonitoring(): void {
    if (!this.analyser || !this.dataArray) return;

    const updateLevel = () => {
      if (!this.analyser || !this.dataArray) return;

      this.analyser.getByteFrequencyData(this.dataArray);
      
      // Вычисляем средний уровень
      let sum = 0;
      for (let i = 0; i < this.dataArray.length; i++) {
        sum += this.dataArray[i];
      }
      const average = sum / this.dataArray.length;
      const level = Math.min(average / 255, 1); // Нормализуем до 0-1

      if (this.onLevelCallback) {
        this.onLevelCallback(level);
      }

      this.animationFrameId = requestAnimationFrame(updateLevel);
    };

    updateLevel();
  }

  stopRecording(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.analyser = null;
    this.dataArray = null;
    this.onLevelCallback = null;
  }

  isRecording(): boolean {
    return this.mediaStream !== null && this.mediaStream.active;
  }
}

export const microphoneService = new MicrophoneService();

