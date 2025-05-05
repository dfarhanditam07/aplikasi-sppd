import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { SuratDinas } from '@/lib/models/surat-dinas';

interface InputPegawaiProps {
  register: UseFormRegister<SuratDinas>;
  errors: FieldErrors<SuratDinas>;
}

const unitKerjaOptions = [
  'Biro Umum',
  'Biro Keuangan',
  'Biro Hukum',
  'Biro Organisasi',
  'Biro Kepegawaian',
  'Biro Perencanaan',
  'Biro Hubungan Masyarakat',
  'Biro Pengawasan',
  'Biro Teknologi Informasi',
  'Biro Kerjasama',
];

export default function InputPegawai({ register, errors }: InputPegawaiProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Informasi Pegawai</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Nama Pegawai</label>
        <input
          {...register('namaPegawai', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.namaPegawai && <span className="text-red-500 text-sm">Nama pegawai harus diisi</span>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">NIP</label>
        <input
          {...register('nip', { 
            required: true,
            pattern: /^[0-9]*$/,
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.nip && <span className="text-red-500 text-sm">NIP harus diisi dan hanya boleh berisi angka</span>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Jabatan</label>
        <input
          {...register('jabatan', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.jabatan && <span className="text-red-500 text-sm">Jabatan harus diisi</span>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Unit Kerja</label>
        <select
          {...register('unitKerja', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Pilih Unit Kerja</option>
          {unitKerjaOptions.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>
        {errors.unitKerja && <span className="text-red-500 text-sm">Unit kerja harus dipilih</span>}
      </div>
    </div>
  );
} 