'use client';

import { useEffect, useState, useCallback } from 'react';
import { SuratDinas } from '@/lib/models/surat-dinas';
import { toast } from 'react-hot-toast';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface PrediksiData {
  estimasiBiayaBulanDepan: number;
  prediksiJumlahDinas: number;
  rekomendasiTransportasi: string;
  prediksiLokasiPopuler: Array<{
    lokasi: string;
    probabilitas: number;
  }>;
}

export default function Dashboard() {
  const [suratDinas, setSuratDinas] = useState<SuratDinas[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [prediksi, setPrediksi] = useState<PrediksiData | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved'>('all');

  const fetchSuratDinas = useCallback(async () => {
    try {
      const response = await fetch('/api/spd');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error ${response.status}: ${errorData.error || 'Unknown error'}`);
      }
      
      const data = await response.json();
      setSuratDinas(data);
      generateAiInsights(data);
      generatePrediksi(data);
    } catch (error) {
      toast.error(`Gagal mengambil data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuratDinas();
  }, [fetchSuratDinas]);

  const generateAiInsights = (data: SuratDinas[]) => {
    // Custom algorithm to generate AI insights
    const totalSurat = data.length;
    const totalBiaya = data.reduce((sum, item) => sum + (item.totalEstimasiBiaya || 0), 0);
    const rataRataBiaya = totalSurat > 0 ? totalBiaya / totalSurat : 0;

    const insights = `Total Surat Dinas: ${totalSurat}\n` +
                     `Total Biaya: Rp ${totalBiaya.toLocaleString()}\n` +
                     `Rata-rata Biaya: Rp ${rataRataBiaya.toLocaleString()}`;

    setAiInsights(insights);
  };

  const generatePrediksi = (data: SuratDinas[]) => {
    // Mendapatkan tanggal saat ini
    const today = new Date();
    const bulanIni = today.getMonth();
    const tahunIni = today.getFullYear();

    // Helper function untuk mendapatkan data berdasarkan bulan dan tahun
    const getDataByMonthYear = (month: number, year: number) => {
      return data.filter(item => {
        const date = new Date(item.tanggalBerangkat);
        return date.getMonth() === month && date.getFullYear() === year;
      });
    };

    // Data 6 bulan terakhir untuk analisis tren
    const dataBulanTerakhir = Array.from({ length: 6 }, (_, i) => {
      let targetMonth = bulanIni - i;
      let targetYear = tahunIni;
      if (targetMonth < 0) {
        targetMonth += 12;
        targetYear--;
      }
      return {
        month: targetMonth,
        year: targetYear,
        data: getDataByMonthYear(targetMonth, targetYear)
      };
    });

    // Prediksi jumlah dinas bulan depan dengan rata-rata bergerak
    const jumlahPerBulan = dataBulanTerakhir.map(m => m.data.length);
    const avgJumlahDinas = jumlahPerBulan.reduce((a, b) => a + b, 0) / jumlahPerBulan.length;
    const trendJumlahDinas = jumlahPerBulan[0] > 0 
      ? ((jumlahPerBulan[0] - avgJumlahDinas) / avgJumlahDinas) 
      : 0;
    
    const prediksiJumlahDinas = Math.max(1, Math.round(avgJumlahDinas * (1 + trendJumlahDinas)));

    // Prediksi biaya dengan perhitungan yang lebih robust
    const biayaPerBulan = dataBulanTerakhir.map(monthData => {
      const totalBiaya = monthData.data.reduce((sum, item) => sum + (item.totalEstimasiBiaya || 0), 0);
      return monthData.data.length > 0 ? totalBiaya / monthData.data.length : null;
    }).filter(biaya => biaya !== null) as number[];

    const avgBiaya = biayaPerBulan.length > 0 
      ? biayaPerBulan.reduce((a, b) => a + b, 0) / biayaPerBulan.length
      : (data[0]?.totalEstimasiBiaya || 0);

    const trendBiaya = biayaPerBulan.length >= 2
      ? ((biayaPerBulan[0] - biayaPerBulan[1]) / biayaPerBulan[1])
      : 0;

    const estimasiBiayaBulanDepan = Math.max(0, prediksiJumlahDinas * avgBiaya * (1 + Math.max(-0.5, Math.min(0.5, trendBiaya))));

    // Analisis lokasi dan transportasi yang lebih informatif
    const lokasiAnalysis: { [key: string]: { count: number; weightedCount: number; latestUsage: Date } } = {};
    
    data.forEach(item => {
      const lokasi = item.tujuanPerjalanan;
      if (!lokasiAnalysis[lokasi]) {
        lokasiAnalysis[lokasi] = { count: 0, weightedCount: 0, latestUsage: new Date(item.tanggalBerangkat) };
      }
      lokasiAnalysis[lokasi].count++;
      
      // Memberikan bobot lebih tinggi untuk data yang lebih baru
      const daysSinceUsage = Math.max(0, (new Date().getTime() - new Date(item.tanggalBerangkat).getTime()) / (1000 * 60 * 60 * 24));
      const timeWeight = Math.exp(-daysSinceUsage / 30); // Exponential decay over 30 days
      lokasiAnalysis[lokasi].weightedCount += timeWeight;
      
      if (new Date(item.tanggalBerangkat) > lokasiAnalysis[lokasi].latestUsage) {
        lokasiAnalysis[lokasi].latestUsage = new Date(item.tanggalBerangkat);
      }
    });

    const prediksiLokasiPopuler = Object.entries(lokasiAnalysis)
      .map(([lokasi, data]) => ({
        lokasi,
        probabilitas: (data.weightedCount / Object.values(lokasiAnalysis).reduce((sum, loc) => sum + loc.weightedCount, 0)) * 100
      }))
      .sort((a, b) => b.probabilitas - a.probabilitas)
      .slice(0, 5);

    // Analisis transportasi dengan mempertimbangkan efisiensi biaya
    const transportAnalysis: { [key: string]: { count: number; totalBiaya: number; avgDuration: number } } = {};
    
    data.forEach(item => {
      const transport = item.jenisTransportasi;
      if (!transportAnalysis[transport]) {
        transportAnalysis[transport] = { count: 0, totalBiaya: 0, avgDuration: 0 };
      }
      transportAnalysis[transport].count++;
      transportAnalysis[transport].totalBiaya += item.totalEstimasiBiaya || 0;
      
      const duration = new Date(item.tanggalKembali).getTime() - new Date(item.tanggalBerangkat).getTime();
      transportAnalysis[transport].avgDuration = 
        (transportAnalysis[transport].avgDuration * (transportAnalysis[transport].count - 1) + duration) / 
        transportAnalysis[transport].count;
    });

    const rekomendasiTransportasi = Object.entries(transportAnalysis)
      .map(([transport, data]) => ({
        transport,
        score: (data.count * data.avgDuration) / (data.totalBiaya || 1) // Higher score = more efficient
      }))
      .sort((a, b) => b.score - a.score)[0]?.transport || 'Belum ada rekomendasi';

    setPrediksi({
      estimasiBiayaBulanDepan,
      prediksiJumlahDinas,
      rekomendasiTransportasi,
      prediksiLokasiPopuler
    });
  };

  const generateChartData = (data: SuratDinas[]) => {
    const transportCounts: { [key: string]: number } = {};
    const locationCounts: { [key: string]: number } = {};

    data.forEach(item => {
      transportCounts[item.jenisTransportasi] = (transportCounts[item.jenisTransportasi] || 0) + 1;
      locationCounts[item.tujuanPerjalanan] = (locationCounts[item.tujuanPerjalanan] || 0) + 1;
    });

    const transportData = {
      labels: Object.keys(transportCounts),
      datasets: [
        {
          label: 'Jenis Transportasi',
          data: Object.values(transportCounts),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        },
      ],
    };

    const locationData = {
      labels: Object.keys(locationCounts),
      datasets: [
        {
          label: 'Tujuan Perjalanan',
          data: Object.values(locationCounts),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        },
      ],
    };

    return { transportData, locationData };
  };

  const filteredSuratDinas = suratDinas.filter(item => {
    if (activeTab === 'pending') return item.statusApproval === 'Pending';
    if (activeTab === 'approved') return item.statusApproval === 'Approved';
    return true;
  });

  const { transportData, locationData } = generateChartData(filteredSuratDinas);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard Surat Dinas</h1>
      
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`${
                activeTab === 'all'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Semua Data
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`${
                activeTab === 'pending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Pending Approval
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`${
                activeTab === 'approved'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Disetujui
            </button>
          </nav>
        </div>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Surat Dinas</h3>
          <p className="text-3xl font-bold">{filteredSuratDinas.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Biaya</h3>
          <p className="text-3xl font-bold">
            Rp {filteredSuratDinas.reduce((sum, item) => 
              sum + item.totalEstimasiBiaya, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Rata-rata Biaya</h3>
          <p className="text-3xl font-bold">
            Rp {(filteredSuratDinas.reduce((sum, item) => 
              sum + item.totalEstimasiBiaya, 0) 
              / filteredSuratDinas.length || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Diagram Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Distribusi Jenis Transportasi</h3>
          <Pie data={transportData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Distribusi Tujuan Perjalanan</h3>
          <Bar data={locationData} />
        </div>
      </div>

      {/* Prediksi */}
      {prediksi && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Prediksi dan Estimasi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Prediksi Bulan Depan</h3>
              <ul className="space-y-2">
                <li>Jumlah Dinas: {prediksi.prediksiJumlahDinas}</li>
                <li>Estimasi Biaya: Rp {prediksi.estimasiBiayaBulanDepan.toLocaleString()}</li>
                <li>Rekomendasi Transportasi: {prediksi.rekomendasiTransportasi}</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Lokasi Potensial</h3>
              <ul className="space-y-2">
                {prediksi.prediksiLokasiPopuler.map((item, index) => (
                  <li key={index}>
                    {item.lokasi}: {item.probabilitas.toFixed(1)}% kemungkinan
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold mb-4">AI Insights</h2>
        <div className="whitespace-pre-line bg-gray-50 p-4 rounded">
          {aiInsights}
        </div>
      </div>

      {/* Tabel Data */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Data Surat Dinas</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">No</th>
                <th className="py-2 px-4 border-b">Nomor SPD</th>
                <th className="py-2 px-4 border-b">Nama Pegawai</th>
                <th className="py-2 px-4 border-b">Tujuan</th>
                <th className="py-2 px-4 border-b">Jenis Transportasi</th>
                <th className="py-2 px-4 border-b">Total Biaya</th>
                <th className="py-2 px-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuratDinas.map((item, index) => (
                <tr key={item._id?.toString() || index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                  <td className="py-2 px-4 border-b">{item.nomorSPD}</td>
                  <td className="py-2 px-4 border-b">{item.namaPegawai}</td>
                  <td className="py-2 px-4 border-b">{item.tujuanPerjalanan}</td>
                  <td className="py-2 px-4 border-b">{item.jenisTransportasi}</td>
                  <td className="py-2 px-4 border-b text-right">
                    Rp {item.totalEstimasiBiaya.toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.statusApproval === 'Pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : item.statusApproval === 'Approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {item.statusApproval}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}