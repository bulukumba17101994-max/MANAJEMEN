import React, { useState } from 'react';
import { 
  Coins, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  PieChart,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
  Wallet
} from 'lucide-react';
import { DistributionSummary } from '../types/jaspel';
import { formatRupiah, formatPercentage, parseRupiahInput } from '../utils/jaspelCalculations';
import { DEFAULT_TOTAL_FUND } from '../utils/jaspelData';

interface CalculatorTabProps {
  summary: DistributionSummary;
  onUpdateTotalFund: (newAmount: number) => void;
  onNavigateToTab: (tab: 'dashboard' | 'matriks' | 'penerima' | 'laporan') => void;
  onSelectGroupFilter?: (groupId: string) => void;
}

export const CalculatorTab: React.FC<CalculatorTabProps> = ({
  summary,
  onUpdateTotalFund,
  onNavigateToTab,
  onSelectGroupFilter,
}) => {
  const [inputValue, setInputValue] = useState<string>(
    formatRupiah(summary.totalFund, false)
  );

  const presets = [
    { label: '50 Juta', amount: 50000000 },
    { label: '80,14 Jt (SK Siwa)', amount: DEFAULT_TOTAL_FUND },
    { label: '100 Juta', amount: 100000000 },
    { label: '125 Juta', amount: 125000000 },
    { label: '150 Juta', amount: 150000000 },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const parsed = parseRupiahInput(rawVal);
    setInputValue(new Intl.NumberFormat('id-ID').format(parsed));
    onUpdateTotalFund(parsed);
  };

  const handlePresetClick = (amount: number) => {
    setInputValue(new Intl.NumberFormat('id-ID').format(amount));
    onUpdateTotalFund(amount);
  };

  // Group allocations by category
  const categoryBreakdown = summary.groupAllocations.reduce((acc, curr) => {
    const cat = curr.group.category;
    if (!acc[cat]) {
      acc[cat] = {
        category: cat,
        label: getCategoryLabel(cat),
        totalAmount: 0,
        totalPercentage: 0,
        memberCount: 0,
        groupsCount: 0,
      };
    }
    acc[cat].totalAmount += curr.allocatedAmount;
    acc[cat].totalPercentage += curr.group.percentage;
    acc[cat].memberCount += curr.activeMemberCount;
    acc[cat].groupsCount += 1;
    return acc;
  }, {} as Record<string, { category: string; label: string; totalAmount: number; totalPercentage: number; memberCount: number; groupsCount: number }>);

  const categoryList = Object.values(categoryBreakdown).sort(
    (a, b) => b.totalAmount - a.totalAmount
  );

  const averagePerActiveRecipient = summary.activeRecipients > 0 
    ? Math.round(summary.totalAllocated / summary.activeRecipients) 
    : 0;

  return (
    <div className="space-y-5 pb-24 max-w-5xl mx-auto px-4 sm:px-6 pt-4">
      {/* Hero Input Card for Total Fund */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                Kalkulator Distribusi
              </span>
              <span className="text-xs text-slate-400">Periode {summary.period}</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2 mt-1">
              <Coins className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>Total Dana Jasa Manajemen Rumah Sakit</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Masukkan total anggaran jaspel yang akan didistribusikan pada periode pencairan ini
            </p>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
            <span>{summary.activeRecipients} Pegawai Aktif</span>
          </div>
        </div>

        {/* Big Rupiah Input */}
        <div>
          <label htmlFor="total-fund-input" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Nominal Pagu Dana (Rp)
          </label>
          <div className="relative rounded-2xl shadow-xs">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 font-bold text-base sm:text-lg">
              Rp
            </div>
            <input
              id="total-fund-input"
              type="text"
              inputMode="numeric"
              value={inputValue}
              onChange={handleInputChange}
              className="w-full pl-14 pr-4 py-3 sm:py-4 text-xl sm:text-3xl font-black text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-2xl focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 tabular-nums transition-all"
              placeholder="0"
            />
          </div>
        </div>

        {/* Preset Chips */}
        <div>
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Pilihan Cepat Anggaran:
          </div>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset.amount}
                onClick={() => handlePresetClick(preset.amount)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  summary.totalFund === preset.amount
                    ? 'bg-teal-700 dark:bg-teal-600 text-white shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Regulation Matrix Status Bar */}
      <div 
        className={`rounded-3xl p-4 sm:p-5 border flex items-center justify-between gap-3 ${
          Math.abs(summary.totalPercentage - 100) < 0.05
            ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-200'
            : 'bg-amber-50/80 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/80 text-amber-950 dark:text-amber-200'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`p-2.5 rounded-2xl shrink-0 ${
            Math.abs(summary.totalPercentage - 100) < 0.05 
              ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' 
              : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
          }`}>
            {Math.abs(summary.totalPercentage - 100) < 0.05 ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-bold truncate">
              {Math.abs(summary.totalPercentage - 100) < 0.05
                ? 'Matriks Regulasi 100% Terpenuhi'
                : `Porsi Matriks: ${formatPercentage(summary.totalPercentage)} (Selisih ${(100 - summary.totalPercentage).toFixed(2)}%)`}
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 truncate mt-0.5">
              15 Kelompok SK Direktur · {formatRupiah(summary.totalAllocated)} Terdistribusi
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigateToTab('matriks')}
          className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs shrink-0 flex items-center gap-1"
        >
          <span>Atur Matriks</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Allocated */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Alokasi
          </div>
          <div className="text-base sm:text-xl font-black text-slate-900 dark:text-white tabular-nums">
            {formatRupiah(summary.totalAllocated)}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            {formatPercentage(summary.totalPercentage)} dari total dana
          </div>
        </div>

        {/* Active Recipients */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Penerima Aktif
          </div>
          <div className="text-base sm:text-xl font-black text-slate-900 dark:text-white tabular-nums">
            {summary.activeRecipients}{' '}
            <span className="text-xs font-normal text-slate-400">
              / {summary.totalRecipients} orang
            </span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            {summary.totalRecipients - summary.activeRecipients} berstatus cuti/non-aktif
          </div>
        </div>

        {/* Average per Person */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Rata-Rata per Orang
          </div>
          <div className="text-base sm:text-xl font-black text-teal-700 dark:text-teal-400 tabular-nums">
            {formatRupiah(averagePerActiveRecipient)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Untuk pegawai berhak
          </div>
        </div>

        {/* Total Groups */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Kelompok SK
          </div>
          <div className="text-base sm:text-xl font-black text-slate-900 dark:text-white">
            15 Kategori
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Struktural, Keuangan &amp; Staf
          </div>
        </div>
      </div>

      {/* Visual Allocation Breakdown By Categories */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Alokasi Berdasarkan Kategori Pegawai</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Proporsi pembagian jasa berdasarkan tingkatan fungsi organisasi rumah sakit
            </p>
          </div>
        </div>

        {/* Color segment bar */}
        <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 flex overflow-hidden">
          {categoryList.map((item) => {
            const widthPct = (item.totalAmount / (summary.totalAllocated || 1)) * 100;
            return (
              <div
                key={item.category}
                style={{ width: `${widthPct}%` }}
                className={`${getCategoryColor(item.category)} h-full transition-all`}
                title={`${item.label}: ${formatPercentage(item.totalPercentage)}`}
              />
            );
          })}
        </div>

        {/* Category list items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {categoryList.map((item) => (
            <div
              key={item.category}
              className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 space-y-2 hover:bg-slate-100/60 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${getCategoryColor(item.category)}`} />
                  {item.label}
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                  {formatPercentage(item.totalPercentage)}
                </span>
              </div>

              <div className="text-sm font-extrabold text-slate-900 dark:text-white tabular-nums">
                {formatRupiah(item.totalAmount)}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                <span>{item.groupsCount} Aturan Kelompok</span>
                <span>{item.memberCount} Pegawai Aktif</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function getCategoryLabel(cat: string): string {
  switch (cat) {
    case 'struktural':
      return 'Eselon & Pimpinan';
    case 'keuangan':
      return 'Pengelola Keuangan';
    case 'staf':
      return 'Staf Manajemen & TU';
    case 'unit':
      return 'Unit & Surveilans';
    case 'khusus':
      return 'Penugasan Khusus';
    case 'pengelola':
      return 'Tim Pengelola Jaspel';
    default:
      return cat;
  }
}

function getCategoryColor(cat: string): string {
  switch (cat) {
    case 'struktural':
      return 'bg-blue-600';
    case 'keuangan':
      return 'bg-emerald-600';
    case 'staf':
      return 'bg-purple-600';
    case 'unit':
      return 'bg-rose-500';
    case 'khusus':
      return 'bg-teal-500';
    case 'pengelola':
      return 'bg-amber-500';
    default:
      return 'bg-slate-500';
  }
}
