import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { QdrantClient } from '@qdrant/js-client-rest';
import { Document } from 'langchain/document';

export class EmbeddingService {
  private embeddings: OpenAIEmbeddings;
  private client: QdrantClient;
  private collectionName: string;

  constructor() {
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: process.env.EMBEDDING_MODEL,
    });

    this.client = new QdrantClient({
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY  // Menambahkan API key
    });

    this.collectionName = process.env.QDRANT_COLLECTION_NAME || 'documents';
    this.initializeCollection().catch(console.error);
  }

  async initializeCollection() {
    try {
      await this.client.createCollection(this.collectionName, {
        vectors: {
          size: 1536, // OpenAI embedding dimension
          distance: 'Cosine',
        },
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        console.log('Collection already exists');
      } else {
        throw error;
      }
    }
  }

  async addDocuments(documents: Document[]) {
    const vectors = await Promise.all(
      documents.map(async (doc) => {
        const embedding = (await this.embeddings.embedDocuments([doc.pageContent]))[0];
        return {
          id: Math.floor(Math.random() * 10000000), // Simple random ID generation
          vector: embedding,
          payload: {
            content: doc.pageContent,
            metadata: doc.metadata,
          },
        };
      })
    );

    await this.client.upsert(this.collectionName, {
      points: vectors,
    });
  }

  async searchSimilar(query: string, limit: number = 5) {
    const queryEmbedding = await this.embeddings.embedQuery(query);

    const results = await this.client.search(this.collectionName, {
      vector: queryEmbedding,
      limit: limit,
      with_payload: true,
    });

    return results.map((result) => ({
      content: result.payload?.content,
      metadata: result.payload?.metadata,
      score: result.score,
    }));
  }
}