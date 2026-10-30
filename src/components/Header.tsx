import React, { useState } from 'react';
import { Building2, Calendar, Folder, RotateCcw, Info, Cloud, CloudCheck, RefreshCw } from 'lucide-react';
import { formatRupiah } from '../utils/jaspelCalculations';

interface HeaderProps {
  hospitalName: string;
  period: string;
  totalFund: number;
  isSyncing?: boolean;
  onPeriodChange: (newPeriod: string) => void;
  onOpenPeriodFolder: () => void;
  onResetToDefault: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  hospitalName,
  period,
  totalFund,
  isSyncing = false,
  onPeriodChange,
  onOpenPeriodFolder,
  onResetToDefault,
}) => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-slate-900 text-white shadow-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Brand Wordmark & Hospital Badge */}
          <div className="flex items-center gap-2.5 min-w-0 shrink">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center shrink-0 text-teal-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0 shrink">
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-white whitespace-nowrap">
                  SIP-JASMAN
                </h1>
                <span className="hidden xs:inline-block text-[10px] font-semibold px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 shrink-0">
                  RSUD
                </span>
                {/* Real-time Cloud Indicator */}
                <span 
                  className={`hidden sm:flex items-center gap-1 text-[10px] font-medium px-2 py-0.2 rounded-full border ${
                    isSyncing 
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' 
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}
                  title={isSyncing ? 'Sedang menyinkronkan ke cloud...' : 'Tersinkronisasi Real-Time Semua Device'}
                >
                  <Cloud className="w-3 h-3 text-emerald-400" />
                  <span>{isSyncing ? 'Sinkron...' : 'Real-Time'}</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-[120px] sm:max-w-[200px]">
                {hospitalName}
              </p>
            </div>
          </div>

          {/* Quick Actions & Period Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Period / Folder trigger */}
            <button
              onClick={onOpenPeriodFolder}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-teal-900/60 hover:bg-teal-800/80 border border-teal-700/60 text-teal-100 text-xs font-medium transition-colors shadow-2xs"
              title="Buka Folder Arsip Bulan & Tahun"
              aria-label="Folder Bulan & Tahun"
            >
              <Folder className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span className="hidden sm:inline text-teal-300">Periode:</span>
              <span className="font-bold text-white whitespace-nowrap">{period}</span>
            </button>

            {/* Reset to CSV baseline button */}
            <button
              onClick={() => {
                if (window.confirm('Kembalikan semua data dan matriks regulasi ke ketetapan awal (CSV Baseline RSUD)?')) {
                  onResetToDefault();
                }
              }}
              className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              title="Reset ke Ketetapan Awal SK"
              aria-label="Reset ke Default"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Info dialog trigger */}
            <button
              onClick={() => setShowInfo(true)}
              className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              title="Informasi Regulasi Jasa Manajemen"
              aria-label="Informasi Regulasi"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-teal-50 text-teal-700">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Tentang Matriks Regulasi</h3>
                  <p className="text-xs text-slate-500">Sistem Jasa Manajemen RSUD Siwa</p>
                </div>
              </div>
              <button
                onClick={() => setShowInfo(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                Aplikasi <strong>SIP-JASMAN</strong> adalah sistem kalkulasi dan tata kelola pembagian jasa manajemen rumah sakit berdasarkan SK Direktur / Peraturan Bupati mengenai proporsi Jasa Pelayanan (Jaspel).
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <div className="font-semibold text-slate-800">Prinsip Matriks Regulasi:</div>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                  <li>Total persentase 15 kelompok regulasi harus berjumlah tepat <strong>100,00%</strong>.</li>
                  <li>Total dana dasar pada SK baseline: <strong>{formatRupiah(totalFund)}</strong>.</li>
                  <li>Alokasi per kelompok dibagi rata kepada anggota kelompok yang berstatus <strong>Aktif</strong> pada periode berjalan.</li>
                  <li>Pegawai non-aktif (seperti cuti) otomatis tidak membebani anggaran dan porsinya dinikmati kelompok secara proporsional.</li>
                </ul>
              </div>
              <p>
                Dilengkapi dengan fitur slip gaji individu resmi, simulasi perubahan anggaran dana, penyesuaian porsi matriks, dan ekspor lampiran laporan tanda terima.
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowInfo(false)}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
