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
  SlidersHorizontal
} from 'lucide-react';
import { DistributionSummary } from '../types/jaspel';
import { formatRupiah, formatPercentage, parseRupiahInput } from '../utils/jaspelCalculations';
import { DEFAULT_TOTAL_FUND } from '../utils/jaspelData';

interface CalculatorTabProps {
  summary: DistributionSummary;
  onUpdateTotalFund: (newAmount: number) => void;
  onNavigateToTab: (tab: 'matriks' | 'penerima' | 'laporan') => void;
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
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Coins className="w-4 h-4 text-teal-600" />
              Total Dana Jasa Manajemen
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Masukkan total anggaran jaspel yang akan didistribusikan periode ini
            </p>
          </div>
          <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
            <span>Periode {summary.period}</span>
            <span aria-hidden="true">·</span>
            <span>{summary.activeRecipients} Pegawai Aktif</span>
          </div>
        </div>

        {/* Big Rupiah Input */}
        <div>
          <label htmlFor="total-fund-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Nominal Dana (Rp)
          </label>
          <div className="relative rounded-xl shadow-xs">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-base sm:text-lg">
              Rp
            </div>
            <input
              id="total-fund-input"
              type="text"
              inputMode="numeric"
              value={inputValue}
              onChange={handleInputChange}
              className="w-full pl-12 pr-4 py-3 sm:py-3.5 text-xl sm:text-2xl font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 tabular-nums transition-all"
              placeholder="0"
            />
          </div>
        </div>

        {/* Preset Chips */}
        <div>
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Pilihan Cepat Anggaran:
          </div>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset.amount}
                onClick={() => handlePresetClick(preset.amount)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  summary.totalFund === preset.amount
                    ? 'bg-teal-700 text-white shadow-xs font-semibold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
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
        className={`rounded-2xl p-4 border flex items-center justify-between gap-3 ${
          Math.abs(summary.totalPercentage - 100) < 0.05
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
            : 'bg-amber-50/80 border-amber-200 text-amber-900'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`p-2 rounded-xl shrink-0 ${
            Math.abs(summary.totalPercentage - 100) < 0.05 
              ? 'bg-emerald-100 text-emerald-700' 
              : 'bg-amber-100 text-amber-700'
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
            <div className="text-[11px] text-slate-600 truncate mt-0.5">
              15 Kelompok SK Direktur · {formatRupiah(summary.totalAllocated)} Terdistribusi
            </div>
          </div>
        </div>

        <button
          onClick={() => onNavigateToTab('matriks')}
          className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 transition-colors shrink-0 flex items-center gap-1 shadow-xs"
        >
          <span>Atur Matriks</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* KPI 4-Grid Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1 */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
            Total Alokasi
          </span>
          <div className="text-base sm:text-lg font-bold text-slate-900 mt-1 tabular-nums">
            {formatRupiah(summary.totalAllocated)}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            {formatPercentage(summary.totalPercentage)} dari total dana
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
            Penerima Aktif
          </span>
          <div className="text-base sm:text-lg font-bold text-slate-900 mt-1 tabular-nums flex items-baseline gap-1.5">
            <span>{summary.activeRecipients}</span>
            <span className="text-xs font-normal text-slate-400">/ {summary.totalRecipients} orang</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {summary.totalRecipients - summary.activeRecipients} berstatus cuti/non-aktif
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
            Rata-rata per Orang
          </span>
          <div className="text-base sm:text-lg font-bold text-teal-800 mt-1 tabular-nums">
            {formatRupiah(averagePerActiveRecipient)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Untuk pegawai berhak
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
            Kelompok SK
          </span>
          <div className="text-base sm:text-lg font-bold text-slate-900 mt-1 tabular-nums">
            {summary.groupAllocations.length} Kategori
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Struktural, Keuangan &amp; Staf
          </div>
        </div>
      </div>

      {/* Alokasi Berdasarkan Kategori Utama */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-teal-600" />
              Alokasi Berdasarkan Kategori Pegawai
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Proporsi pembagian jasa berdasarkan tingkatan fungsi organisasi rumah sakit
            </p>
          </div>
        </div>

        {/* Stacked Visual Bar */}
        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
          {categoryList.map((cat, idx) => {
            const widthPct = Math.max(cat.totalPercentage, 2);
            const colorClass = getCategoryColor(cat.category);
            return (
              <div
                key={cat.category}
                style={{ width: `${widthPct}%` }}
                className={`${colorClass} h-full transition-all`}
                title={`${cat.label}: ${formatPercentage(cat.totalPercentage)} (${formatRupiah(cat.totalAmount)})`}
              />
            );
          })}
        </div>

        {/* Category List Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {categoryList.map((cat) => {
            const badgeBg = getCategoryBadgeBg(cat.category);
            return (
              <div
                key={cat.category}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${badgeBg}`}>
                      {cat.label}
                    </span>
                    <span className="text-xs font-semibold text-slate-700 tabular-nums">
                      {formatPercentage(cat.totalPercentage)}
                    </span>
                  </div>
                  <div className="text-base font-bold text-slate-900 tabular-nums">
                    {formatRupiah(cat.totalAmount)}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2.5 pt-2 border-t border-slate-200/60">
                  <span>{cat.groupsCount} Sub-Kelompok</span>
                  <span>{cat.memberCount} Penerima Aktif</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rincian 15 Kelompok Regulasi (Interactive List) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-teal-600" />
              Rincian 15 Kelompok Regulasi Jasa Manajemen
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Klik pada kelompok untuk melihat anggota atau menyesuaikan aturan
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('matriks')}
            className="text-xs font-medium text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <span>Buka Matriks Lengkap</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto">
          {summary.groupAllocations.map((groupAlloc, index) => {
            const { group, allocatedAmount, activeMemberCount, totalMemberCount, amountPerMember } = groupAlloc;
            return (
              <div
                key={group.id}
                onClick={() => {
                  if (onSelectGroupFilter) onSelectGroupFilter(group.id);
                  onNavigateToTab('penerima');
                }}
                className="p-3.5 sm:p-4 hover:bg-slate-50/80 transition-colors cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                        {group.name}
                      </h4>
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200/60 tabular-nums shrink-0">
                        {formatPercentage(group.percentage)}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{activeMemberCount} Orang Aktif</span>
                      {totalMemberCount > activeMemberCount && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-amber-600">({totalMemberCount - activeMemberCount} Non-aktif)</span>
                        </>
                      )}
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-slate-700 tabular-nums">
                        {formatRupiah(amountPerMember)} / org
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 flex items-center gap-2">
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 tabular-nums">
                      {formatRupiah(allocatedAmount)}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Total Kelompok
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function getCategoryLabel(category: string): string {
  switch (category) {
    case 'struktural':
      return 'Eselon & Pimpinan';
    case 'keuangan':
      return 'Bendahara & Akuntansi';
    case 'staf':
      return 'Staf Manajemen & TU';
    case 'unit':
      return 'Unit Penunjang & Loket';
    case 'khusus':
      return 'Penugasan Khusus';
    case 'pengelola':
      return 'Tim Pengelola Jaspel';
    default:
      return category;
  }
}

function getCategoryColor(category: string): string {
  switch (category) {
    case 'struktural':
      return 'bg-blue-600';
    case 'keuangan':
      return 'bg-emerald-600';
    case 'staf':
      return 'bg-indigo-600';
    case 'unit':
      return 'bg-amber-500';
    case 'khusus':
      return 'bg-rose-500';
    case 'pengelola':
      return 'bg-teal-600';
    default:
      return 'bg-slate-500';
  }
}

function getCategoryBadgeBg(category: string): string {
  switch (category) {
    case 'struktural':
      return 'bg-blue-100 text-blue-800 border border-blue-200';
    case 'keuangan':
      return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    case 'staf':
      return 'bg-indigo-100 text-indigo-800 border border-indigo-200';
    case 'unit':
      return 'bg-amber-100 text-amber-800 border border-amber-200';
    case 'khusus':
      return 'bg-rose-100 text-rose-800 border border-rose-200';
    case 'pengelola':
      return 'bg-teal-100 text-teal-800 border border-teal-200';
    default:
      return 'bg-slate-100 text-slate-800 border border-slate-200';
  }
}
