// Эмулятор голосового ввода для тестирования
// Позволяет эмулировать речь пользователя без реального микрофона

export interface EmulatedSpeech {
  text: string;
  duration: number; // в миллисекундах
  delay?: number; // задержка перед началом (для эмуляции паузы)
}

class VoiceEmulator {
  private isEmulating: boolean = false;
  private onTextCallback?: (text: string) => void;
  private currentTimeout: NodeJS.Timeout | null = null;

  // Эмулированные фразы для тестирования
  private testPhrases: EmulatedSpeech[] = [
    { text: "Hello, I'm thinking about my career direction", duration: 3000 },
    { text: "I want to explore opportunities in data science", duration: 2500 },
    { text: "What should I focus on?", duration: 2000 },
  ];

  startEmulation(
    onText: (text: string) => void,
    phrases?: EmulatedSpeech[]
  ): void {
    if (this.isEmulating) return;

    this.isEmulating = true;
    this.onTextCallback = onText;
    const phrasesToUse = phrases || this.testPhrases;

    let phraseIndex = 0;

    const emitNextPhrase = () => {
      if (!this.isEmulating || phraseIndex >= phrasesToUse.length) {
        this.isEmulating = false;
        return;
      }

      const phrase = phrasesToUse[phraseIndex];
      
      // Эмулируем промежуточные результаты
      const words = phrase.text.split(' ');
      let currentText = '';

      words.forEach((word, index) => {
        setTimeout(() => {
          if (!this.isEmulating) return;
          currentText += (currentText ? ' ' : '') + word;
          // Эмулируем промежуточный результат
          if (this.onTextCallback) {
            this.onTextCallback(currentText);
          }
        }, (phrase.duration / words.length) * index);
      });

      // Эмулируем финальный результат
      setTimeout(() => {
        if (!this.isEmulating) return;
        if (this.onTextCallback) {
          this.onTextCallback(phrase.text);
        }
        phraseIndex++;
        
        // Следующая фраза через паузу
        if (phraseIndex < phrasesToUse.length) {
          this.currentTimeout = setTimeout(emitNextPhrase, 2000);
        } else {
          this.isEmulating = false;
        }
      }, phrase.duration);
    };

    emitNextPhrase();
  }

  stopEmulation(): void {
    this.isEmulating = false;
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
  }

  isActive(): boolean {
    return this.isEmulating;
  }
}

export const voiceEmulator = new VoiceEmulator();

