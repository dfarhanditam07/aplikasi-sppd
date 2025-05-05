import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { SuratDinas } from '@/lib/models/surat-dinas';

interface PersetujuanLampiranProps {
  register: UseFormRegister<SuratDinas>;
  errors: FieldErrors<SuratDinas>;
}

const pejabatOptions = [
  'Kepala Biro Umum',
  'Kepala Biro Keuangan',
  'Kepala Biro Hukum',
  'Kepala Biro Organisasi',
  'Kepala Biro Kepegawaian',
  'Kepala Biro Perencanaan',
  'Kepala Biro Hubungan Masyarakat',
  'Kepala Biro Pengawasan',
  'Kepala Biro Teknologi Informasi',
  'Kepala Biro Kerjasama',
];

export default function PersetujuanLampiran({ register, errors }: PersetujuanLampiranProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Informasi Persetujuan</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">Sumber Dana</label>
        <select
          {...register('sumberDana', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Pilih Sumber Dana</option>
          <option value="APBN">APBN</option>
          <option value="APBD">APBD</option>
          <option value="Internal">Internal</option>
          <option value="Sponsor">Sponsor</option>
        </select>
        {errors.sumberDana && <span className="text-red-500 text-sm">Sumber dana harus dipilih</span>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Pejabat Pemberi Tugas</label>
        <select
          {...register('pejabatPemberiTugas', { required: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Pilih Pejabat</option>
          {pejabatOptions.map((pejabat) => (
            <option key={pejabat} value={pejabat}>
              {pejabat}
            </option>
          ))}
        </select>
        {errors.pejabatPemberiTugas && <span className="text-red-500 text-sm">Pejabat pemberi tugas harus dipilih</span>}
      </div>

      {/* <div>
        <label className="block text-sm font-medium text-gray-700">Status Approval</label>
        <input
          type="text"
          value=""
          readOnly
          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div> */}

      <div>
        <label className="block text-sm font-medium text-gray-700">Lampiran</label>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              if (file.size > 5 * 1024 * 1024) {
                alert('Ukuran file maksimal 5MB');
                e.target.value = '';
                return;
              }
              // Handle file upload here
            }
          }}
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100"
        />
        <p className="mt-1 text-sm text-gray-500">Format: PDF, JPG, PNG (maks. 5MB)</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Keterangan Tambahan</label>
        <textarea
          {...register('keteranganTambahan')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
} 