'use client';

import { useEffect, useState } from 'react';
import { SuratDinas } from '@/lib/models/surat-dinas';
import { toast } from 'react-hot-toast';
import { EyeIcon } from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';

export default function Approved() {
  const [suratDinas, setSuratDinas] = useState<SuratDinas[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuratDinas();
  }, []);

  const fetchSuratDinas = async () => {
    try {
      const response = await fetch('/api/spd');
      if (!response.ok) throw new Error('Gagal mengambil data');
      const data = await response.json();
      setSuratDinas(data.filter((item: SuratDinas) => 
        item.statusApproval === 'Approved'
      ));
    } catch (err) {
      console.error('Error:', err);
      toast.error('Gagal mengambil data surat dinas');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handlePreviewPDF = (item: SuratDinas) => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text('Surat Perjalanan Dinas', 105, 20, { align: 'center' });

    // Add details
    doc.setFontSize(12);
    doc.text(`Nomor SPD: ${item.nomorSPD}`, 20, 40);
    doc.text(`Nama Pegawai: ${item.namaPegawai}`, 20, 50);
    doc.text(`Tujuan Perjalanan: ${item.tujuanPerjalanan}`, 20, 60);
    doc.text(`Jenis Transportasi: ${item.jenisTransportasi}`, 20, 70);
    doc.text(`Total Estimasi Biaya: ${formatCurrency(item.totalEstimasiBiaya)}`, 20, 80);
    doc.text(`Tanggal Persetujuan: ${item.tanggalPersetujuan ? formatDate(item.tanggalPersetujuan) : '-'}`, 20, 90);

    // Save or preview the PDF
    doc.save(`SuratDinas_${item.nomorSPD}.pdf`);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Daftar Surat Dinas Disetujui</h1>
      
      {suratDinas.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Tidak ada surat dinas yang telah disetujui</p>
        </div>
      ) : (
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
                <th className="py-2 px-4 border-b">Tanggal Disetujui</th>
                <th className="py-2 px-4 border-b">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {suratDinas.map((item, index) => (
                <tr key={item._id?.toString() || index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                  <td className="py-2 px-4 border-b">{item.nomorSPD}</td>
                  <td className="py-2 px-4 border-b">{item.namaPegawai}</td>
                  <td className="py-2 px-4 border-b">{item.tujuanPerjalanan}</td>
                  <td className="py-2 px-4 border-b">{item.jenisTransportasi}</td>
                  <td className="py-2 px-4 border-b text-right">
                    {formatCurrency(item.totalEstimasiBiaya)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {item.tanggalPersetujuan ? formatDate(item.tanggalPersetujuan) : '-'}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      type="button"
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                      onClick={() => handlePreviewPDF(item)}
                    >
                      <EyeIcon className="h-5 w-5 mr-2" />
                      Preview PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}