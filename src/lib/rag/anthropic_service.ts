import { Anthropic } from '@anthropic-ai/sdk';

export class AnthropicService {
  private client: Anthropic;
  private model: string;

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || '',
    });
    this.model = 'claude-3-opus-20240229';
  }

  async generateResponse(context: string, query: string): Promise<string> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 1024,
      system: "Anda adalah asisten yang membantu menjawab pertanyaan berdasarkan konteks yang diberikan.",
      messages: [
        {
          role: "user",
          content: `Gunakan konteks berikut untuk menjawab pertanyaan:\n\nKonteks: ${context}\n\nPertanyaan: ${query}\n\nBerikan jawaban yang ringkas dan relevan berdasarkan konteks yang diberikan. Jika konteks tidak cukup untuk menjawab pertanyaan, katakan saja bahwa Anda tidak memiliki informasi yang cukup untuk menjawab pertanyaan tersebut.`,
        },
      ],
    });

    return response.content[0].text; // Ambil isi text dari respons Claude
  }
}
