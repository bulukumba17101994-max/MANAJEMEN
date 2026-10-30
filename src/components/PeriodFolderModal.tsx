import React, { useState } from 'react';
import { 
  X, 
  Folder, 
  FolderPlus, 
  Calendar, 
  Check, 
  Trash2, 
  Copy, 
  Save, 
  ChevronRight,
  Clock,
  Coins,
  Users
} from 'lucide-react';
import { PeriodArchive, RegulationGroup, Recipient, ReportConfig } from '../types/jaspel';
import { MONTH_NAMES } from '../utils/jaspelData';
import { formatRupiah } from '../utils/jaspelCalculations';

interface PeriodFolderModalProps {
  isOpen: boolean;
  currentPeriod: string;
  totalFund: number;
  groups: RegulationGroup[];
  recipients: Recipient[];
  reportConfig: ReportConfig;
  archives: PeriodArchive[];
  onClose: () => void;
  onSelectPeriod: (archive: PeriodArchive) => void;
  onSaveCurrentPeriod: () => void;
  onCreateNewPeriod: (
    month: number,
    year: number,
    copyFromCurrent: boolean,
    initialFund?: number
  ) => void;
  onDeletePeriod: (id: string, label: string) => void;
}

export const PeriodFolderModal: React.FC<PeriodFolderModalProps> = ({
  isOpen,
  currentPeriod,
  totalFund,
  archives,
  onClose,
  onSelectPeriod,
  onSaveCurrentPeriod,
  onCreateNewPeriod,
  onDeletePeriod,
}) => {
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number>(10); // default Oktober (10)
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [copyCurrentData, setCopyCurrentData] = useState(true);
  const [newFundInput, setNewFundInput] = useState<string>(totalFund.toString());
  const [justSavedNotice, setJustSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSaveCurrent = () => {
    onSaveCurrentPeriod();
    setJustSavedNotice(true);
    setTimeout(() => setJustSavedNotice(false), 2500);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fund = parseInt(newFundInput.replace(/[^\d]/g, ''), 10) || totalFund;
    onCreateNewPeriod(selectedMonth, selectedYear, copyCurrentData, fund);
    setIsCreatingNew(false);
  };

  // Group archives by year
  const archivesByYear = archives.reduce((acc, curr) => {
    const y = curr.year || 2026;
    if (!acc[y]) acc[y] = [];
    acc[y].push(curr);
    return acc;
  }, {} as Record<number, PeriodArchive[]>);

  const years = Object.keys(archivesByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Folder className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Folder Arsip Bulan &amp; Tahun</h3>
              <p className="text-[11px] text-slate-400">
                Penyimpanan data hasil pembagian jasa manajemen per periode
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Active Period Card & Quick Save */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              Folder Periode Aktif Saat Ini
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm font-bold text-slate-900">{currentPeriod}</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                {formatRupiah(totalFund)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveCurrent}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Save className="w-3.5 h-3.5 text-teal-400" />
              <span>{justSavedNotice ? 'Tersimpan!' : 'Simpan Data Bulan Ini'}</span>
            </button>
            <button
              onClick={() => setIsCreatingNew(true)}
              className="px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>Bulan Baru</span>
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* New Month Folder Creator (Collapsible Form) */}
          {isCreatingNew && (
            <form onSubmit={handleCreateSubmit} className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 space-y-3 text-xs animate-in fade-in">
              <div className="flex items-center justify-between border-b border-teal-200/80 pb-2">
                <h4 className="font-bold text-teal-950 flex items-center gap-1.5">
                  <FolderPlus className="w-4 h-4 text-teal-700" />
                  Buat Folder Arsip Bulan &amp; Tahun Baru
                </h4>
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pilih Bulan *</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-teal-300 bg-white text-xs font-medium focus:ring-2 focus:ring-teal-500"
                  >
                    {MONTH_NAMES.map((m, idx) => (
                      <option key={m} value={idx + 1}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pilih Tahun *</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-teal-300 bg-white text-xs font-medium focus:ring-2 focus:ring-teal-500"
                  >
                    {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Anggaran Awal Jasa Manajemen (Rp)
                </label>
                <input
                  type="text"
                  value={newFundInput}
                  onChange={(e) => setNewFundInput(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-teal-300 bg-white text-xs font-bold focus:ring-2 focus:ring-teal-500 tabular-nums"
                />
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={copyCurrentData}
                    onChange={(e) => setCopyCurrentData(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                  />
                  <span className="text-slate-800 font-medium">
                    Salin daftar pegawai &amp; matriks dari bulan saat ini ({currentPeriod})
                  </span>
                </label>
                <p className="text-[11px] text-slate-500 pl-6">
                  Jika dicentang, seluruh data pegawai dan persentase akan diduplikasi sehingga Anda hanya perlu mengubah status atau nominal.
                </p>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold shadow-2xs"
                >
                  Buat &amp; Buka Folder
                </button>
              </div>
            </form>
          )}

          {/* List of Archived Folders by Year */}
          {years.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Folder className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>Belum ada arsip bulan tersimpan.</p>
            </div>
          ) : (
            years.map((year) => (
              <div key={year} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 bg-slate-200/80 px-2.5 py-0.5 rounded-md">
                    Tahun {year}
                  </span>
                  <div className="h-[1px] bg-slate-200 flex-1" />
                </div>

                <div className="space-y-2">
                  {archivesByYear[year]
                    .sort((a, b) => b.month - a.month)
                    .map((item) => {
                      const isActive = item.label === currentPeriod;
                      return (
                        <div
                          key={item.id}
                          className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                            isActive
                              ? 'bg-teal-50/60 border-teal-300 shadow-2xs'
                              : 'bg-white hover:bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                                isActive
                                  ? 'bg-teal-600 text-white'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              <Folder className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                  {item.label}
                                </h4>
                                {isActive && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-teal-200 text-teal-900 shrink-0">
                                    Aktif
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                                <span className="font-semibold text-slate-700 tabular-nums">
                                  {formatRupiah(item.totalFund)}
                                </span>
                                <span aria-hidden="true">·</span>
                                <span>{item.recipients?.length || 0} Pegawai</span>
                                <span aria-hidden="true">·</span>
                                <span className="text-slate-400">
                                  {item.savedAt ? new Date(item.savedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : ''}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {!isActive && (
                              <button
                                onClick={() => {
                                  onSelectPeriod(item);
                                  onClose();
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors shadow-2xs"
                              >
                                Buka
                              </button>
                            )}

                            {archives.length > 1 && (
                              <button
                                onClick={() => onDeletePeriod(item.id, item.label)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Hapus Arsip Bulan Ini"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500 shrink-0">
          <span>{archives.length} folder arsip tersimpan</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
