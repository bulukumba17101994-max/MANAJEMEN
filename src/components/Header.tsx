import React, { useState } from 'react';
import { 
  Building2, 
  Folder, 
  RotateCcw, 
  Info, 
  Cloud, 
  Sun, 
  Moon, 
  ShieldCheck, 
  Crown 
} from 'lucide-react';
import { UserProfile } from '../types/jaspel';

interface HeaderProps {
  hospitalName: string;
  period: string;
  totalFund: number;
  isSyncing?: boolean;
  currentUser: UserProfile;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onPeriodChange: (newPeriod: string) => void;
  onOpenPeriodFolder: () => void;
  onResetToDefault: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  hospitalName,
  period,
  totalFund,
  isSyncing = false,
  currentUser,
  isDarkMode,
  onToggleDarkMode,
  onOpenPeriodFolder,
  onResetToDefault,
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const [clickedIcon, setClickedIcon] = useState<string | null>(null);
  const [iconClickTick, setIconClickTick] = useState<number>(0);

  const triggerIconAnim = (name: string, callback?: () => void) => {
    setClickedIcon(name);
    setIconClickTick((t) => t + 1);
    if (callback) callback();
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md text-white shadow-lg border-b border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          {/* Brand Wordmark & Hospital Badge - Renamed to MANAJEMEN */}
          <div 
            onClick={() => triggerIconAnim('brand')}
            className="flex items-center gap-2.5 min-w-0 shrink cursor-pointer group select-none"
            title="Sistem Pembagian Jasa Manajemen RSUD Siwa"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shrink-0 text-white shadow-md shadow-teal-900/30 ring-1 ring-white/20 transition-all duration-300 group-hover:scale-105 group-active:scale-95">
              <Building2 
                key={clickedIcon === 'brand' ? `brand-${iconClickTick}` : undefined}
                className={`w-5 h-5 transition-transform ${clickedIcon === 'brand' ? 'animate-icon-pop' : 'group-hover:rotate-6'}`} 
              />
            </div>
            <div className="min-w-0 shrink">
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-base md:text-lg font-black tracking-tight text-white whitespace-nowrap">
                  MANAJEMEN
                </h1>
                <span className="hidden xs:inline-block text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/40 shrink-0">
                  RSUD
                </span>
                {/* Real-time Cloud Indicator */}
                <span 
                  className={`hidden sm:flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    isSyncing 
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' 
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}
                  title={isSyncing ? 'Sedang sinkronisasi data cloud...' : 'Tersinkronisasi Real-Time Semua Device'}
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

          {/* Right Action Hub: Administrator Profile Badge, Dark Mode Toggle, Period Folder */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Administrator Profile Badge (Full Access) */}
            <div
              onClick={() => triggerIconAnim('admin_badge')}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-slate-200 text-xs font-semibold select-none group cursor-pointer hover:border-amber-500/40 transition-all active:scale-95 shadow-2xs"
              title="Administrator: Hak Akses Penuh Mengubah Semua Data, Matriks Regulasi, Pegawai, dan Pengesahan"
            >
              <div 
                key={clickedIcon === 'admin_badge' ? `admin-${iconClickTick}` : undefined}
                className={clickedIcon === 'admin_badge' ? 'animate-icon-pop' : 'transition-transform group-hover:scale-110'}
              >
                <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              </div>
              <span className="hidden md:inline font-medium text-slate-300 max-w-[120px] truncate">
                {currentUser.name.split(',')[0]}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <ShieldCheck className="w-2.5 h-2.5 text-amber-400 hidden xs:inline" />
                <span>ADMIN</span>
              </span>
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={() => triggerIconAnim('theme', onToggleDarkMode)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-90 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-2xs group"
              title={isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
              aria-label="Toggle Mode Terang/Gelap"
            >
              <div 
                key={clickedIcon === 'theme' ? `theme-${iconClickTick}` : undefined}
                className={clickedIcon === 'theme' ? 'animate-icon-spin' : 'transition-transform group-hover:rotate-45'}
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-300" />
                )}
              </div>
            </button>

            {/* Period / Folder trigger */}
            <button
              onClick={() => triggerIconAnim('folder', onOpenPeriodFolder)}
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-xl bg-teal-900/60 hover:bg-teal-800/80 active:scale-95 border border-teal-700/60 text-teal-100 text-xs font-medium transition-all shadow-2xs group"
              title={`Buka Folder Arsip Bulan & Tahun (${period})`}
              aria-label="Folder Bulan & Tahun"
            >
              <div 
                key={clickedIcon === 'folder' ? `folder-${iconClickTick}` : undefined}
                className={clickedIcon === 'folder' ? 'animate-icon-pop' : 'transition-transform group-hover:-translate-y-0.5'}
              >
                <Folder className="w-4 h-4 text-teal-400 shrink-0" />
              </div>
              <span className="hidden md:inline text-teal-300">Periode:</span>
              <span className="hidden sm:inline font-bold text-white whitespace-nowrap text-xs">{period}</span>
            </button>

            {/* Reset to CSV baseline button (Desktop/Tablet) */}
            {currentUser.role === 'admin' && (
              <button
                onClick={() => {
                  triggerIconAnim('reset', () => {
                    if (window.confirm('Kembalikan semua data dan matriks regulasi ke ketetapan awal (CSV Baseline RSUD)?')) {
                      onResetToDefault();
                    }
                  });
                }}
                className="hidden sm:flex w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-90 border border-slate-700 text-slate-300 hover:text-white items-center justify-center transition-all group"
                title="Reset ke Ketetapan Awal SK"
                aria-label="Reset ke Default"
              >
                <div 
                  key={clickedIcon === 'reset' ? `reset-${iconClickTick}` : undefined}
                  className={clickedIcon === 'reset' ? 'animate-icon-spin' : 'transition-transform group-hover:-rotate-90'}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </div>
              </button>
            )}

            {/* Info Trigger */}
            <button
              onClick={() => triggerIconAnim('info', () => setShowInfo(true))}
              className="hidden sm:flex w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-90 border border-slate-700 text-slate-300 hover:text-white items-center justify-center transition-all group"
              title="Informasi Regulasi & SK Direktur"
              aria-label="Informasi Regulasi"
            >
              <div 
                key={clickedIcon === 'info' ? `info-${iconClickTick}` : undefined}
                className={clickedIcon === 'info' ? 'animate-icon-pop' : 'transition-transform group-hover:scale-110'}
              >
                <Info className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Tentang Sistem MANAJEMEN</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">UPT RSUD Siwa - Kabupaten Wajo</p>
                </div>
              </div>
              <button
                onClick={() => setShowInfo(false)}
                className="w-8 h-8 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                Aplikasi <strong>MANAJEMEN</strong> merupakan sistem informasi resmi pengelolaan dan pembagian jasa manajemen rumah sakit berdasarkan SK Direktur RSUD Siwa.
              </p>

              <div className="p-3 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">Pilar Utama Sistem:</span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-400">
                  <li>Kepatuhan penuh pada 15 kelompok regulasi (100,00%).</li>
                  <li>Real-time Cloud Sync antarsemua perangkat mobile dan komputer.</li>
                  <li>Hak akses penuh Administrator untuk mengelola seluruh data, matriks regulasi, dan pengesahan.</li>
                  <li>Folder arsip per bulan dan tahun dengan audit kepatuhan otomatis.</li>
                </ul>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setShowInfo(false)}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors"
                >
                  Tutup Informasi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
