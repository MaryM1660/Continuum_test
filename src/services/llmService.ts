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

// Системный промпт для карьерного коуча
const SYSTEM_PROMPT = `You are a friendly and supportive AI career coach for tech professionals (software engineers, DevOps, data scientists, product managers). 

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

  resetConversation(): void {
    this.conversationHistory = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];
  }

  async chat(userMessage: string): Promise<LLMResponse> {
    try {
      // Добавляем сообщение пользователя в историю
      this.conversationHistory.push({ role: 'user', content: userMessage });

      // Формируем промпт для модели
      const prompt = this.formatPrompt();

      // Вызываем API
      const response = await fetch(`${HUGGINGFACE_API_URL}/${DEFAULT_MODEL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 150, // Ограничиваем длину ответа
            temperature: 0.7, // Креативность
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
          return this.chat(userMessage); // Рекурсивный вызов
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
    let prompt = SYSTEM_PROMPT + '\n\n';
    
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

