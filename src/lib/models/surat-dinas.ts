export interface KomponenBiaya {
  nama: string;
  jumlah: number;
}

export interface SuratDinas {
  _id: string;
  namaPegawai: string;
  nip: string;
  jabatan: string;
  unitKerja: string;
  nomorSPD: string;
  tanggalBerangkat: string;
  tanggalKembali: string;
  lamaPerjalanan: number;
  tujuanPerjalanan: string;
  alamatTujuan?: string;
  jenisTransportasi: 'Pesawat' | 'Kereta' | 'Mobil Dinas' | 'Lainnya';
  maksudPerjalanan: string;
  sumberDana: 'APBN' | 'APBD' | 'Internal' | 'Sponsor' | null;
  komponenBiaya: KomponenBiaya[];
  totalEstimasiBiaya: number;
  pejabatPemberiTugas: string;
  tanggalPersetujuan?: string;
  statusApproval: 'Pending' | 'Approved' | 'Rejected';
  lampiran?: {
    filename: string;
    url: string;
  };
  keteranganTambahan?: string;
  createdAt: string;
  updatedAt: string;
}

export function validateSuratDinas(data: Partial<SuratDinas>): string[] {
  const errors: string[] = [];

  // Validasi field yang diperlukan
  const requiredFields: (keyof SuratDinas)[] = [
    'namaPegawai',
    'nip',
    'jabatan',
    'unitKerja',
    'nomorSPD',
    'tanggalBerangkat',
    'tanggalKembali',
    'tujuanPerjalanan',
    'jenisTransportasi',
    'sumberDana',
    'pejabatPemberiTugas'
  ];

  for (const field of requiredFields) {
    if (!data[field] || data[field] === '-') {
      errors.push(`${field} harus diisi`);
    }
  }

  // Validasi format tanggal
  if (data.tanggalBerangkat && data.tanggalKembali) {
    const berangkat = new Date(data.tanggalBerangkat);
    const kembali = new Date(data.tanggalKembali);
    
    if (isNaN(berangkat.getTime()) || isNaN(kembali.getTime())) {
      errors.push('Format tanggal tidak valid');
    } else if (berangkat > kembali) {
      errors.push('Tanggal berangkat tidak boleh lebih besar dari tanggal kembali');
    }
  }

  // Validasi komponen biaya
  if (data.komponenBiaya) {
    if (!Array.isArray(data.komponenBiaya) || data.komponenBiaya.length === 0) {
      errors.push('Komponen biaya harus diisi minimal satu item');
    } else {
      data.komponenBiaya.forEach((item, index) => {
        if (!item.nama || !item.jumlah) {
          errors.push(`Komponen biaya ke-${index + 1} harus memiliki nama dan jumlah`);
        }
      });
    }
  }

  // Validasi total estimasi biaya
  if (data.totalEstimasiBiaya === undefined || data.totalEstimasiBiaya === 0) {
    errors.push('Total estimasi biaya harus diisi dan tidak boleh 0');
  }

  return errors;
} 