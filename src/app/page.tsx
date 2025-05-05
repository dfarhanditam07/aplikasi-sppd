'use client';

import SuratDinasForm from '@/components/SuratDinasForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Form Surat Dinas</h1>
          <p className="mt-2 text-lg text-gray-600">
            Silakan isi form berikut untuk mengajukan surat dinas
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <SuratDinasForm />
        </div>
      </div>
    </main>
  );
}
