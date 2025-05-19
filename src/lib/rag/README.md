# RAG (Retrieval Augmented Generation) Pipeline

Implementasi RAG pipeline untuk aplikasi Surat Dinas menggunakan LangChain, Qdrant, dan OpenAI.

## Komponen Utama

1. **Document Processor** (`document_processor.ts`)
   - Menangani pemrosesan dokumen (PDF, TXT, MD)
   - Membagi dokumen menjadi chunk yang lebih kecil
   - Mendukung pemrosesan file tunggal atau direktori

2. **Embedding Service** (`embedding_service.ts`)
   - Menggunakan OpenAI untuk menghasilkan embedding
   - Menyimpan dan mencari dokumen dalam Qdrant
   - Mengelola koleksi vektor dokumen

3. **RAG Service** (`rag_service.ts`)
   - Mengintegrasikan document processing dan embedding
   - Menangani query menggunakan konteks yang relevan
   - Menghasilkan respons menggunakan LLM

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Setup Qdrant:
   - Install dan jalankan Qdrant server
   - Atau gunakan Qdrant Cloud

3. Konfigurasi environment:
   - Copy `.env.example` ke `.env`
   - Isi kredensial yang diperlukan

## Penggunaan API

### 1. Menambah Dokumen

```typescript
// Menambah dokumen tunggal
await fetch('/api/rag', {
  method: 'POST',
  body: JSON.stringify({
    action: 'add_document',
    path: '/path/to/document.pdf'
  })
});

// Menambah dokumen dari direktori
await fetch('/api/rag', {
  method: 'POST',
  body: JSON.stringify({
    action: 'add_directory',
    path: '/path/to/documents/'
  })
});
```

### 2. Query RAG

```typescript
const response = await fetch('/api/rag', {
  method: 'POST',
  body: JSON.stringify({
    action: 'query',
    content: 'Pertanyaan Anda tentang surat dinas?'
  })
});

const result = await response.json();
console.log(result.response);
```

## Catatan Penting

- Pastikan dokumen yang diproses memiliki format yang didukung (PDF, TXT, MD)
- Ukuran chunk dan overlap dapat disesuaikan di `.env`
- Gunakan model embedding dan LLM yang sesuai dengan kebutuhan
- Perhatikan rate limit dan biaya API jika menggunakan OpenAI