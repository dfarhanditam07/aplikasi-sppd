'use client';

import { useEffect, useState } from 'react';
import { SuratDinas } from '@/lib/models/surat-dinas';
import { toast } from 'react-hot-toast';

export default function Pending() {
  const [suratDinas, setSuratDinas] = useState<SuratDinas[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSurat, setSelectedSurat] = useState<SuratDinas | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    fetchSuratDinas();
  }, []);

  const fetchSuratDinas = async () => {
    try {
      const response = await fetch('/api/spd');
      if (!response.ok) throw new Error('Gagal mengambil data');
      const data = await response.json();
      setSuratDinas(data.filter((item: SuratDinas) => 
        item.statusApproval === 'Pending'
      ));
    } catch (err) {
      console.error('Error:', err);
      toast.error('Gagal mengambil data surat dinas');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (processing) return;
    setProcessing(true);
    try {
      const response = await fetch(`/api/spd/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          statusApproval: 'Approved',
          tanggalPersetujuan: new Date().toISOString()
        }),
      });

      if (!response.ok) throw new Error('Gagal menyetujui surat dinas');
      
      toast.success('Surat dinas berhasil disetujui');
      fetchSuratDinas();
      setIsDialogOpen(false);
    } catch (err) {
      console.error('Error:', err);
      toast.error('Gagal menyetujui surat dinas');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (id: string) => {
    if (processing) return;
    setProcessing(true);
    try {
      const response = await fetch(`/api/spd/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          statusApproval: 'Rejected',
          tanggalPersetujuan: new Date().toISOString()
        }),
      });

      if (!response.ok) throw new Error('Gagal menolak surat dinas');
      
      toast.success('Surat dinas berhasil ditolak');
      fetchSuratDinas();
      setIsDialogOpen(false);
    } catch (err) {
      console.error('Error:', err);
      toast.error('Gagal menolak surat dinas');
    } finally {
      setProcessing(false);
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

  const filteredData = suratDinas.filter((item) =>
    item.namaPegawai.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Daftar Surat Dinas Pending</h1>

      <input
        type="text"
        placeholder="Cari nama pegawai..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      />

      {filteredData.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Tidak ada surat dinas yang menunggu persetujuan</p>
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
                <th className="py-2 px-4 border-b">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b text-center">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="py-2 px-4 border-b">{item.nomorSPD}</td>
                  <td className="py-2 px-4 border-b">{item.namaPegawai}</td>
                  <td className="py-2 px-4 border-b">{item.tujuanPerjalanan}</td>
                  <td className="py-2 px-4 border-b">{item.jenisTransportasi}</td>
                  <td className="py-2 px-4 border-b text-right">
                    {formatCurrency(item.totalEstimasiBiaya)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedSurat(item);
                          setIsDialogOpen(true);
                        }}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Lihat
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {isDialogOpen && selectedSurat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4">Detail Surat Dinas</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Nomor SPD:</p>
                <p>{selectedSurat.nomorSPD}</p>
              </div>
              <div>
                <p className="font-semibold">Nama Pegawai:</p>
                <p>{selectedSurat.namaPegawai}</p>
              </div>
              <div>
                <p className="font-semibold">NIP:</p>
                <p>{selectedSurat.nip}</p>
              </div>
              <div>
                <p className="font-semibold">Jabatan:</p>
                <p>{selectedSurat.jabatan}</p>
              </div>
              <div>
                <p className="font-semibold">Unit Kerja:</p>
                <p>{selectedSurat.unitKerja}</p>
              </div>
              <div>
                <p className="font-semibold">Tanggal Berangkat:</p>
                <p>{formatDate(selectedSurat.tanggalBerangkat)}</p>
              </div>
              <div>
                <p className="font-semibold">Tanggal Kembali:</p>
                <p>{formatDate(selectedSurat.tanggalKembali)}</p>
              </div>
              <div>
                <p className="font-semibold">Lama Perjalanan:</p>
                <p>{selectedSurat.lamaPerjalanan} hari</p>
              </div>
              <div>
                <p className="font-semibold">Tujuan Perjalanan:</p>
                <p>{selectedSurat.tujuanPerjalanan}</p>
              </div>
              <div>
                <p className="font-semibold">Jenis Transportasi:</p>
                <p>{selectedSurat.jenisTransportasi}</p>
              </div>
              <div>
                <p className="font-semibold">Maksud Perjalanan:</p>
                <p>{selectedSurat.maksudPerjalanan}</p>
              </div>
              <div>
                <p className="font-semibold">Sumber Dana:</p>
                <p>{selectedSurat.sumberDana}</p>
              </div>
              <div className="col-span-2">
                <p className="font-semibold">Komponen Biaya:</p>
                <ul className="list-disc pl-5">
                  {selectedSurat.komponenBiaya.map((item, index) => (
                    <li key={index}>
                      {item.nama}: {formatCurrency(item.jumlah)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-span-2">
                <p className="font-semibold">Total Estimasi Biaya:</p>
                <p>{formatCurrency(selectedSurat.totalEstimasiBiaya)}</p>
              </div>
              <div className="col-span-2">
                <p className="font-semibold">Pejabat Pemberi Tugas:</p>
                <p>{selectedSurat.pejabatPemberiTugas}</p>
              </div>
              {selectedSurat.keteranganTambahan && (
                <div className="col-span-2">
                  <p className="font-semibold">Keterangan Tambahan:</p>
                  <p>{selectedSurat.keteranganTambahan}</p>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Tutup
              </button>
              <button
                onClick={() => handleApprove(selectedSurat._id)}
                disabled={processing}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
              >
                Setujui
              </button>
              <button
                onClick={() => handleReject(selectedSurat._id)}
                disabled={processing}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
              >
                Tolak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}