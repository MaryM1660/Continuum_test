// Интеграция с бесплатным LLM API (Hugging Face Inference API)
// Используем модель Mistral-7B или Llama-2 для бесплатного использования

const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models';
const DEFAULT_MODEL = 'mistralai/Mistral-7B-Instruct-v0.2'; // Бесплатная модель

// Альтернативные бесплатные модели:
// - 'meta-llama/Llama-2-7b-chat-hf' (требует токен)
// - 'google/flan-t5-base' (меньше, но быстрее)
// - 'microsoft/DialoGPT-medium' (для диалогов)

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  text: string;
  error?: string;
}

// Базовый системный промпт для карьерного коуча
const BASE_SYSTEM_PROMPT = `You are a friendly and supportive AI career coach for tech professionals (software engineers, DevOps, data scientists, product managers). 

Your role:
- Help users think through their career direction and strategy
- Ask thoughtful questions to help them reflect
- Encourage honesty and sharing messy thoughts
- Do NOT give ready-made instructions or write resumes
- Focus on helping users think out loud and explore their goals

Keep responses:
- Conversational and natural (like a real conversation)
- Short and focused (2-3 sentences max)
- Supportive and non-judgmental
- Encouraging users to share more details

Start conversations naturally and ask open-ended questions.`;

class LLMService {
  private apiKey: string | null = null;
  private conversationHistory: LLMMessage[] = [];
  private baseSystemPrompt: string = BASE_SYSTEM_PROMPT;
  private customSystemPrompt: string | null = null;

  constructor() {
    // API ключ устанавливается через переменную окружения
    // Для Hugging Face можно использовать бесплатный токен: https://huggingface.co/settings/tokens
    // В production используйте переменные окружения для безопасности
    if (typeof window !== 'undefined') {
      // На веб используем токен из переменной окружения
      // @ts-ignore - для веб-окружения
      this.apiKey = process.env.REACT_APP_HUGGINGFACE_API_KEY || 
                    process.env.HUGGINGFACE_API_KEY || 
                    null;
    } else {
      // На мобильных платформах
      this.apiKey = process.env.HUGGINGFACE_API_KEY || null;
    }
  }

  setApiKey(key: string): void {
    this.apiKey = key;
  }

  /**
   * Установить пользовательский системный промпт.
   * Пустая строка сбрасывает к базовому промпту.
   */
  setSystemPrompt(customPrompt?: string): void {
    const trimmed = customPrompt?.trim();
    this.customSystemPrompt = trimmed && trimmed.length > 0 ? trimmed : null;
    // После изменения промпта сразу сбрасываем историю
    this.resetConversation();
  }

  /**
   * Получить текущий кастомный промпт (без базового).
   */
  getCustomPrompt(): string | null {
    return this.customSystemPrompt;
  }

  /**
   * Сбросить историю разговора, опционально временно переопределив промпт.
   */
  resetConversation(customPrompt?: string): void {
    if (typeof customPrompt === 'string') {
      const trimmed = customPrompt.trim();
      this.customSystemPrompt = trimmed && trimmed.length > 0 ? trimmed : null;
    }

    this.conversationHistory = [
      { role: 'system', content: this.getEffectiveSystemPrompt() },
    ];
  }

  /**
   * Получить итоговый системный промпт:
   * базовый + (опционально) пользовательский.
   */
  private getEffectiveSystemPrompt(): string {
    if (!this.customSystemPrompt) {
      return this.baseSystemPrompt;
    }

    return `${this.baseSystemPrompt}

Additional instructions for the assistant (user provided):
${this.customSystemPrompt}`.trim();
  }

  async chat(userMessage: string): Promise<LLMResponse> {
    try {
      // Добавляем сообщение пользователя в историю
      this.conversationHistory.push({ role: 'user', content: userMessage });

      // Формируем промпт для модели
      const prompt = this.formatPrompt();

      // Вызываем серверный прокси, чтобы избежать CORS и не светить ключ
      const response = await fetch('/api/llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`LLM proxy error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const assistantText = (data.text || '').toString().trim() || JSON.stringify(data);

      // Добавляем ответ ассистента в историю
      this.conversationHistory.push({ role: 'assistant', content: assistantText });

      return { text: assistantText };
    } catch (error: any) {
      console.error('LLM service error:', error);
      
      // Fallback ответ
      const fallbackResponses = [
        "I'm here to help you think through your career. What's on your mind?",
        "Tell me more about what you're thinking about your career direction.",
        "That's interesting. Can you share more details about that?",
      ];
      const fallbackText = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
      return { 
        text: fallbackText,
        error: error.message,
      };
    }
  }

  private formatPrompt(): string {
    // Форматируем историю разговора для модели
    let prompt = this.getEffectiveSystemPrompt() + '\n\n';
    
    // Добавляем последние несколько сообщений (чтобы не перегружать)
    const recentMessages = this.conversationHistory.slice(-6); // Последние 6 сообщений
    for (const msg of recentMessages) {
      if (msg.role === 'user') {
        prompt += `User: ${msg.content}\n`;
      } else if (msg.role === 'assistant') {
        prompt += `Assistant: ${msg.content}\n`;
      }
    }
    
    prompt += 'Assistant:';
    
    return prompt;
  }

  getConversationHistory(): LLMMessage[] {
    return [...this.conversationHistory];
  }
}

export const llmService = new LLMService();

