import { RegulationGroup, Recipient, ReportConfig } from '../types/jaspel';

export const DEFAULT_HOSPITAL_NAME = 'RSUD SIWA - KABUPATEN WAJO';
export const DEFAULT_PERIOD = 'Oktober 2026';
export const DEFAULT_TOTAL_FUND = 80143754; // Rp 80.143.754

export const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export const DEFAULT_REPORT_CONFIG: ReportConfig = {
  showSignatureColumn: true,
  showApprovalBlock: true,
  documentCity: 'Siwa',
  documentDate: '30 Oktober 2026',
  signatories: [
    {
      id: 'sig-1',
      role: 'Ketua Tim Pengelola Jaspel',
      name: 'TIM PENGELOLA JASPEL',
      nip: '',
    },
    {
      id: 'sig-2',
      role: 'Kepala Bagian Tata Usaha',
      name: 'HJ. SUKRAWATI',
      nip: '19750812 200212 2 004',
    },
    {
      id: 'sig-3',
      role: 'Direktur RSUD Siwa',
      name: 'DIREKTUR RSUD SIWA',
      nip: '19700515 200003 1 002',
    },
  ],
};

export const DEFAULT_REGULATION_GROUPS: RegulationGroup[] = [
  {
    id: 'kabag_kabid',
    name: 'KABAG & KABID',
    category: 'struktural',
    percentage: 20.98,
    description: 'Eselon III: Kepala Bagian & Kepala Bidang',
    defaultMemberCount: 4,
  },
  {
    id: 'kasubag_kasie',
    name: 'KASUBAG & KASIE',
    category: 'struktural',
    percentage: 28.59,
    description: 'Eselon IV: Kepala Sub Bagian & Kepala Seksi',
    defaultMemberCount: 7,
  },
  {
    id: 'bendahara_penerimaan',
    name: 'BENDAHARA PENERIMAAN',
    category: 'keuangan',
    percentage: 1.75,
    description: 'Pengelola Penerimaan Keuangan BLUD/RSUD',
    defaultMemberCount: 1,
  },
  {
    id: 'bendahara_pengeluaran',
    name: 'BENDAHARA PENGELUARAN',
    category: 'keuangan',
    percentage: 2.00,
    description: 'Pengelola Pengeluaran & Pembukuan Keuangan',
    defaultMemberCount: 1,
  },
  {
    id: 'akuntansi',
    name: 'AKUNTANSI / VERIFIKATOR',
    category: 'keuangan',
    percentage: 1.75,
    description: 'Staf Verifikasi & Laporan Keuangan Akuntansi',
    defaultMemberCount: 1,
  },
  {
    id: 'staf_manajemen_1',
    name: 'STAF MANAJEMEN 1',
    category: 'staf',
    percentage: 7.00,
    description: 'Staf Administrasi & Tata Usaha Manajemen Gol. 1',
    defaultMemberCount: 6,
  },
  {
    id: 'staf_manajemen_2',
    name: 'STAF MANAJEMEN 2',
    category: 'staf',
    percentage: 2.887, // Baseline CSV: 2,89% (Rp 2.313.750)
    description: 'Staf Administrasi & Operasional Manajemen Gol. 2',
    defaultMemberCount: 2,
  },
  {
    id: 'aset',
    name: 'TIM ASET',
    category: 'unit',
    percentage: 1.30,
    description: 'Pengelola Barang Milik Daerah & Inventaris Aset',
    defaultMemberCount: 2,
  },
  {
    id: 'surveilans',
    name: 'SURVEILANS / EPIDEMIOLOGI',
    category: 'unit',
    percentage: 2.138, // Baseline CSV: 2,14% (Rp 1.713.473)
    description: 'Unit Surveilans, PPI & Pengendalian Penyakit',
    defaultMemberCount: 2,
  },
  {
    id: 'khusus_suci',
    name: 'PENUGASAN KHUSUS (SUCI)',
    category: 'khusus',
    percentage: 0.40,
    description: 'Penugasan Teknis Khusus Manajemen',
    defaultMemberCount: 1,
  },
  {
    id: 'administrasi_umum',
    name: 'ADMINISTRASI UMUM',
    category: 'staf',
    percentage: 3.67,
    description: 'Staf Pelayanan Administrasi Umum & Surat Menyurat',
    defaultMemberCount: 4,
  },
  {
    id: 'non_medik_loket',
    name: 'NON MEDIK / LOKET',
    category: 'unit',
    percentage: 0.42,
    description: 'Petugas Front Office & Loket Pendaftaran Pasien',
    defaultMemberCount: 4,
  },
  {
    id: 'khusus_rezki',
    name: 'RESKI EKA WAHYUNI (KHUSUS)',
    category: 'khusus',
    percentage: 8.50,
    description: 'Tanggung Jawab Teknis Koordinasi Khusus SK',
    defaultMemberCount: 1,
  },
  {
    id: 'khusus_halifah',
    name: 'HALIFAH (PENYESUAIAN S.D BLN 6)',
    category: 'khusus',
    percentage: 1.50,
    description: 'Alokasi Penyesuaian Transisi Semester I',
    defaultMemberCount: 1,
  },
  {
    id: 'pengelola',
    name: 'TIM PENGELOLA JASPEL (15 ORANG)',
    category: 'pengelola',
    percentage: 17.115, // Baseline CSV: 17,12% (Rp 13.716.603)
    description: 'Tim Pengelola Pembagian Jasa Manajemen Rumah Sakit',
    defaultMemberCount: 15,
    isSpecialGroup: true,
  },
];

export const DEFAULT_RECIPIENTS: Recipient[] = [
  // 1. KABAG & KABID (4 members)
  { id: 'rec-1', groupId: 'kabag_kabid', name: 'HJ. SUKRAWATI', position: 'KABAG TATA USAHA', isActive: true },
  { id: 'rec-2', groupId: 'kabag_kabid', name: 'NURAINI YUNUS', position: 'KABID PELAYANAN', isActive: true },
  { id: 'rec-3', groupId: 'kabag_kabid', name: 'LAETOBDO SALI', position: 'KABID KEPERAWATAN', isActive: true },
  { id: 'rec-4', groupId: 'kabag_kabid', name: 'MUH. SAING', position: 'KABID PENUNJANG & SARPRAS', isActive: true },

  // 2. KASUBAG & KASIE (7 active, 2 inactive as in baseline)
  { id: 'rec-5', groupId: 'kasubag_kasie', name: 'SURYANI', position: 'KASUBAG PERENCANAAN', isActive: true },
  { id: 'rec-6', groupId: 'kasubag_kasie', name: 'RASDYANA', position: 'KASUBAG KEPEGAWAIAN', isActive: true },
  { id: 'rec-7', groupId: 'kasubag_kasie', name: 'MURNIATI', position: 'KASUBAG KEUANGAN', isActive: true },
  { id: 'rec-8', groupId: 'kasubag_kasie', name: 'HJ. DEVI ANGGREINI', position: 'KASIE KEPERAWATAN', isActive: true },
  { id: 'rec-9', groupId: 'kasubag_kasie', name: 'BIDYA MARSI', position: 'KASIE MEDIS', isActive: true },
  { id: 'rec-10', groupId: 'kasubag_kasie', name: 'NIRWANA', position: 'KASIE PENGEMBANGAN', isActive: true },
  { id: 'rec-11', groupId: 'kasubag_kasie', name: 'HJ. RAODAH', position: 'KASIE SDM', isActive: true },
  { id: 'rec-12', groupId: 'kasubag_kasie', name: 'RESKI YULIANTI', position: 'KASIE FARMASI', isActive: false, notes: 'Non-aktif / cuti tugas periode ini' },
  { id: 'rec-13', groupId: 'kasubag_kasie', name: 'NURHIDAYAT', position: 'KASIE PENUNJANG', isActive: false, notes: 'Non-aktif periode ini' },

  // 3. BENDAHARA PENERIMAAN (1 member)
  { id: 'rec-14', groupId: 'bendahara_penerimaan', name: 'EGA SAAD', position: 'BENDAHARA PENERIMAAN', isActive: true },

  // 4. BENDAHARA PENGELUARAN (1 member)
  { id: 'rec-15', groupId: 'bendahara_pengeluaran', name: 'A. FATIMAH INAYAH', position: 'BENDAHARA PENGELUARAN', isActive: true },

  // 5. AKUNTANSI (1 member)
  { id: 'rec-16', groupId: 'akuntansi', name: 'A. ARNINSING', position: 'STAF AKUNTANSI & VERIFIKATOR', isActive: true },

  // 6. STAF MANAJEMEN 1 (6 members)
  { id: 'rec-17', groupId: 'staf_manajemen_1', name: 'EKA SRIWAHYUNI', position: 'STAF MANAJEMEN I', isActive: true },
  { id: 'rec-18', groupId: 'staf_manajemen_1', name: 'RIZKI YULVI ANITA RAHMAN', position: 'STAF MANAJEMEN I', isActive: true },
  { id: 'rec-19', groupId: 'staf_manajemen_1', name: 'UNISAL LUKMAN', position: 'STAF MANAJEMEN I', isActive: true },
  { id: 'rec-20', groupId: 'staf_manajemen_1', name: 'SINAR', position: 'STAF MANAJEMEN I', isActive: true },
  { id: 'rec-21', groupId: 'staf_manajemen_1', name: 'ASMIAH', position: 'STAF MANAJEMEN I', isActive: true },
  { id: 'rec-22', groupId: 'staf_manajemen_1', name: 'RITA EKA SRI MULIANI', position: 'STAF MANAJEMEN I', isActive: true },

  // 7. STAF MANAJEMEN 2 (2 members)
  { id: 'rec-23', groupId: 'staf_manajemen_2', name: 'REZKI EKA WAHYUNI', position: 'STAF MANAJEMEN II', isActive: true },
  { id: 'rec-24', groupId: 'staf_manajemen_2', name: 'AYA MANGKAU', position: 'STAF MANAJEMEN II', isActive: true },

  // 8. TIM ASET (2 members)
  { id: 'rec-25', groupId: 'aset', name: 'ADELIA', position: 'STAF PENGELOLA ASET', isActive: true },
  { id: 'rec-26', groupId: 'aset', name: 'ADI', position: 'STAF PENGELOLA ASET', isActive: true },

  // 9. SURVEILANS (2 members)
  { id: 'rec-27', groupId: 'surveilans', name: 'ATIRAH ASRI', position: 'PETUGAS SURVEILANS', isActive: true },
  { id: 'rec-28', groupId: 'surveilans', name: 'HASRA', position: 'PETUGAS SURVEILANS', isActive: true },

  // 10. PENUGASAN KHUSUS (SUCI) (1 member)
  { id: 'rec-29', groupId: 'khusus_suci', name: 'SUCI', position: 'PENUGASAN KHUSUS MANAJEMEN', isActive: true },

  // 11. ADMINISTRASI UMUM (4 members)
  { id: 'rec-30', groupId: 'administrasi_umum', name: 'A. LUCY ANGGGREINI', position: 'STAF ADMINISTRASI UMUM', isActive: true },
  { id: 'rec-31', groupId: 'administrasi_umum', name: 'A. BAU', position: 'STAF ADMINISTRASI UMUM', isActive: true },
  { id: 'rec-32', groupId: 'administrasi_umum', name: 'AYU AMINI', position: 'STAF ADMINISTRASI UMUM', isActive: true },
  { id: 'rec-33', groupId: 'administrasi_umum', name: 'RISNA', position: 'STAF ADMINISTRASI UMUM', isActive: true },

  // 12. NON MEDIK / LOKET (4 members)
  { id: 'rec-34', groupId: 'non_medik_loket', name: 'SALMIAH', position: 'PETUGAS LOKET PENDAFTARAN', isActive: true },
  { id: 'rec-35', groupId: 'non_medik_loket', name: 'HUSMAWATI', position: 'PETUGAS LOKET PENDAFTARAN', isActive: true },
  { id: 'rec-36', groupId: 'non_medik_loket', name: 'ULVA DEWI', position: 'PETUGAS LOKET PENDAFTARAN', isActive: true },
  { id: 'rec-37', groupId: 'non_medik_loket', name: 'FEBY ARDA AMELIA', position: 'PETUGAS LOKET PENDAFTARAN', isActive: true },

  // 13. RESKI EKA WAHYUNI (KHUSUS) (1 member)
  { id: 'rec-38', groupId: 'khusus_rezki', name: 'RESKI EKA WAHYUNI', position: 'PENUGASAN KHUSUS KOORDINASI', isActive: true },

  // 14. HALIFAH (PENYESUAIAN) (1 member)
  { id: 'rec-39', groupId: 'khusus_halifah', name: 'HALIFAH', position: 'PENYESUAIAN TUGAS (S.D BLN 6)', isActive: true },

  // 15. TIM PENGELOLA (15 members per SK Tim)
  { id: 'rec-40', groupId: 'pengelola', name: 'TIM PENGELOLA JASPEL (15 ANGGOTA)', position: 'TIM PENGELOLA JASA BLUD', isActive: true, notes: 'Dialokasikan untuk 15 personil tim pengelola jaspel sesuai ketetapan SK Direktur' },
];
