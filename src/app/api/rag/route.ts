import { NextRequest, NextResponse } from 'next/server';
import { RAGService } from '@/lib/rag/rag_service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, content, path } = body;

    const ragService = new RAGService();

    switch (action) {
      case 'query':
        if (!content) {
          return NextResponse.json(
            { error: 'Query content is required' },
            { status: 400 }
          );
        }
        const response = await ragService.query(content);
        return NextResponse.json({ response });

      case 'add_document':
        if (!path) {
          return NextResponse.json(
            { error: 'Document path is required' },
            { status: 400 }
          );
        }
        await ragService.addDocuments(path);
        return NextResponse.json({ message: 'Document added successfully' });

      case 'add_directory':
        if (!path) {
          return NextResponse.json(
            { error: 'Directory path is required' },
            { status: 400 }
          );
        }
        await ragService.addDirectoryDocuments(path);
        return NextResponse.json({ message: 'Directory documents added successfully' });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('RAG API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}