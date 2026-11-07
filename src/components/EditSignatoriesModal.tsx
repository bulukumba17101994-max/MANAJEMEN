import React, { useState } from 'react';
import { X, Check, FileSignature, Plus, Trash2, Calendar, MapPin } from 'lucide-react';
import { ReportConfig, Signatory } from '../types/jaspel';

interface EditSignatoriesModalProps {
  isOpen: boolean;
  config: ReportConfig;
  onClose: () => void;
  onSaveConfig: (updated: ReportConfig) => void;
}

export const EditSignatoriesModal: React.FC<EditSignatoriesModalProps> = ({
  isOpen,
  config,
  onClose,
  onSaveConfig,
}) => {
  const [documentCity, setDocumentCity] = useState(config.documentCity || 'Siwa');
  const [documentDate, setDocumentDate] = useState(config.documentDate || '30 Oktober 2026');
  const [signatories, setSignatories] = useState<Signatory[]>(config.signatories || []);

  if (!isOpen) return null;

  const handleUpdateSignatory = (index: number, field: keyof Signatory, val: string) => {
    setSignatories((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: val } : s))
    );
  };

  const handleAddSignatory = () => {
    const newSig: Signatory = {
      id: `sig_${Date.now()}`,
      role: 'Pejabat Penandatangan',
      name: 'NAMA PEJABAT',
      nip: '',
    };
    setSignatories([...signatories, newSig]);
  };

  const handleDeleteSignatory = (index: number) => {
    setSignatories((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      ...config,
      documentCity: documentCity.trim() || 'Siwa',
      documentDate: documentDate.trim() || '30 Oktober 2026',
      signatories,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between shrink-0 border-b border-white/10">
          <div className="flex items-center gap-2">
            <FileSignature className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-bold">Edit Lembar Pengesahan &amp; Pejabat</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Document City & Date */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              Tempat &amp; Tanggal Pembuatan Dokumen
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Kota / Wilayah *
                </label>
                <input
                  type="text"
                  required
                  value={documentCity}
                  onChange={(e) => setDocumentCity(e.target.value)}
                  placeholder="Siwa"
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Tanggal Dokumen *
                </label>
                <input
                  type="text"
                  required
                  value={documentDate}
                  onChange={(e) => setDocumentDate(e.target.value)}
                  placeholder="30 Oktober 2026"
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Signatories List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <FileSignature className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                Daftar Pejabat Penandatangan ({signatories.length})
              </h4>
              <button
                type="button"
                onClick={handleAddSignatory}
                className="px-2.5 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 text-teal-700 dark:text-teal-300 text-[11px] font-bold flex items-center gap-1 border border-teal-200 dark:border-teal-800"
              >
                <Plus className="w-3 h-3" />
                <span>Tambah Pejabat</span>
              </button>
            </div>

            <div className="space-y-3">
              {signatories.map((sig, idx) => (
                <div
                  key={sig.id || idx}
                  className="p-4 bg-slate-50/80 dark:bg-slate-950/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 relative"
                >
                  <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 pb-1.5">
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Pejabat Penandatangan #{idx + 1}
                    </span>
                    {signatories.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteSignatory(idx)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Hapus Pejabat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                      Jabatan Pengesahan *
                    </label>
                    <input
                      type="text"
                      required
                      value={sig.role}
                      onChange={(e) => handleUpdateSignatory(idx, 'role', e.target.value)}
                      placeholder="Contoh: Kepala Bagian Tata Usaha"
                      className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                        Nama Lengkap Pejabat *
                      </label>
                      <input
                        type="text"
                        required
                        value={sig.name}
                        onChange={(e) => handleUpdateSignatory(idx, 'name', e.target.value)}
                        placeholder="Contoh: HJ. SUKRAWATI"
                        className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">
                        NIP (Nomor Induk Pegawai)
                      </label>
                      <input
                        type="text"
                        value={sig.nip || ''}
                        onChange={(e) => handleUpdateSignatory(idx, 'nip', e.target.value)}
                        placeholder="Contoh: 19750812 200212 2 004"
                        className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-2 justify-end pt-3 border-t border-slate-100 dark:border-slate-800 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Simpan Pengesahan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
