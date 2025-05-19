import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { SuratDinas } from '@/lib/models/surat-dinas';

interface InputPegawaiProps {
  register: UseFormRegister<SuratDinas>;
  errors: FieldErrors<SuratDinas>;
}

// Daftar divisi/fungsi umum dalam perusahaan besar
const divisiOptions = [
  'Divisi Teknologi Informasi',
  'Divisi Keuangan',
  'Divisi Pengadaan & Aset',
  'Divisi Sumber Daya Manusia',
  'Divisi Hukum & Kepatuhan',
  'Divisi Pemasaran',
  'Divisi Operasional',
  'Divisi Perencanaan Strategis',
  'Divisi Audit Internal',
  'Divisi Hubungan Masyarakat',
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
        <label className="block text-sm font-medium text-gray-700">Divisi / Fungsi</label>
        <select
          {...register('unitKerja', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Pilih Divisi / Fungsi</option>
          {divisiOptions.map((divisi) => (
            <option key={divisi} value={divisi}>
              {divisi}
            </option>
          ))}
        </select>
        {errors.unitKerja && <span className="text-red-500 text-sm">Divisi / fungsi harus dipilih</span>}
      </div>
    </div>
  );
}
