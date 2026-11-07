import React, { useState, useRef } from 'react';
import { 
  Table2, 
  RotateCcw, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  Trash2, 
  Info,
  Layers,
  Percent,
  Sparkles,
  Upload,
  Download,
  FileSpreadsheet,
  Check,
  X,
  ShieldCheck,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { RegulationGroup, DistributionSummary, UserProfile } from '../types/jaspel';
import { 
  formatRupiah, 
  formatPercentage, 
  validateMatrixPercentage,
  exportRegulatoryMatrixJSON,
  parseRegulatoryMatrixFile
} from '../utils/jaspelCalculations';
import { ROLE_PERMISSIONS } from '../services/auth';

interface MatrixRegulationTabProps {
  summary: DistributionSummary;
  groups: RegulationGroup[];
  currentUser: UserProfile;
  onUpdateGroups: (groups: RegulationGroup[]) => void;
  onResetGroups: () => void;
  onAddGroupModal: () => void;
}

export const MatrixRegulationTab: React.FC<MatrixRegulationTabProps> = ({
  summary,
  groups,
  currentUser,
  onUpdateGroups,
  onResetGroups,
  onAddGroupModal,
}) => {
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editPercentageVal, setEditPercentageVal] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const permissions = ROLE_PERMISSIONS[currentUser.role];
  const { totalPercentage, isValid, delta } = validateMatrixPercentage(groups);
  const compliance = summary.complianceReport;

  const categories = [
    { id: 'all', label: 'Semua Kategori' },
    { id: 'struktural', label: 'Eselon & Struktural' },
    { id: 'keuangan', label: 'Keuangan' },
    { id: 'staf', label: 'Staf Manajemen' },
    { id: 'unit', label: 'Unit & Loket' },
    { id: 'khusus', label: 'Khusus' },
    { id: 'pengelola', label: 'Pengelola' },
  ];

  const filteredAllocations = summary.groupAllocations.filter((ga) => {
    if (selectedCategoryFilter === 'all') return true;
    return ga.group.category === selectedCategoryFilter;
  });

  const handleStartEdit = (group: RegulationGroup) => {
    if (!permissions.canEditMatrix) {
      alert('Peran Anda saat ini (' + currentUser.role + ') hanya memiliki akses baca. Silakan beralih ke peran Admin untuk mengubah persentase regulasi SK.');
      return;
    }
    setEditingGroupId(group.id);
    setEditPercentageVal(group.percentage.toString());
  };

  const handleSavePercentage = (groupId: string) => {
    const val = parseFloat(editPercentageVal.replace(',', '.'));
    if (!isNaN(val) && val >= 0) {
      const updated = groups.map((g) => (g.id === groupId ? { ...g, percentage: val } : g));
      onUpdateGroups(updated);
    }
    setEditingGroupId(null);
  };

  const handleDeleteGroup = (groupId: string, name: string) => {
    if (!permissions.canEditMatrix) {
      alert('Hanya Administrator yang memiliki wewenang menghapus pasal/kelompok regulasi.');
      return;
    }
    if (window.confirm(`Hapus aturan kelompok "${name}" dari matriks regulasi SK?`)) {
      const updated = groups.filter((g) => g.id !== groupId);
      onUpdateGroups(updated);
    }
  };

  const handleAutoBalance = () => {
    if (!permissions.canEditMatrix) {
      alert('Hanya Administrator yang memiliki wewenang menyeimbangkan matriks.');
      return;
    }
    if (groups.length === 0) return;
    const currentSum = groups.reduce((acc, g) => acc + g.percentage, 0);
    if (currentSum <= 0) return;

    const factor = 100 / currentSum;
    const balanced = groups.map((g) => ({
      ...g,
      percentage: Math.round(g.percentage * factor * 100) / 100,
    }));

    // Rounding adjustment on last group
    const newSum = balanced.reduce((acc, g) => acc + g.percentage, 0);
    const diff = Math.round((100 - newSum) * 100) / 100;
    if (diff !== 0 && balanced.length > 0) {
      balanced[balanced.length - 1].percentage = Math.round((balanced[balanced.length - 1].percentage + diff) * 100) / 100;
    }

    onUpdateGroups(balanced);
  };

  // Download Matrix Template (JSON)
  const handleDownloadTemplate = () => {
    const jsonStr = exportRegulatoryMatrixJSON(groups);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Matriks_Regulasi_Jasa_Manajemen_RSUD_Siwa.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Upload Matrix File (JSON or CSV)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const isJson = file.name.endsWith('.json');
        const importedGroups = parseRegulatoryMatrixFile(content, isJson);

        if (window.confirm(`Berhasil membaca ${importedGroups.length} aturan regulasi dari berkas "${file.name}". Terapkan ke sistem sekarang?`)) {
          onUpdateGroups(importedGroups);
          setUploadNotice(`Berhasil mengimpor ${importedGroups.length} kelompok regulasi.`);
          setTimeout(() => setUploadNotice(null), 3500);
        }
      } catch (err: any) {
        alert(`Gagal mengimpor berkas matriks: ${err.message}`);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-5 pb-24 max-w-5xl mx-auto px-4 sm:px-6 pt-4">
      {/* Hidden File Input for Regulatory Matrix Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.csv"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Header Info & Balance Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                Regulasi &amp; Kepatuhan
              </span>
              <span className="text-xs text-slate-400">SK Direktur RSUD Siwa</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mt-1">
              <Table2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>Kelola Matriks Regulasi SK Pembagian Jasa Manajemen</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tabel persentase ketetapan resmi per kelompok jabatan dan eselon sesuai regulasi rumah sakit
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Upload Matrix Requirements Button */}
            {permissions.canUploadMatrix && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                title="Unggah berkas aturan regulasi (JSON atau CSV)"
              >
                <Upload className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Unggah Matriks</span>
              </button>
            )}

            {/* Download Matrix Template */}
            <button
              onClick={handleDownloadTemplate}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              title="Unduh templat aturan regulasi JSON untuk arsip atau editing offline"
            >
              <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Unduh Templat</span>
            </button>

            {/* Reset to CSV baseline button */}
            {permissions.canEditMatrix && (
              <button
                onClick={() => {
                  if (window.confirm('Kembalikan matriks regulasi ke ketetapan awal SK Direktur (15 Kelompok)?')) {
                    onResetGroups();
                  }
                }}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                title="Reset ke persentase default SK"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset SK</span>
              </button>
            )}

            {/* Add Rule Button */}
            {permissions.canEditMatrix && (
              <button
                onClick={onAddGroupModal}
                className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Aturan</span>
              </button>
            )}
          </div>
        </div>

        {uploadNotice && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{uploadNotice}</span>
          </div>
        )}

        {/* AUTOMATED REGULATORY COMPLIANCE VALIDATOR BANNER */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isValid && compliance.isCompliant
              ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-200'
              : 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800/80 text-rose-950 dark:text-rose-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  isValid && compliance.isCompliant
                    ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                    : 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300'
                }`}
              >
                {isValid && compliance.isCompliant ? (
                  <ShieldCheck className="w-5 h-5" />
                ) : (
                  <ShieldAlert className="w-5 h-5" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Validasi Kepatuhan Matriks
                  </span>
                  <span className="text-xs font-black">
                    {formatPercentage(totalPercentage)} / 100,00%
                  </span>
                </div>
                <p className="text-xs font-semibold mt-0.5">
                  {isValid && compliance.isCompliant
                    ? 'Seluruh anggaran teralokasi secara sempurna ke 15 kelompok regulasi tanpa surplus/defisit.'
                    : delta > 0
                    ? `Alokasi belum genap 100%. Tersisa ${formatPercentage(delta)} dana belum diatur.`
                    : `Alokasi melebihi 100% sebesar ${formatPercentage(Math.abs(delta))}. Berpotensi defisit pagu.`}
                </p>
              </div>
            </div>

            {/* Quick Auto-Balance Button */}
            {!isValid && permissions.canEditMatrix && (
              <button
                onClick={handleAutoBalance}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Seimbangkan Otomatis</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategoryFilter === cat.id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Regulatory Rules List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 bg-slate-50/70 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <span>
            Menampilkan <strong>{filteredAllocations.length}</strong> aturan kelompok regulasi
          </span>
          <span>
            Pagu Dana: <strong>{formatRupiah(summary.totalFund)}</strong>
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredAllocations.map((alloc, index) => {
            const isEditing = editingGroupId === alloc.group.id;
            const hasZeroActive = alloc.activeMemberCount === 0 && !alloc.group.isSpecialGroup;

            return (
              <div
                key={alloc.group.id}
                className="p-4 sm:p-5 hover:bg-slate-50/60 dark:hover:bg-slate-850/40 transition-colors space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300 text-xs flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {alloc.group.name}
                        </h4>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {alloc.group.category}
                        </span>
                        {alloc.group.isSpecialGroup && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                            Pooled / Kolektif
                          </span>
                        )}
                        {hasZeroActive && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            0 Anggota Aktif
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {alloc.group.description || 'Alokasi jasa manajemen sesuai SK Direktur'}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {permissions.canEditMatrix && (
                      <>
                        <button
                          onClick={() => handleStartEdit(alloc.group)}
                          className="p-2 rounded-xl text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit persentase aturan"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {groups.length > 1 && (
                          <button
                            onClick={() => handleDeleteGroup(alloc.group.id, alloc.group.name)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                            title="Hapus kelompok"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Inline Editing or Display */}
                {isEditing ? (
                  <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-teal-950 dark:text-teal-200">
                        Persentase Baru (%):
                      </label>
                      <input
                        type="text"
                        value={editPercentageVal}
                        onChange={(e) => setEditPercentageVal(e.target.value)}
                        className="w-24 px-2.5 py-1 rounded-lg border border-teal-300 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white tabular-nums"
                        autoFocus
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingGroupId(null)}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-white/80 dark:hover:bg-slate-800"
                        title="Batal"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSavePercentage(alloc.group.id)}
                        className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 shadow-2xs"
                      >
                        Simpan
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/80 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Porsi SK:</span>
                      <span className="font-extrabold text-teal-700 dark:text-teal-300 tabular-nums text-sm">
                        {formatPercentage(alloc.group.percentage)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 block">Total Alokasi Kelompok:</span>
                      <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                        {formatRupiah(alloc.allocatedAmount)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 block">
                        Per Pegawai ({alloc.activeMemberCount} org):
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                        {alloc.activeMemberCount > 0
                          ? formatRupiah(alloc.amountPerMember)
                          : alloc.group.isSpecialGroup
                          ? `${formatRupiah(alloc.amountPerMember)} (Pagu Kolektif)`
                          : 'Rp 0 (Cuti / Kosong)'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
