// Universal LLM proxy for Vercel serverless environment
// Provider-agnostic: supports Hugging Face by default, OpenRouter optionally.

const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

type Provider = 'huggingface' | 'openrouter' | 'openai';

interface ProxyRequestBody {
  prompt?: string;
}

export default async function handler(req: any, res: any) {
  // Basic CORS support so that localhost dev can call the proxy on Vercel
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body: ProxyRequestBody;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }

  const prompt = body.prompt;
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'Missing or empty "prompt" field' });
  }

  const provider = (process.env.LLM_PROVIDER as Provider | undefined) || 'huggingface';

  try {
    if (provider === 'huggingface') {
      const model = process.env.LLM_MODEL || 'mistralai/Mistral-7B-Instruct-v0.2';
      const apiKey = process.env.HUGGINGFACE_API_KEY;

      const hfResponse = await fetch(`${HUGGINGFACE_API_URL}/${model}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
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

      if (!hfResponse.ok) {
        const errorText = await hfResponse.text();
        return res.status(hfResponse.status).json({
          text: "I'm here to help you think through your career. What's on your mind?",
          error: `HF error: ${hfResponse.status} - ${errorText}`,
        });
      }

      const data = await hfResponse.json();
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

      return res.status(200).json({ text: assistantText });
    }

    if (provider === 'openrouter') {
      const model = process.env.LLM_MODEL || 'openai/gpt-4o-mini';
      const apiKey = process.env.OPENROUTER_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: 'Missing OPENROUTER_API_KEY env variable' });
      }

      const orResponse = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.OPENROUTER_SITE_URL || '',
          'X-Title': 'Continuum Career Coach',
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 256,
          temperature: 0.7,
        }),
      });

      if (!orResponse.ok) {
        const errorText = await orResponse.text();
        return res.status(orResponse.status).json({
          text: "I'm here to help you think through your career. What's on your mind?",
          error: `OpenRouter error: ${orResponse.status} - ${errorText}`,
        });
      }

      const data = await orResponse.json();
      const choice = data.choices?.[0];
      const assistantText =
        (choice?.message?.content && String(choice.message.content).trim()) ||
        JSON.stringify(data);

      return res.status(200).json({ text: assistantText });
    }

    // Placeholder for future direct OpenAI provider if needed
    return res.status(500).json({ error: `Unsupported LLM_PROVIDER: ${provider}` });
  } catch (error: any) {
    console.error('LLM proxy error:', error);
    return res.status(500).json({
      text: "I'm here to help you think through your career. What's on your mind?",
      error: error?.message || 'Unknown error in /api/llm',
    });
  }
}


