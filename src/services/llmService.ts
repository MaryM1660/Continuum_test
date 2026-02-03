// Интеграция с бесплатным LLM API (Hugging Face Inference API)
// Используем модель Mistral-7B или Llama-2 для бесплатного использования

const HUGGINGFACE_API_URL = 'https://router.huggingface.co';
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

      // Пытаемся использовать серверный прокси (работает в production на Vercel)
      // Если 404 - значит локальная разработка, используем прямой вызов к HF
      let assistantText = '';
      try {
        const response = await fetch('/api/llm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          assistantText = (data.text || '').toString().trim() || JSON.stringify(data);
        } else if (response.status === 404) {
          // Локальная разработка - используем прямой вызов к HF
          console.log('⚠️ [LLM] API proxy not available (local dev), using direct HF call');
          assistantText = await this.callHuggingFaceDirect(prompt);
        } else {
          const errorText = await response.text();
          throw new Error(`LLM proxy error: ${response.status} - ${errorText}`);
        }
      } catch (fetchError: any) {
        // Если fetch к /api/llm упал (404, network error), пробуем прямой вызов
        if (fetchError.message?.includes('404') || fetchError.message?.includes('Failed to fetch')) {
          console.log('⚠️ [LLM] API proxy unavailable, trying direct HF call');
          try {
            assistantText = await this.callHuggingFaceDirect(prompt);
          } catch (directError: any) {
            // Если прямой вызов тоже упал (CORS), используем fallback
            throw directError;
          }
        } else {
          throw fetchError;
        }
      }

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

  /**
   * Прямой вызов к Hugging Face (для локальной разработки)
   * В production этот метод не используется - все идет через /api/llm
   */
  private async callHuggingFaceDirect(prompt: string): Promise<string> {
    // New Hugging Face Router API format
    const response = await fetch(`${HUGGINGFACE_API_URL}/models/${DEFAULT_MODEL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.7,
          top_p: 0.9,
          return_full_text: false,
        },
      }),
    });

    if (!response.ok) {
      // Если модель загружается, ждем и повторяем
      if (response.status === 503) {
        const retryAfter = response.headers.get('Retry-After');
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 10000;
        console.log(`Model loading, waiting ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return this.callHuggingFaceDirect(prompt); // Рекурсивный вызов
      }

      const errorText = await response.text();
      throw new Error(`LLM API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // Обрабатываем ответ (формат зависит от модели)
    let assistantText = '';
    if (Array.isArray(data) && data[0]?.generated_text) {
      assistantText = data[0].generated_text.trim();
    } else if (data.generated_text) {
      assistantText = data.generated_text.trim();
    } else if (typeof data === 'string') {
      assistantText = data.trim();
    } else {
      assistantText = JSON.stringify(data);
    }

    // Убираем промпт из ответа, если он там есть
    assistantText = assistantText.replace(prompt, '').trim();

    return assistantText;
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

