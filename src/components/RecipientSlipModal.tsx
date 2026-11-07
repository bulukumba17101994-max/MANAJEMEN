import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Copy, 
  Check, 
  Building2, 
  ShieldCheck, 
  Share2,
  Receipt
} from 'lucide-react';
import { CalculatedRecipient, DistributionSummary } from '../types/jaspel';
import { formatRupiah, formatPercentage } from '../utils/jaspelCalculations';

interface RecipientSlipModalProps {
  recipient: CalculatedRecipient | null;
  summary: DistributionSummary;
  onClose: () => void;
}

export const RecipientSlipModal: React.FC<RecipientSlipModalProps> = ({
  recipient,
  summary,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!recipient) return null;

  const handlePrintSlip = () => {
    window.print();
  };

  const handleCopyWhatsApp = () => {
    const text = 
`*SLIP JASA MANAJEMEN - RSUD SIWA*
----------------------------------------
*Nama:* ${recipient.name}
*Jabatan:* ${recipient.position}
*Kelompok SK:* ${recipient.groupName}
*Periode:* ${summary.period}
----------------------------------------
*Total Dana RSUD:* ${formatRupiah(summary.totalFund)}
*Porsi Regulasi:* ${formatPercentage(recipient.groupPercentage)}
*Jumlah Diterima Bersih:* *${formatRupiah(recipient.allocatedAmount)}*
----------------------------------------
_Sistem Informasi Pembagian Jasa MANAJEMEN RSUD Siwa_`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        {/* Header Bar */}
        <div className="px-5 py-4 bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-bold">Rincian Slip Jasa Manajemen</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Slip Card Official Body */}
        <div className="p-6 space-y-4">
          <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              UPT RSUD SIWA - KABUPATEN WAJO
            </span>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              SLIP PEMBAGIAN JASA MANAJEMEN
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Periode Pencairan: <strong>{summary.period}</strong>
            </p>
          </div>

          {/* Details */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-2.5 text-xs">
            <div className="flex justify-between items-start">
              <span className="text-slate-500 dark:text-slate-400">Nama Pegawai:</span>
              <span className="font-bold text-slate-900 dark:text-white text-right">{recipient.name}</span>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-slate-500 dark:text-slate-400">Jabatan:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">{recipient.position}</span>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-slate-500 dark:text-slate-400">Kelompok Regulasi:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">{recipient.groupName}</span>
            </div>
          </div>

          {/* Calculations breakdown */}
          <div className="space-y-2 text-xs border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Total Dana Jasa Manajemen RS:</span>
              <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                {formatRupiah(summary.totalFund)}
              </span>
            </div>

            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Porsi Regulasi Kelompok (%):</span>
              <span className="font-bold text-teal-700 dark:text-teal-400 tabular-nums">
                {formatPercentage(recipient.groupPercentage)}
              </span>
            </div>

            <div className="flex justify-between text-slate-600 dark:text-slate-400 items-center">
              <span>Status Verifikasi:</span>
              <span className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Terverifikasi SK Direktur</span>
              </span>
            </div>
          </div>

          {/* Big Amount */}
          <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-center space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
              Jumlah Hak Diterima Bersih
            </span>
            <div className="text-2xl sm:text-3xl font-black text-teal-900 dark:text-teal-200 tabular-nums">
              {formatRupiah(recipient.allocatedAmount)}
            </div>
            <p className="text-[10px] text-teal-700 dark:text-teal-400">
              Ditransfer langsung ke rekening payroll pegawai
            </p>
          </div>

          <p className="text-[10px] text-center text-slate-400 leading-tight">
            Dokumen sah digital MANAJEMEN RSUD Siwa. Dicetak otomatis pada {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}.
          </p>

          {/* Actions */}
          <div className="pt-2 flex gap-2">
            <button
              onClick={handleCopyWhatsApp}
              className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 dark:text-emerald-400">Tersalin!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Salin WhatsApp</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrintSlip}
              className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Slip</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
