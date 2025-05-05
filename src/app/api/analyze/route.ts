import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

interface AnalysisResult {
  totalSurat: number;
  totalBiaya: number;
  rataRataBiaya: number;
  tujuanPopuler: { tujuan: string; count: number }[];
  distribusiStatus: { status: string; count: number }[];
  trendBulanan: { bulan: string; count: number }[];
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('surat-dinas');
    const collection = db.collection('surat-dinas');

    // Ambil semua data
    const allData = await collection.find({}).toArray();

    // Hitung total surat
    const totalSurat = allData.length;

    // Hitung total biaya
    const totalBiaya = allData.reduce((sum, item) => sum + parseInt(item.biaya), 0);

    // Hitung rata-rata biaya
    const rataRataBiaya = totalSurat > 0 ? totalBiaya / totalSurat : 0;

    // Hitung tujuan populer
    const tujuanCount = allData.reduce((acc: { [key: string]: number }, item) => {
      acc[item.tujuan] = (acc[item.tujuan] || 0) + 1;
      return acc;
    }, {});

    const tujuanPopuler = Object.entries(tujuanCount)
      .map(([tujuan, count]) => ({ tujuan, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Hitung distribusi status
    const statusCount = allData.reduce((acc: { [key: string]: number }, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});

    const distribusiStatus = Object.entries(statusCount)
      .map(([status, count]) => ({ status, count }));

    // Hitung trend bulanan
    const bulanCount = allData.reduce((acc: { [key: string]: number }, item) => {
      const bulan = new Date(item.tanggal).toLocaleString('id-ID', { month: 'long' });
      acc[bulan] = (acc[bulan] || 0) + 1;
      return acc;
    }, {});

    const trendBulanan = Object.entries(bulanCount)
      .map(([bulan, count]) => ({ bulan, count }))
      .sort((a, b) => {
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                       'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        return months.indexOf(a.bulan) - months.indexOf(b.bulan);
      });

    const result: AnalysisResult = {
      totalSurat,
      totalBiaya,
      rataRataBiaya,
      tujuanPopuler,
      distribusiStatus,
      trendBulanan
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menganalisis data' },
      { status: 500 }
    );
  }
} 