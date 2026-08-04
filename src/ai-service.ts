export type AIProvider = "openai" | "anthropic" | "google" | "custom" | "openrouter" | "groq";

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model?: string;
  baseURL?: string; // For custom endpoints
}

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export abstract class AIProviderBase {
  protected config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  abstract chat(messages: AIMessage[], systemInstruction?: string): Promise<AIResponse>;
  abstract getDefaultModel(): string;
}

export class OpenAIProvider extends AIProviderBase {
  getDefaultModel(): string {
    return "gpt-4o-mini";
  }

  async chat(messages: AIMessage[], systemInstruction?: string): Promise<AIResponse> {
    const model = this.config.model || this.getDefaultModel();
    const baseURL = this.config.baseURL || "https://api.openai.com/v1";

    const apiMessages: any[] = [];

    if (systemInstruction) {
      apiMessages.push({ role: "system", content: systemInstruction });
    }

    for (const msg of messages) {
      apiMessages.push({
        role: msg.role,
        content: msg.content,
      });
    }

    const response = await fetch(`${baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: apiMessages,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      },
    };
  }
}

export class AnthropicProvider extends AIProviderBase {
  getDefaultModel(): string {
    return "claude-3-5-haiku-20241022";
  }

  async chat(messages: AIMessage[], systemInstruction?: string): Promise<AIResponse> {
    const model = this.config.model || this.getDefaultModel();

    const apiMessages = messages.map((msg) => ({
      role: msg.role === "system" ? "user" : msg.role,
      content: msg.content,
    }));

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.config.apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        system: systemInstruction,
        messages: apiMessages,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Anthropic API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return {
      content: data.content[0].text,
      usage: {
        promptTokens: data.usage?.input_tokens || 0,
        completionTokens: data.usage?.output_tokens || 0,
        totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
      },
    };
  }
}

export class GroqProvider extends AIProviderBase {
  getDefaultModel(): string {
    return "llama-3.3-70b-versatile";
  }

  async chat(messages: AIMessage[], systemInstruction?: string): Promise<AIResponse> {
    const model = this.config.model || this.getDefaultModel();
    const baseURL = this.config.baseURL || "https://api.groq.com/openai/v1";

    const apiMessages: any[] = [];

    if (systemInstruction) {
      apiMessages.push({ role: "system", content: systemInstruction });
    }

    for (const msg of messages) {
      apiMessages.push({
        role: msg.role,
        content: msg.content,
      });
    }

    const response = await fetch(`${baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: apiMessages,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      },
    };
  }
}

export class GoogleProvider extends AIProviderBase {
  getDefaultModel(): string {
    return "gemini-2.0-flash-exp";
  }

  async chat(messages: AIMessage[], systemInstruction?: string): Promise<AIResponse> {
    const model = this.config.model || this.getDefaultModel();
    const baseURL = this.config.baseURL || "https://generativelanguage.googleapis.com/v1beta";

    // Convert messages to Gemini format
    const contents = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    const systemInstructionPart = systemInstruction
      ? {
          parts: [{ text: systemInstruction }],
        }
      : undefined;

    const response = await fetch(
      `${baseURL}/models/${model}:generateContent?key=${this.config.apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          systemInstruction: systemInstructionPart,
          generationConfig: {
            temperature: 0.3,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Google Gemini API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return {
      content: data.candidates?.[0]?.content?.parts?.[0]?.text || "",
    };
  }
}

export class CustomProvider extends AIProviderBase {
  getDefaultModel(): string {
    return "default";
  }

  async chat(messages: AIMessage[], systemInstruction?: string): Promise<AIResponse> {
    if (!this.config.baseURL) {
      throw new Error("Custom provider requires baseURL in config");
    }

    const apiMessages: any[] = [];

    if (systemInstruction) {
      apiMessages.push({ role: "system", content: systemInstruction });
    }

    for (const msg of messages) {
      apiMessages.push({
        role: msg.role,
        content: msg.content,
      });
    }

    const response = await fetch(`${this.config.baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model || "default",
        messages: apiMessages,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Custom API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return {
      content: data.choices?.[0]?.message?.content || data.response || data.text || JSON.stringify(data),
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      },
    };
  }
}

export function createAIProvider(config: AIConfig): AIProviderBase {
  switch (config.provider) {
    case "openai":
      return new OpenAIProvider(config);
    case "anthropic":
      return new AnthropicProvider(config);
    case "google":
      return new GoogleProvider(config);
    case "groq":
      return new GroqProvider(config);
    case "custom":
    case "openrouter":
      // OpenRouter uses OpenAI-compatible API
      return new CustomProvider(config);
    default:
      throw new Error(`Unsupported AI provider: ${config.provider}`);
  }
}
