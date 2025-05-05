'use client';

import { useForm } from 'react-hook-form';
import { SuratDinas } from '@/lib/models/surat-dinas';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import InputPegawai from './InputPegawai';
import DetailPerjalanan from './DetailPerjalanan';
import KomponenBiayaForm from './KomponenBiaya';
import PersetujuanLampiran from './PersetujuanLampiran';
import { toast } from 'react-hot-toast';
import { ArrowPathIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

export default function SuratDinasForm() {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<SuratDinas>({
    defaultValues: {
      statusApproval: 'Pending',
      komponenBiaya: [{ nama: '', jumlah: 0 }],
      jenisTransportasi: 'Pesawat',
      sumberDana: null,
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: SuratDinas) => {
    try {
      setIsSubmitting(true);
      
      // Generate nomor SPD
      const nomorSPD = `SPD-${Date.now()}`;
      data.nomorSPD = nomorSPD;

      // Hitung total estimasi biaya
      data.totalEstimasiBiaya = data.komponenBiaya.reduce((total, item) => total + (item.jumlah || 0), 0);

      const response = await fetch('/api/spd/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Gagal menyimpan data');
      }

      toast.success('Data berhasil disimpan');
      router.push('/pending');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Gagal menyimpan data. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    if (confirm('Apakah Anda yakin ingin mengosongkan form?')) {
      setValue('namaPegawai', '');
      setValue('nip', '');
      setValue('jabatan', '');
      setValue('unitKerja', '');
      setValue('tanggalBerangkat', '');
      setValue('tanggalKembali', '');
      setValue('tujuanPerjalanan', '');
      setValue('alamatTujuan', '');
      setValue('jenisTransportasi', 'Pesawat');
      setValue('maksudPerjalanan', '');
      setValue('sumberDana', null);
      setValue('komponenBiaya', [{ nama: '', jumlah: 0 }]);
      setValue('pejabatPemberiTugas', '');
      setValue('keteranganTambahan', '');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <div className="space-y-6">
        <InputPegawai register={register} errors={errors} />
        <DetailPerjalanan register={register} errors={errors} watch={watch} />
        <KomponenBiayaForm register={register} errors={errors} setValue={setValue} watch={watch} />
        <PersetujuanLampiran register={register} errors={errors} />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={resetForm}
          className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300"
        >
          <ArrowPathIcon className="h-5 w-5 mr-2" />
          Reset Form
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition duration-300"
        >
          <PaperAirplaneIcon className="h-5 w-5 mr-2" />
          {isSubmitting ? 'Menyimpan...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}