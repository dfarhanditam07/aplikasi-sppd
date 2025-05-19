import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import path from 'path';

export class DocumentProcessor {
  private chunkSize: number;
  private chunkOverlap: number;

  constructor(chunkSize = 500, chunkOverlap = 50) {
    this.chunkSize = chunkSize;
    this.chunkOverlap = chunkOverlap;
  }

  async processDocument(filePath: string): Promise<Document[]> {
    const loader = this.getLoader(filePath);
    const rawDocs = await loader.load();
    
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: this.chunkSize,
      chunkOverlap: this.chunkOverlap
    });

    return await textSplitter.splitDocuments(rawDocs);
  }

  async processDirectory(dirPath: string): Promise<Document[]> {
    const loader = new DirectoryLoader(dirPath, {
      '.pdf': (path) => new PDFLoader(path),
      '.txt': (path) => new TextLoader(path),
      '.md': (path) => new TextLoader(path)
    });

    const rawDocs = await loader.load();
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: this.chunkSize,
      chunkOverlap: this.chunkOverlap
    });

    return await textSplitter.splitDocuments(rawDocs);
  }

  private getLoader(filePath: string) {
    const extension = path.extname(filePath).toLowerCase();
    switch (extension) {
      case '.pdf':
        return new PDFLoader(filePath);
      case '.txt':
      case '.md':
        return new TextLoader(filePath);
      default:
        throw new Error(`Unsupported file type: ${extension}`);
    }
  }
}