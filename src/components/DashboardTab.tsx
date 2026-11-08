import React, { useState } from 'react';
import { 
  TrendingUp, 
  Wallet, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  FileText, 
  ArrowUpRight, 
  Users, 
  Layers, 
  Lock, 
  CheckCheck,
  ChevronRight,
  Sparkles,
  PieChart,
  Calculator
} from 'lucide-react';
import { DistributionSummary, UserProfile, PeriodApprovalStatus } from '../types/jaspel';
import { formatRupiah, formatPercentage } from '../utils/jaspelCalculations';
import { ROLE_PERMISSIONS } from '../services/auth';

interface DashboardTabProps {
  summary: DistributionSummary;
  currentUser: UserProfile;
  onNavigateToTab: (tab: any) => void;
  onUpdateApprovalStatus: (status: PeriodApprovalStatus) => void;
  onAutoFixMatrix?: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  summary,
  currentUser,
  onNavigateToTab,
  onUpdateApprovalStatus,
  onAutoFixMatrix,
}) => {
  const permissions = ROLE_PERMISSIONS[currentUser.role];
  const { totalFund, totalAllocated, difference, complianceReport, approvalInfo } = summary;

  const [clickedAction, setClickedAction] = useState<string | null>(null);
  const [actionClickTick, setActionClickTick] = useState<number>(0);

  const handleActionClick = (key: string, tab: any) => {
    setClickedAction(key);
    setActionClickTick((t) => t + 1);
    onNavigateToTab(tab);
  };

  // Category Tier aggregation
  const tierSummary = summary.groupAllocations.reduce((acc, curr) => {
    const cat = curr.group.category;
    if (!acc[cat]) {
      acc[cat] = {
        name: cat,
        allocatedAmount: 0,
        percentage: 0,
        memberCount: 0,
      };
    }
    acc[cat].allocatedAmount += curr.allocatedAmount;
    acc[cat].percentage += curr.group.percentage;
    acc[cat].memberCount += curr.activeMemberCount;
    return acc;
  }, {} as Record<string, { name: string; allocatedAmount: number; percentage: number; memberCount: number }>);

  const tierLabels: Record<string, { label: string; color: string; bar: string }> = {
    struktural: { label: 'Eselon & Struktural', color: 'text-blue-500 dark:text-blue-400', bar: 'bg-blue-500' },
    keuangan: { label: 'Keuangan & Bendahara', color: 'text-amber-500 dark:text-amber-400', bar: 'bg-amber-500' },
    staf: { label: 'Staf Manajemen & TU', color: 'text-indigo-500 dark:text-indigo-400', bar: 'bg-indigo-500' },
    unit: { label: 'Unit, Loket & Surveilans', color: 'text-teal-500 dark:text-teal-400', bar: 'bg-teal-500' },
    khusus: { label: 'Penugasan Khusus', color: 'text-purple-500 dark:text-purple-400', bar: 'bg-purple-500' },
    pengelola: { label: 'Tim Pengelola Jaspel', color: 'text-emerald-500 dark:text-emerald-400', bar: 'bg-emerald-500' },
  };

  const statusInfo: Record<PeriodApprovalStatus, { label: string; badge: string; desc: string }> = {
    draft: {
      label: 'Draft (Tahap Perhitungan)',
      badge: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700',
      desc: 'Perhitungan sedang disiapkan dan disesuaikan dengan kehadiran pegawai.',
    },
    pending_approval: {
      label: 'Menunggu Persetujuan Direktur',
      badge: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      desc: 'Telah diajukan oleh Manager dan siap untuk ditinjau oleh Direktur.',
    },
    approved: {
      label: 'Disetujui & Terkunci (Sah)',
      badge: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      desc: 'Telah diverifikasi dan disahkan oleh Direktur RSUD Siwa sesuai regulasi.',
    },
  };

  const currentStatus = approvalInfo?.status || 'draft';

  return (
    <div className="space-y-6 pb-24 max-w-6xl mx-auto px-4 sm:px-6 pt-5">
      {/* Executive Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Executive Dashboard
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Periode: <strong className="text-white">{summary.period}</strong>
              </span>
              <span className="text-xs text-slate-400 font-medium">·</span>
              <span className="text-xs text-slate-400 font-medium">
                {summary.hospitalName}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
              Ringkasan Pembagian Jasa Manajemen &amp; Audit Regulasi
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Monitoring real-time pagu dana, kepatuhan persentase SK Direktur, dan alokasi nominal pegawai secara akuntabel dan transparan.
            </p>
          </div>

          {/* Approval Action Widget */}
          <div className="bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80 min-w-[280px] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400">Status Persetujuan SK:</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border ${statusInfo[currentStatus].badge}`}>
                {statusInfo[currentStatus].label}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-snug">
              {statusInfo[currentStatus].desc}
            </p>

            {/* Admin approval & lock controls */}
            <div className="pt-1 flex flex-col sm:flex-row gap-2">
              {currentStatus === 'draft' && (
                <button
                  onClick={() => onUpdateApprovalStatus('approved')}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.01] transition-all"
                  title="Langsung sahkan dan kunci pembagian jasa manajemen"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>Setujui &amp; Kunci SK</span>
                </button>
              )}

              {currentStatus === 'pending_approval' && (
                <div className="w-full flex gap-2">
                  <button
                    onClick={() => onUpdateApprovalStatus('approved')}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.01] transition-all"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span>Setujui &amp; Kunci SK</span>
                  </button>
                  <button
                    onClick={() => onUpdateApprovalStatus('draft')}
                    className="py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-semibold"
                    title="Kembalikan ke status draft"
                  >
                    Draft
                  </button>
                </div>
              )}

              {currentStatus === 'approved' && (
                <div className="w-full flex items-center justify-between gap-2 p-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
                  <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-bold px-2 py-0.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Terkunci &amp; Sah</span>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm('Buka kunci periode ini untuk mengedit data kembali?')) {
                        onUpdateApprovalStatus('draft');
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 text-[11px] font-bold border border-slate-700 transition-colors shadow-2xs"
                    title="Buka kunci sebagai Administrator untuk mengubah data"
                  >
                    Buka Kunci (Edit)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4 PRIMARY KEY PERFORMANCE INDICATOR (KPI) CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Fees Collected */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Dana Jasa Terkumpul
            </span>
            <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-100 dark:border-teal-900">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
              {formatRupiah(totalFund)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              <span>Total anggaran jasa manajemen periode</span>
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-500" />
        </div>

        {/* KPI 2: Fees Distributed */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Dana Teralokasi
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums tracking-tight">
              {formatRupiah(totalAllocated)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
              <strong className="text-emerald-700 dark:text-emerald-300 font-semibold">{formatPercentage(summary.totalPercentage)}</strong>
              <span>terbagi ke 15 kelompok regulasi</span>
            </p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />
        </div>

        {/* KPI 3: Pending / Reserve Distributions */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Sisa Cadangan / Pending
            </span>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
              difference === 0 
                ? 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700' 
                : difference > 0 
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900'
            }`}>
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className={`text-xl sm:text-2xl font-black tabular-nums tracking-tight ${
              difference === 0 
                ? 'text-slate-900 dark:text-white' 
                : difference > 0 
                ? 'text-amber-600 dark:text-amber-400' 
                : 'text-rose-600 dark:text-rose-400'
            }`}>
              {formatRupiah(difference)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {difference === 0 
                ? 'Nol selisih (Distribusi 100% sempurna)' 
                : difference > 0 
                ? 'Cadangan dana belum dialokasikan' 
                : 'Defisit alokasi (Melebihi pagu)'}
            </p>
          </div>
          <div className={`absolute bottom-0 left-0 right-0 h-1 ${difference === 0 ? 'bg-slate-400' : 'bg-amber-500'}`} />
        </div>

        {/* KPI 4: Regulatory Compliance Status */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Kepatuhan Regulasi SK
            </span>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
              complianceReport.isCompliant
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900'
            }`}>
              {complianceReport.isCompliant ? (
                <ShieldCheck className="w-5 h-5" />
              ) : (
                <ShieldAlert className="w-5 h-5" />
              )}
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <span className={`text-xl sm:text-2xl font-black tabular-nums tracking-tight ${
                complianceReport.isCompliant
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}>
                {complianceReport.score}%
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                complianceReport.isCompliant
                  ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300'
                  : 'bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300'
              }`}>
                {complianceReport.isCompliant ? '100% Sesuai' : 'Perlu Penyesuaian'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {complianceReport.issues.length === 0
                ? 'Seluruh 15 pasal SK tervalidasi'
                : `${complianceReport.issues.length} catatan audit terdeteksi`}
            </p>
          </div>
          <div className={`absolute bottom-0 left-0 right-0 h-1 ${complianceReport.isCompliant ? 'bg-emerald-500' : 'bg-rose-500'}`} />
        </div>
      </div>

      {/* COMPLIANCE AUDIT MATRIX & ISSUES SECTION */}
      {complianceReport.issues.length > 0 && (
        <div className="bg-amber-50/80 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800/80 rounded-3xl p-5 sm:p-6 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-950 dark:text-amber-200">
                  Audit Kepatuhan Matriks Regulasi ({complianceReport.issues.length} Catatan)
                </h3>
                <p className="text-xs text-amber-800/90 dark:text-amber-300/80">
                  Sistem mendeteksi potensi ketidaksesuaian pembagian terhadap SK Direktur RSUD Siwa.
                </p>
              </div>
            </div>

            {permissions.canEditMatrix && onAutoFixMatrix && (
              <button
                onClick={onAutoFixMatrix}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-colors shadow-sm shrink-0 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Seimbangkan Matriks Otomatis</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {complianceReport.issues.map((issue) => (
              <div
                key={issue.id}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 shadow-2xs space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    {issue.title}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
                    {issue.severity}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                  {issue.description}
                </p>
                {issue.suggestedFix && (
                  <p className="text-teal-700 dark:text-teal-400 font-semibold text-[11px] pt-1 border-t border-slate-100 dark:border-slate-800">
                    Solusi: {issue.suggestedFix}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TWO COLUMN ANALYTICAL SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Category Tier Allocation Breakdown */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PieChart className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>Distribusi Berdasarkan Kluster Jabatan</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Proporsi pembagian jasa menurut fungsi organisasi RSUD
              </p>
            </div>
            <button
              onClick={() => handleActionClick('kalkulator', 'kalkulator')}
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 flex items-center gap-1.5 active:scale-95 transition-all group select-none"
            >
              <Calculator className={`w-3.5 h-3.5 transition-transform ${clickedAction === 'kalkulator' ? 'animate-icon-wiggle' : 'group-hover:scale-110'}`} />
              <span>Kalkulator</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          <div className="space-y-4">
            {Object.entries(tierSummary).map(([catKey, item]) => {
              const meta = tierLabels[catKey] || { label: catKey, color: 'text-slate-600', bar: 'bg-slate-500' };
              const percentOfTotal = totalFund > 0 ? (item.allocatedAmount / totalFund) * 100 : 0;

              return (
                <div key={catKey} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${meta.bar}`} />
                      {meta.label}
                    </span>
                    <div className="text-right tabular-nums">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatRupiah(item.allocatedAmount)}
                      </span>
                      <span className="text-slate-400 ml-1.5">
                        ({formatPercentage(percentOfTotal)})
                      </span>
                    </div>
                  </div>

                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${meta.bar} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(100, Math.max(0, percentOfTotal))}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{item.memberCount} Pegawai Berhak</span>
                    <span>Porsi Regulasi: {formatPercentage(item.percentage)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Quick Action Hub & Overview Stats */}
        <div className="lg:col-span-5 space-y-4">
          {/* Quick Shortcuts */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Akses Cepat Modul Sistem</span>
            </h3>

            <div className="grid grid-cols-1 gap-2 pt-1">
              {/* Shortcut Matriks */}
              <button
                onClick={() => handleActionClick('matriks', 'matriks')}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 hover:bg-teal-50 dark:hover:bg-teal-950/40 border border-slate-200 dark:border-slate-700/80 transition-all flex items-center justify-between group text-left active:scale-95 relative overflow-hidden select-none"
              >
                {clickedAction === 'matriks' && (
                  <span
                    key={`matriks-act-${actionClickTick}`}
                    className="absolute inset-0 rounded-2xl bg-teal-400/20 animate-ripple pointer-events-none"
                  />
                )}
                <div className="flex items-center gap-3">
                  <div 
                    key={clickedAction === 'matriks' ? `m-icon-${actionClickTick}` : undefined}
                    className={`w-9 h-9 rounded-xl bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xs transition-all ${
                      clickedAction === 'matriks' ? 'animate-icon-spin' : 'group-hover:scale-110'
                    }`}
                  >
                    100%
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      Kelola Matriks Regulasi SK
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Input persentase, unggah berkas CSV/JSON &amp; audit aturan
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
              </button>

              {/* Shortcut Penerima */}
              <button
                onClick={() => handleActionClick('penerima', 'penerima')}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 hover:bg-teal-50 dark:hover:bg-teal-950/40 border border-slate-200 dark:border-slate-700/80 transition-all flex items-center justify-between group text-left active:scale-95 relative overflow-hidden select-none"
              >
                {clickedAction === 'penerima' && (
                  <span
                    key={`penerima-act-${actionClickTick}`}
                    className="absolute inset-0 rounded-2xl bg-sky-400/20 animate-ripple pointer-events-none"
                  />
                )}
                <div className="flex items-center gap-3">
                  <div 
                    key={clickedAction === 'penerima' ? `p-icon-${actionClickTick}` : undefined}
                    className={`w-9 h-9 rounded-xl bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center transition-all ${
                      clickedAction === 'penerima' ? 'animate-icon-pop' : 'group-hover:scale-110'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      Daftar Pegawai Penerima
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {summary.activeRecipients} Pegawai Aktif · {summary.totalRecipients - summary.activeRecipients} Cuti
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
              </button>

              {/* Shortcut Laporan */}
              <button
                onClick={() => handleActionClick('laporan', 'laporan')}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 hover:bg-teal-50 dark:hover:bg-teal-950/40 border border-slate-200 dark:border-slate-700/80 transition-all flex items-center justify-between group text-left active:scale-95 relative overflow-hidden select-none"
              >
                {clickedAction === 'laporan' && (
                  <span
                    key={`laporan-act-${actionClickTick}`}
                    className="absolute inset-0 rounded-2xl bg-amber-400/20 animate-ripple pointer-events-none"
                  />
                )}
                <div className="flex items-center gap-3">
                  <div 
                    key={clickedAction === 'laporan' ? `l-icon-${actionClickTick}` : undefined}
                    className={`w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center transition-all ${
                      clickedAction === 'laporan' ? 'animate-icon-wiggle' : 'group-hover:scale-110'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      Laporan &amp; Berita Acara Sah
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Cetak dokumen resmi, atur pengesahan &amp; tanda tangan
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>

          {/* Quick Statistics Banner */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-teal-900 to-slate-900 text-white border border-teal-800/50 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-teal-300">
              Rata-Rata Nominal Hak Terima
            </span>
            <div className="text-2xl font-black tabular-nums text-white">
              {summary.activeRecipients > 0 
                ? formatRupiah(Math.round(totalAllocated / summary.activeRecipients)) 
                : 'Rp 0'}
              <span className="text-xs font-normal text-slate-300 ml-1">/ pegawai aktif</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Dihitung berdasarkan proporsi persentase regulasi SK dibagi rata ke anggota yang aktif bertugas pada bulan {summary.period}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
