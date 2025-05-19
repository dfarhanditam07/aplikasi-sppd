import { EmbeddingService } from './embedding_service';
import { AnthropicService } from './anthropic_service';

export class RAGService {
  private anthropic: AnthropicService;
  private embeddingService: EmbeddingService;

  constructor() {
    this.anthropic = new AnthropicService();
    this.embeddingService = new EmbeddingService();
  }

  async query(question: string): Promise<string> {
    // Retrieve relevant documents
    const relevantDocs = await this.embeddingService.searchSimilar(question, 3);
    const context = relevantDocs
      .map((doc) => doc.content)
      .join('\n\n');

    // Generate response using Anthropic
    const response = await this.anthropic.generateResponse(context, question);

    return response;
  }

  async addDocuments(filePath: string) {
    const { DocumentProcessor } = await import('./document_processor');
    const processor = new DocumentProcessor();
    const documents = await processor.processDocument(filePath);
    await this.embeddingService.addDocuments(documents);
  }

  async addDirectoryDocuments(dirPath: string) {
    const { DocumentProcessor } = await import('./document_processor');
    const processor = new DocumentProcessor();
    const documents = await processor.processDirectory(dirPath);
    await this.embeddingService.addDocuments(documents);
  }
}