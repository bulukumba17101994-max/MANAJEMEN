import React, { useState } from 'react';
import { 
  Printer, 
  Download, 
  Copy, 
  Check, 
  FileText, 
  Sliders, 
  FileSignature,
  Eye,
  EyeOff,
  Building2,
  Lock
} from 'lucide-react';
import { DistributionSummary, ReportConfig, UserProfile } from '../types/jaspel';
import { formatRupiah, formatPercentage, generateExportCSV } from '../utils/jaspelCalculations';
import { DEFAULT_REPORT_CONFIG } from '../utils/jaspelData';
import { EditSignatoriesModal } from './EditSignatoriesModal';
import { ROLE_PERMISSIONS } from '../services/auth';

interface ReportsTabProps {
  summary: DistributionSummary;
  currentUser: UserProfile;
  reportConfig?: ReportConfig;
  onUpdateReportConfig?: (config: ReportConfig) => void;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({
  summary,
  currentUser,
  reportConfig = DEFAULT_REPORT_CONFIG,
  onUpdateReportConfig,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditSignatoriesOpen, setIsEditSignatoriesOpen] = useState(false);

  const permissions = ROLE_PERMISSIONS[currentUser.role];
  const activeConfig = reportConfig || DEFAULT_REPORT_CONFIG;

  const handleToggleSignatureColumn = () => {
    if (onUpdateReportConfig) {
      onUpdateReportConfig({
        ...activeConfig,
        showSignatureColumn: !activeConfig.showSignatureColumn,
      });
    }
  };

  const handleToggleApprovalBlock = () => {
    if (onUpdateReportConfig) {
      onUpdateReportConfig({
        ...activeConfig,
        showApprovalBlock: !activeConfig.showApprovalBlock,
      });
    }
  };

  const handleDownloadCSV = () => {
    const csvContent = generateExportCSV(summary);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `MANAJEMEN_Jasa_${summary.period.replace(/\s+/g, '_')}_RSUD_Siwa.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    let text = `*BERITA ACARA PEMBAGIAN JASA MANAJEMEN RSUD SIWA*\n`;
    text += `Unit Kerja: ${summary.hospitalName}\n`;
    text += `Periode: ${summary.period}\n`;
    text += `Total Anggaran: ${formatRupiah(summary.totalFund)}\n`;
    text += `Total Teralokasi: ${formatRupiah(summary.totalAllocated)} (100%)\n`;
    text += `Jumlah Penerima Aktif: ${summary.activeRecipients} Orang\n\n`;
    text += `*Ringkasan Alokasi Kelompok:*\n`;

    summary.groupAllocations.forEach((ga, i) => {
      text += `${i + 1}. ${ga.group.name} (${formatPercentage(ga.group.percentage)}): ${formatRupiah(ga.allocatedAmount)} [${ga.activeMemberCount} org, @ ${formatRupiah(ga.amountPerMember)}]\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 pb-24 max-w-5xl mx-auto px-4 sm:px-6 pt-4">
      {/* Action Bar (hidden when printing) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm print:hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                Dokumen Resmi
              </span>
              <span className="text-xs text-slate-400">Format SK Direktur</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mt-1">
              <FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>Laporan &amp; Berita Acara Sah Pembagian Jasa</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Lampiran ketetapan pencairan dana jasa manajemen RSUD Siwa
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Salin Teks</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadCSV}
              className="px-3 py-2 rounded-xl border border-teal-200 dark:border-teal-800 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 text-teal-800 dark:text-teal-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Unduh CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Laporan</span>
            </button>
          </div>
        </div>

        {/* Customization Controls: Tanda Tangan & Pengesahan */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {/* Toggle Tanda Tangan di Tabel */}
            <button
              onClick={handleToggleSignatureColumn}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeConfig.showSignatureColumn
                  ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-300 dark:border-teal-800 text-teal-800 dark:text-teal-300'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              {activeConfig.showSignatureColumn ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-teal-600" />
                  <span>Kolom Tanda Tangan: Tampil</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                  <span>Tanpa Kolom Tanda Tangan</span>
                </>
              )}
            </button>

            {/* Toggle Lembar Pengesahan */}
            <button
              onClick={handleToggleApprovalBlock}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeConfig.showApprovalBlock
                  ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-300 dark:border-teal-800 text-teal-800 dark:text-teal-300'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              {activeConfig.showApprovalBlock ? (
                <>
                  <Check className="w-3.5 h-3.5 text-teal-600" />
                  <span>Lembar Pengesahan: Tampil</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                  <span>Tanpa Lembar Pengesahan</span>
                </>
              )}
            </button>
          </div>

          {/* Edit Signatories Modal Trigger */}
          {permissions.canEditSignatories && (
            <button
              onClick={() => setIsEditSignatoriesOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <FileSignature className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Edit Pejabat Pengesahan</span>
            </button>
          )}
        </div>
      </div>

      {/* Official Printable Document Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm print:shadow-none print:border-none print:p-0 print:bg-white print:text-black">
        {/* Kop Surat Resmi */}
        <div className="border-b-2 border-slate-900 dark:border-slate-700 print:border-black pb-4 text-center space-y-1">
          <h4 className="text-xs font-bold tracking-widest text-slate-600 dark:text-slate-400 print:text-slate-700 uppercase">
            PEMERINTAH KABUPATEN WAJO
          </h4>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white print:text-black tracking-wide">
            UPT RUMAH SAKIT UMUM DAERAH SIWA
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 print:text-slate-700">
            Jl. Oto Jennae No. 1 Siwa, Kec. Pitumpanua, Kab. Wajo, Sulawesi Selatan
          </p>
          <div className="pt-2">
            <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 print:bg-slate-100 text-slate-900 dark:text-white print:text-black font-bold text-xs uppercase tracking-wider rounded border border-slate-300 dark:border-slate-700 print:border-slate-400">
              LAMPIRAN BERITA ACARA PEMBAGIAN JASA MANAJEMEN
            </span>
          </div>
        </div>

        {/* Metadata Transaksi */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 text-xs border-b border-slate-200 dark:border-slate-800 print:border-slate-300">
          <div>
            <span className="text-slate-500 dark:text-slate-400 print:text-slate-600 block">Periode Pencairan:</span>
            <span className="font-bold text-slate-900 dark:text-white print:text-black">{summary.period}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 print:text-slate-600 block">Total Dana Tersedia:</span>
            <span className="font-bold text-slate-900 dark:text-white print:text-black tabular-nums">{formatRupiah(summary.totalFund)}</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 print:text-slate-600 block">Total Teralokasi:</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400 print:text-black tabular-nums">{formatRupiah(summary.totalAllocated)} (100%)</span>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 print:text-slate-600 block">Penerima Berhak:</span>
            <span className="font-bold text-slate-900 dark:text-white print:text-black">{summary.activeRecipients} Pegawai Aktif</span>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="mt-4">
          {activeConfig.showSignatureColumn && (
            <div className="flex sm:hidden items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-2 italic print:hidden">
              <span>← Geser tabel ke kanan untuk kolom tanda tangan →</span>
            </div>
          )}
          <div className="overflow-x-auto pb-2 scrollbar-thin">
            <table className={`w-full text-left text-xs border-collapse ${activeConfig.showSignatureColumn ? 'min-w-[620px]' : 'min-w-[500px]'}`}>
              <thead>
                <tr className="bg-slate-100/90 dark:bg-slate-800/80 print:bg-slate-100 border-y border-slate-300 dark:border-slate-700 print:border-slate-300 text-slate-900 dark:text-slate-100 print:text-black font-bold">
                  <th className="py-2.5 px-2 text-center w-10">No</th>
                  <th className="py-2.5 px-3">Kelompok Regulasi</th>
                  <th className="py-2.5 px-3">Jabatan</th>
                  <th className="py-2.5 px-3">Nama Pegawai</th>
                  <th className="py-2.5 px-2 text-center">Porsi</th>
                  <th className="py-2.5 px-3 text-right">Nominal (Rp)</th>
                  {activeConfig.showSignatureColumn && (
                    <th className="py-2.5 px-4 text-center">Tanda Tangan</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 print:divide-slate-300">
                {summary.groupAllocations.map((groupAlloc, gIndex) => {
                  const colSpanTotal = activeConfig.showSignatureColumn ? 7 : 6;
                  return (
                    <React.Fragment key={groupAlloc.group.id}>
                      {/* Group Header Row */}
                      <tr className="bg-slate-50/80 dark:bg-slate-850/60 print:bg-slate-50 font-semibold">
                        <td colSpan={colSpanTotal} className="py-2 px-3 border-y border-slate-200 dark:border-slate-750 print:border-slate-300 text-slate-900 dark:text-slate-100 print:text-black font-bold">
                          <div className="flex items-center justify-between">
                            <span>
                              {gIndex + 1}. {groupAlloc.group.name} ({formatPercentage(groupAlloc.group.percentage)})
                            </span>
                            <span className="tabular-nums font-bold text-teal-800 dark:text-teal-400 print:text-black">
                              Total Kelompok: {formatRupiah(groupAlloc.allocatedAmount)}
                            </span>
                          </div>
                        </td>
                      </tr>

                      {/* Member Rows */}
                      {groupAlloc.recipients.map((rec, rIndex) => {
                        return (
                          <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                            <td className="py-2 px-2 text-center text-slate-400 dark:text-slate-500 print:text-slate-600">
                              {rIndex + 1}
                            </td>
                            <td className="py-2 px-3 text-slate-500 dark:text-slate-400 print:text-slate-700">
                              {groupAlloc.group.name}
                            </td>
                            <td className="py-2 px-3 font-medium text-slate-700 dark:text-slate-300 print:text-black">
                              {rec.position}
                            </td>
                            <td className="py-2 px-3 font-bold text-slate-900 dark:text-white print:text-black">
                              {rec.name}
                            </td>
                            <td className="py-2 px-2 text-center text-slate-500 dark:text-slate-400 print:text-slate-700 tabular-nums">
                              {rec.isActive ? formatPercentage(groupAlloc.group.percentage) : '-'}
                            </td>
                            <td className="py-2 px-3 text-right font-bold text-slate-900 dark:text-white print:text-black tabular-nums">
                              {rec.isActive ? formatRupiah(rec.allocatedAmount) : 'Rp 0 (Cuti)'}
                            </td>
                            {activeConfig.showSignatureColumn && (
                              <td className="py-2 px-4 text-center border-l border-slate-100 dark:border-slate-800 print:border-slate-200">
                                <span className="text-[10px] text-slate-400 print:text-slate-500 block pb-4">
                                  {rIndex + 1}................
                                </span>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 dark:bg-slate-800 print:bg-slate-100 border-t-2 border-slate-900 dark:border-slate-700 print:border-black font-bold text-slate-900 dark:text-white print:text-black">
                  <td colSpan={5} className="py-3 px-3 text-right">
                    TOTAL DIALOKASIKAN:
                  </td>
                  <td className="py-3 px-3 text-right tabular-nums text-sm">
                    {formatRupiah(summary.totalAllocated)}
                  </td>
                  {activeConfig.showSignatureColumn && (
                    <td className="py-3 px-4 text-center text-xs text-emerald-800 dark:text-emerald-400 print:text-black font-bold">
                      LENGKAP 100%
                    </td>
                  )}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Lembar Pengesahan / Tanda Tangan Resmi */}
        {activeConfig.showApprovalBlock && (
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 print:border-slate-300">
            <div className="text-right text-xs text-slate-600 dark:text-slate-400 print:text-slate-700 mb-6 font-medium">
              {activeConfig.documentCity || 'Siwa'}, {activeConfig.documentDate || '30 Oktober 2026'}
            </div>

            <div className={`grid gap-4 text-center text-xs ${
              (activeConfig.signatories?.length || 3) === 2 
                ? 'grid-cols-2' 
                : (activeConfig.signatories?.length || 3) >= 3 
                ? 'grid-cols-1 sm:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {(activeConfig.signatories || []).map((sig) => (
                <div key={sig.id} className="space-y-1">
                  <p className="text-slate-600 dark:text-slate-400 print:text-slate-700">{sig.role},</p>
                  <div className="h-16" />
                  <p className="font-bold text-slate-900 dark:text-white print:text-black underline uppercase tracking-tight">
                    {sig.name}
                  </p>
                  {sig.nip ? (
                    <p className="text-slate-500 dark:text-slate-400 print:text-slate-600">NIP. {sig.nip}</p>
                  ) : (
                    <p className="text-slate-400 text-[11px]">-</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Signatories & Approval Modal */}
      <EditSignatoriesModal
        isOpen={isEditSignatoriesOpen}
        config={activeConfig}
        onClose={() => setIsEditSignatoriesOpen(false)}
        onSaveConfig={(updated) => {
          if (onUpdateReportConfig) onUpdateReportConfig(updated);
        }}
      />
    </div>
  );
};
