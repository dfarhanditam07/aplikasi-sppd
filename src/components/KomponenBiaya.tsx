import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { SuratDinas, KomponenBiaya } from '@/lib/models/surat-dinas';
import { useState } from 'react';

interface KomponenBiayaProps {
  register: UseFormRegister<SuratDinas>;
  errors: FieldErrors<SuratDinas>;
  setValue: UseFormSetValue<SuratDinas>;
  watch: UseFormWatch<SuratDinas>;
}

export default function KomponenBiayaForm({ register, errors, setValue, watch }: KomponenBiayaProps) {
  const [komponenBiaya, setKomponenBiaya] = useState<KomponenBiaya[]>([{ nama: '', jumlah: 0 }]);
  const watchKomponenBiaya = watch('komponenBiaya');

  const addKomponenBiaya = () => {
    setKomponenBiaya([...komponenBiaya, { nama: '', jumlah: 0 }]);
  };

  const removeKomponenBiaya = (index: number) => {
    const newKomponenBiaya = komponenBiaya.filter((_, i) => i !== index);
    setKomponenBiaya(newKomponenBiaya);
    setValue('komponenBiaya', newKomponenBiaya);
  };

  const calculateTotal = () => {
    if (!watchKomponenBiaya) return 0;
    return watchKomponenBiaya.reduce((total, item) => total + (item.jumlah || 0), 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Komponen Biaya</h2>
        <button
          type="button"
          onClick={addKomponenBiaya}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Tambah Komponen
        </button>
      </div>

      {komponenBiaya.map((_, index) => (
        <div key={index} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Nama Komponen</label>
            <input
              {...register(`komponenBiaya.${index}.nama`, { required: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.komponenBiaya?.[index]?.nama && (
              <span className="text-red-500 text-sm">Nama komponen harus diisi</span>
            )}
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Harga</label>
            <input
              type="number"
              {...register(`komponenBiaya.${index}.jumlah`, { 
                required: true,
                min: 0,
                valueAsNumber: true
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.komponenBiaya?.[index]?.jumlah && (
              <span className="text-red-500 text-sm">Jumlah harus diisi dan lebih dari 0</span>
            )}
          </div>

          <button
            type="button"
            onClick={() => removeKomponenBiaya(index)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Hapus
          </button>
        </div>
      ))}

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Total Estimasi Biaya</label>
        <input
          type="text"
          value={`Rp ${calculateTotal().toLocaleString('id-ID')}`}
          readOnly
          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
} 