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
_Sistem Informasi Pembagian Jasa Manajemen (SIP-JASMAN) RSUD Siwa_`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
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

        {/* Slip Body (Printable Area) */}
        <div className="p-6 space-y-4 text-xs">
          {/* Slip Kop */}
          <div className="text-center border-b border-dashed border-slate-300 pb-3 space-y-0.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              UPT RSUD SIWA - KABUPATEN WAJO
            </h4>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              SLIP PEMBAGIAN JASA MANAJEMEN
            </h3>
            <p className="text-[11px] text-slate-500">
              Periode Pencairan: <span className="font-semibold text-slate-800">{summary.period}</span>
            </p>
          </div>

          {/* Pegawai Info */}
          <div className="bg-slate-50 rounded-xl p-3.5 space-y-2 border border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-500">Nama Pegawai:</span>
              <span className="font-bold text-slate-900 text-right">{recipient.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Jabatan:</span>
              <span className="font-semibold text-slate-800 text-right">{recipient.position}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Kelompok Regulasi:</span>
              <span className="font-medium text-slate-700 text-right">{recipient.groupName}</span>
            </div>
          </div>

          {/* Breakdown Perhitungan */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between text-slate-600">
              <span>Total Dana Jasa Manajemen RS:</span>
              <span className="font-semibold tabular-nums text-slate-800">{formatRupiah(summary.totalFund)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Porsi Regulasi Kelompok (%):</span>
              <span className="font-semibold tabular-nums text-teal-800">{formatPercentage(recipient.groupPercentage)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Status Verifikasi:</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Terverifikasi SK Direktur</span>
              </span>
            </div>
          </div>

          {/* Big Amount Card */}
          <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-center space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
              Jumlah Hak Diterima Bersih
            </span>
            <div className="text-2xl font-extrabold text-teal-950 tabular-nums">
              {formatRupiah(recipient.allocatedAmount)}
            </div>
            <p className="text-[10px] text-teal-700">
              Ditransfer langsung ke rekening payroll pegawai
            </p>
          </div>

          {/* Security & Verification note */}
          <div className="pt-2 text-center text-[10px] text-slate-400 border-t border-slate-100">
            Dokumen sah digital SIP-JASMAN RSUD Siwa. Dicetak otomatis pada {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}.
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2 justify-end">
          <button
            onClick={handleCopyWhatsApp}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Tersalin!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-slate-500" />
                <span>Salin WhatsApp</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrintSlip}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Slip</span>
          </button>
        </div>
      </div>
    </div>
  );
};
