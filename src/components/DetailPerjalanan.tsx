import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import { SuratDinas } from '@/lib/models/surat-dinas';
import { useEffect, useState } from 'react';

interface DetailPerjalananProps {
  register: UseFormRegister<SuratDinas>;
  errors: FieldErrors<SuratDinas>;
  watch: UseFormWatch<SuratDinas>;
}

export default function DetailPerjalanan({ register, errors, watch }: DetailPerjalananProps) {
  const [lamaPerjalanan, setLamaPerjalanan] = useState<number>(0);
  const tanggalBerangkat = watch('tanggalBerangkat');
  const tanggalKembali = watch('tanggalKembali');

  useEffect(() => {
    if (tanggalBerangkat && tanggalKembali) {
      const berangkat = new Date(tanggalBerangkat);
      const kembali = new Date(tanggalKembali);
      const diffTime = Math.abs(kembali.getTime() - berangkat.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setLamaPerjalanan(diffDays);
    }
  }, [tanggalBerangkat, tanggalKembali]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Detail Perjalanan</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">Nomor SPD</label>
        <input
          {...register('nomorSPD')}
          readOnly
          value={`SPD-${Date.now()}`}
          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tanggal Berangkat</label>
        <input
          type="date"
          {...register('tanggalBerangkat', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.tanggalBerangkat && <span className="text-red-500 text-sm">Tanggal berangkat harus diisi</span>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tanggal Kembali</label>
        <input
          type="date"
          {...register('tanggalKembali', { 
            required: true,
            validate: (value) => {
              if (!tanggalBerangkat) return true;
              return new Date(value) >= new Date(tanggalBerangkat);
            }
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.tanggalKembali && (
          <span className="text-red-500 text-sm">
            {errors.tanggalKembali.type === 'validate' 
              ? 'Tanggal kembali tidak boleh lebih awal dari tanggal berangkat'
              : 'Tanggal kembali harus diisi'}
          </span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Lama Perjalanan</label>
        <input
          type="text"
          value={`${lamaPerjalanan} hari`}
          readOnly
          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tujuan Perjalanan</label>
        <input
          {...register('tujuanPerjalanan', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.tujuanPerjalanan && <span className="text-red-500 text-sm">Tujuan perjalanan harus diisi</span>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Alamat Tujuan</label>
        <input
          {...register('alamatTujuan')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Jenis Transportasi</label>
        <select
          {...register('jenisTransportasi', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Pilih Jenis Transportasi</option>
          <option value="Pesawat">Pesawat</option>
          <option value="Kereta">Kereta</option>
          <option value="Mobil Dinas">Mobil Dinas</option>
          <option value="Lainnya">Kendaran Pribadi</option>
          <option value="Lainnya">Lainnya</option>
        </select>
        {errors.jenisTransportasi && <span className="text-red-500 text-sm">Jenis transportasi harus dipilih</span>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Maksud Perjalanan</label>
        <textarea
          {...register('maksudPerjalanan', { required: true })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.maksudPerjalanan && <span className="text-red-500 text-sm">Maksud perjalanan harus diisi</span>}
      </div>
    </div>
  );
} 